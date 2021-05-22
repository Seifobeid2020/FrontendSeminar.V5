import { Doctor } from './doctor.model';

export interface DoctorCityLabel {
  label: string;
  value: number;
  items?: Doctor[];
}
