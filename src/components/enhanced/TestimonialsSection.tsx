import { Column, Row, Text, Avatar, Card, RevealFx } from "@once-ui-system/core";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar?: string;
  content: string;
  rating?: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  delay?: number;
}

export function TestimonialsSection({ testimonials, delay = 0 }: TestimonialsSectionProps) {
  return (
    <RevealFx translateY="16" delay={delay}>
      <Column fillWidth gap="xl" paddingY="32">
        <Column horizontal="center" align="center" gap="16">
          <Text variant="heading-strong-l" onBackground="neutral-strong">
            What People Say
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            Feedback from colleagues and collaborators in the energy industry
          </Text>
        </Column>

        <Row 
          fillWidth 
          gap="xl" 
          horizontal="center"
          s={{ gap: "24", direction: "column" }}
        >
          {testimonials.map((testimonial, index) => (
            <RevealFx 
              key={`testimonial-${testimonial.name}-${index}`} 
              translateY="8" 
              delay={delay + index * 0.2}
            >
              <Card
                background="neutral-alpha-weak"
                border="neutral-alpha-medium"
                radius="l"
                padding="20"
                style={{ maxWidth: "400px" }}
              >
                <Column gap="16">
                  {/* Quote */}
                  <Text 
                    variant="body-default-m" 
                    onBackground="neutral-strong"
                    wrap="balance"
                  >
                    "{testimonial.content}"
                  </Text>
                  
                  {/* Rating */}
                  {testimonial.rating && (
                    <Row gap="4">
                      {Array.from({ length: testimonial.rating }, (_, i) => (
                        <Text key={`star-${testimonial.name}-${i}`} variant="label-default-l">⭐</Text>
                      ))}
                    </Row>
                  )}

                  {/* Author Info */}
                  <Row gap="12" vertical="center">
                    <Avatar
                      src={testimonial.avatar}
                      size="s"
                    />
                    <Column gap="2">
                      <Text variant="label-default-l" onBackground="neutral-strong">
                        {testimonial.name}
                      </Text>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {testimonial.role} at {testimonial.company}
                      </Text>
                    </Column>
                  </Row>
                </Column>
              </Card>
            </RevealFx>
          ))}
        </Row>
      </Column>
    </RevealFx>
  );
}