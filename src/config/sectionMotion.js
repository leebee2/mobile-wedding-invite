export const sectionMotion = {
  variants: {
    hidden: { opacity: 0, y: 22 },
    visible: (idx) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.62, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] },
    }),
  },
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.08 },
};
