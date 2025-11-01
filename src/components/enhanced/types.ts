export interface Skill {
  name: string;
  level: number; // 0-100
  category: "engineering" | "development" | "analytics" | "operations";
  icon?: string;
}

export interface TimelineItem {
  title: string;
  company: string;
  timeframe: string;
  description: string[];
  achievements?: string[];
  type: "education" | "experience" | "project";
  icon?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar?: string;
  content: string;
  rating?: number;
}