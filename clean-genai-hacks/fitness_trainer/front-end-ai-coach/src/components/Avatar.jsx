/*
  Adapted to work with the new fitness_avatar.glb model and animations from /models/animations.glb.
*/

import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { button, useControls } from "leva";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";

// -------------------------------
// Facial Expressions & Viseme Mappings
// -------------------------------
const facialExpressions = {
  default: {
    eyeLookDownRight: 0.7,
    eyeLookDownLeft: 0.7,
  },
  smile: {
    browInnerUp: 0.17,
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.44,
    noseSneerLeft: 0.17,
    noseSneerRight: 0.14,
    mouthPressLeft: 0.61,
    mouthPressRight: 0.41,
    eyeLookDownRight: 0.7,
    eyeLookDownLeft: 0.7,
  },
};

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

let setupMode = false;

export function Avatar(props) {
  // 1) Load the new model from /models/fitness_avatar.glb
  const { nodes, materials, scene } = useGLTF("/models/fitness_avatar.glb");
  // 2) Load your animations from /models/animations.glb
  const { animations } = useGLTF("/models/animations.glb");

  // 3) Set up references and state
  const group = useRef();
  const { actions, mixer } = useAnimations(animations, group);
  const { message, onMessagePlayed, chat } = useChat();

  const [animation, setAnimation] = useState(
    animations.find((a) => a.name === "Idle") ? "Idle" : animations[0]?.name
  );
  const [facialExpression, setFacialExpression] = useState("default");
  const [lipsync, setLipsync] = useState(null);
  const [audio, setAudio] = useState(null);

  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);

  // 4) When a new chat message arrives, update states and play audio.
  useEffect(() => {
    if (!message) {
      setAnimation("Idle");
      return;
    }
    setAnimation(message.animation || "Idle");
    setFacialExpression(message.facialExpression || "default");
    setLipsync(message.lipsync || null);
    if (message.audio) {
      // Create a new Audio object for the synthesized speech.
      const newAudio = new Audio("data:audio/mp3;base64," + message.audio);
      newAudio.play();
      setAudio(newAudio);
      newAudio.onended = onMessagePlayed;
    }
  }, [message, onMessagePlayed]);

  // 5) Handle animations (Mixamo) and fade in/out.
  useEffect(() => {
    if (!actions || !animation) return;
    const current = actions[animation];
    if (!current) return;
    current
      .reset()
      .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
      .play();
    return () => {
      current.fadeOut(0.5);
    };
  }, [animation, actions, mixer]);

  // 6) Function to smoothly adjust a morph target.
  const lerpMorphTarget = (targetName, targetValue, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[targetName];
        if (index === undefined) return;
        const currentValue = child.morphTargetInfluences[index];
        if (currentValue === undefined) return;
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          currentValue,
          targetValue,
          speed
        );
      }
    });
  };

  // 7) Update morph targets each frame, including lip sync based on audio playback.
  useFrame(() => {
    if (setupMode) return;

    // Apply facial expression (excluding eye blinks, handled separately)
    const expressionData = facialExpressions[facialExpression] || {};
    Object.keys(nodes.Wolf3D_Avatar.morphTargetDictionary).forEach((key) => {
      if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") return;
      const wantedValue = expressionData[key] || 0;
      lerpMorphTarget(key, wantedValue, 0.1);
    });

    // Apply blinking/winking if morph targets exist.
    const morphDict = nodes.Wolf3D_Avatar.morphTargetDictionary;
    if (morphDict && "eyeBlinkLeft" in morphDict && "eyeBlinkRight" in morphDict) {
      const blinkOrWinkLeft = blink || winkLeft ? 1 : 0;
      const blinkOrWinkRight = blink || winkRight ? 1 : 0;
      lerpMorphTarget("eyeBlinkLeft", blinkOrWinkLeft, 0.5);
      lerpMorphTarget("eyeBlinkRight", blinkOrWinkRight, 0.5);
    }

    // Lip Sync: If lipsync data and audio exist, update mouth morph targets.
    if (message && lipsync && audio) {
      const currentAudioTime = audio.currentTime;
      let foundViseme = null;
      // Loop through mouth cues to find the active viseme.
      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const cue = lipsync.mouthCues[i];
        if (currentAudioTime >= cue.start && currentAudioTime <= cue.end) {
          foundViseme = cue.value; // e.g. "A", "B", etc.
          break;
        }
      }
      const targetName = corresponding[foundViseme];
      if (targetName) {
        // Lerp that viseme morph target up.
        lerpMorphTarget(targetName, 1, 0.2);
      }
      // Lerp all other viseme morph targets down.
      Object.values(corresponding).forEach((viseme) => {
        if (viseme !== targetName) {
          lerpMorphTarget(viseme, 0, 0.1);
        }
      });
    } else {
      // If no lipsync data, ensure all visemes are set to 0.
      Object.values(corresponding).forEach((viseme) => {
        lerpMorphTarget(viseme, 0, 0.1);
      });
    }
  });

  // 8) Simple random blinking effect.
  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // 9) Leva panel controls for debugging (optional)
  const [_, setLevaState] = useControls("MorphTarget", () =>
    Object.assign(
      {},
      ...Object.keys(nodes.Wolf3D_Avatar.morphTargetDictionary).map((key) => ({
        [key]: {
          label: key,
          value:
            nodes.Wolf3D_Avatar.morphTargetInfluences[
              nodes.Wolf3D_Avatar.morphTargetDictionary[key]
            ] || 0,
          min: 0,
          max: 1,
          onChange: (val) => {
            if (setupMode) {
              lerpMorphTarget(key, val, 1);
            }
          },
        },
      }))
    )
  );

  useControls("FacialExpressions", {
    chat: button(() => chat()),
    winkLeft: button(() => {
      setWinkLeft(true);
      setTimeout(() => setWinkLeft(false), 300);
    }),
    winkRight: button(() => {
      setWinkRight(true);
      setTimeout(() => setWinkRight(false), 300);
    }),
    animation: {
      value: animation,
      options: animations.map((a) => a.name),
      onChange: (val) => setAnimation(val),
    },
    facialExpression: {
      options: Object.keys(facialExpressions),
      value: facialExpression,
      onChange: (val) => setFacialExpression(val),
    },
    enableSetupMode: button(() => {
      setupMode = true;
    }),
    disableSetupMode: button(() => {
      setupMode = false;
    }),
    logMorphTargetValues: button(() => {
      const emotionValues = {};
      const dict = nodes.Wolf3D_Avatar.morphTargetDictionary;
      const influences = nodes.Wolf3D_Avatar.morphTargetInfluences;
      Object.keys(dict).forEach((key) => {
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") return;
        const value = influences[dict[key]];
        if (value > 0.01) {
          emotionValues[key] = parseFloat(value.toFixed(2));
        }
      });
      console.log(JSON.stringify(emotionValues, null, 2));
    }),
  });

  // 10) Render the model.
  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="Wolf3D_Avatar"
        geometry={nodes.Wolf3D_Avatar.geometry}
        material={materials.Wolf3D_Avatar}
        skeleton={nodes.Wolf3D_Avatar.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Avatar.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Avatar.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload("/models/fitness_avatar.glb");
useGLTF.preload("/models/animations.glb");