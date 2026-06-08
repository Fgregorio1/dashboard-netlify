export type Level = "Iniciante" | "Intermediário" | "Todos";

export type Lesson = {
  id: string;
  title: string;
  level: Level;
  duration: string;
  tag?: string;
  hook: string;
  teach: string[];
  example?: string;
  task: string;
  closing: string;
};

export type Module = {
  code: string;
  title: string;
  goal: string;
  lessons: Lesson[];
};
