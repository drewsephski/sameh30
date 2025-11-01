import { Column, Row, Text, Button, Card, RevealFx } from "@once-ui-system/core";
import { person } from "@/resources";

interface CTASectionProps {
  delay?: number;
}

export function CTASection({ delay = 0 }: CTASectionProps) {
  return (
    <RevealFx translateY="16" delay={delay}>
      <Column fillWidth gap="xl" paddingY="32">
        <Card
          background="brand-alpha-weak"
          border="brand-alpha-medium"
          radius="l"
          padding="32"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <Column gap="24" horizontal="center" align="center">
            <Column gap="16" horizontal="center" align="center">
              <Text variant="heading-strong-l" onBackground="brand-strong" wrap="balance">
                Let's Build Something Amazing Together
              </Text>
              <Text
                variant="body-default-m"
                onBackground="neutral-weak"
                wrap="balance"
              >
                Ready to collaborate on your next petroleum engineering project?
                I'm always excited to discuss new opportunities in energy technology and innovation.
              </Text>
            </Column>

            <Row gap="16" horizontal="center">
              <Button
                variant="primary"
                href={`mailto:${person.email}`}
              >
                Get In Touch
              </Button>
              <Button
                variant="secondary"
                href="https://www.linkedin.com/in/sam-sepeczi/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Send a Message
              </Button>
            </Row>

            <Row gap="16" vertical="center" horizontal="center">
              <Text variant="body-default-s" onBackground="neutral-weak">
                📍 Based in {person.location}
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                ⚡ Available for new projects
              </Text>
            </Row>
          </Column>
        </Card>
      </Column>
    </RevealFx>
  );
}