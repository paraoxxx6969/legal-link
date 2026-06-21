/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Attorney {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviewsCount: number;
  experience: string;
  specialty: string;
  image: string;
  bio: string;
  rate: number;
  expertiseTags: string[];
  cases: PriorCase[];
  endorsements: Endorsement[];
  affiliations: string[];
  online?: boolean;
}

export interface PriorCase {
  title: string;
  outcome: string;
  outcomeColor: 'green' | 'blue' | 'amber';
  description: string;
}

export interface Endorsement {
  quote: string;
  author: string;
}

export interface Case {
  id: string;
  title: string;
  status: 'In Progress' | 'Pending' | 'Completed';
  lastUpdated: string;
  progress: number; // 0 to 100
  lawyerName: string;
  iconName: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  size: string;
  uploadedDate: string;
  category: string; // Folder ID
  type: 'pdf' | 'doc' | 'image' | 'excel';
  sharedWith: string[]; // names of attorneys shared with
}

export interface Folder {
  id: string;
  name: string;
  itemCount: number;
  accent: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // e.g. "Oct 16"
  time: string; // e.g. "11:15 AM"
  type: string; // e.g. "Initial Consultation"
  attorneyName: string;
}
