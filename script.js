// Load the AI library from a CDN (runs in the browser, no C++ needed)
import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3";

// ----- Get page elements -----
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const cameraBtn = document.getElementById("cameraBtn");
const cameraBox = document.getElementById("cameraBox");
const video = document.getElementById("video");
const captureBtn = document.getElementById("captureBtn");
const closeCameraBtn = document.getElementById("closeCameraBtn");
const canvas = document.getElementById("canvas");
const previewBox = document.getElementById("previewBox");
const preview = document.getElementById("preview");
const classifyBtn = document.getElementById("classifyBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");
const results = document.getElementById("results");
const emptyText = document.getElementById("emptyText");

let selectedFile = null; // the image currently chosen
let stream = null;       // camera stream

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "error" : "";
}

// ----- Load the AI model once and reuse it -----
let classifierPromise = null;
function getClassifier() {
  if (!classifierPromise) {
    classifierPromise = pipeline("image-classification", "Xenova/vit-base-patch16-224");
  }
  return classifierPromise;
}

// ----- Upload from device -----
uploadBtn.onclick = () => fileInput.click();
fileInput.onchange = () => {
  if (fileInput.files[0]) showPreview(fileInput.files[0]);
};

function showPreview(file) {
  if (!file.type.startsWith("image/")) {
    showMessage("Invalid file. Please choose an image.", true);
    return;
  }
  selectedFile = file;
  preview.src = URL.createObjectURL(file);
  previewBox.hidden = false;
  showMessage("");
}

// ----- Reset -----
resetBtn.onclick = () => {
  selectedFile = null;
  fileInput.value = "";
  previewBox.hidden = true;
  showMessage("");
};

// ----- Camera -----
cameraBtn.onclick = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showMessage("Camera is not supported on this device/browser.", true);
    return;
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    cameraBox.hidden = false;
  } catch (err) {
    showMessage("Could not access the camera (permission denied?).", true);
  }
};

function closeCamera() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  cameraBox.hidden = true;
}
closeCameraBtn.onclick = closeCamera;

captureBtn.onclick = () => {
  // Draw the current video frame onto a canvas, then turn it into a file
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  canvas.toBlob((blob) => {
    showPreview(new File([blob], "photo.jpg", { type: "image/jpeg" }));
    closeCamera();
  }, "image/jpeg");
};

// ----- Classify (done in the browser) -----
classifyBtn.onclick = async () => {
  if (!selectedFile) return;

  classifyBtn.disabled = true;
  showMessage("Classifying... (the first image downloads the model, please wait)");

  try {
    const classifier = await getClassifier();
    const output = await classifier(preview.src, { top_k: 3 });

    // Convert score (0-1) to percentage with 1 decimal place
    const predictions = output.map((r) => ({
      label: r.label,
      confidence: Math.round(r.score * 1000) / 10,
    }));

    addResult(preview.src, predictions);
    showMessage("Done! You can test another image.");
  } catch (err) {
    console.error(err);
    showMessage("Error: could not classify this image. Check your internet and try again.", true);
    classifierPromise = null; // allow a retry if model loading failed
  } finally {
    classifyBtn.disabled = false;
  }
};

// ----- Show one result card (newest on top) -----
function addResult(imageSrc, predictions) {
  const top = predictions[0];

  let status;
  if (top.confidence >= 70) status = "The model is fairly confident. It can still be wrong.";
  else if (top.confidence >= 40) status = "The model is unsure. Treat this guess carefully.";
  else status = "Low confidence. Try a clearer image.";

  const card = document.createElement("div");
  card.className = "result";

  const img = document.createElement("img");
  img.src = imageSrc;

  const info = document.createElement("div");
  // textContent (not innerHTML) keeps the output safe
  const category = document.createElement("p");
  category.textContent = "Category: " + top.label;
  const confidence = document.createElement("p");
  confidence.textContent = "Confidence: " + top.confidence + "%";
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.innerHTML = `<div style="width:${top.confidence}%"></div>`;
  const statusText = document.createElement("p");
  statusText.textContent = status;
  const others = document.createElement("small");
  others.textContent =
    "Other guesses: " + predictions.slice(1).map((p) => `${p.label} (${p.confidence}%)`).join(", ");

  info.append(category, confidence, bar, statusText, others);
  card.append(img, info);
  results.prepend(card);
  emptyText.hidden = true;
}
