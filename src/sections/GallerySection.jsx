import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { ButtonReveal, LightboxCounter, RevealText } from '../shared/ui';

export default function GallerySection({
  activeSection,
  sectionMotion,
  galleryImages,
  galleryPreviewCount,
}) {
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const navigationLockRef = useRef(false);

  useEffect(() => {
    document.body.classList.toggle('lightbox-open', lightboxOpen);
    return () => document.body.classList.remove('lightbox-open');
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen || !galleryImages.length) {
      return;
    }

    const total = galleryImages.length;
    const preloadIndexes = [lightboxIndex, (lightboxIndex - 1 + total) % total, (lightboxIndex + 1) % total];

    preloadIndexes.forEach((index) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = galleryImages[index].full;
    });
  }, [galleryImages, lightboxIndex, lightboxOpen]);

  const moveLightbox = (direction) => {
    if (navigationLockRef.current || !galleryImages.length) {
      return;
    }

    navigationLockRef.current = true;
    setLightboxIndex((prev) => {
      const total = galleryImages.length;
      return (prev + direction + total) % total;
    });

    window.setTimeout(() => {
      navigationLockRef.current = false;
    }, 140);
  };

  return (
    <>
      <motion.section
        className={`section section-flow gallery ${activeSection === 5 ? 'is-current' : 'is-dimmed'}`}
        data-section-index="5"
        custom={5}
        {...sectionMotion}
      >
        <RevealText as="p" className="map-eyebrow" lines={['Gallery']} />
        <RevealText as="h2" className="section-title" lines={['갤러리']} />
        <motion.div
          className={`grid gallery-grid ${galleryExpanded ? 'is-expanded' : ''}`}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
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
        </motion.div>
        {galleryImages.length > galleryPreviewCount && (
          <ButtonReveal delay={0.12}>
            <button type="button" className="gallery-more-btn" onClick={() => setGalleryExpanded((prev) => !prev)}>
              {galleryExpanded ? '접기' : '더보기'}
            </button>
          </ButtonReveal>
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
          fade: 0,
          swipe: 80,
          navigation: 90,
          easing: {
            fade: 'linear',
            swipe: 'linear',
            navigation: 'linear',
          },
        }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
          controls: () => (
            <div className="lightbox-mobile-nav" aria-hidden={!lightboxOpen}>
              <button type="button" className="lightbox-mobile-arrow" onClick={() => moveLightbox(-1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button type="button" className="lightbox-mobile-arrow" onClick={() => moveLightbox(1)}>
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
