import type { Skill, TimelineItem, Testimonial } from "./types";

export const sampleSkills: Skill[] = [
  // Engineering Skills
  { name: "Petroleum Engineering", level: 95, category: "engineering" },
  { name: "Reservoir Simulation", level: 88, category: "engineering" },
  { name: "Production Optimization", level: 92, category: "engineering" },
  { name: "Drilling Operations", level: 85, category: "engineering" },
  
  // Development Skills
  { name: "Python", level: 90, category: "development" },
  { name: "HTML/CSS", level: 85, category: "development" },
  { name: "Data Analysis", level: 88, category: "development" },
  { name: "Machine Learning", level: 75, category: "development" },
  
  // Analytics Skills
  { name: "Statistical Analysis", level: 90, category: "analytics" },
  { name: "Data Visualization", level: 85, category: "analytics" },
  { name: "Process Analytics", level: 88, category: "analytics" },
  { name: "Performance Metrics", level: 92, category: "analytics" },
  
  // Operations Skills
  { name: "Project Management", level: 87, category: "operations" },
  { name: "Technical Writing", level: 90, category: "operations" },
  { name: "Team Leadership", level: 82, category: "operations" },
  { name: "Process Improvement", level: 85, category: "operations" }
];

export const sampleTimeline: TimelineItem[] = [
  {
    title: "OEDP Production Engineer",
    company: "Oxy",
    timeframe: "2025 - Present",
    description: [
      "Participating in Oxy's Operations Engineering Development Program",
      "Gaining hands-on experience in oil and gas production operations and optimization",
      "Applying petroleum engineering principles to improve production efficiency"
    ],
    achievements: [
      "Completed comprehensive production operations training",
      "Led cross-functional team for process optimization initiative",
      "Implemented data-driven decision making frameworks"
    ],
    type: "experience"
  },
  {
    title: "Bachelor of Science in Petroleum Engineering",
    company: "Texas Tech University",
    timeframe: "2021 - 2025",
    description: [
      "Bachelor of Science in Petroleum Engineering with Minors in Mathematics and Computer Science",
      "Focus on reservoir engineering and production optimization",
      "Strong foundation in mathematical modeling and computational methods"
    ],
    achievements: [
      "Dean's List for multiple semesters",
      "President of Society of Petroleum Engineers student chapter",
      "Graduated with honors and distinction"
    ],
    type: "education"
  },
  {
    title: "Production Optimization Analytics Platform",
    company: "Independent Project",
    timeframe: "2024",
    description: [
      "Developed a comprehensive analytics platform for production optimization",
      "Integrated real-time data analysis with machine learning algorithms",
      "Created dashboard for monitoring key performance indicators"
    ],
    achievements: [
      "Increased production efficiency by 15% in pilot testing",
      "Reduced operational costs through predictive maintenance",
      "Presented findings at regional engineering conference"
    ],
    type: "project"
  },
  {
    title: "Intern - Energy Analytics",
    company: "Major Oil & Gas Company",
    timeframe: "Summer 2024",
    description: [
      "Analyzed production data to identify optimization opportunities",
      "Developed Python scripts for automated data processing",
      "Collaborated with field engineers on process improvements"
    ],
    achievements: [
      "Identified $2M in potential cost savings",
      "Developed automated reporting system",
      "Received recognition for outstanding performance"
    ],
    type: "experience"
  }
];

export const sampleTestimonials: Testimonial[] = [
  {
    name: "Dr. Sarah Johnson",
    role: "Professor of Petroleum Engineering",
    company: "Texas Tech University",
    content: "Sam demonstrates exceptional analytical skills and a natural ability to bridge theoretical knowledge with practical applications. Their approach to problem-solving in reservoir engineering is both innovative and methodical.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Senior Production Engineer",
    company: "Oxy",
    content: "Working with Sam has been a pleasure. They bring fresh perspectives to our production optimization challenges and consistently deliver data-driven insights that drive real results.",
    rating: 5
  },
  {
    name: "Lisa Rodriguez",
    role: "Operations Manager",
    company: "Energy Analytics Corp",
    content: "Sam's technical expertise in both petroleum engineering and data analytics makes them a valuable asset. They have a unique ability to translate complex data into actionable business recommendations.",
    rating: 5
  }
];

export const sampleStats = [
  { value: 95, label: "Projects Completed", suffix: "+" },
  { value: 15, label: "Years of Experience", suffix: "+" },
  { value: 50, label: "Happy Clients", suffix: "+" },
  { value: 99, label: "Success Rate", suffix: "%" }
];