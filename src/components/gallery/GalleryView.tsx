"use client";

import { useState } from "react";
import { MasonryGrid } from "@once-ui-system/core";
import Image from "next/image";
import GalleryModal from "./GalleryModal";
import { gallery } from "@/resources";

export default function GalleryView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === gallery.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? gallery.images.length - 1 : prev - 1
    );
  };

  return (
    <>
      <MasonryGrid columns={2} s={{ columns: 1 }}>
        {gallery.images.map((image, index) => (
          <div 
            key={`gallery-${index}-${image.src}`}
            className="gallery-image-wrapper"
            onClick={() => handleImageClick(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={400}
              height={300}
              className="gallery-thumbnail-image"
              style={{
                aspectRatio: image.orientation === "horizontal" ? "16 / 9" : "3 / 4",
                objectFit: "cover",
                borderRadius: "var(--radius-m, 8px)",
                cursor: "pointer",
              }}
              priority={index < 10}
              loading={index < 10 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </MasonryGrid>

      <GalleryModal
        images={gallery.images}
        isOpen={isModalOpen}
        currentIndex={currentImageIndex}
        onClose={handleCloseModal}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
      />
    </>
  );
}
