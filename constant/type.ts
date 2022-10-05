export interface Game {
  title: string;
  questions: Question[];
}

export interface Question {
  index: number;
  content: string;
  options: Option[];
}

export interface Option {
  content: string;
  next: number;
  _id?: string;
}
