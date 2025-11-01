"use client";

import {
    Avatar,
    Button,
    Column,
    Heading,
    Icon,
    IconButton,
    Media,
    Tag,
    Text,
    Row,
} from "@once-ui-system/core";
import { about, person, social } from "@/resources";
import GalleryModal from "@/components/gallery/GalleryModal";
import React, { useState, useEffect } from "react";

export default function AboutClient() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [aboutImages, setAboutImages] = useState<Array<{ src: string, alt: string }>>([]);

    // Collect all images from the about page
    useEffect(() => {
        const images: Array<{ src: string, alt: string }> = [];

        // Add work experience images
        for (const experience of about.work.experiences) {
            if (experience.images) {
                for (const image of experience.images) {
                    images.push({
                        src: image.src,
                        alt: image.alt,
                    });
                }
            }
        }

        // Add technical skills images
        for (const skill of about.technical.skills) {
            if (skill.images) {
                for (const image of skill.images) {
                    images.push({
                        src: image.src,
                        alt: image.alt,
                    });
                }
            }
        }

        setAboutImages(images);
    }, []);

    const handleImageClick = (imageSrc: string) => {
        const imageIndex = aboutImages.findIndex(img => img.src === imageSrc);
        if (imageIndex !== -1) {
            setCurrentImageIndex(imageIndex);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === aboutImages.length - 1 ? 0 : prev + 1
        );
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? aboutImages.length - 1 : prev - 1
        );
    };

    return (
        <>
            <Row fillWidth s={{ direction: "column" }} horizontal="center">
                {about.avatar.display && (
                    <Column
                        className="avatar"
                        top="64"
                        fitHeight
                        position="sticky"
                        s={{ position: "relative", style: { top: "auto" } }}
                        xs={{ style: { top: "auto" } }}
                        minWidth="160"
                        paddingX="l"
                        paddingBottom="xl"
                        gap="m"
                        flex={3}
                        horizontal="center"
                    >
                        <Avatar src={person.avatar} size="xl" />
                        <Row gap="8" vertical="center">
                            <Icon onBackground="accent-weak" name="globe" />
                            {person.location}
                        </Row>
                        {person.languages && person.languages.length > 0 && (
                            <Row wrap gap="8">
                                {person.languages.map((language, index) => (
                                    <Tag key={`language-${language}-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                        index}`} size="l">
                                        {language}
                                    </Tag>
                                ))}
                            </Row>
                        )}
                    </Column>
                )}
                <Column className="blockAlign" flex={9} maxWidth={40}>
                    <Column
                        id={about.intro.title}
                        fillWidth
                        minHeight="160"
                        vertical="center"
                        marginBottom="32"
                    >
                        {about.calendar.display && (
                            <Row
                                fitWidth
                                border="brand-alpha-medium"
                                background="brand-alpha-weak"
                                radius="full"
                                padding="4"
                                gap="8"
                                marginBottom="m"
                                vertical="center"
                                className="blockAlign"
                                style={{
                                    backdropFilter: "blur(var(--static-space-1))",
                                }}
                            >
                                <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
                                <Row paddingX="8">Schedule a call</Row>
                                <IconButton
                                    href={about.calendar.link}
                                    data-border="rounded"
                                    variant="secondary"
                                    icon="chevronRight"
                                />
                            </Row>
                        )}
                        <Heading className="textAlign" variant="display-strong-xl">
                            {person.name}
                        </Heading>
                        <Text
                            className="textAlign"
                            variant="display-default-xs"
                            onBackground="neutral-weak"
                        >
                            {person.role}
                        </Text>
                        {social.length > 0 && (
                            <Row
                                className="blockAlign"
                                paddingTop="20"
                                paddingBottom="8"
                                gap="8"
                                wrap
                                horizontal="center"
                                fitWidth
                                data-border="rounded"
                            >
                                {social.map(
                                    (item) =>
                                        item.link && (
                                            <React.Fragment key={`social-${item.name}`}>
                                                <Row s={{ hide: true }}>
                                                    <Button
                                                        key={item.name}
                                                        href={item.link}
                                                        prefixIcon={item.icon}
                                                        label={item.name}
                                                        size="s"
                                                        weight="default"
                                                        variant="secondary"
                                                    />
                                                </Row>
                                                <Row hide s={{ hide: false }}>
                                                    <IconButton
                                                        size="l"
                                                        key={`${item.name}-icon`}
                                                        href={item.link}
                                                        icon={item.icon}
                                                        variant="secondary"
                                                    />
                                                </Row>
                                            </React.Fragment>
                                        ),
                                )}
                            </Row>
                        )}
                    </Column>

                    {about.intro.display && (
                        <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
                            {about.intro.description}
                        </Column>
                    )}

                    {about.work.display && (
                        <>
                            <Heading as="h2" id={about.work.title} variant="display-strong-s" marginBottom="m">
                                {about.work.title}
                            </Heading>
                            <Column fillWidth gap="l" marginBottom="40">
                                {about.work.experiences.map((experience, index) => (
                                    <Column key={`experience-${experience.company}-${experience.role}-${index}`} fillWidth>
                                        <Row fillWidth horizontal="between" vertical="end" marginBottom="4">
                                            <Text id={experience.company} variant="heading-strong-l">
                                                {experience.company}
                                            </Text>
                                            <Text variant="heading-default-xs" onBackground="neutral-weak">
                                                {experience.timeframe}
                                            </Text>
                                        </Row>
                                        <Text variant="body-default-s" onBackground="brand-weak" marginBottom="m">
                                            {experience.role}
                                        </Text>
                                        <Column as="ul" gap="16">
                                            {experience.achievements.map(
                                                (achievement: React.ReactNode, index: number) => (
                                                    <Text
                                                        as="li"
                                                        variant="body-default-m"
                                                        key={`achievement-${experience.company}-${index}`}
                                                    >
                                                        {achievement}
                                                    </Text>
                                                ),
                                            )}
                                        </Column>
                                        {experience.images && experience.images.length > 0 && (
                                            <Row fillWidth paddingTop="m" paddingLeft="40" gap="12" wrap>
                                                {experience.images.map((image, index) => (
                                                    <button
                                                        key={`experience-${image.src}-${index}`}
                                                        type="button"
                                                        className="gallery-image-wrapper"
                                                        onClick={() => handleImageClick(image.src)}
                                                        aria-label={`View larger image: ${image.alt}`}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                            margin: 0,
                                                            cursor: 'pointer',
                                                            display: 'contents'
                                                        }}
                                                    >
                                                        <Row
                                                            border="neutral-medium"
                                                            radius="m"
                                                            minWidth={image.width}
                                                            height={image.height}
                                                        >
                                                            <Media
                                                                enlarge
                                                                radius="m"
                                                                sizes={image.width.toString()}
                                                                alt={image.alt}
                                                                src={image.src}
                                                            />
                                                        </Row>
                                                    </button>
                                                ))}
                                            </Row>
                                        )}
                                    </Column>
                                ))}
                            </Column>
                        </>
                    )}

                    {about.studies.display && (
                        <>
                            <Heading as="h2" id={about.studies.title} variant="display-strong-s" marginBottom="m">
                                {about.studies.title}
                            </Heading>
                            <Column fillWidth gap="l" marginBottom="40">
                                {about.studies.institutions.map((institution, index) => (
                                    <Column key={`institution-${institution.name}-${index}`} fillWidth gap="4">
                                        <Text id={institution.name} variant="heading-strong-l">
                                            {institution.name}
                                        </Text>
                                        <Text variant="heading-default-xs" onBackground="neutral-weak">
                                            {institution.description}
                                        </Text>
                                    </Column>
                                ))}
                            </Column>
                        </>
                    )}

                    {about.technical.display && (
                        <>
                            <Heading
                                as="h2"
                                id={about.technical.title}
                                variant="display-strong-s"
                                marginBottom="40"
                            >
                                {about.technical.title}
                            </Heading>
                            <Column fillWidth gap="l">
                                {about.technical.skills.map((skill, index) => (
                                    <Column key={`skill-${skill.title}-${index}`} fillWidth gap="4">
                                        <Text id={skill.title} variant="heading-strong-l">
                                            {skill.title}
                                        </Text>
                                        <Text variant="body-default-m" onBackground="neutral-weak">
                                            {skill.description}
                                        </Text>
                                        {skill.tags && skill.tags.length > 0 && (
                                            <Row wrap gap="8" paddingTop="8">
                                                {skill.tags.map((tag, tagIndex) => (
                                                    <Tag key={`tag-${skill.title}-${tag.name}-${tagIndex}`} size="l" prefixIcon={tag.icon}>
                                                        {tag.name}
                                                    </Tag>
                                                ))}
                                            </Row>
                                        )}
                                        {skill.images && skill.images.length > 0 && (
                                            <Row fillWidth paddingTop="m" gap="12" wrap>
                                                {skill.images.map((image, index) => (
                                                    <button
                                                        key={`skill-${image.src}-${index}`}
                                                        type="button"
                                                        className="gallery-image-wrapper"
                                                        onClick={() => handleImageClick(image.src)}
                                                        aria-label={`View larger image: ${image.alt}`}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                            margin: 0,
                                                            cursor: 'pointer',
                                                            display: 'contents'
                                                        }}
                                                    >
                                                        <Row
                                                            border="neutral-medium"
                                                            radius="m"
                                                            minWidth={image.width}
                                                            height={image.height}
                                                        >
                                                            <Media
                                                                enlarge
                                                                radius="m"
                                                                sizes={image.width.toString()}
                                                                alt={image.alt}
                                                                src={image.src}
                                                            />
                                                        </Row>
                                                    </button>
                                                ))}
                                            </Row>
                                        )}
                                    </Column>
                                ))}
                            </Column>
                        </>
                    )}
                </Column>
            </Row>

            <GalleryModal
                images={aboutImages}
                isOpen={isModalOpen}
                currentIndex={currentImageIndex}
                onClose={handleCloseModal}
                onNext={handleNextImage}
                onPrevious={handlePreviousImage}
            />
        </>
    );
}