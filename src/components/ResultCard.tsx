import React, { useState } from 'react';
import { DiseasePrediction } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Leaf,
  Sparkles,
  ArrowLeft,
  Printer,
  ChevronRight,
  Activity,
  Layers,
  Thermometer,
  Microscope,
  Calendar,
  Clock,
  Sprout,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';

interface ResultCardProps {
  result: DiseasePrediction;
  onScanAnother: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onScanAnother }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'symptoms' | 'treatment' | 'prevention' | 'model'>('overview');

  const getSeverityBadge = () => {
    switch (result.severity) {
      case 'Healthy':
        return {
          bg: 'bg-[#E5EFE7] text-[#1E4D2B] border-[#BED6C3]',
          icon: ShieldCheck,
          label: 'Healthy Foliage'
        };
      case 'Low':
        return {
          bg: 'bg-[#E6F0F2] text-[#24525C] border-[#B7D7DC]',
          icon: Activity,
          label: 'Low Severity'
        };
      case 'Moderate':
        return {
          bg: 'bg-[#F8EFE0] text-[#7E571E] border-[#E8D2B0]',
          icon: AlertTriangle,
          label: 'Moderate Severity'
        };
      case 'High':
        return {
          bg: 'bg-[#F7EAE3] text-[#8C3F1D] border-[#E9C3AF]',
          icon: ShieldAlert,
          label: 'High Severity'
        };
      case 'Severe':
        return {
          bg: 'bg-[#F6E3E3] text-[#8C2323] border-[#E5B5B5]',
          icon: Flame,
          label: 'Severe / Urgent'
        };
      default:
        return {
          bg: 'bg-[#F1F5F0] text-[#334D3D] border-[#D1DDD0]',
          icon: Activity,
          label: result.severity
        };
    }
  };

  const severityInfo = getSeverityBadge();
  const SeverityIcon = severityInfo.icon;

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Top Bar with Back Action & Print */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          id="back-to-upload-btn"
          onClick={onScanAnother}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#284233] bg-white hover:bg-[#F2F6F1] border border-[#D0DED0] shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload New Leaf</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="print-report-btn"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#385243] bg-white hover:bg-[#F2F6F1] border border-[#D0DED0] shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-[#617B6D]" />
            <span className="hidden sm:inline">Print Diagnostic Summary</span>
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="bg-white rounded-3xl border border-[#DCE4DA] shadow-xl shadow-[#203D2F]/5 overflow-hidden">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-br from-[#14231B] via-[#1E3228] to-[#122019] p-6 sm:p-8 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3E7053]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${severityInfo.bg}`}>
                  <SeverityIcon className="w-3.5 h-3.5" />
                  <span>{severityInfo.label}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#243E31] text-[#BEE0CA] border border-[#3E664F]">
                  <Sprout className="w-3.5 h-3.5 text-[#8CBFA0]" />
                  <span>{result.plantSpecies}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#1F3329] text-[#B7C7BD] border border-[#354F41]">
                  {result.pathogenType} Pathogen
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight">
                {result.commonName}
              </h1>
              <p className="text-[#C1D2C7] text-xs sm:text-sm font-mono italic">
                {result.diseaseName}
              </p>
            </div>

            {/* Confidence Score Dial */}
            <div className="flex items-center gap-4 bg-[#14231B]/90 p-4 rounded-2xl border border-[#2F473A] backdrop-blur-md self-start md:self-auto">
              <div className="text-right">
                <span className="block text-[11px] uppercase tracking-wider text-[#98AFA2] font-semibold">
                  CNN Confidence
                </span>
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-[#7CD2A2]">
                  {result.confidenceScore.toFixed(1)}%
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-[#3D6950]/50 border-t-[#66C590] flex items-center justify-center font-bold text-xs text-[#A8DCBE] shadow-[0_0_12px_rgba(102,197,144,0.25)]">
                AI
              </div>
            </div>
          </div>
        </div>

        {/* Specimen Preview Bar */}
        <div className="bg-[#132018] px-6 py-4 border-y border-[#263C2F] flex flex-wrap items-center justify-between gap-4 text-[#BACABF] text-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1D3025] border border-[#354D3F] shrink-0">
              <img
                src={result.imageUrl}
                alt="Analyzed leaf specimen"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-semibold text-white block">Specimen Analysis ID: #{result.id}</span>
              <span className="text-[#8EA295]">
                Timestamp: {new Date(result.analyzedAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[#8EA295] font-mono text-[11px]">
            <span>Latency: {result.modelDetails.inferenceTimeMs}ms</span>
            <span>•</span>
            <span>Input: {result.modelDetails.inputResolution}</span>
          </div>
        </div>

        {/* Diagnostic Tabs */}
        <div className="border-b border-[#DCE4DA] bg-[#F7FAF6] px-6 flex overflow-x-auto gap-2 sm:gap-4">
          <button
            type="button"
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#2D563F] text-[#1B402C] bg-[#EEF5EF]'
                : 'border-transparent text-[#5B7264] hover:text-[#1D2B23]'
            }`}
          >
            📋 Overview & Pathology
          </button>
          <button
            type="button"
            id="tab-symptoms"
            onClick={() => setActiveTab('symptoms')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'symptoms'
                ? 'border-[#2D563F] text-[#1B402C] bg-[#EEF5EF]'
                : 'border-transparent text-[#5B7264] hover:text-[#1D2B23]'
            }`}
          >
            🔍 Symptoms & Diagnostics
          </button>
          <button
            type="button"
            id="tab-treatment"
            onClick={() => setActiveTab('treatment')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'treatment'
                ? 'border-[#2D563F] text-[#1B402C] bg-[#EEF5EF]'
                : 'border-transparent text-[#5B7264] hover:text-[#1D2B23]'
            }`}
          >
            🌿 Treatment Protocols
          </button>
          <button
            type="button"
            id="tab-prevention"
            onClick={() => setActiveTab('prevention')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'prevention'
                ? 'border-[#2D563F] text-[#1B402C] bg-[#EEF5EF]'
                : 'border-transparent text-[#5B7264] hover:text-[#1D2B23]'
            }`}
          >
            🛡️ Prevention Tips
          </button>
          <button
            type="button"
            id="tab-model"
            onClick={() => setActiveTab('model')}
            className={`py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'model'
                ? 'border-[#2D563F] text-[#1B402C] bg-[#EEF5EF]'
                : 'border-transparent text-[#5B7264] hover:text-[#1D2B23]'
            }`}
          >
            🧠 Model Metrics
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 sm:p-8">
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-base font-semibold text-[#1A2921] mb-2">
                  Disease Description
                </h3>
                <p className="text-[#455A4E] text-sm leading-relaxed">
                  {result.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DA]">
                  <span className="text-xs font-semibold text-[#667C6F] uppercase tracking-wider block mb-1">
                    Pathogen Classification
                  </span>
                  <span className="text-sm font-bold text-[#1D3025] flex items-center gap-1.5">
                    <Microscope className="w-4 h-4 text-[#2E6347]" />
                    {result.pathogenType}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DA]">
                  <span className="text-xs font-semibold text-[#667C6F] uppercase tracking-wider block mb-1">
                    Target Crop
                  </span>
                  <span className="text-sm font-bold text-[#1D3025] flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-[#2E6347]" />
                    {result.plantSpecies.split('(')[0]}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DA]">
                  <span className="text-xs font-semibold text-[#667C6F] uppercase tracking-wider block mb-1">
                    Intervention Urgency
                  </span>
                  <span className="text-sm font-bold text-[#1D3025] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#2E6347]" />
                    {result.severity === 'Healthy' ? 'Routine Monitoring' : `${result.severity} Priority`}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. SYMPTOMS */}
          {activeTab === 'symptoms' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h3 className="text-base font-semibold text-[#1A2921]">
                Characteristic Diagnostic Symptoms
              </h3>
              <p className="text-[#5B7365] text-xs">
                Observed visual indicators and pathology features detected on plant foliage:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {result.symptoms.map((symptom, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DA] flex items-start gap-3"
                  >
                    <div className="p-1 rounded-lg bg-[#E4EFE4] text-[#28553D] shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#273B30] leading-snug">
                      {symptom}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 3. TREATMENT */}
          {activeTab === 'treatment' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Organic Solutions */}
              <div>
                <h3 className="text-sm font-bold text-[#1B432D] flex items-center gap-2 mb-3">
                  <Leaf className="w-4 h-4 text-[#356B4C]" />
                  <span>Organic & Biological Interventions</span>
                </h3>
                <ul className="space-y-2.5">
                  {result.recommendedTreatments.organic.map((item, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-[#EFF5F0] border border-[#CDE1D0] text-xs sm:text-sm text-[#1A3825] flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#356B4C] shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical Controls */}
              {result.recommendedTreatments.chemical.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#3B291A] flex items-center gap-2 mb-3">
                    <Thermometer className="w-4 h-4 text-[#B56A2B]" />
                    <span>Chemical & Fungicide Controls</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {result.recommendedTreatments.chemical.map((item, idx) => (
                      <li
                        key={idx}
                        className="p-3 rounded-xl bg-[#FAF5EE] border border-[#EBD9C6] text-xs sm:text-sm text-[#4E3725] flex items-start gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B56A2B] shrink-0 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* 4. PREVENTION */}
          {activeTab === 'prevention' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h3 className="text-base font-semibold text-[#1A2921]">
                Cultural Management & Disease Prevention
              </h3>
              <p className="text-[#5B7365] text-xs">
                Agronomic strategies to suppress fungal spore dissemination and safeguard future harvests:
              </p>
              <div className="space-y-3 mt-3">
                {result.preventionTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DA] flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#E4EFE4] text-[#244E38] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#C6DDD0]">
                      {idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm text-[#273B30] leading-relaxed">
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 5. MODEL DETAILS */}
          {activeTab === 'model' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              <h3 className="text-base font-semibold text-[#1A2921]">
                Neural Inference Telemetry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#DCE4DA] space-y-1">
                  <span className="text-[#647C6F] font-medium">Model Architecture</span>
                  <p className="font-semibold text-[#1C2C23]">{result.modelDetails.architecture}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#DCE4DA] space-y-1">
                  <span className="text-[#647C6F] font-medium">Input Tensor Shape</span>
                  <p className="font-semibold text-[#1C2C23]">{result.modelDetails.inputResolution}</p>
                </div>
              </div>

              {result.modelDetails.topKAlternatives && result.modelDetails.topKAlternatives.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-[#4F685B] uppercase tracking-wider mb-2">
                    Top Alternative Softmax Class Probabilities
                  </h4>
                  <div className="space-y-2">
                    {result.modelDetails.topKAlternatives.map((alt, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#F8FAF7] border border-[#DCE4DA] flex items-center justify-between text-xs"
                      >
                        <span className="text-[#2D4236] font-medium">{alt.label}</span>
                        <span className="font-mono text-[#667E71]">{alt.probability}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#F8FAF7] border-t border-[#DCE4DA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#63796D] text-center sm:text-left">
            <span>Result generated via deep learning inference. Always confirm critical findings with local agronomist extension services.</span>
          </div>

          <button
            type="button"
            id="analyze-another-leaf-bottom-btn"
            onClick={onScanAnother}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2D563F] hover:bg-[#234532] text-white font-semibold text-sm shadow-md shadow-[#1C3627]/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] border border-[#427357]"
          >
            <Sparkles className="w-4 h-4 text-[#B6E0C6]" />
            <span>Analyze Another Leaf Specimen</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
