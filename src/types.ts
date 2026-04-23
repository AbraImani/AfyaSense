export interface HealthCase {
  id: string;
  patientName: string;
  age: number;
  sex: 'M' | 'F';
  district: string;
  symptoms: string[];
  temperature: number;
  notes?: string;
  probableCondition: string;
  severity: 'Faible' | 'Modéré' | 'Élevé' | 'Critique';
  recommendation: string;
  createdAt: string;
}

export interface EpidemicAlert {
  id: string;
  district: string;
  alertType: string;
  severity: 'Faible' | 'Modéré' | 'Élevé';
  relatedCasesCount: number;
  status: 'Actif' | 'Résolu';
  createdAt: string;
}

export interface ImageAnalysis {
  id: string;
  imageUrl?: string;
  result: 'Normal' | 'Risque Modéré' | 'Risque Élevé';
  confidence: number;
  recommendation: string;
  createdAt: string;
}
