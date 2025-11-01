import { Column, Row, Text, Badge, Line, RevealFx } from "@once-ui-system/core";

interface TimelineItem {
  title: string;
  company: string;
  timeframe: string;
  description: string[];
  achievements?: string[];
  type: "education" | "experience" | "project";
  icon?: string;
}

interface CareerTimelineProps {
  timeline: TimelineItem[];
  delay?: number;
}

const typeConfig = {
  education: {
    color: "accent",
    label: "Education"
  },
  experience: {
    color: "brand", 
    label: "Experience"
  },
  project: {
    color: "moss",
    label: "Project"
  }
};

export function CareerTimeline({ timeline, delay = 0 }: CareerTimelineProps) {
  return (
    <RevealFx translateY="16" delay={delay}>
      <Column fillWidth gap="xl" paddingY="32">
        <Column horizontal="center" align="center" gap="16">
          <Text variant="heading-strong-l" onBackground="neutral-strong">
            Career Journey
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            My professional path in petroleum engineering and technology
          </Text>
        </Column>

        <Column gap="xl" paddingX="20">
          {timeline.map((item, index) => (
            <RevealFx key={`timeline-${item.title}-${index}`} translateY="8" delay={delay + index * 0.2}>
              <Row gap="24" vertical="start">
                {/* Timeline Line */}
                <Column align="center">
                  <Line
                    background="brand-alpha-medium"
                    style={{
                      width: "2px",
                      minHeight: index === timeline.length - 1 ? "24px" : "100%"
                    }}
                  />
                  <Badge
                    background="brand-alpha-medium"
                    onBackground="brand-strong"
                  >
                    {typeConfig[item.type].label}
                  </Badge>
                </Column>

                {/* Content */}
                <Column flex={1} gap="12" paddingBottom="32">
                  <Row gap="16" vertical="start">
                    <Column flex={1} gap="8">
                      <Text variant="heading-default-m" onBackground="neutral-strong">
                        {item.title}
                      </Text>
                      <Row gap="12" vertical="center">
                        <Text variant="label-default-l" onBackground="neutral-medium">
                          {item.company}
                        </Text>
                        <Badge background="neutral-alpha-medium">
                          {item.timeframe}
                        </Badge>
                      </Row>
                    </Column>
                  </Row>

                  {/* Description */}
                  <Column gap="8">
                    {item.description.map((desc, descIndex) => (
                      <Text 
                        key={`desc-${item.title}-${descIndex}`}
                        variant="body-default-s" 
                        onBackground="neutral-weak"
                        wrap="balance"
                      >
                        • {desc}
                      </Text>
                    ))}
                  </Column>

                  {/* Achievements */}
                  {item.achievements && item.achievements.length > 0 && (
                    <Column gap="8" paddingTop="8">
                      <Text variant="label-default-l" onBackground="neutral-medium">
                        Key Achievements:
                      </Text>
                      {item.achievements.map((achievement, achIndex) => (
                        <Text 
                          key={`ach-${item.title}-${achIndex}`}
                          variant="body-default-s" 
                          onBackground="neutral-weak"
                          wrap="balance"
                        >
                          ✓ {achievement}
                        </Text>
                      ))}
                    </Column>
                  )}
                </Column>
              </Row>
            </RevealFx>
          ))}
        </Column>
      </Column>
    </RevealFx>
  );
}