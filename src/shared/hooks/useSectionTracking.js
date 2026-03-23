const ALWAYS_REVEALED = {
  0: true,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
};

export default function useSectionTracking() {
  return {
    activeSection: 0,
    revealedSections: ALWAYS_REVEALED,
  };
}
