import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useChat } from "./hooks/useChat";
import * as THREE from "three";

export function Avatar() {
  // Load your 3D model & animations from public/models/
  const { scene, nodes, materials } = useGLTF("/models/therapist_avatar.glb");
  const { animations } = useGLTF("/models/animations.glb");
  
  const group = useRef();
  const { actions, mixer } = useAnimations(animations, group);

  const { message, onMessagePlayed } = useChat();
  const [audio, setAudio] = useState(null);

  // If your Node returns { audio: "base64..." }
  useEffect(() => {
    if (message?.audio) {
      const newAudio = new Audio(`data:audio/mp3;base64,${message.audio}`);
      newAudio.play();
      setAudio(newAudio);
      newAudio.onended = onMessagePlayed;
    }
  }, [message, onMessagePlayed]);

  // Idle animation
  useEffect(() => {
    if (!actions) return;
    const idle = actions["Idle"] || actions[Object.keys(actions)[0]];
    if (idle) {
      idle.reset().fadeIn(0.5).play();
    }
  }, [actions]);

  useFrame((_, delta) => {
    mixer.update(delta);
  });

  return (
    <group ref={group} dispose={null}>
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

useGLTF.preload("/models/therapist_avatar.glb");
useGLTF.preload("/models/animations.glb");
