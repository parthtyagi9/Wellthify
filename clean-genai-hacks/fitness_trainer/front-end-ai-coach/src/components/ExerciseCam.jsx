import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";

export default function ExerciseCam() {
  const webcamRef = useRef(null);
  const [feedback, setFeedback] = useState("Initializing...");
  const [repCount, setRepCount] = useState(0);
  const [detector, setDetector] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [inFrame, setInFrame] = useState(true);
  const [detectorReady, setDetectorReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await tf.setBackend("webgl");
      await tf.ready();

      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        }
      );

      setDetector(detector);
      setDetectorReady(true);
      setFeedback("Ready. Press Start to begin.");
      console.log("Detector initialized");
    };

    init();
  }, []);

  // 👇 Call your backend when tracking starts
  useEffect(() => {
    if (tracking) {
      (async () => {
        try {
          const res = await fetch("http://localhost:4300/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Start counting my squats. Do not suggest any other exercises. Only motivate" }),
          });
          const data = await res.json();
          const msg = data?.messages?.[0];

          if (msg?.audio) {
            const audio = new Audio(`data:audio/mp3;base64,${msg.audio}`);
            audio.play();
          }

          if (msg?.text) {
            console.log("Coach:", msg.text);
          }
        } catch (err) {
          console.error("Error fetching coach audio:", err);
        }
      })();
    }
  }, [tracking]);

  // 👇 Motivational message after every 3 reps
  useEffect(() => {
    if (repCount > 0 && repCount % 3 === 0) {
      (async () => {
        try {
          const res = await fetch("http://localhost:4300/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Motivate me after 3 reps!" }),
          });
          const data = await res.json();
          const msg = data?.messages?.[0];

          if (msg?.audio) {
            const audio = new Audio(`data:audio/mp3;base64,${msg.audio}`);
            audio.play();
          }

          if (msg?.text) {
            console.log("Coach:", msg.text);
          }
        } catch (err) {
          console.error("Error fetching motivational audio:", err);
        }
      })();
    }
  }, [repCount]);

  useEffect(() => {
    if (!detectorReady || !tracking || !detector) return;

    const interval = setInterval(async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const poses = await detector.estimatePoses(video);
        console.log("👀 Raw poses:", poses);

        if (poses.length > 0) {
          const pose = poses[0];
          const hip = pose.keypoints.find((pt) => pt.name === "left_hip");
          const knee = pose.keypoints.find((pt) => pt.name === "left_knee");
          const shoulder = pose.keypoints.find((pt) => pt.name === "left_shoulder");

          if (hip && knee && shoulder && hip.score > 0.6 && knee.score > 0.6 && shoulder.score > 0.6) {
            setInFrame(true);
            const torso = Math.abs(shoulder.y - hip.y);
            const leg = Math.abs(hip.y - knee.y);
            console.log("📏 Torso:", torso.toFixed(1), "Leg:", leg.toFixed(1));

            if (leg < torso * 0.6 && feedback !== "🪑 Sitting") {
              setFeedback("🪑 Sitting");
              setRepCount((prev) => prev + 1);
            } else if (leg > torso * 0.8 && feedback !== "🧍 Standing") {
              setFeedback("🧍 Standing");
            }
          } else {
            setInFrame(false);
            setFeedback("Stay in frame");
          }
        } else {
          setInFrame(false);
          setFeedback("No person detected");
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [detector, tracking, detectorReady, feedback]);

  return (
    <div style={styles.wrapper}>
      <Webcam
        ref={webcamRef}
        mirrored
        width={300}
        height={225}
        style={styles.video}
      />
      <div style={styles.feedback}>Feedback: {feedback}</div>
      <div style={styles.reps}>Reps: {repCount}</div>
      <div style={styles.status}>
        In Frame: {inFrame ? "✅" : "❌"}
      </div>
      <button
        onClick={() => setTracking((prev) => !prev)}
        disabled={!detectorReady}
        style={{
          ...styles.button,
          backgroundColor: detectorReady ? "#00b894" : "#636e72",
          cursor: detectorReady ? "pointer" : "not-allowed",
        }}
      >
        {tracking ? "Stop" : "Start"} Detection
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "absolute",
    top: "20px",
    right: "20px",
    zIndex: 10,
    background: "rgba(0,0,0,0.6)",
    padding: "10px",
    borderRadius: "10px",
    color: "white",
    fontFamily: "sans-serif",
    maxWidth: "320px",
  },
  video: {
    borderRadius: "8px",
  },
  feedback: {
    marginTop: "10px",
    fontWeight: "bold",
  },
  reps: {
    marginTop: "5px",
    fontSize: "16px",
  },
  status: {
    marginTop: "5px",
    fontSize: "14px",
  },
  button: {
    marginTop: "10px",
    padding: "8px 12px",
    fontSize: "14px",
    color: "white",
    border: "none",
    borderRadius: "6px",
  },
};