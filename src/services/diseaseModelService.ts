import {
  DiseasePrediction,
  PathogenType,
  DiseaseSeverity,
  DiagnosticResult,
  UnrecognizedLeafResult
} from '../types';

/**
 * ============================================================================
 * MODEL BACKEND CONFIGURATION
 * ============================================================================
 * Toggle `USE_MOCK` to switch between:
 *  - `true`: Simulated PlantVillage ResNet50 model with realistic botanical
 *            pre-checks, confidence guards, and agronomic treatment plans.
 *  - `false`: Live external REST API model backend.
 *
 * To connect your live model server (FastAPI, Flask, PyTorch TorchServe,
 * TensorFlow Serving, Express, Django, etc.):
 *  1. Flip `USE_MOCK = false` below.
 *  2. Update `MODEL_API_ENDPOINT` with your server URL.
 *  3. The endpoint should accept a multipart/form-data POST with the image file,
 *     and return a JSON object (e.g. `{ disease, confidence, description }`).
 * ============================================================================
 */
export const USE_MOCK: boolean = false;

/**
 * Configurable REST API endpoint URL for your model server.
 * Can be overridden at runtime using VITE_MODEL_API_URL environment variable.
 */
export const MODEL_API_ENDPOINT: string =
  (typeof import.meta !== 'undefined' && (import.meta as Record<string, any>).env?.VITE_MODEL_API_URL) ||
  '/api/predict';

/**
 * Minimum confidence required from the disease classification model.
 * If the top softmax prediction probability is below this threshold,
 * the system withholds diagnosis to prevent hallucinating on non-leaf or
 * ambiguous images. Kept in sync with the backend's own CONFIDENCE_THRESHOLD
 * (currently 90.0 in app.py) as a secondary safeguard — the primary
 * safeguard is the explicit `result: "rejected"` check in
 * callExternalModelApi() below, since the backend already enforces this
 * threshold itself.
 */
export const MIN_CONFIDENCE_THRESHOLD = 90.0;

/**
 * Generic shape expected from an external disease prediction API endpoint.
 * Agnostic to backend frameworks (FastAPI, Flask, TorchServe, TF Serving, etc.)
 */
export interface ExternalModelApiResponse {
  result?: string; // "success" | "rejected" — set by our Flask backend

  disease?: string;
  prediction?: string;
  label?: string;
  class?: string;
  diseaseName?: string;
  commonName?: string;

  confidence?: number;
  confidenceScore?: number;
  score?: number;
  probability?: number;

  message?: string; // rejection message from the backend

  description?: string;
  plantSpecies?: string;
  pathogenType?: PathogenType;
  severity?: DiseaseSeverity;
  symptoms?: string[];
  recommendedTreatments?: {
    organic?: string[];
    chemical?: string[];
    culturalManagement?: string[];
  };
  preventionTips?: string[];
  modelDetails?: {
    architecture?: string;
    inferenceTimeMs?: number;
    topKAlternatives?: { label: string; probability: number }[];
  };
}

/**
 * Plant pathology knowledge database mimicking classifications from datasets like PlantVillage.
 */
interface DiseaseKnowledge {
  diseaseName: string;
  commonName: string;
  plantSpecies: string;
  pathogenType: PathogenType;
  severity: DiseaseSeverity;
  description: string;
  symptoms: string[];
  organicTreatments: string[];
  chemicalTreatments: string[];
  culturalManagement: string[];
  preventionTips: string[];
}

const PLANT_PATHOLOGY_DATABASE: DiseaseKnowledge[] = [
  {
    diseaseName: 'Solanum lycopersicum — Alternaria solani',
    commonName: 'Tomato Early Blight',
    plantSpecies: 'Tomato (Solanum lycopersicum)',
    pathogenType: 'Fungal',
    severity: 'High',
    description:
      'Early blight is a prevalent fungal disease caused by Alternaria solani. It manifests primarily on older foliage as circular brown to black spots with characteristic concentric rings, often resembling a bullseye pattern surrounded by a chlorotic yellow halo.',
    symptoms: [
      'Concentric target-like dark brown necrotic spots on lower leaves',
      'Chlorotic yellowing around leaf lesions leading to premature defoliation',
      'Sunken brown lesions with concentric rings on stems and petioles',
      'Dark leathery decay at the stem-end of tomato fruit'
    ],
    organicTreatments: [
      'Apply copper octanoate (copper soap) or bio-fungicide containing Bacillus subtilis',
      'Spray certified organic neem oil emulsified with mild potassium soap',
      'Dust with sulfur-based organic foliar powder during dry morning intervals'
    ],
    chemicalTreatments: [
      'Apply protectant chlorothalonil or mancozeb at initial appearance of foliar lesions',
      'Rotate with systemic strobilurins (e.g., azoxystrobin) or difenoconazole to mitigate resistance',
      'Spray boscalid formulation at standard agronomic label rates'
    ],
    culturalManagement: [
      'Prune bottom 12 inches of foliage to eliminate soil-splash pathogen transmission',
      'Apply 2-3 inches of organic straw mulch around plant root zones',
      'Utilize drip irrigation rather than overhead sprinklers to minimize leaf wetness duration'
    ],
    preventionTips: [
      'Implement a minimum 3-year crop rotation with non-solanaceous crops',
      'Ensure 24-30 inch spacing between plants to maximize canopy airflow and sun penetration',
      'Sterilize pruning shears with 70% isopropyl alcohol between individual plants'
    ]
  },
  {
    diseaseName: 'Solanum tuberosum — Phytophthora infestans',
    commonName: 'Potato Late Blight',
    plantSpecies: 'Potato (Solanum tuberosum)',
    pathogenType: 'Fungal',
    severity: 'Severe',
    description:
      'Late blight is a devastating oomycete pathogen capable of destroying entire crops within days under humid, cool conditions. Lesions appear water-soaked before turning dark brown to purplish-black with white sporulation on the underside.',
    symptoms: [
      'Irregular water-soaked pale green lesions on leaf margins and tips',
      'Rapid enlargement into dark brown to purplish-black necrotic patches',
      'Delicate white fungal down/mildew on the leaf underside in moist conditions',
      'Foul-smelling vine collapse and rapid tuber rot'
    ],
    organicTreatments: [
      'Apply Bordeaux mixture (copper sulfate and hydrated lime) before disease onset',
      'Foliar spray of Reynoutria sachalinensis (giant knotweed) plant extract',
      'Immediate rogueing (uprooting and deep burial) of infected symptomatic plants'
    ],
    chemicalTreatments: [
      'Apply cymoxanil + mancozeb or propamocarb hydrochloride for penetrant action',
      'Utilize systemic mandipropamid or fluopicolide during peak spore pressure periods',
      'Apply metalaxyl-M (mefenoxam) if local strain sensitivity is verified'
    ],
    culturalManagement: [
      'Destroy all cull piles and volunteer potato sprouts before the growing season',
      'Hill soil deeply around stems to prevent zoospore washdown into developing tubers',
      'Schedule fungicide applications using BlightCast/weather forecasting decision models'
    ],
    preventionTips: [
      'Plant only certified disease-free seed tubers from verified suppliers',
      'Choose resistant or tolerant cultivars (e.g., Defender, Elba, Mountain Gem)',
      'Never compost late blight infected tissue; bag and incinerate or bury'
    ]
  },
  {
    diseaseName: 'Capsicum annuum — Xanthomonas campestris pv. vesicatoria',
    commonName: 'Bell Pepper Bacterial Leaf Spot',
    plantSpecies: 'Bell Pepper (Capsicum annuum)',
    pathogenType: 'Bacterial',
    severity: 'Moderate',
    description:
      'Bacterial leaf spot is caused by Xanthomonas campestris. It creates small, water-soaked, blister-like lesions that darken and become angular as they are restricted by leaf veins, resulting in severe leaf drop and sunscald of exposed fruit.',
    symptoms: [
      'Small, circular to angular water-soaked lesions on leaf undersides',
      'Lesions develop raised brown scab-like centers with yellow margins',
      'Extensive premature foliage loss leaving developing peppers exposed to sunscald',
      'Rough, wart-like raised brown spots on green pepper fruit skin'
    ],
    organicTreatments: [
      'Apply fixed copper hydroxide combined with potassium bicarbonate',
      'Apply Bacillus amyloliquefaciens microbial bactericide spray at 7-day intervals',
      'Use plant defense activators such as harpin alpha-beta proteins'
    ],
    chemicalTreatments: [
      'Apply copper bactericides combined with ethylene bisdithiocarbamate (EBDC)',
      'Utilize acibenzolar-S-methyl (systemic acquired resistance inducer)',
      'Apply agricultural streptomycin formulations where registered and approved'
    ],
    culturalManagement: [
      'Avoid field operations and harvesting when plant foliage is wet with dew or rain',
      'Employ clean drip irrigation lines to eliminate splash dispersal of bacteria',
      'Thoroughly incorporate crop residues into soil immediately following harvest'
    ],
    preventionTips: [
      'Use hot-water treated or hydrochloric acid treated certified seed lots',
      'Select multi-race resistant hybrid bell pepper cultivars (Races 1-10)',
      'Disinfect seedling trays and greenhouse benches with 10% sodium hypochlorite solution'
    ]
  },
  {
    diseaseName: 'Malus domestica — Botryosphaeria obtusa',
    commonName: 'Apple Black Rot / Frogeye Leaf Spot',
    plantSpecies: 'Apple (Malus domestica)',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    description:
      'Black rot is caused by the fungus Botryosphaeria obtusa. On leaves, it produces "frogeye" spots with purple borders and tan centers. It also induces fruit rot and cankers on branches and tree limbs.',
    symptoms: [
      'Small purple spots on leaves expanding into circular spots with light tan centers ("frogeye")',
      'Black pycnidia (fruiting bodies) visible within older center lesions',
      'Firm brown rotting zones on fruit developing concentric alternating dark bands',
      'Sunken elliptical cankers on twigs, branches, and tree trunks'
    ],
    organicTreatments: [
      'Spray lime sulfur or liquid copper fungicide during dormant and delayed-dormant stages',
      'Apply bio-fungicides containing Bacillus subtilis during petal fall',
      'Use certified organic kaolin clay foliar barrier protectant'
    ],
    chemicalTreatments: [
      'Apply captan or thiophanate-methyl from tight cluster through cover sprays',
      'Incorporate strobilurin fungicides (trifloxystrobin, kresoxim-methyl)',
      'Apply fludioxonil or pyraclostrobin formulations at early petal drop'
    ],
    culturalManagement: [
      'Prune out dead wood, fire blight cankers, and mummified fruit during winter dormancy',
      'Burn or chip prunings away from orchard perimeters',
      'Maintain tree vigor with balanced nitrogen-potassium soil nutrition'
    ],
    preventionTips: [
      'Rake and shred fallen apple leaves to accelerate biological decomposition of inoculum',
      'Avoid mechanical damage to bark and trunks during mowing or harvesting',
      'Ensure open canopy pruning structure for rapid drying after morning dew'
    ]
  },
  {
    diseaseName: 'Zea mays — Puccinia sorghi',
    commonName: 'Corn Common Rust',
    plantSpecies: 'Maize / Corn (Zea mays)',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    description:
      'Common rust is caused by Puccinia sorghi. It is characterized by powdery, golden-brown to cinnamon-brown pustules scattered across both the upper and lower leaf surfaces, reducing photosynthetic leaf area.',
    symptoms: [
      'Oval to elongate cinnamon-brown pustules (uredinia) on upper and lower leaf surfaces',
      'Pustules rupture the leaf epidermis revealing powdery reddish-brown spores',
      'Surrounding leaf tissue becomes chlorotic, then necrotic in severe cases',
      'Late season pustules turn dark brownish-black as winter teliospores form'
    ],
    organicTreatments: [
      'Foliar spray of organic potassium silicate to strengthen plant cell wall resistance',
      'Apply horticultural neem oil spray during early vegetative stages',
      'Dust with wettable agricultural elemental sulfur at first pustule detection'
    ],
    chemicalTreatments: [
      'Apply triazole fungicides (propiconazole, tetraconazole) if threshold is exceeded prior to silking',
      'Use premix formulations of azoxystrobin + propiconazole or pyraclostrobin + fluxapyroxad',
      'Fungicide application recommended only if susceptible hybrid and high rust pressure'
    ],
    culturalManagement: [
      'Monitor fields weekly from V6 through VT growth stages',
      'Maintain balanced soil fertility, avoiding excessive early nitrogen fertilizer',
      'Ensure clean cultivation and destroy alternate weed hosts'
    ],
    preventionTips: [
      'Plant corn hybrids possessing Rp-gene resistant traits for common rust',
      'Stagger planting dates if possible to avoid peak airborne spore migration windows',
      'Track regional atmospheric spore trap reports and southern wind currents'
    ]
  },
  {
    diseaseName: 'Vitis vinifera — Uncinula necator (Erysiphe necator)',
    commonName: 'Grape Powdery Mildew',
    plantSpecies: 'Grapevine (Vitis vinifera)',
    pathogenType: 'Fungal',
    severity: 'High',
    description:
      'Grape powdery mildew is an obligate biotrophic fungus that attacks all green vine tissues. It produces a distinctive powdery white-to-gray coating on leaves, young shoots, and developing berry clusters.',
    symptoms: [
      'Chalky, powdery white-gray fungal patches on upper leaf surfaces',
      'Leaf curling, crinkling, and upward cupping of young expanding leaves',
      'Web-like russeting and webbed scarring on green grape shoots',
      'Stunted berry development, berry splitting, and secondary bunch rot infections'
    ],
    organicTreatments: [
      'Apply wettable micronized sulfur at 7-10 day intervals from 2-inch shoot growth',
      'Foliar spray with 0.5% potassium bicarbonate + horticultural mineral oil',
      'Use bio-fungicide containing Ampelomyces quisqualis (hyperparasite of powdery mildew)'
    ],
    chemicalTreatments: [
      'Apply quinoxyfen, tebuconazole, or metrafenone according to resistance rotation schedules',
      'Incorporate SDHI group fungicides (e.g., fluopyram, boscalid)',
      'Apply trifloxystrobin or kresoxim-methyl during pre-bloom to pea-sized berry stages'
    ],
    culturalManagement: [
      'Leaf-pulling in the fruit zone to promote sunlight and wind penetration',
      'Canopy management including shoot thinning and hedging for optimal exposure',
      'Avoid high-vigor inducing irrigation during canopy closure'
    ],
    preventionTips: [
      'Begin preventative spray program early at 1-3 inch shoot extension',
      'Calibrate tractor speed and spray pressure for full 360-degree cluster coverage',
      'Consider planting resistant interspecific hybrid grape varieties'
    ]
  },
  {
    diseaseName: 'Fragaria × ananassa — Healthy Foliage',
    commonName: 'Healthy Strawberry Plant (No Pathology Detected)',
    plantSpecies: 'Strawberry (Fragaria × ananassa)',
    pathogenType: 'Healthy',
    severity: 'Healthy',
    description:
      'The leaf exhibits optimal physiological health with vibrant dark green pigmentation, intact epidermal cellular structure, clear venation without necrotic lesions, and absence of chlorosis or fungal mycelium.',
    symptoms: [
      'Uniform deep green chlorophyll distribution across all three leaflets',
      'Smooth, intact leaf serrations without necrosis or discoloration',
      'Clean epidermal surface free of sporulation, pustules, or insect frass',
      'Turgid petiole structure and vigorous cell membrane integrity'
    ],
    organicTreatments: [
      'No fungicide treatment required',
      'Maintain regular foliar compost tea or seaweed kelp extract applications for vigor',
      'Continue beneficial mycorrhizal root inoculations'
    ],
    chemicalTreatments: [
      'No chemical interventions necessary',
      'Maintain standard baseline scouting schedule (weekly visual inspections)'
    ],
    culturalManagement: [
      'Keep clean pine needle or plastic mulch beneath plants to protect fruit and leaves',
      'Provide 1.0 - 1.5 inches of water weekly through drip lines',
      'Ensure soil pH remains in the optimal 5.8 - 6.5 range'
    ],
    preventionTips: [
      'Continue regular routine scouting for early pest or pathogen indicators',
      'Remove old senescing runner leaves during autumn clean-up',
      'Sanitize harvesting containers and tools regularly'
    ]
  }
];

/**
 * ============================================================================
 * PLACEHOLDER: Leaf vs. Non-Leaf Pre-Check (Leaf Classifier)
 * ============================================================================
 * NOTE: This client-side heuristic only runs in MOCK mode. When USE_MOCK is
 * false, the real guardrail lives server-side in the Flask backend
 * (is_likely_leaf_image + CONFIDENCE_THRESHOLD in app.py), since that's
 * where the real model lives.
 * ============================================================================
 */
export async function isLikelyLeafImage(imageFile: File): Promise<{
  isLeaf: boolean;
  reason?: string;
  botanicalRatio?: number;
}> {
  const lowerName = imageFile.name.toLowerCase();

  if (
    lowerName.includes('nonleaf') ||
    lowerName.includes('non-leaf') ||
    lowerName.includes('car') ||
    lowerName.includes('dog') ||
    lowerName.includes('cat') ||
    lowerName.includes('person') ||
    lowerName.includes('face') ||
    lowerName.includes('building') ||
    lowerName.includes('furniture') ||
    lowerName.includes('screenshot') ||
    lowerName.includes('receipt') ||
    lowerName.includes('random-object')
  ) {
    return {
      isLeaf: false,
      reason: 'Non-leaf subject detected by pre-check keyword filter (temporary test trigger)',
      botanicalRatio: 0.02
    };
  }

  if (
    lowerName.includes('leaf') ||
    lowerName.includes('tomato') ||
    lowerName.includes('potato') ||
    lowerName.includes('pepper') ||
    lowerName.includes('apple') ||
    lowerName.includes('corn') ||
    lowerName.includes('grape') ||
    lowerName.includes('strawberry') ||
    lowerName.includes('plant') ||
    lowerName.includes('foliage') ||
    lowerName.includes('specimen')
  ) {
    return {
      isLeaf: true,
      reason: 'Botanical foliage indicators verified',
      botanicalRatio: 0.85
    };
  }

  try {
    const objectUrl = URL.createObjectURL(imageFile);
    const img = new Image();
    img.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image decode failed'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      return { isLeaf: true, reason: 'Canvas 2D context unavailable, passing to model' };
    }

    ctx.drawImage(img, 0, 0, 32, 32);
    const imgData = ctx.getImageData(0, 0, 32, 32);
    URL.revokeObjectURL(objectUrl);

    let botanicalPixels = 0;
    let nonPlantPixels = 0;
    const totalPixels = 32 * 32;

    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];

      const isGreen = g > 45 && g > r * 0.92 && g > b * 1.05;
      const isYellowChlorotic = r > 85 && g > 75 && b < 110 && Math.abs(r - g) < 65;
      const isBrownLesion = r > 50 && r < 170 && g > 35 && g < 135 && b < 90 && r > b && g > b;

      if (isGreen || isYellowChlorotic || isBrownLesion) {
        botanicalPixels++;
      } else if (b > r + 35 && b > g + 25) {
        nonPlantPixels++;
      }
    }

    const botanicalRatio = botanicalPixels / totalPixels;
    const blueDominanceRatio = nonPlantPixels / totalPixels;

    if (botanicalRatio < 0.12 || blueDominanceRatio > 0.65) {
      return {
        isLeaf: false,
        reason: `Insufficient botanical foliage pigments detected (botanical pixel ratio: ${(botanicalRatio * 100).toFixed(1)}%)`,
        botanicalRatio
      };
    }

    return {
      isLeaf: true,
      reason: `Botanical pigmentation detected (${(botanicalRatio * 100).toFixed(1)}% of frame)`,
      botanicalRatio
    };
  } catch {
    return { isLeaf: true, reason: 'Heuristic skipped due to image processing fallback' };
  }
}

/**
 * Helper to look up pathology knowledge by name or generate an agronomic profile
 */
function resolveDiseaseKnowledge(
  diseaseName: string,
  customDescription?: string,
  customSymptoms?: string[],
  customTreatments?: {
    organic?: string[];
    chemical?: string[];
    culturalManagement?: string[];
  }
): DiseaseKnowledge {
  const cleanName = diseaseName.toLowerCase().trim();

  const found = PLANT_PATHOLOGY_DATABASE.find(
    (item) =>
      item.commonName.toLowerCase().includes(cleanName) ||
      cleanName.includes(item.commonName.toLowerCase()) ||
      item.diseaseName.toLowerCase().includes(cleanName) ||
      cleanName.includes(item.diseaseName.toLowerCase())
  );

  if (found) {
    return {
      ...found,
      description: customDescription || found.description,
      symptoms: customSymptoms && customSymptoms.length > 0 ? customSymptoms : found.symptoms,
      organicTreatments:
        customTreatments?.organic && customTreatments.organic.length > 0
          ? customTreatments.organic
          : found.organicTreatments,
      chemicalTreatments:
        customTreatments?.chemical && customTreatments.chemical.length > 0
          ? customTreatments.chemical
          : found.chemicalTreatments,
      culturalManagement:
        customTreatments?.culturalManagement && customTreatments.culturalManagement.length > 0
          ? customTreatments.culturalManagement
          : found.culturalManagement
    };
  }

  const isHealthy = cleanName.includes('healthy');
  return {
    diseaseName: diseaseName,
    commonName: diseaseName,
    plantSpecies: 'Botanical Foliage Specimen',
    pathogenType: isHealthy ? 'Healthy' : 'Fungal',
    severity: isHealthy ? 'Healthy' : 'Moderate',
    description:
      customDescription ||
      `Diagnostic analysis conducted for foliar symptoms associated with ${diseaseName}.`,
    symptoms:
      customSymptoms && customSymptoms.length > 0
        ? customSymptoms
        : isHealthy
        ? ['Uniform green coloration across lamina', 'Intact epidermal leaf structure']
        : ['Foliar discoloration or necrotic lesions observed on leaf lamina'],
    organicTreatments:
      customTreatments?.organic ||
      (isHealthy
        ? ['Continue balanced moisture and organic compost regimen']
        : ['Apply bio-fungicide or emulsified neem oil spray', 'Prune affected symptomatic leaves']),
    chemicalTreatments:
      customTreatments?.chemical ||
      (isHealthy
        ? ['No chemical intervention necessary']
        : ['Consult local extension office for target pesticide / fungicide formulations']),
    culturalManagement:
      customTreatments?.culturalManagement || [
        'Maintain appropriate plant canopy spacing',
        'Avoid prolonged overhead wetting of foliage'
      ],
    preventionTips: [
      'Monitor foliar canopy weekly for early symptom emergence',
      'Sanitize pruning tools between crops'
    ]
  };
}

/**
 * Executes inference against your custom external REST API model backend.
 * Compatible with any framework (FastAPI, Flask, TorchServe, TF Serving, Express, Django, etc.)
 */
async function callExternalModelApi(
  imageFile: File,
  imageUrl: string
): Promise<DiagnosticResult> {
  const startTime = performance.now();

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('image', imageFile);

  let response: Response;
  try {
    response = await fetch(MODEL_API_ENDPOINT, {
      method: 'POST',
      body: formData
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Failed to connect to model backend at '${MODEL_API_ENDPOINT}': ${message}. Ensure your model server is running or set 'USE_MOCK = true' in 'src/services/diseaseModelService.ts'.`
    );
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `Model backend returned HTTP error ${response.status} (${response.statusText}): ${
        errorText || 'Internal model server error'
      }`
    );
  }

  const data: ExternalModelApiResponse = await response.json();
  const inferenceDurationMs = Math.round(performance.now() - startTime);

  // --------------------------------------------------------------------------
  // STEP 1 (FIX): Explicitly honor the backend's own rejection decision.
  // Our Flask backend already runs the leaf pre-check AND the confidence
  // threshold server-side, and sets `result: "rejected"` when either fails.
  // Previously this function ignored that flag and re-derived its own guess
  // from the confidence number using a DIFFERENT (lower) threshold, which
  // let borderline non-leaf images slip through as fake "successful"
  // predictions. Checking `data.result` directly fixes that.
  // --------------------------------------------------------------------------
  if (data.result === 'rejected') {
    const rejection: UnrecognizedLeafResult = {
      id: 'rejected-' + Math.random().toString(36).substring(2, 9),
      reason: 'low_confidence',
      headline: 'Unable to Identify a Plant Disease',
      message:
        data.message ||
        'Unable to confidently identify a plant disease in this image — please upload a clear photo of a single leaf.',
      confidenceScore: data.confidence,
      thresholdApplied: MIN_CONFIDENCE_THRESHOLD,
      imageUrl: imageUrl,
      analyzedAt: new Date().toISOString(),
      modelDetails: {
        architecture: data.modelDetails?.architecture || 'Custom REST API Model Endpoint',
        inferenceTimeMs: data.modelDetails?.inferenceTimeMs || inferenceDurationMs
      }
    };

    return {
      isRecognizedLeaf: false,
      rejection
    };
  }

  // Extract disease name with flexible property resolution
  const rawDisease =
    data.disease ||
    data.prediction ||
    data.label ||
    data.class ||
    data.diseaseName ||
    data.commonName ||
    'Unidentified Condition';

  // Extract confidence and normalize to 0.0 - 100.0 percentage scale
  let rawConfidence =
    data.confidence ??
    data.confidenceScore ??
    data.score ??
    data.probability ??
    0;

  if (rawConfidence > 0 && rawConfidence <= 1.0) {
    rawConfidence = rawConfidence * 100;
  }
  const confidenceScore = Math.round(rawConfidence * 10) / 10;

  // STEP 2: Secondary safeguard — in case a backend response ever omits
  // `result` but still has low confidence, still catch it here.
  if (confidenceScore < MIN_CONFIDENCE_THRESHOLD) {
    const rejection: UnrecognizedLeafResult = {
      id: 'lowconf-' + Math.random().toString(36).substring(2, 9),
      reason: 'low_confidence',
      headline: 'Low Classification Confidence',
      message:
        'Unable to confidently identify a plant disease in this image — please upload a clear photo of a single leaf.',
      confidenceScore: confidenceScore,
      thresholdApplied: MIN_CONFIDENCE_THRESHOLD,
      imageUrl: imageUrl,
      analyzedAt: new Date().toISOString(),
      modelDetails: {
        architecture: data.modelDetails?.architecture || 'Custom REST API Model Endpoint',
        inferenceTimeMs: data.modelDetails?.inferenceTimeMs || inferenceDurationMs,
        rawTopPrediction: {
          label: rawDisease,
          confidence: confidenceScore
        }
      }
    };

    return {
      isRecognizedLeaf: false,
      rejection
    };
  }

  const knowledge = resolveDiseaseKnowledge(
    rawDisease,
    data.description,
    data.symptoms,
    data.recommendedTreatments
  );

  const prediction: DiseasePrediction = {
    id: 'diag-' + Math.random().toString(36).substring(2, 9),
    diseaseName: data.diseaseName || knowledge.diseaseName,
    commonName: data.commonName || knowledge.commonName,
    plantSpecies: data.plantSpecies || knowledge.plantSpecies,
    pathogenType: data.pathogenType || knowledge.pathogenType,
    confidenceScore: confidenceScore,
    severity: data.severity || knowledge.severity,
    description: data.description || knowledge.description,
    symptoms: data.symptoms && data.symptoms.length > 0 ? data.symptoms : knowledge.symptoms,
    recommendedTreatments: {
      organic: data.recommendedTreatments?.organic || knowledge.organicTreatments,
      chemical: data.recommendedTreatments?.chemical || knowledge.chemicalTreatments,
      culturalManagement:
        data.recommendedTreatments?.culturalManagement || knowledge.culturalManagement
    },
    preventionTips:
      data.preventionTips && data.preventionTips.length > 0
        ? data.preventionTips
        : knowledge.preventionTips,
    imageUrl: imageUrl,
    analyzedAt: new Date().toISOString(),
    modelDetails: {
      architecture: data.modelDetails?.architecture || 'Custom REST API Model Endpoint',
      inputResolution: 'Model Standard (RGB Tensor)',
      inferenceTimeMs: data.modelDetails?.inferenceTimeMs || inferenceDurationMs,
      topKAlternatives: data.modelDetails?.topKAlternatives
    }
  };

  return {
    isRecognizedLeaf: true,
    prediction
  };
}

/**
 * Runs the local mock prediction pipeline with simulated CNN inference,
 * heuristic leaf pre-filter, and realistic confidence score distribution.
 */
async function runMockPredictionPipeline(
  imageFile: File,
  imageUrl: string
): Promise<DiagnosticResult> {
  const precheck = await isLikelyLeafImage(imageFile);

  if (!precheck.isLeaf) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const rejection: UnrecognizedLeafResult = {
      id: 'precheck-' + Math.random().toString(36).substring(2, 9),
      reason: 'failed_precheck',
      headline: 'Non-Leaf or Unrecognized Specimen Detected',
      message:
        'Unable to confidently identify a plant disease in this image — please upload a clear photo of a single leaf.',
      thresholdApplied: MIN_CONFIDENCE_THRESHOLD,
      imageUrl: imageUrl,
      analyzedAt: new Date().toISOString(),
      precheckDetails: {
        method: 'isLikelyLeafImage (Heuristic Pre-Filter)',
        description:
          precheck.reason ||
          'The pre-check could not detect standard botanical foliar characteristics or chlorophyll distribution.',
        passed: false
      }
    };

    return {
      isRecognizedLeaf: false,
      rejection
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 1800));

  const lowerName = imageFile.name.toLowerCase();

  const isLowConfidenceTest =
    lowerName.includes('ambiguous') ||
    lowerName.includes('low-conf') ||
    lowerName.includes('low_conf') ||
    lowerName.includes('blurry') ||
    lowerName.includes('unclear');

  let selectedKnowledge: DiseaseKnowledge;

  if (lowerName.includes('tomato') || lowerName.includes('early') || lowerName.includes('blight')) {
    selectedKnowledge = PLANT_PATHOLOGY_DATABASE[0];
  } else if (lowerName.includes('potato') || lowerName.includes('late')) {
    selectedKnowledge = PLANT_PATHOLOGY_DATABASE[1];
  } else if (lowerName.includes('pepper') || lowerName.includes('bacterial') || lowerName.includes('spot')) {
    selectedKnowledge = PLANT_PATHOLOGY_DATABASE[2];
  } else if (lowerName.includes('apple') || lowerName.includes('rot')) {
    selectedKnowledge = PLANT_PATHOLOGY_DATABASE[3];
  } else if (lowerName.includes('corn') || lowerName.includes('rust')) {
    selectedKnowledge = PLANT_PATHOLOGY_DATABASE[4];
  } else if (lowerName.includes('grape') || lowerName.includes('mildew')) {
    selectedKnowledge = PLANT_PATHOLOGY_DATABASE[5];
  } else if (lowerName.includes('healthy') || lowerName.includes('strawberry')) {
    selectedKnowledge = PLANT_PATHOLOGY_DATABASE[6];
  } else {
    const hash = (imageFile.name.length * 37 + imageFile.size) % PLANT_PATHOLOGY_DATABASE.length;
    selectedKnowledge = PLANT_PATHOLOGY_DATABASE[hash];
  }

  let confidenceScore: number;
  if (isLowConfidenceTest) {
    confidenceScore = Math.round((52.0 + (imageFile.size % 120) / 10) * 10) / 10;
  } else {
    const baseConfidence = 91.5 + ((imageFile.size % 70) / 10);
    confidenceScore = Math.min(99.4, Math.round(baseConfidence * 10) / 10);
  }

  if (confidenceScore < MIN_CONFIDENCE_THRESHOLD) {
    const rejection: UnrecognizedLeafResult = {
      id: 'lowconf-' + Math.random().toString(36).substring(2, 9),
      reason: 'low_confidence',
      headline: 'Low Classification Confidence',
      message:
        'Unable to confidently identify a plant disease in this image — please upload a clear photo of a single leaf.',
      confidenceScore: confidenceScore,
      thresholdApplied: MIN_CONFIDENCE_THRESHOLD,
      imageUrl: imageUrl,
      analyzedAt: new Date().toISOString(),
      modelDetails: {
        architecture: 'PlantVillage-ResNet50v2 (Pre-trained & Fine-tuned)',
        inferenceTimeMs: Math.floor(70 + Math.random() * 40),
        rawTopPrediction: {
          label: selectedKnowledge.commonName,
          confidence: confidenceScore
        }
      }
    };

    return {
      isRecognizedLeaf: false,
      rejection
    };
  }

  const otherDiseases = PLANT_PATHOLOGY_DATABASE.filter(
    (d) => d.commonName !== selectedKnowledge.commonName
  );
  const alt1 = otherDiseases[0];
  const alt2 = otherDiseases[1];
  const remainingProb = Math.max(0.6, Math.round((100 - confidenceScore) * 10) / 10);

  const prediction: DiseasePrediction = {
    id: 'diag-' + Math.random().toString(36).substring(2, 9),
    diseaseName: selectedKnowledge.diseaseName,
    commonName: selectedKnowledge.commonName,
    plantSpecies: selectedKnowledge.plantSpecies,
    pathogenType: selectedKnowledge.pathogenType,
    confidenceScore: confidenceScore,
    severity: selectedKnowledge.severity,
    description: selectedKnowledge.description,
    symptoms: selectedKnowledge.symptoms,
    recommendedTreatments: {
      organic: selectedKnowledge.organicTreatments,
      chemical: selectedKnowledge.chemicalTreatments,
      culturalManagement: selectedKnowledge.culturalManagement
    },
    preventionTips: selectedKnowledge.preventionTips,
    imageUrl: imageUrl,
    analyzedAt: new Date().toISOString(),
    modelDetails: {
      architecture: 'PlantVillage-ResNet50v2 (Pre-trained & Fine-tuned)',
      inputResolution: '224 × 224 × 3 RGB Tensor',
      inferenceTimeMs: Math.floor(65 + Math.random() * 45),
      topKAlternatives: [
        { label: alt1.commonName, probability: Math.round((remainingProb * 0.7) * 10) / 10 },
        { label: alt2.commonName, probability: Math.round((remainingProb * 0.3) * 10) / 10 }
      ]
    }
  };

  return {
    isRecognizedLeaf: true,
    prediction
  };
}

/**
 * ============================================================================
 * PREDICT DISEASE (Primary Unified Async Inference Entrypoint)
 * ============================================================================
 */
export async function predictDisease(imageFile: File): Promise<DiagnosticResult> {
  const fileExt = imageFile.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['jpg', 'jpeg'];
  const isJpegMime = imageFile.type === 'image/jpeg' || imageFile.type === 'image/pjpeg';

  if (!fileExt || !validExtensions.includes(fileExt) || (!isJpegMime && imageFile.type !== '')) {
    throw new Error(
      `Unsupported file format (${fileExt ? '.' + fileExt : 'unknown'}). The CNN inference pipeline strictly accepts only .jpg and .jpeg images.`
    );
  }

  const imageUrl = URL.createObjectURL(imageFile);

  if (USE_MOCK) {
    return runMockPredictionPipeline(imageFile, imageUrl);
  }

  return callExternalModelApi(imageFile, imageUrl);
}
