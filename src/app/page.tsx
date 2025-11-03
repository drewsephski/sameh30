import {
  Heading,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Schema,
  Meta,
  Line,
} from "@once-ui-system/core";
import { home, about, person, baseURL, routes } from "@/resources";
import { Mailchimp } from "@/components";
import { Projects } from "@/components/work/Projects";
import { Posts } from "@/components/blog/Posts";
import { CareerTimeline } from "@/components/enhanced/CareerTimeline";
import { sampleTimeline, sampleStats } from "@/components/enhanced/sampleData";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-l">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
            <Button
              id="about"
              data-border="rounded"
              href={about.path}
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
            >
              <Row gap="8" vertical="center" paddingRight="4">
                {about.avatar.display && (
                  <Avatar
                    marginRight="8"
                    style={{ marginLeft: "-0.75rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                {about.title}
              </Row>
            </Button>
          </RevealFx>
        </Column>
      </Column>

      {/* Featured Project */}
      <RevealFx translateY="16" delay={1.2}>
        <Projects range={[1, 1]} />
      </RevealFx>

      {/* Field Production Engineering */}
      <RevealFx translateY="16" delay={1.3}>
        <Column fillWidth gap="24" marginY="xl">
          <Row fillWidth paddingRight="64">
            <Line maxWidth={48} />
          </Row>
          <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
            <Row flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" variant="display-strong-xs" wrap="balance">
                Field Production Engineering
              </Heading>
            </Row>
            <Row flex={3} paddingX="20">
              <Column gap="16">
                <Text
                  wrap="balance"
                  onBackground="neutral-strong"
                  variant="heading-default-m"
                >
                  Specialized expertise in optimizing production operations across complex energy systems
                </Text>
                <Column gap="12">
                  <Row gap="8" vertical="center">
                    <Badge
                      background="brand-alpha-weak"
                      paddingX="12"
                      paddingY="4"
                      onBackground="neutral-strong"
                      textVariant="label-default-s"
                    >
                      Facilities Engineering
                    </Badge>
                    <Text
                      onBackground="neutral-weak"
                      variant="body-default-s"
                    >
                      Design and optimization of production facilities and infrastructure systems
                    </Text>
                  </Row>
                  <Row gap="8" vertical="center">
                    <Badge
                      background="brand-alpha-weak"
                      paddingX="12"
                      paddingY="4"
                      onBackground="neutral-strong"
                      textVariant="label-default-s"
                    >
                      Production Assurance
                    </Badge>
                    <Text
                      onBackground="neutral-weak"
                      variant="body-default-s"
                    >
                      Ensuring operational reliability and maximizing production efficiency
                    </Text>
                  </Row>
                  <Row gap="8" vertical="center">
                    <Badge
                      background="brand-alpha-weak"
                      paddingX="12"
                      paddingY="4"
                      onBackground="neutral-strong"
                      textVariant="label-default-s"
                    >
                      Production Support
                    </Badge>
                    <Text
                      onBackground="neutral-weak"
                      variant="body-default-s"
                    >
                      Technical expertise and problem-solving for production teams and operations
                    </Text>
                  </Row>
                  <Row gap="8" vertical="center">
                    <Badge
                      background="brand-alpha-weak"
                      paddingX="12"
                      paddingY="4"
                      onBackground="neutral-strong"
                      textVariant="label-default-s"
                    >
                      Technical Optimization
                    </Badge>
                    <Text
                      onBackground="neutral-weak"
                      variant="body-default-s"
                    >
                      Data-driven solutions for production performance enhancement and cost optimization
                    </Text>
                  </Row>
                </Column>
              </Column>
            </Row>
          </Row>
          <Row fillWidth paddingLeft="64" horizontal="end">
            <Line maxWidth={48} />
          </Row>
        </Column>
      </RevealFx>


      {/* Blog Section */}
      {routes["/blog"] && (
        <Column fillWidth gap="24" marginBottom="l">
          <Row fillWidth paddingRight="64">
            <Line maxWidth={48} />
          </Row>
          <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
            <Row flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" variant="display-strong-xs" wrap="balance">
                Latest from the blog
              </Heading>
            </Row>
            <Row flex={3} paddingX="20">
              <Posts range={[1, 2]} columns="2" />
            </Row>
          </Row>
          <Row fillWidth paddingLeft="64" horizontal="end">
            <Line maxWidth={48} />
          </Row>
        </Column>
      )}
      <CareerTimeline timeline={sampleTimeline} delay={1.4} />

      {/* Additional Projects */}
      <Projects range={[2]} />

      {/* Newsletter Signup */}
      <Mailchimp />
    </Column>
  );
}
