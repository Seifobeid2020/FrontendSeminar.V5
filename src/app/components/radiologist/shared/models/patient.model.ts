import { Treatment } from './treatment.model';

export interface Patient {
  patientId?: number;
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: number;
  phoneNumber: string;
  createdAt?: Date;
  totalTreatmentCost?: number;

  treatments?: Treatment[];
}
