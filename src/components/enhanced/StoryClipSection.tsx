import { Card, Column, Heading, Line, RevealFx, Row, Text } from "@once-ui-system/core";

interface StoryClipSectionProps {
  delay?: number;
}

export function StoryClipSection({ delay = 1.5 }: StoryClipSectionProps) {
  return (
    <RevealFx translateY="16" delay={delay}>
      <Column fillWidth gap="24" marginY="xl">
        <Row fillWidth paddingRight="64">
          <Line maxWidth={48} />
        </Row>
        <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
          <Row flex={1} paddingLeft="l" paddingTop="24">
            <Heading as="h2" variant="display-strong-xs" wrap="balance">
              In conversation
            </Heading>
          </Row>
          <Row flex={3} paddingX="20">
            <Column fillWidth gap="16">
              <Text wrap="balance" onBackground="neutral-weak" variant="body-default-m">
                A short dialogue on engineering, investing, and building in energy and technology.
              </Text>
              <Card
                fillWidth
                background="surface"
                border="neutral-alpha-weak"
                radius="l"
                padding="0"
                overflow="hidden"
              >
                <div className="story-clip-video-wrapper">
                  {/* biome-ignore lint/a11y/useMediaCaption: Source clip has no separate caption file */}
                  <video
                    className="story-clip-video"
                    controls
                    playsInline
                    preload="metadata"
                    poster="/videos/story-clip-poster.jpg"
                    aria-label="Sam Stehno dialogue clip on engineering and investing"
                  >
                    <source src="/videos/story-clip.mp4" type="video/mp4" />
                    Your browser does not support embedded video playback.
                  </video>
                </div>
              </Card>
            </Column>
          </Row>
        </Row>
        <Row fillWidth paddingLeft="64" horizontal="end">
          <Line maxWidth={48} />
        </Row>
      </Column>
    </RevealFx>
  );
}
