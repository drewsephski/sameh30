import { Column, Row, Text, RevealFx } from "@once-ui-system/core";

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface AnimatedStatsProps {
  stats: StatItem[];
  delay?: number;
}

export function AnimatedStats({ stats, delay = 0 }: AnimatedStatsProps) {
  return (
    <RevealFx translateY="8" delay={delay}>
      <Row
        fillWidth
        gap="xl"
        paddingY="32"
        horizontal="center"
        s={{ gap: "24", paddingY: "24" }}
      >
        {stats.map((stat, index) => (
          <Column key={`stat-${stat.label}-${index}`} horizontal="center" align="center" gap="8">
            <Row gap="4" vertical="center">
              <Text
                variant="display-strong-l"
                onBackground="brand-strong"
              >
                {stat.value}
              </Text>
              {stat.prefix && (
                <Text
                  variant="heading-strong-l"
                  onBackground="brand-medium"
                >
                  {stat.prefix}
                </Text>
              )}
              {stat.suffix && (
                <Text
                  variant="heading-strong-l"
                  onBackground="brand-medium"
                >
                  {stat.suffix}
                </Text>
              )}
            </Row>
            <Text
              variant="body-default-s"
              onBackground="neutral-weak"
              wrap="balance"
            >
              {stat.label}
            </Text>
          </Column>
        ))}
      </Row>
    </RevealFx>
  );
}