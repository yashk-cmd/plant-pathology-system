import React from 'react';
import { UnrecognizedLeafResult } from '../types';
import {
  HelpCircle,
  Sparkles,
  ArrowLeft,
  ScanLine,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Info,
  Sliders,
  Cpu,
  RefreshCw,
  Camera,
  Sun,
  Focus,
  Maximize2
} from 'lucide-react';
import { motion } from 'motion/react';

interface UnrecognizedLeafCardProps {
  result: UnrecognizedLeafResult;
  onScanAnother: () => void;
  onLearnMore?: () => void;
}

export const UnrecognizedLeafCard: React.FC<UnrecognizedLeafCardProps> = ({
  result,
  onScanAnother,
  onLearnMore
}) => {
  const isPrecheckFailure = result.reason === 'failed_precheck';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Top Bar with Back Action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          id="rejection-back-to-upload-btn"
          onClick={onScanAnother}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#284233] bg-white hover:bg-[#F2F6F1] border border-[#D0DED0] shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Another Image</span>
        </button>

        <span className="text-xs font-mono text-[#607769] bg-[#F1F5F0] px-3 py-1 rounded-full border border-[#D5E1D4]">
          Pipeline Status: Withheld Diagnosis
        </span>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-3xl border border-[#D8E2D6] shadow-xl shadow-[#1C3627]/5 overflow-hidden">
        {/* Soft, Gentle Header Banner (Distinct from red error / green diagnosis) */}
        <div className="bg-gradient-to-br from-[#1C2C23] via-[#23382C] to-[#18261E] p-6 sm:p-8 text-white relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#5B8D70]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#324D3E] text-[#D0E8D9] border border-[#486D58]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#9BD0B0]" />
                  <span>
                    {isPrecheckFailure ? 'Leaf Pre-Filter Guard' : 'Confidence Safety Guard'}
                  </span>
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-[#A7C0B0] bg-[#16251E] border border-[#2B4435]">
                  Threshold: ≥{result.thresholdApplied.toFixed(0)}%
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                {result.headline}
              </h1>

              <p className="text-[#D3E2D8] text-sm sm:text-base leading-relaxed">
                {result.message}
              </p>
            </div>

            {/* Status Dial / Guard Badge */}
            <div className="bg-[#14231A]/90 p-4 rounded-2xl border border-[#2D4536] backdrop-blur-md self-start md:self-auto flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="block text-[11px] uppercase tracking-wider text-[#91A89B] font-semibold">
                  {isPrecheckFailure ? 'Pre-Check' : 'Model Confidence'}
                </span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-[#E5B582]">
                  {isPrecheckFailure ? '0.0%' : `${result.confidenceScore?.toFixed(1)}%`}
                </span>
                <span className="block text-[10px] text-[#A6BCB0] font-mono">
                  (Below {result.thresholdApplied}% min)
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-[#E5B582]/40 bg-[#2A3728] flex items-center justify-center font-bold text-xs text-[#E5B582] shadow-[0_0_12px_rgba(229,181,130,0.15)]">
                <ScanLine className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Specimen Evaluation Strip */}
        <div className="bg-[#121E17] px-6 py-4 border-y border-[#23382B] flex flex-wrap items-center justify-between gap-4 text-[#B8C8BD] text-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1C2C22] border border-[#344D3E] shrink-0 relative">
              <img
                src={result.imageUrl}
                alt="Evaluated specimen"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-[#000]/20 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-white/80" />
              </div>
            </div>
            <div>
              <span className="font-semibold text-white block">Specimen Log: #{result.id}</span>
              <span className="text-[#899E90]">
                Evaluated: {new Date(result.analyzedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-[#A1B6A8]">
            <span>Decision: Short-circuited / Withheld</span>
            <span>•</span>
            <span>Anti-Hallucination Safe</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Transparent Pipeline Diagnostics Explanation */}
          <div className="p-5 rounded-2xl bg-[#F7FAF6] border border-[#DDE6DC] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2D563F] uppercase tracking-wider">
              <Info className="w-4 h-4 text-[#2D563F]" />
              <span>Why Was A Diagnosis Not Shown?</span>
            </div>

            {isPrecheckFailure ? (
              <div className="text-xs sm:text-sm text-[#3E5547] space-y-2 leading-relaxed">
                <p>
                  <strong>Leaf Presence Pre-Filter:</strong> The lightweight{' '}
                  <code className="px-1.5 py-0.5 rounded bg-[#EAEFE8] font-mono text-xs text-[#1D3B2A]">
                    isLikelyLeafImage()
                  </code>{' '}
                  pre-check was triggered before passing data to the heavy neural network. The image did
                  not present recognizable botanical leaf pigments or foliar characteristics.
                </p>
                <p className="text-xs text-[#627C6C] italic">
                  {result.precheckDetails?.description}
                </p>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-[#3E5547] space-y-2 leading-relaxed">
                <p>
                  <strong>Confidence Threshold Guard:</strong> The disease classification model
                  evaluated this specimen, but its highest softmax probability (
                  <strong>{result.confidenceScore?.toFixed(1)}%</strong>) fell below the required{' '}
                  <strong>{result.thresholdApplied.toFixed(0)}%</strong> diagnostic threshold.
                </p>
                <p className="text-xs text-[#627C6C]">
                  Plant pathology datasets (such as PlantVillage) train models to classify specific
                  diseases, but without a confidence guard, random or ambiguous photos could result in
                  hallucinated diagnoses. By withholding low-confidence outputs, the system preserves
                  diagnostic integrity.
                </p>
              </div>
            )}
          </div>

          {/* Practical Specimen Capture Guidelines */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[#1B2C21] mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#2D563F]" />
              <span>How to Capture an Accurate Leaf Specimen</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-white border border-[#DCE4DA] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#EAEFE8] text-[#245037] shrink-0">
                  <Focus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1C2C22]">Single Leaf Close-Up</h4>
                  <p className="text-xs text-[#546A5C] mt-0.5 leading-relaxed">
                    Frame a single symptomatic leaf so it fills at least 70% of the viewfinder. Avoid whole trees or distant crops.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#DCE4DA] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#EAEFE8] text-[#245037] shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1C2C22]">Even, Natural Lighting</h4>
                  <p className="text-xs text-[#546A5C] mt-0.5 leading-relaxed">
                    Photograph under bright, indirect daylight. Avoid strong camera flash glares, heavy cast shadows, or backlighting.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#DCE4DA] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#EAEFE8] text-[#245037] shrink-0">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1C2C22]">Clear Background Contrast</h4>
                  <p className="text-xs text-[#546A5C] mt-0.5 leading-relaxed">
                    Place the leaf against a clean, uncluttered neutral background (e.g. soil surface, palm of hand, or neutral mat).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#DCE4DA] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#EAEFE8] text-[#245037] shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1C2C22]">Sharp Macro Focus</h4>
                  <p className="text-xs text-[#546A5C] mt-0.5 leading-relaxed">
                    Ensure lesions, leaf venation, fungal spots, and leaf margins are crisp and in sharp optical focus.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Developer Note */}
          <div className="p-4 rounded-xl bg-[#F4F6F2] border border-[#DAE3D7] flex items-center justify-between flex-wrap gap-3 text-xs text-[#556D5E]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#355B45]" />
              <span>
                <strong>Developer Integration Notice:</strong> Pre-check (
                <code>isLikelyLeafImage</code>) &amp; Confidence Threshold (
                <code>≥70%</code>) are active.
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#789382]">
              Config: <code>MIN_CONFIDENCE_THRESHOLD = 70.0</code>
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#F8FAF7] border-t border-[#DCE4DA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#63796D] text-center sm:text-left">
            Upload a clear, high-resolution photo of a single leaf to proceed with classification.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onLearnMore && (
              <button
                type="button"
                id="view-guidelines-btn"
                onClick={onLearnMore}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-[#F1F5EF] text-[#274634] font-medium text-xs sm:text-sm border border-[#CDE1D0] transition-all"
              >
                View Guidelines
              </button>
            )}

            <button
              type="button"
              id="try-another-specimen-btn"
              onClick={onScanAnother}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#2D563F] hover:bg-[#234532] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#1C3627]/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] border border-[#427357]"
            >
              <RefreshCw className="w-4 h-4 text-[#B6E0C6]" />
              <span>Try Another Photo</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
