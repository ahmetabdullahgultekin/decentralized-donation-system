import {Badge} from './badge';

export interface Profile {
  id: number;
  name: string;
  level: string;
  reputation: number;
  address: string;
  badges: Badge[];
  activityHistory: { date: string, description: string }[];
}
