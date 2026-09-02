import React from 'react';
import {
  BrainCircuit,
  Database,
  Layers,
  Sprout,
  ShieldCheck,
  Cpu,
  Target,
  FileCheck2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Camera,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedFoliageHeroBackground } from './AnimatedFoliageHeroBackground';

interface AboutPageProps {
  onStartDiagnosing: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartDiagnosing }) => {
  const supportedSpecies = [
    { name: 'Tomato (Solanum lycopersicum)', diseases: ['Early Blight', 'Late Blight', 'Leaf Mold', 'Septoria Spot', 'Yellow Leaf Curl', 'Mosaic Virus'] },
    { name: 'Potato (Solanum tuberosum)', diseases: ['Early Blight', 'Late Blight', 'Healthy Foliage'] },
    { name: 'Bell Pepper (Capsicum annuum)', diseases: ['Bacterial Spot', 'Healthy Foliage'] },
    { name: 'Apple (Malus domestica)', diseases: ['Apple Scab', 'Black Rot', 'Cedar Apple Rust', 'Healthy Foliage'] },
    { name: 'Corn / Maize (Zea mays)', diseases: ['Cercospora Leaf Spot', 'Common Rust', 'Northern Leaf Blight', 'Healthy'] },
    { name: 'Grape (Vitis vinifera)', diseases: ['Black Rot', 'Esca (Black Measles)', 'Leaf Blight', 'Powdery Mildew'] },
    { name: 'Strawberry (Fragaria × ananassa)', diseases: ['Leaf Scorch', 'Healthy Foliage'] },
    { name: 'Peach (Prunus persica)', diseases: ['Bacterial Spot', 'Healthy Foliage'] }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      {/* Modern SaaS Hero Section with Animated Background */}
      <div className="bg-gradient-to-br from-[#122219] via-[#1A2F23] to-[#0E1A13] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-[#0D1812]/15 border border-[#2B4738]">
        {/* Animated Background Canvas */}
        <AnimatedFoliageHeroBackground />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#244634] text-[#A6D6B9] text-xs font-semibold uppercase tracking-wider border border-[#3A6B4E]">
              <BrainCircuit className="w-3.5 h-3.5 text-[#88D4A8]" />
              <span>Deep Learning in Agronomy</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#172D21] text-[#7DBE95] text-xs font-mono border border-[#274D38]">
              <Activity className="w-3 h-3 text-[#58BE82]" />
              <span>CNN Inference Engine Active</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white leading-[1.15]">
              Plant Pathology Identification System
            </h1>

            <p className="text-[#C1D7C8] text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              An automated agronomic diagnostic engine powered by Deep Convolutional Neural Networks (CNNs).
              Analyze foliar lesions, chlorotic margins, and pathogen morphology in real time with built-in
              anti-hallucination safety guards.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-[#15271E]/80 backdrop-blur-md border border-[#2D4D3A]">
              <span className="block text-[11px] uppercase tracking-wider text-[#85A892] font-semibold">Classes</span>
              <span className="text-xl sm:text-2xl font-display font-bold text-white">38</span>
              <span className="block text-[10px] text-[#A2C2AE]">Pathology Types</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#15271E]/80 backdrop-blur-md border border-[#2D4D3A]">
              <span className="block text-[11px] uppercase tracking-wider text-[#85A892] font-semibold">Dataset</span>
              <span className="text-xl sm:text-2xl font-display font-bold text-white">54,303</span>
              <span className="block text-[10px] text-[#A2C2AE]">PlantVillage Specs</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#15271E]/80 backdrop-blur-md border border-[#2D4D3A]">
              <span className="block text-[11px] uppercase tracking-wider text-[#85A892] font-semibold">Guard</span>
              <span className="text-xl sm:text-2xl font-display font-bold text-[#E5B582]">≥70.0%</span>
              <span className="block text-[10px] text-[#A2C2AE]">Min Confidence</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#15271E]/80 backdrop-blur-md border border-[#2D4D3A]">
              <span className="block text-[11px] uppercase tracking-wider text-[#85A892] font-semibold">Latency</span>
              <span className="text-xl sm:text-2xl font-display font-bold text-[#7DE2A6]">&lt;100ms</span>
              <span className="block text-[10px] text-[#A2C2AE]">Real-Time Eval</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="about-cta-start-btn"
              onClick={onStartDiagnosing}
              className="px-6 py-3.5 rounded-xl bg-[#2D5B41] hover:bg-[#234A34] text-white font-semibold text-sm flex items-center gap-2.5 shadow-lg shadow-[#0F1D14]/50 transition-all hover:scale-[1.02] active:scale-[0.98] border border-[#488562]"
            >
              <span>Launch Leaf Diagnostic Scanner</span>
              <ArrowRight className="w-4 h-4 text-[#B8E7CB]" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Technical Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#DCE4DA] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#E4EFE4] text-[#27533B] flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-display font-bold text-[#1D2B23]">
            PlantVillage Dataset
          </h2>
          <p className="text-[#596E62] text-xs sm:text-sm leading-relaxed">
            Trained and evaluated on the curated PlantVillage open-access pathology repository, encompassing over 54,000+ expert-annotated leaf specimen images across 38 distinct plant disease classes and healthy benchmarks.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#DCE4DA] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#E4EFE4] text-[#27533B] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-display font-bold text-[#1D2B23]">
            CNN Architecture
          </h2>
          <p className="text-[#596E62] text-xs sm:text-sm leading-relaxed">
            Utilizes deep residual convolutional networks (ResNet-50 / EfficientNet) with transfer learning to extract hierarchical visual features — detecting micro-lesions, chlorotic margins, powdery mycelium, and pustules.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#DCE4DA] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#E4EFE4] text-[#27533B] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-display font-bold text-[#1D2B23]">
            Pathology Management
          </h2>
          <p className="text-[#596E62] text-xs sm:text-sm leading-relaxed">
            Beyond diagnosis, the platform pairs each prediction with actionable agronomic intelligence: bio-fungicide options, chemical controls, sanitation protocols, and crop rotation schedules.
          </p>
        </div>
      </div>

      {/* Anti-Hallucination Guard Architecture */}
      <div className="bg-[#F8FAF7] rounded-3xl p-6 sm:p-8 border border-[#DCE4DA] shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#E4EFE4] text-[#27533B]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-[#1D2B23]">
              Anti-Hallucination &amp; Rejection Architecture
            </h2>
            <p className="text-xs text-[#63796D]">
              How the system prevents false diagnoses on random photos and ambiguous specimens:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-white border border-[#DCE4DA] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EAEFE8] text-[#245037] font-mono text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="text-sm font-bold text-[#1C2C22]">Stage 1: Botanical Pre-Filter</h3>
            </div>
            <p className="text-xs text-[#546A5C] leading-relaxed">
              A lightweight pre-check (<code className="bg-[#EAEFE8] px-1 py-0.5 rounded font-mono text-[11px] text-[#1D3B2A]">isLikelyLeafImage</code>) verifies foliar pigments (chlorophyll, carotenoids, necrosis ratios) before invoking the model. Non-botanical images are safely rejected upfront.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#DCE4DA] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EAEFE8] text-[#245037] font-mono text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-bold text-[#1C2C22]">Stage 2: Confidence Threshold Guard (≥70%)</h3>
            </div>
            <p className="text-xs text-[#546A5C] leading-relaxed">
              If the top softmax probability is below 70.0%, the system withholds a diagnosis instead of guessing, asking the user to submit a clear, single-leaf photo with better focus and illumination.
            </p>
          </div>
        </div>
      </div>

      {/* Photography & Diagnostic Capture Guidelines */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE4DA] shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#E4EFE4] text-[#27533B]">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-[#1D2B23]">
              Optimal Specimen Photography Guidelines
            </h2>
            <p className="text-xs text-[#63796D]">
              How to achieve maximum classification confidence with the CNN model:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#DCE4DA] space-y-1.5 text-xs">
            <strong className="text-[#1D2B23] block font-semibold">1. Single Leaf Focus</strong>
            <p className="text-[#566B5F]">
              Center a single affected leaf occupying 70%+ of the frame rather than the entire bushy canopy.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#DCE4DA] space-y-1.5 text-xs">
            <strong className="text-[#1D2B23] block font-semibold">2. Natural Uniform Light</strong>
            <p className="text-[#566B5F]">
              Avoid harsh direct glare, heavy cast shadows, or lens flash that can distort natural leaf color spectra.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#DCE4DA] space-y-1.5 text-xs">
            <strong className="text-[#1D2B23] block font-semibold">3. Neutral Background</strong>
            <p className="text-[#566B5F]">
              Whenever possible, frame the leaf against a neutral surface (soil, paper, or hand) to avoid background noise.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#DCE4DA] space-y-1.5 text-xs">
            <strong className="text-[#1D2B23] block font-semibold">4. Sharp Macro Focus</strong>
            <p className="text-[#566B5F]">
              Ensure crisp optical focus on symptomatic margins and necrotic spots rather than blurred petioles.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Plant Species Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE4DA] shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-display font-bold text-[#1D2B23]">
            Supported Agricultural Crops & Classes
          </h2>
          <p className="text-[#63796D] text-xs mt-0.5">
            Pathological diagnostic classes trained from the PlantVillage taxonomy:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportedSpecies.map((species, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DA] space-y-2"
            >
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#2C5F43]" />
                <span className="font-bold text-[#1D2B23] text-xs">
                  {species.name}
                </span>
              </div>
              <ul className="space-y-1">
                {species.diseases.map((d, dIdx) => (
                  <li key={dIdx} className="text-[11px] text-[#55695D] flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#3D7355]" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
