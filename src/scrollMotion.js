import { useReducedMotion } from "framer-motion";

export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export const popIn = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export function useScrollReveal(amount = 0.2) {
  const reduceMotion = useReducedMotion();

  return {
    initial: reduceMotion ? false : "hidden",
    whileInView: "show",
    viewport: { once: true, amount },
  };
}
