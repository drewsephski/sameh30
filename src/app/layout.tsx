import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "@/resources/custom.css";
import "@/app/styles/globals.css";
import "@/app/styles/enhanced.css";
import "@/styles/mobile-chat.css";

import classNames from "classnames";

import {
  Background,
  Column,
  Flex,
  Meta,
  type opacity,
  RevealFx,
  type SpacingToken,
} from "@once-ui-system/core";
import { Footer, Header, RouteGuard, Providers } from "@/components";
import { baseURL, effects, fonts, style, dataStyle, home } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={classNames(
        'bg-background text-foreground',
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
      data-theme="light"
    >
      <head>
        <script
          id="theme-init"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  // Initialize with light theme by default
                  let theme = 'light';
                  
                  // Check for saved theme preference
                  const savedTheme = localStorage.getItem('theme');
                  if (savedTheme) {
                    theme = savedTheme;
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    theme = 'dark';
                  }
                  
                  // Apply the theme
                  root.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    root.classList.add('dark');
                  } else {
                    root.classList.remove('dark');
                  }
                  
                  // Watch for system theme changes
                  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                    if (!localStorage.getItem('theme')) {
                      const newTheme = e.matches ? 'dark' : 'light';
                      root.setAttribute('data-theme', newTheme);
                      if (newTheme === 'dark') {
                        root.classList.add('dark');
                      } else {
                        root.classList.remove('dark');
                      }
                    }
                  });
                  const defaultTheme = 'system';
                  
                  // Set defaults from config
                  const config = ${JSON.stringify({
                    brand: style.brand,
                    accent: style.accent,
                    neutral: style.neutral,
                    solid: style.solid,
                    "solid-style": style.solidStyle,
                    border: style.border,
                    surface: style.surface,
                    transition: style.transition,
                    scaling: style.scaling,
                    "viz-style": dataStyle.variant,
                  })};
                  
                  // Apply default values
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });
                  
                  // Resolve theme
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };
                  
                  // Apply saved theme
                  const savedTheme = localStorage.getItem('data-theme');
                  const resolvedTheme = resolveTheme(savedTheme);
                  root.setAttribute('data-theme', resolvedTheme);
                  
                  // Apply any saved style overrides
                  const styleKeys = Object.keys(config);
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                } catch (e) {
                  console.error('Failed to initialize theme:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <Providers>
        <Column
          as="body"
          background="page"
          fillWidth
          style={{ minHeight: "100vh" }}
          margin="0"
          padding="0"
          horizontal="center"
          suppressHydrationWarning
        >
          <RevealFx fill position="absolute">
            <Background
              mask={{
                x: effects.mask.x,
                y: effects.mask.y,
                radius: effects.mask.radius,
                cursor: effects.mask.cursor,
              }}
              gradient={{
                display: effects.gradient.display,
                opacity: effects.gradient.opacity as opacity,
                x: effects.gradient.x,
                y: effects.gradient.y,
                width: effects.gradient.width,
                height: effects.gradient.height,
                tilt: effects.gradient.tilt,
                colorStart: effects.gradient.colorStart,
                colorEnd: effects.gradient.colorEnd,
              }}
              dots={{
                display: effects.dots.display,
                opacity: effects.dots.opacity as opacity,
                size: effects.dots.size as SpacingToken,
                color: effects.dots.color,
              }}
              grid={{
                display: effects.grid.display,
                opacity: effects.grid.opacity as opacity,
                color: effects.grid.color,
                width: effects.grid.width,
                height: effects.grid.height,
              }}
              lines={{
                display: effects.lines.display,
                opacity: effects.lines.opacity as opacity,
                size: effects.lines.size as SpacingToken,
                thickness: effects.lines.thickness,
                angle: effects.lines.angle,
                color: effects.lines.color,
              }}
            />
          </RevealFx>
          <Flex fillWidth minHeight="16" s={{ hide: true }} />
          <Header />
          <Flex zIndex={0} fillWidth padding="l" horizontal="center" flex={1}>
            <Flex horizontal="center" fillWidth minHeight="0">
              <RouteGuard>{children}</RouteGuard>
            </Flex>
          </Flex>
          <Footer />
        </Column>
      </Providers>
    </html>
  );
}
