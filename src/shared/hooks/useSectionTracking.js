import { useEffect, useState } from 'react';

export default function useSectionTracking() {
  const [activeSection, setActiveSection] = useState(0);
  const [revealedSections, setRevealedSections] = useState({ 0: true });

  useEffect(() => {
    setRevealedSections((prev) => (prev[activeSection] ? prev : { ...prev, [activeSection]: true }));
  }, [activeSection]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('.section[data-section-index]'));
    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }
        if (best) {
          setActiveSection(Number(best.target.getAttribute('data-section-index')));
        }
      },
      { threshold: [0.08, 0.18, 0.3] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return { activeSection, revealedSections };
}
