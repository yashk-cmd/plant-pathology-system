<div align="center">

# 🌿 Plant Pathology Identification System (Frontend)

An interactive, deep learning-powered web application for detecting and diagnosing plant leaf diseases in real time. Built with React, TypeScript, Tailwind CSS, and Framer Motion, with integrated Google OAuth authorization.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://plant-pathology-system.vercel.app/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## ✨ Key Features

* **Instant CNN Disease Inference:** Connects directly to a ResNet-50 deep learning backend REST API to evaluate leaf lesions, chlorosis, and pathogen indicators.
* **Anti-Hallucination & Rejection Architecture:** 
  * **Botanical Pre-Filter:** Client-side heuristic check (`isLikelyLeafImage`) verifies foliage pigments before calling the neural network.
  * **Confidence Safety Guard:** Withholds predictions if top model confidence falls below 70.0% to prevent false positives on ambiguous or non-leaf photos.
* **Interactive UI & Motion Design:** Smooth spring physics, interactive drag-and-drop zone, live radar/scanner HUD, and staggered tab transitions powered by Framer Motion.
* **Google OAuth Authorization:** Secure Google authentication integration (`@react-oauth/google`) removing plain-text mock credentials.
* **Agronomic Diagnostic Reports:** Displays categorized treatment protocols (Organic, Chemical, Cultural Management) and preventative crop care strategies.
* **Scan History & Session Logging:** Tracks evaluated specimens locally with full diagnostic telemetry and high-resolution previews.

---

## 🛠️ Tech Stack

* **Framework:** React 19 + Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **Animations:** Framer Motion (`motion/react`)
* **Authentication:** Google Identity Services (`@react-oauth/google`)
* **Icons:** Lucide React

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yashk-cmd/plant-pathology-system.git](https://github.com/yashk-cmd/plant-pathology-system.git)
   cd plant-pathology-system
