import React from 'react';
import { DiseasePrediction } from '../types';
import { History, Sparkles, ChevronRight, Calendar, Sprout, Activity, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryPageProps {
  records: DiseasePrediction[];
  onSelectRecord: (record: DiseasePrediction) => void;
  onClearHistory: () => void;
  onGoToUpload: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  records,
  onSelectRecord,
  onClearHistory,
  onGoToUpload
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCE4DA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4EFE4] text-[#244E38] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#CDE1D0]">
            <History className="w-3.5 h-3.5" />
            <span>Specimen Diagnostic Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1D2B23] tracking-tight">
            Diagnostic Scan History
          </h1>
          <p className="text-[#596E62] text-xs sm:text-sm mt-1">
            Review leaf specimens evaluated during this research session.
          </p>
        </div>

        {records.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl text-xs font-medium text-[#9E362A] hover:bg-[#FBF0EE] border border-[#EAC4BD] transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#DCE4DA] shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF4EE] text-[#71897B] flex items-center justify-center mx-auto">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#1D2B23]">
            No Diagnostic Records Yet
          </h3>
          <p className="text-[#63796D] text-xs sm:text-sm max-w-md mx-auto">
            You haven't scanned any leaf specimens yet in this session. Upload a photo to run the CNN pathology pipeline.
          </p>
          <button
            type="button"
            onClick={onGoToUpload}
            className="px-5 py-2.5 rounded-xl bg-[#2D563F] hover:bg-[#234532] text-white font-semibold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 border border-[#427357]"
          >
            <Sparkles className="w-4 h-4 text-[#B6E0C6]" />
            <span>Start Leaf Scan</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              onClick={() => onSelectRecord(record)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCE4DA] hover:border-[#3D6E52] hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#EFF4EE] border border-[#D5E1D4] shrink-0">
                  <img
                    src={record.imageUrl}
                    alt={record.commonName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#E4EFE4] text-[#244E38] border border-[#CDE1D0]">
                      {record.pathogenType}
                    </span>
                    <span className="text-xs text-[#7B9284]">#{record.id}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1D2B23] group-hover:text-[#28573D] transition-colors">
                    {record.commonName}
                  </h3>
                  <p className="text-xs text-[#63796D] font-mono italic">
                    {record.plantSpecies}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0F4EE]">
                <div className="text-left sm:text-right">
                  <span className="block text-[11px] text-[#7B9284]">Confidence</span>
                  <span className="text-sm font-bold text-[#27533B]">
                    {record.confidenceScore.toFixed(1)}%
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F1F5F0] group-hover:bg-[#E4EFE4] text-[#6E8376] group-hover:text-[#25513A] flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
