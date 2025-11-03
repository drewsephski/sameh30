import type { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Sam",
  lastName: "Stehno",
  name: "Sam Stehno",
  role: "OEDP Production Engineer",
  avatar: "/images/sam.png",
  email: "samstehno@gmail.com",
  location: "America/Chicago", // Central Time Zone (Texas)
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>Weekly insights on engineering, technology, and innovation</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/sam-stehno/",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home: Home = {
  path: "/",
  image: "/images/sam.png",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as an ${person.role}`,
  headline: <>Innovating the future of energy engineering</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Production Engineering</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/production-optimization-analytics-platform",
  },
  subline: (
    <>
      I'm Sam Stehno, a petroleum engineer specializing in production optimization and
      <br /> data-driven solutions that maximize operational efficiency in complex energy systems.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://samstehno@gmail.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I'm a petroleum engineer with a passion for applying engineering principles to optimize
        oil and gas production operations. With a background in Mathematics and Computer Science,
        I bring a unique analytical approach to solving complex engineering challenges in the energy sector.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Oxy",
        timeframe: "2025 - Present",
        role: "OEDP Production Engineer",
        achievements: [
          "Participating in Oxy's Operations Engineering Development Program, gaining hands-on experience in oil and gas production operations and optimization.",
          "Applying petroleum engineering principles and data analysis to improve production efficiency and operational performance across multiple assets.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/gallery/horizontal-3.jpg",
            alt: "Oxy Operations",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Education",
    institutions: [
      {
        name: "Texas Tech University",
        description: <>Bachelor of Science in Petroleum Engineering with Minors in Mathematics and Computer Science</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical Skills & Services",
    skills: [
      {
        title: "Petroleum Engineering",
        description: (
          <>Oil and gas production optimization, reservoir engineering, and drilling operations.</>
        ),
        tags: [
          {
            name: "Python",
            icon: "python",
          },
          {
            name: "Data Analysis",
            icon: "analytics",
          },
          {
            name: "Reservoir Simulation",
            icon: "engineering",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/gallery/vertical-1.jpg",
            alt: "Petroleum Engineering",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Software Development",
        description: (
          <>Custom software solutions for engineering applications and business operations.</>
        ),
        tags: [
          {
            name: "HTML",
            icon: "html",
          },
          {
            name: "pandas",
            icon: "analytics",
          },
          {
            name: "Python",
            icon: "python",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/gallery/vertical-2.jpg",
            alt: "Software Development",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Professional Services",
        description: (
          <>Technical writing, project management, and content strategy for engineering teams.</>
        ),
        tags: [
          {
            name: "Technical Writing",
            icon: "edit",
          },
          {
            name: "Project Management",
            icon: "calendar",
          },
          {
            name: "Content Strategy",
            icon: "book",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/gallery/vertical-3.jpg",
            alt: "Professional Services",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Field Production Engineering",
        description: (
          <>Current role as a field production engineer focusing on facilities engineering, production assurance activities, and supporting the production team with technical expertise in production optimization.</>
        ),
        tags: [
          {
            name: "Facilities Engineering",
            icon: "engineering",
          },
          {
            name: "Production Assurance",
            icon: "analytics",
          },
          {
            name: "Team Support",
            icon: "users",
          },
          {
            name: "Production Optimization",
            icon: "settings",
          },
        ],
        images: [
          {
            src: "/images/gallery/vertical-4.jpg",
            alt: "Field Production Engineering",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Engineering insights and industry trends",
  description: `Read what ${person.name} has been up to recently in petroleum engineering`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Engineering Projects – ${person.name}`,
  description: `Petroleum engineering and software development projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

const chat = {
  path: "/chat",
  label: "Chat",
  title: `AI Chat – ${person.name}`,
  description: `Chat with AI assistant powered by ${person.name}'s portfolio`,
};

export { person, social, newsletter, home, about, blog, work, gallery, chat };
