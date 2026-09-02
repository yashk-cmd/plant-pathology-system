export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export type PathogenType =
  | 'Fungal'
  | 'Bacterial'
  | 'Viral'
  | 'Pest / Insect'
  | 'Nutritional / Abiotic'
  | 'Healthy';

export type DiseaseSeverity = 'Healthy' | 'Low' | 'Moderate' | 'High' | 'Severe';

export interface TreatmentPlan {
  organic: string[];
  chemical: string[];
  culturalManagement: string[];
}

export interface DiseasePrediction {
  id: string;
  diseaseName: string;
  commonName: string;
  plantSpecies: string;
  pathogenType: PathogenType;
  confidenceScore: number; // 0 to 100
  severity: DiseaseSeverity;
  description: string;
  symptoms: string[];
  recommendedTreatments: TreatmentPlan;
  preventionTips: string[];
  imageUrl: string;
  analyzedAt: string;
  modelDetails: {
    architecture: string;
    inputResolution: string;
    inferenceTimeMs: number;
    topKAlternatives?: { label: string; probability: number }[];
  };
}

export type RejectionReason = 'failed_precheck' | 'low_confidence';

export interface UnrecognizedLeafResult {
  id: string;
  reason: RejectionReason;
  headline: string;
  message: string;
  confidenceScore?: number; // e.g. 54.2% if evaluated by model but fell below threshold
  thresholdApplied: number; // e.g. 70.0%
  imageUrl: string;
  analyzedAt: string;
  precheckDetails?: {
    method: string;
    description: string;
    passed: boolean;
  };
  modelDetails?: {
    architecture: string;
    inferenceTimeMs: number;
    rawTopPrediction?: {
      label: string;
      confidence: number;
    };
  };
}

export type DiagnosticResult =
  | {
      isRecognizedLeaf: true;
      prediction: DiseasePrediction;
    }
  | {
      isRecognizedLeaf: false;
      rejection: UnrecognizedLeafResult;
    };

export interface ScanRecord extends DiseasePrediction {
  fileName: string;
  fileSizeBytes: number;
}

