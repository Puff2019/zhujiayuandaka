export type TaskStatus = 'todo' | 'pending' | 'approved' | 'rejected' | 'completed';

export enum TaskType {
  READING = 'READING',
  ENGLISH = 'ENGLISH'
}

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  reward: number;
  status: TaskStatus;
  date: string; // YYYY-MM-DD
  // Reading specific
  bookName?: string;
  videoPreviewUrl?: string; // base64 or blob url
  duration?: number;
  // English specific
  englishSentence?: string;
  englishTranslation?: string;
  audioUrl?: string;
  submissionTime?: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO String
  amount: number;
  description: string;
  type: 'income' | 'expense';
}

export interface Wish {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface AppState {
  balance: number;
  totalEarnings: number;
  transactions: Transaction[];
  tasks: Task[];
  wishes: Wish[];
  streak: number;
  lastLoginDate: string;
}
