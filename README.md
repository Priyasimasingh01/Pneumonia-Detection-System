# 🫁 AI-Powered Pneumonia Detection System

![Version](https://img.shields.io/badge/Version-2.5-blue.svg)
![Status](https://img.shields.io/badge/Status-Stable-success.svg)
![Tech](https://img.shields.io/badge/Tech-React_|_FastAPI_|_TensorFlow-00d4ff.svg)
![Author](https://img.shields.io/badge/Designed_By-Priya-ff0a54.svg)

> **A Next-Generation Radiology Assistant designed to detect Pneumonia from Chest X-Rays with high precision using Deep Learning.**

---

## 📖 Overview

The **Pneumonia Detection System** is a state-of-the-art web application that leverages Convolutional Neural Networks (CNN) to analyze chest X-ray images. It provides instant diagnostic predictions, classifying images as **NORMAL** or **PNEUMONIA** along with a precise confidence score.

The interface is designed with a **Dark Medical Theme**, featuring glassmorphism effects, a "Laser Scan" analysis animation, and high-quality vector animations to ensure a professional and immersive user experience.

---

## ✨ Key Features

* **🧠 Deep Learning Core**: Powered by a custom-trained TensorFlow/Keras CNN model.
* **⚡ Real-Time Inference**: High-performance prediction engine built with FastAPI.
* **🎨 Modern Dark UI/UX**:
    * Split-screen layout with **Lottie Animations**.
    * "Dark Medical" aesthetic with Neon Cyan & Medical Blue accents.
    * Glassmorphism control panel with transparency effects.
    * Interactive "Laser Scan" analysis animation during processing.
* **📱 Fully Responsive**: Optimized for Desktop, Tablet, and Mobile devices.
* **🔒 Secure Processing**: Images are processed in real-time and not stored permanently.

---

## 🛠️ Tech Stack

### Frontend
* **React.js**: Component-based UI architecture.
* **Lottie-React**: For fluid, vector-based medical animations.
* **CSS3**: Custom Keyframe animations, Flexbox/Grid, and CSS Variables.
* **Axios**: For asynchronous API communication.

### Backend
* **FastAPI**: High-performance web framework for building APIs.
* **Uvicorn**: ASGI server implementation.
* **TensorFlow / Keras**: For loading and running the pre-trained `.h5` model.
* **Pillow (PIL)**: For image preprocessing (resizing/normalization).

---

## 📂 Project Structure

```bash
Pneumonia-Detection-System/
├── backend/
│   ├── main.py                  # FastAPI Server & Inference Logic
│   ├── my_model.h5              # Trained Deep Learning Model
│   └── requirements.txt         # Python Dependencies
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── App.js               # Main Frontend Logic
    │   ├── App.css              # Styling, Animations & Dark Theme
    │   ├── DoctorAnimation.json # Lottie Animation File
    │   └── index.js
    ├── package.json
    └── README.md
