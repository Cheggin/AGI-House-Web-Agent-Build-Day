import { Id } from "../../convex/_generated/dataModel";

export interface Candidate {
  _id?: Id<"candidates">;
  email: string;
  password: string;
  profileType: string;
  cvUploaded: boolean;
  firstName: string;
  lastName: string;
  eligibilityToWork: boolean;
  age: number;
  postCode: string;
  birthdate: string;
  phone: string;
  country: string;
  county: string;
  salary: string;
  profileSummary: string;
  currentJobTitle: string;
  currentCompany: string;
  experience: number;
}

export interface JobExperience {
  _id?: Id<"jobExperiences">;
  candidateId?: Id<"candidates">;
  company: string;
  title: string;
  currentJob: boolean;
  startDate: string;
  endDate: string;
  scope: string;
}

export interface Question {
  _id?: Id<"questions">;
  candidateId?: Id<"candidates">;
  questionId: string;
  name: string;
  answer: string;
  intent: string;
  answered: boolean;
  questionType: string;
  options?: string[];
}

export interface Job {
  _id: Id<"jobs">;
  _creationTime: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  status: "active" | "closed";
}

export interface Application {
  _id: Id<"applications">;
  _creationTime: number;
  candidateId: Id<"candidates">;
  jobId: Id<"jobs">;
  appliedDate: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  coverLetter?: string;
}

export interface UploadedProfile {
  email: string;
  password: string;
  profileType: string;
  cvUploaded: boolean;
  firstName: string;
  lastName: string;
  eligibilityToWork: boolean;
  age: number;
  postCode: string;
  birthdate: string;
  phone: string;
  country: string;
  county: string;
  salary: string;
  profileSummary: string;
  currentJobTitle: string;
  currentCompany: string;
  lastJobTitle: string;
  lastJobCompany: string;
  lastJobStartMonth: string;
  lastJobStartYear: string;
  lastJobEndMonth: string;
  lastJobEndYear: string;
  lastJobResponsibilities: string;
  lastJobLocation: string;
  experience: number;
  jobExperiences: JobExperience[];
  questions: Question[];
}