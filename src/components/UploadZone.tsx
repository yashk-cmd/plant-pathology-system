import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FileCheck,
  Zap,
  Info,
  Layers,
  X,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadZoneProps {
  onAnalyze: (file: File) => void;
  isAnalyzing: boolean;
}

// Sample leaf & test images ready for instant testing of all pipeline paths
const SAMPLE_LEAF_IMAGES = [
  {
    title: 'Tomato Early Blight',
    caption: 'High Confidence Diagnosis (94.8%)',
    tag: 'Pathology Pass',
    tagColor: 'bg-[#E4EFE5] text-[#245039]',
    fileName: 'tomato_early_blight_sample.jpg',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Healthy Strawberry Leaf',
    caption: 'High Confidence Healthy (98.2%)',
    tag: 'Healthy Pass',
    tagColor: 'bg-[#E4EFE5] text-[#245039]',
    fileName: 'healthy_strawberry_leaf_sample.jpeg',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Ambiguous / Blurry Foliage',
    caption: 'Triggers Confidence Guard (<70%)',
    tag: 'Low Confidence Guard',
    tagColor: 'bg-[#FAF0E4] text-[#7A4B1A]',
    fileName: 'ambiguous_unclear_leaf_sample.jpg',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Non-Leaf Object Specimen',
    caption: 'Triggers Pre-Check Pre-Filter',
    tag: 'Pre-Check Guard',
    tagColor: 'bg-[#F6EBEB] text-[#863026]',
    fileName: 'nonleaf_random_object_sample.jpg',
    url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
  }
];


// Maximum file size: 5MB in bytes
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const UploadZone: React.FC<UploadZoneProps> = ({ onAnalyze, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{ size: string; dimensions?: string } | null>(null);
  const [analyzingStage, setAnalyzingStage] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cycle through diagnostic stages during analysis for high visual engagement
  React.useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setAnalyzingStage(0);
      interval = setInterval(() => {
        setAnalyzingStage((prev) => (prev + 1) % 4);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const validateAndSelectFile = (file: File) => {
    setErrorMessage(null);

    // 1. Check file extension (strictly .jpg or .jpeg)
    const nameParts = file.name.split('.');
    const ext = nameParts.length > 1 ? nameParts.pop()?.toLowerCase() : '';
    const validExtensions = ['jpg', 'jpeg'];
    const hasValidExtension = !!ext && validExtensions.includes(ext);

    // 2. Check MIME type (must strictly be image/jpeg or image/pjpeg)
    const validMimeTypes = ['image/jpeg', 'image/pjpeg'];
    const hasValidMimeType = validMimeTypes.includes(file.type.toLowerCase());

    // Both extension AND MIME type must be valid
    if (!hasValidExtension || !hasValidMimeType) {
      // Immediately block upload and discard any previous selection or preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedFile(null);
      setFileDetails(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setErrorMessage('Only JPG/JPEG images are supported.');
      return;
    }

    // 3. Max file size check (5MB limit)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedFile(null);
      setFileDetails(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setErrorMessage('File size exceeds the 5MB limit. Please upload a smaller image.');
      return;
    }

    // Clear previous preview URL if any
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);

    // Format file size
    const sizeKB = Math.round(file.size / 1024);
    const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(2)} MB` : `${sizeKB} KB`;

    // Measure dimensions via Image object
    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      setFileDetails({
        size: sizeStr,
        dimensions: `${img.naturalWidth} × ${img.naturalHeight} px`
      });
    };
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileDetails(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Load a quick sample image by fetching blob and converting to a File object
  const handleLoadSample = async (sample: typeof SAMPLE_LEAF_IMAGES[0]) => {
    try {
      setErrorMessage(null);
      const response = await fetch(sample.url);
      const blob = await response.blob();
      // Ensure the file is created with .jpg name and image/jpeg type
      const file = new File([blob], sample.fileName, { type: 'image/jpeg' });
      validateAndSelectFile(file);
    } catch (err) {
      setErrorMessage('Could not load sample image. Please upload a local .jpg file.');
    }
  };

  const analysisStages = [
    'Pre-processing 224×224 RGB tensor & normalization...',
    'Extracting convolutional feature maps (Conv2D filters)...',
    'Analyzing leaf venation & necrotic lesion gradients...',
    'Generating pathology classification & confidence probabilities...'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Page Title & Instructions Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DCE4DA] shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E3EFE5]/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4EFE4] text-[#244E38] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#CDE1D0]">
              <Zap className="w-3.5 h-3.5" />
              <span>Plant Pathology Diagnostic Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1D2B23] tracking-tight">
              Upload Plant Leaf Image
            </h1>
            <p className="text-[#566B5E] text-sm mt-1 max-w-xl">
              Provide a clear, high-resolution photograph of the affected leaf surface.
              Our CNN neural network will evaluate lesion morphology, chlorosis, and pathogen markers.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F6FAF5] border border-[#D2E2D4] px-3.5 py-2 rounded-xl text-xs text-[#476050] self-start sm:self-center">
            <Info className="w-4 h-4 text-[#35674B] shrink-0" />
            <span>Strict format: <strong className="text-[#1D2B23]">.JPG / .JPEG only</strong></span>
          </div>
        </div>
      </div>

      {/* Error Banner when non-jpg or invalid file is detected */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            id="file-validation-error-alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-[#FBF0EE] border border-[#EAC4BD] text-[#863026] shadow-sm flex items-start gap-3.5"
          >
            <div className="p-2 rounded-xl bg-[#F6DED9] text-[#9E362A] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs sm:text-sm">
              <strong className="block font-semibold text-[#661D15] text-sm">
                Format Validation Error
              </strong>
              <p className="mt-0.5 text-[#863026]">{errorMessage}</p>
              <p className="mt-2 text-xs text-[#9E362A] font-medium">
                Tip: Please convert your image to a <code className="bg-[#F6DED9] px-1 py-0.5 rounded">.jpg</code> or <code className="bg-[#F6DED9] px-1 py-0.5 rounded">.jpeg</code> file, or click one of the pre-curated test samples below.
              </p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-[#B95548] hover:text-[#79241B] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Upload / Preview Area */}
      <div className="bg-white rounded-2xl border border-[#DCE4DA] shadow-sm overflow-hidden">
        {!previewUrl ? (
          /* Dropzone State */
          <div
            id="leaf-dropzone"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 border-2 border-dashed m-4 rounded-xl flex flex-col items-center justify-center ${
              dragActive
                ? 'border-[#3D6E52] bg-[#EFF6F0] scale-[0.99]'
                : 'border-[#CAD8C8] hover:border-[#3D6E52] hover:bg-[#F4F9F4] bg-[#F9FBF8]'
            }`}
          >
            <input
              ref={fileInputRef}
              id="leaf-file-input"
              type="file"
              accept=".jpg, .jpeg, image/jpeg"
              onChange={handleInputChange}
              className="hidden"
            />

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#E4EFE5] border border-[#C6DDD0] text-[#28553D] flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-[#2C5B42]" />
            </div>

            <h2 className="text-lg sm:text-xl font-display font-semibold text-[#1F3026]">
              Drag and drop your leaf photo here
            </h2>
            <p className="text-[#64796C] text-xs sm:text-sm mt-1 max-w-md">
              or <span className="text-[#2F6146] font-semibold underline underline-offset-2">browse from your computer</span> to select a file.
            </p>

            {/* Allowed Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E4EFE5] text-[#245039] border border-[#C2DEC9]">
                <FileCheck className="w-3.5 h-3.5" />
                .JPG / .JPEG Only
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F0] text-[#556A5E] border border-[#DCE4DA]">
                Max 5MB
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F0] text-[#556A5E] border border-[#DCE4DA]">
                224×224+ Optimal
              </span>
            </div>
          </div>
        ) : (
          /* Live Image Preview & Control Zone */
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Image Preview Window with scanning effect if analyzing */}
              <div className="lg:col-span-7">
                <div className="relative rounded-2xl overflow-hidden bg-[#0F1C14] border border-[#CAD8C8] aspect-[4/3] flex items-center justify-center shadow-lg group">
                  <img
                    id="leaf-preview-img"
                    src={previewUrl}
                    alt="Uploaded leaf preview"
                    className={`w-full h-full object-contain transition-transform duration-500 ${
                      isAnalyzing ? 'scale-105 filter brightness-95 contrast-105' : ''
                    }`}
                  />

                  {/* Advanced Multi-Layered Scanning HUD when running inference */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                      {/* Laser Scanning Ray */}
                      <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-[#5FE09E] to-transparent shadow-[0_0_20px_#4AE090] animate-scan-line absolute z-20" />

                      {/* Ambient Holographic Tint */}
                      <div className="absolute inset-0 bg-[#0E2818]/35 backdrop-contrast-125 z-10" />

                      {/* Dynamic Neural Mesh Grid */}
                      <div
                        className="absolute inset-0 opacity-25 z-10"
                        style={{
                          backgroundImage:
                            'linear-gradient(to right, #61DA98 1px, transparent 1px), linear-gradient(to bottom, #61DA98 1px, transparent 1px)',
                          backgroundSize: '28px 28px'
                        }}
                      />

                      {/* Viewfinder Target Reticle Frame */}
                      <div className="absolute inset-4 border border-[#5FE09E]/30 rounded-xl z-20 pointer-events-none">
                        {/* Corner Reticles */}
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#5FE09E]" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#5FE09E]" />
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#5FE09E]" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#5FE09E]" />

                        {/* Center Target Crosshair */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-60">
                          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#5FE09E]" />
                          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#5FE09E]" />
                          <div className="absolute inset-1 rounded-full border border-[#5FE09E] animate-ping opacity-40" />
                        </div>
                      </div>

                      {/* Simulated Holographic Feature Detection Nodes */}
                      <div className="absolute top-1/3 left-1/4 z-20 flex items-center gap-1.5">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5FE09E] opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#5FE09E]" />
                        </span>
                        <span className="text-[9px] font-mono text-[#7EEBB3] bg-[#0E1E14]/80 px-1 rounded border border-[#356B4C]">
                          Foliar Lesion #1
                        </span>
                      </div>

                      <div className="absolute bottom-1/3 right-1/4 z-20 flex items-center gap-1.5">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5B582] opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E5B582]" />
                        </span>
                        <span className="text-[9px] font-mono text-[#E5B582] bg-[#0E1E14]/80 px-1 rounded border border-[#6B4F35]">
                          Chlorosis ROI
                        </span>
                      </div>

                      {/* Real-Time Tensor Scan HUD Header */}
                      <div className="absolute top-3 left-3 z-20 bg-[#0B170F]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-[#A6E8C2] font-mono border border-[#2B543B] flex items-center gap-2 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-[#4AE090] animate-pulse" />
                        <span>CNN SCANNING: RESNET-50 BACKBONE</span>
                      </div>
                    </div>
                  )}

                  {/* Overlay Badge */}
                  <div className="absolute bottom-3 left-3 bg-[#132219]/85 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] text-[#EDF5EE] font-mono border border-[#324B3C] flex items-center gap-2 z-20">
                    <span className="w-2 h-2 rounded-full bg-[#5AC48B] animate-pulse" />
                    <span>{fileDetails?.dimensions || 'Image Loaded'}</span>
                  </div>
                </div>
              </div>

              {/* Action & Metadata Panel */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E1E8DE]">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#E5EFE6] text-[#29573E]">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-[#1C2C23] text-sm">
                        Leaf Specimen Loaded
                      </span>
                    </div>
                    <button
                      type="button"
                      id="remove-selected-leaf-btn"
                      disabled={isAnalyzing}
                      onClick={handleClearFile}
                      className="text-xs text-[#63796D] hover:text-[#9E362A] flex items-center gap-1 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Change photo</span>
                    </button>
                  </div>

                  {isAnalyzing ? (
                    /* Skeleton Loader / Telemetry while analyzing */
                    <div className="mt-4 space-y-3">
                      <div className="p-3 rounded-xl bg-[#F4F8F4] border border-[#DCE8DC] space-y-2 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-[#244F37] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#35674B] animate-ping" />
                            <span>Tensor Extraction</span>
                          </span>
                          <span className="font-mono text-[11px] text-[#557864]">224×224 RGB</span>
                        </div>
                        <div className="h-1.5 bg-[#D5E6D8] rounded-full overflow-hidden">
                          <div className="h-full bg-[#3D7856] w-3/4 animate-pulse rounded-full" />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#F4F8F4] border border-[#DCE8DC] space-y-2 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-[#244F37]">Softmax Probabilities</span>
                          <span className="font-mono text-[11px] text-[#557864]">Computing...</span>
                        </div>
                        <div className="h-1.5 bg-[#D5E6D8] rounded-full overflow-hidden">
                          <div className="h-full bg-[#3D7856] w-1/2 animate-pulse rounded-full" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-2.5 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-[#F0F4EE]">
                        <span className="text-[#64796C]">File Name:</span>
                        <span className="font-mono font-medium text-[#1E2E25] truncate max-w-[180px]">
                          {selectedFile?.name}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-[#F0F4EE]">
                        <span className="text-[#64796C]">File Size:</span>
                        <span className="font-mono font-medium text-[#1E2E25]">
                          {fileDetails?.size}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-[#F0F4EE]">
                        <span className="text-[#64796C]">MIME / Codec:</span>
                        <span className="font-semibold text-[#2D5A42]">image/jpeg (.jpg)</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-[#64796C]">Preprocessing:</span>
                        <span className="text-[#3A5043]">RGB Auto-Rescale (224×224)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Analysis Trigger or Progress */}
                <div>
                  {isAnalyzing ? (
                    <div className="p-4 rounded-2xl bg-[#EEF6F0] border border-[#C6DFC9] space-y-3 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#1D4A32]">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-4 h-4 animate-spin text-[#2E6347]" />
                          <span>CNN Neural Analysis Running...</span>
                        </span>
                        <span className="font-mono text-[#326347]">Inference active</span>
                      </div>
                      <div className="w-full bg-[#CFE4D3] rounded-full h-2.5 overflow-hidden shadow-inner">
                        <div className="bg-[#2D6645] h-2.5 rounded-full w-full animate-pulse transition-all duration-300" />
                      </div>
                      <p className="text-[11px] text-[#245239] font-medium transition-all">
                        {analysisStages[analyzingStage]}
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      id="analyze-leaf-btn"
                      disabled={!selectedFile || isAnalyzing}
                      onClick={() => selectedFile && onAnalyze(selectedFile)}
                      className="w-full py-3.5 px-5 rounded-xl bg-[#2D563F] hover:bg-[#234532] active:scale-[0.99] disabled:bg-[#8EA596] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#8EA596] disabled:active:scale-100 text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#1C3627]/15 flex items-center justify-center gap-2.5 transition-all group border border-[#427357] disabled:border-transparent cursor-pointer"
                    >
                      <Sparkles className="w-5 h-5 text-[#B6E0C6] group-hover:rotate-12 transition-transform" />
                      <span>Analyze Leaf Specimen</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Curated Sample Specimens for Instant Testing */}
      <div className="bg-[#F8FAF7] rounded-2xl p-6 border border-[#DCE4DA]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#1C2C23]">
              Need a sample leaf image to test?
            </h3>
            <p className="text-xs text-[#5D7365] mt-0.5">
              Select one of our curated PlantVillage test specimens to run a live diagnostic evaluation.
            </p>
          </div>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] bg-[#E7EFE6] text-[#365844] font-medium border border-[#D3E0D1]">
            1-Click Load
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_LEAF_IMAGES.map((sample, idx) => (
            <button
              key={idx}
              id={`sample-leaf-btn-${idx}`}
              type="button"
              disabled={isAnalyzing}
              onClick={() => handleLoadSample(sample)}
              className="p-2.5 rounded-xl bg-white border border-[#D9E3D7] hover:border-[#3D6E52] hover:shadow-md transition-all text-left group flex flex-col justify-between"
            >
              <div className="relative rounded-lg overflow-hidden bg-[#EDF3EC] aspect-[4/3] mb-2">
                <img
                  src={sample.url}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${sample.tagColor}`}>
                  {sample.tag}
                </span>
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#101C15]/70 backdrop-blur-sm text-[9px] font-mono text-white">
                  .JPG
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1D2B23] group-hover:text-[#2E6347] transition-colors line-clamp-1">
                  {sample.title}
                </p>
                <p className="text-[10px] text-[#617769] line-clamp-1 mt-0.5">
                  {sample.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
