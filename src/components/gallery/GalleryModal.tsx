"use client";

import { useState } from "react";
import { Flex } from "@once-ui-system/core";
import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
  orientation?: string;
}

interface GalleryModalProps {
  images: GalleryImage[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function GalleryModal({
  images,
  isOpen,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}: GalleryModalProps) {
  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      className="gallery-modal-overlay"
      onClick={onClose}
      data-enlarge-overlay
    >
      <div 
        className="gallery-modal-container"
        onClick={(e) => e.stopPropagation()}
        data-enlarge
      >
        <button 
          type="button"
          className="gallery-modal-close"
          onClick={onClose}
          data-enlarge-close
          aria-label="Close modal"
        >
          ×
        </button>
        
        <button 
          type="button"
          className="gallery-modal-nav gallery-modal-prev"
          onClick={onPrevious}
          aria-label="Previous image"
        >
          ‹
        </button>
        
        <div className="gallery-modal-image-container">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={800}
            height={600}
            className="gallery-modal-image"
            priority
            unoptimized={false}
          />
        </div>
        
        <button 
          type="button"
          className="gallery-modal-nav gallery-modal-next"
          onClick={onNext}
          aria-label="Next image"
        >
          ›
        </button>
      </div>
    </div>
  );
}