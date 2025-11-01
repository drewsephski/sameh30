"use client";

import { Column, Row, Text, Badge, BarChart, RevealFx } from "@once-ui-system/core";
import { useState } from "react";

interface Skill {
  name: string;
  level: number; // 0-100
  category: "engineering" | "development" | "analytics" | "operations";
  icon?: string;
}

interface SkillsVisualizationProps {
  skills: Skill[];
  delay?: number;
}

export function SkillsVisualization({ skills, delay = 0 }: SkillsVisualizationProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const categories = [
    { key: "all", label: "All Skills" },
    { key: "engineering", label: "Engineering" },
    { key: "development", label: "Development" },
    { key: "analytics", label: "Analytics" },
    { key: "operations", label: "Operations" }
  ];

  const filteredSkills = selectedCategory === "all" 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const chartData = categories
    .filter(cat => cat.key !== "all")
    .map(category => ({
      category: category.label,
      value: skills
        .filter(skill => skill.category === category.key)
        .reduce((sum, skill) => sum + skill.level, 0) / skills.filter(skill => skill.category === category.key).length || 0
    }));

  return (
    <RevealFx translateY="16" delay={delay}>
      <Column fillWidth gap="xl" paddingY="32">
        <Column horizontal="center" align="center" gap="16">
          <Text variant="heading-strong-l" onBackground="neutral-strong">
            Technical Expertise
          </Text>
          <Text variant="body-default-m" onBackground="neutral-weak" wrap="balance">
            A comprehensive overview of my skills across petroleum engineering, software development, and operations
          </Text>
        </Column>

        {/* Category Filter */}
        <Row fillWidth horizontal="center" gap="12">
          {categories.map(category => (
            <Badge
              key={category.key}
              background={selectedCategory === category.key ? "brand-alpha-medium" : "neutral-alpha-weak"}
              onBackground={selectedCategory === category.key ? "brand-strong" : "neutral-weak"}
              style={{ 
                cursor: "pointer",
                opacity: selectedCategory === category.key ? 1 : 0.7
              }}
            >
              {category.label}
            </Badge>
          ))}
        </Row>

        {/* Skills Chart */}
        {chartData.length > 0 && (
          <Column gap="24">
            <Text variant="heading-default-m" onBackground="neutral-strong">
              Average Skill Level by Category
            </Text>
            <BarChart
              data={chartData}
              series={[
                {
                  key: "value",
                  color: "brand"
                }
              ]}
              title="Skill Proficiency"
              description="Average skill level across different domains"
              axis="x"
              barWidth="l"
            />
          </Column>
        )}

        {/* Individual Skills */}
        <Column gap="24">
          <Text variant="heading-default-m" onBackground="neutral-strong">
            Detailed Skills Breakdown
          </Text>
          <Column gap="16">
            {filteredSkills.map((skill, index) => (
              <RevealFx key={`skill-${skill.name}-${index}`} translateY="8" delay={delay + index * 0.1}>
                <Row fillWidth gap="16" vertical="center">
                  <Column gap="4">
                    <Text variant="label-default-l" onBackground="neutral-strong">
                      {skill.name}
                    </Text>
                    <Badge background="brand-alpha-medium">
                      {skill.category}
                    </Badge>
                  </Column>
                  <Row flex={1} gap="12" vertical="center">
                    <div style={{
                      flex: 1,
                      height: "8px",
                      background: "var(--neutral-alpha-medium)",
                      borderRadius: "var(--radius-m)",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${skill.level}%`,
                        height: "100%",
                        background: "var(--brand-strong)",
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      {skill.level}%
                    </Text>
                  </Row>
                </Row>
              </RevealFx>
            ))}
          </Column>
        </Column>
      </Column>
    </RevealFx>
  );
}