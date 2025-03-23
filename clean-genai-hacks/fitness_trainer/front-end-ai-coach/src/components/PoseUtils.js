// PoseUtils.js
let wasSquatting = false;
let repCount = 0;

export function analyzeSquatPose(pose) {
  const keypoints = pose.keypoints;

  const hip = keypoints.find((k) => k.name === "left_hip");
  const knee = keypoints.find((k) => k.name === "left_knee");
  const ankle = keypoints.find((k) => k.name === "left_ankle");

  if (!hip || !knee || !ankle) return `Pose not clear | Reps: ${repCount}`;

  const angle = calculateAngle(hip, knee, ankle);

  // Rep counting logic
  if (angle < 90 && !wasSquatting) {
    wasSquatting = true;
  }

  if (angle > 150 && wasSquatting) {
    wasSquatting = false;
    repCount++;
  }

  let feedback = "";

  if (angle < 90) {
    feedback = "Hold the squat!";
  } else if (angle < 140) {
    feedback = "Going down...";
  } else {
    feedback = "Stand tall!";
  }

  return `${feedback} | Reps: ${repCount}`;
}

function calculateAngle(a, b, c) {
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const cb = { x: b.x - c.x, y: b.y - c.y };

  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
  const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);

  const cosineAngle = dot / (magAB * magCB);
  const angle = Math.acos(cosineAngle);
  return (angle * 180) / Math.PI;
}