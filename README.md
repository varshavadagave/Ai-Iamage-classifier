# AI Image Classifier

## Problem Statement
Manually identifying objects in images is slow. This project lets a user upload or
capture an image and uses a computer vision model to predict its category with a
confidence percentage. Predictions are estimates and can be wrong.

## Assigned Feature Set
Feature Set C: Image upload/capture, computer vision classification, category and
confidence display, multiple image testing, basic result display.

## Features Implemented
- Upload an image from the device
- Capture a photo using the camera (if supported)
- Image preview and remove/reset button
- Classification by a pre-trained vision model
- Loading message and error handling (invalid file, large file, model errors)
- Shows category, confidence %, and a status message
- Test many images without refreshing; results are listed with previews

## Technologies Used
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express (serves the frontend files)
- AI library: Transformers.js (@huggingface/transformers), runs in the browser using WebAssembly
- Model: Xenova/vit-base-patch16-224 (Vision Transformer, ImageNet 1000 classes)

## AI Tools Used
- Claude (Anthropic) to generate and explain the initial code
- Vision Transformer model for image classification (runs in the browser, no API key)

## Important AI Prompts / AI Usage
- Prompt: "Build a beginner-friendly web project for Feature Set C (image
  upload/capture, classification, confidence, multiple image testing, results)
  with separate frontend and backend."
- Claude suggested the local ViT model, the folder structure and the code.
- I ran, tested and verified the project myself with different images
  (add your own test notes here).
- Limitation: the model only knows 1000 ImageNet categories and is not 100% accurate.

## Instructions to Run the Project
1. Install Node.js 18+
2. `cd backend`
3. `npm install`
4. `npm start`
5. Open http://localhost:3000 (internet needed on first use to download the model, about 100 MB)

## Screenshots
- [Screenshot 1: Home page]
- [Screenshot 2: Image preview]
- [Screenshot 3: Classification result]
- [Screenshot 4: Multiple results]
- [Screenshot 5: Error message]
