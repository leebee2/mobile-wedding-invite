import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { LightboxCounter } from '../shared/ui';

export default function GallerySection({
  activeSection,
  sectionMotion,
  galleryImages,
  galleryPreviewCount,
}) {
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const lightboxControllerRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('lightbox-open', lightboxOpen);
    return () => document.body.classList.remove('lightbox-open');
  }, [lightboxOpen]);

  return (
    <>
      <motion.section
        className={`section section-flow gallery ${activeSection === 4 ? 'is-current' : 'is-dimmed'}`}
        data-section-index="4"
        custom={5}
        {...sectionMotion}
      >
        <p className="map-eyebrow">Gallery</p>
        <h2>갤러리</h2>
        <div className={`grid gallery-grid ${galleryExpanded ? 'is-expanded' : ''}`}>
          {(galleryExpanded ? galleryImages : galleryImages.slice(0, galleryPreviewCount)).map((image, idx) => (
            <button
              key={image.full}
              type="button"
              className="gallery-item"
              onClick={() => {
                const sourceIndex = galleryImages.findIndex((entry) => entry.full === image.full);
                setLightboxIndex(sourceIndex);
                setLightboxOpen(true);
              }}
            >
              <img
                src={image.thumb}
                alt={`웨딩 사진 ${idx + 1}`}
                loading="lazy"
                fetchPriority="low"
                decoding="async"
              />
            </button>
          ))}
        </div>
        {galleryImages.length > galleryPreviewCount && (
          <button type="button" className="gallery-more-btn" onClick={() => setGalleryExpanded((prev) => !prev)}>
            {galleryExpanded ? '접기' : '더보기'}
          </button>
        )}
      </motion.section>
      <LightboxCounter open={lightboxOpen} index={lightboxIndex} total={galleryImages.length} />
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryImages.map((image) => ({ src: image.full }))}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        carousel={{ padding: 0, spacing: 0, preload: 1, imageFit: 'contain' }}
        animation={{
          fade: 120,
          swipe: 180,
          navigation: 180,
          easing: {
            fade: 'ease-out',
            swipe: 'ease-out',
            navigation: 'ease-out',
          },
        }}
        controller={{ ref: lightboxControllerRef }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
          controls: () => (
            <div className="lightbox-mobile-nav" aria-hidden={!lightboxOpen}>
              <button type="button" className="lightbox-mobile-arrow" onClick={() => lightboxControllerRef.current?.prev()}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button type="button" className="lightbox-mobile-arrow" onClick={() => lightboxControllerRef.current?.next()}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          ),
        }}
      />
    </>
  );
}
