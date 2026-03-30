export type Difficulty = 'Junior' | 'Semi senior' | 'Senior';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  difficulty: Difficulty;
  tags: string[];
  initialHtml: string;
  initialCss: string;
}

export interface CodeState {
  html: string;
  css: string;
}
