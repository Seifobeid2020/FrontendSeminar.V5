import { Treatment } from './treatment.model';

export interface TreatmentType {
  treatmentTypeId?: number;
  name: string;
  defaultCost: number;
  userId: string;

  treatments?: Treatment[];
}
