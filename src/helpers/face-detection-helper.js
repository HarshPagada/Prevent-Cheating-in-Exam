import { Results } from "@mediapipe/face_detection";

export const extractFaceCoordinates = (result) => {
  if (result.detections.length < 1) {
    return;
  }

  const [leftEye, rightEye, , , leftEar, rightEar] =
    result.detections[0].landmarks;

  return {
    leftEye: leftEye.x,
    leftEar: leftEar.x,
    rightEye: rightEye.x,
    rightEar: rightEar.x,
  };
};

export const printLandmarks = (result) => {
  if (result.detections.length < 1) {
    return;
  }

  const { leftEar, leftEye, rightEar, rightEye } =
    extractFaceCoordinates(result);

  console.log("----------------------");
  console.log(`LEFT EAR: ${leftEar}`);
  console.log(`LEFT EYE: ${leftEye}`);
  console.log("----------------------");
  console.log(`RIGHT EYE: ${rightEye}`);
  console.log(`RIGHT EAR: ${rightEar}`);
  console.log("----------------------");
};

export const detectCheating = (
  faceCoordinates,
  printResults = false
) => {
  const { leftEar, leftEye, rightEar, rightEye } = faceCoordinates;

  const leftCoordDistance = leftEye - leftEar;
  const rightCoordDistance = rightEar - rightEye;

  // The higher the distance, the more difficult it is to cheat
  const lookingLeft = leftCoordDistance <= 0.03;  // 0.05
  const lookingRight = rightCoordDistance <= 0.03;

  if (printResults) {
    console.log("----------------------");
    console.log(`LOOKING LEFT: ${lookingLeft}`);
    console.log(`LOOKING RIGHT: ${lookingRight}`);
    console.log("----------------------");
  }

  return [lookingLeft, lookingRight];
};

export const getCheatingStatus = (
  lookingLeft,
  lookingRight
) => {
  if (lookingLeft) return "Cheating Detected: You're looking left";
  else if (lookingRight) return "Cheating Detected: You're looking right";
  else return "Everything is okay!";
};

export const b64toBlob = async (base64) =>
  fetch(base64).then((res) => res.blob());
