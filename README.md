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

1.   Install dependencies:

Bash
npm install

2.Configure Environment Variables:
Create a .env.local file in the root directory and configure the following variables:

Code snippet
# Plant Disease Model Backend Endpoint
VITE_MODEL_API_URL=[https://plant-backend-z74c.onrender.com/predict](https://plant-backend-z74c.onrender.com/predict)

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=890439483208-na6ijt26td75mlgb4asus6pldj4ujlqi.apps.googleusercontent.com

3.Run local development server:
Bash
npm run dev
Open http://localhost:3000 (or http://localhost:5173) in your browser.

🏗️ Project Structure
Plaintext
src/
├── components/          # Reusable UI components & Page views
│   ├── AboutPage.tsx    # Model metrics & photography guidelines
│   ├── HistoryPage.tsx  # Specimen diagnostic logs
│   ├── LoginPage.tsx    # Secure sign-in with Google OAuth
│   ├── Navbar.tsx       # Main navigation header
│   ├── ResultCard.tsx   # Diagnostic output & treatment tabs
│   ├── UploadZone.tsx   # Drag-and-drop uploader & live scanner HUD
│   └── ...
├── context/             # Global React state (AuthContext)
├── services/            # API integration & prediction services
│   ├── authService.ts
│   └── diseaseModelService.ts
├── types/               # TypeScript interfaces & types
└── utils/               # Animation helper presets (Framer Motion)


🌐 Deployment
This frontend is configured for instant continuous deployment on Vercel.
1.Connect your GitHub repository to Vercel.
2.Add VITE_MODEL_API_URL and VITE_GOOGLE_CLIENT_ID to your Vercel Project Environment Variables.
3.Add https://plant-pathology-system.vercel.app to Authorized JavaScript origins in Google Cloud Console under your OAuth Web Client settings.

📄 License
Distributed under the MIT License. See LICENSE for more information.
