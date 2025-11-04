# Magic Portfolio - Developer Onboarding

A modern, Next.js-based portfolio template with MDX support for content management.

clone the repo

bun install

bun run dev

Visit `http://localhost:3000` to view the site.

## Project Structure

### Key Configuration Files
- `src/resources/once-ui.config.js` - Main configuration (site metadata, navigation, etc.)
- `src/resources/content.js` - Content configuration and data
- `tailwind.config.js` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration

### Main Directories
- `src/app/` - Page routes and layouts
  - `about/` - About/CV page content
  - `blog/` - Blog posts (MDX files)
  - `work/` - Project showcase (MDX files)
  - `gallery/` - Image gallery content
  - `chat/` - AI chat interface

- `src/components/` - Reusable UI components
  - `ui/` - Base UI components
  - `about/` - About page components
  - `blog/` - Blog components
  - `work/` - Project showcase components
  - `ai-elements/` - AI-related components

- `public/` - Static assets (images, fonts, etc.)

## Content Management

### Adding Blog Posts
1. Create a new `.mdx` file in `src/app/blog/posts/`
2. Use the following frontmatter format:
   ```mdx
   ---
   title: 'Your Post Title'
   date: '2025-11-04'
   description: 'A brief description of your post'
   ---
   
   Your post content here...
   ```

### Adding Projects
1. Create a new `.mdx` file in `src/app/work/projects/`
2. Use the following frontmatter format:
   ```mdx
   ---
   title: 'Project Name'
   date: '2025-11-04'
   description: 'Brief project description'
   tags: ['web', 'design', 'development']
   featuredImage: '/images/projects/your-image.jpg'
   ---
   
   Project details here...
   ```

## Customization

### Theming
- Edit `src/styles/global.css` for global styles
- Modify color schemes in `tailwind.config.js`

### Configuration
Update the following files to customize your portfolio:
- Site metadata: `src/resources/once-ui.config.js`
- Navigation: `src/resources/content.js`
- Social links: `src/resources/content.js`