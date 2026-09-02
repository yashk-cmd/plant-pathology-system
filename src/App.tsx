import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { UploadZone } from './components/UploadZone';
import { ResultCard } from './components/ResultCard';
import { UnrecognizedLeafCard } from './components/UnrecognizedLeafCard';
import { AboutPage } from './components/AboutPage';
import { HistoryPage } from './components/HistoryPage';
import { DiagnosticResult, DiseasePrediction } from './types';
import { predictDisease } from './services/diseaseModelService';
import { BrandLogo } from './components/BrandLogo';
import { Leaf, ShieldCheck, Sprout, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'upload' | 'about' | 'history' | 'login' | 'signup'>('upload');
  const [redirectReason, setRedirectReason] = useState<string | null>(null);

  // Diagnostic state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<DiagnosticResult | null>(null);
  const [scanHistory, setScanHistory] = useState<DiseasePrediction[]>([]);

  // Navigation guard
  const handleTabChange = (tab: 'upload' | 'about' | 'history' | 'login' | 'signup') => {
    if ((tab === 'upload' || tab === 'history') && !isAuthenticated) {
      setRedirectReason('Please log in or create an account to access the leaf disease detection tool.');
      setActiveTab('login');
      return;
    }
    setRedirectReason(null);
    setActiveTab(tab);
  };

  const handleAnalyzeLeaf = async (file: File) => {
    if (!isAuthenticated) {
      setRedirectReason('Please sign in before running model inference.');
      setActiveTab('login');
      return;
    }

    try {
      setIsAnalyzing(true);
      const diagnosticOutcome = await predictDisease(file);
      setCurrentResult(diagnosticOutcome);

      if (diagnosticOutcome.isRecognizedLeaf) {
        setScanHistory((prev) => [diagnosticOutcome.prediction, ...prev]);
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred during leaf analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScanAnother = () => {
    setCurrentResult(null);
    setActiveTab('upload');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#16251E] flex items-center justify-center text-[#F2F6F3]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#284737] border border-[#447259] flex items-center justify-center animate-pulse">
            <Leaf className="w-6 h-6 text-[#9EC4AE]" />
          </div>
          <span className="text-sm font-medium text-[#B8CBBF]">Initializing pathology runtime...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F2] text-[#212E27] flex flex-col font-sans selection:bg-[#D7E6D7] selection:text-[#172B1E]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        historyCount={scanHistory.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {/* LOGIN PAGE */}
          {activeTab === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <LoginPage
                redirectReason={redirectReason}
                onSwitchToSignup={() => {
                  setRedirectReason(null);
                  setActiveTab('signup');
                }}
                onSuccessRedirect={() => {
                  setRedirectReason(null);
                  setActiveTab('upload');
                }}
              />
            </motion.div>
          )}

          {/* SIGNUP PAGE */}
          {activeTab === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <SignupPage
                onSwitchToLogin={() => setActiveTab('login')}
                onSuccessRedirect={() => setActiveTab('upload')}
              />
            </motion.div>
          )}

          {/* ABOUT PAGE */}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <AboutPage
                onStartDiagnosing={() => {
                  if (isAuthenticated) {
                    setActiveTab('upload');
                  } else {
                    setRedirectReason('Please log in to test the leaf disease diagnostic engine.');
                    setActiveTab('login');
                  }
                }}
              />
            </motion.div>
          )}

          {/* HISTORY PAGE (PROTECTED) */}
          {activeTab === 'history' && isAuthenticated && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <HistoryPage
                records={scanHistory}
                onSelectRecord={(record) => {
                  setCurrentResult({
                    isRecognizedLeaf: true,
                    prediction: record
                  });
                  setActiveTab('upload');
                }}
                onClearHistory={() => setScanHistory([])}
                onGoToUpload={() => setActiveTab('upload')}
              />
            </motion.div>
          )}

          {/* UPLOAD & RESULTS VIEW (PROTECTED) */}
          {activeTab === 'upload' && isAuthenticated && (
            <motion.div
              key="upload-results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <AnimatePresence mode="wait">
                {currentResult ? (
                  currentResult.isRecognizedLeaf ? (
                    <motion.div
                      key="diagnosis-result"
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -10 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      <ResultCard
                        result={currentResult.prediction}
                        onScanAnother={handleScanAnother}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="rejection-result"
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -10 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      <UnrecognizedLeafCard
                        result={currentResult.rejection}
                        onScanAnother={handleScanAnother}
                        onLearnMore={() => setActiveTab('about')}
                      />
                    </motion.div>
                  )
                ) : (
                  <motion.div
                    key="upload-zone"
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <UploadZone
                      onAnalyze={handleAnalyzeLeaf}
                      isAnalyzing={isAnalyzing}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* FALLBACK IF USER NAVIGATES TO UPLOAD WHILE LOGGED OUT */}
          {activeTab === 'upload' && !isAuthenticated && (
            <motion.div
              key="upload-guest"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <LoginPage
                redirectReason="Authentication is required to access the leaf disease identification tool."
                onSwitchToSignup={() => setActiveTab('signup')}
                onSuccessRedirect={() => setActiveTab('upload')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#14221A] border-t border-[#25392D] text-[#8EA295] py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showBadge={false} />
            <span className="text-[#3B5445] hidden sm:inline">|</span>
            <span className="hidden sm:inline text-[#7A9382]">PlantVillage CNN Inference Engine</span>
          </div>

          <div className="flex items-center gap-4 text-[#A1B5A8]">
            <span>Accepted formats: <strong className="text-[#E7EFE9]">.JPG / .JPEG</strong></span>
            <span>•</span>
            <span>ResNet-50 Feature Maps</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
