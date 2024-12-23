export interface IJob{
  id: number;
  title: string;
  description: string;
  type: string;
  locations: string[];
  skills: string[];
  experience: string;
  postedDate: string;
}