"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  value: number;
  className?: string;
  format?: (n: number) => string;
};

/**
 * Compteur animé — ressort doux vers la valeur cible.
 */
export function NumberTicker({ value, className, format }: Props) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 18, mass: 0.6 });
  const display = useTransform(spring, (v) => {
    const rounded = Math.round(v);
    return format ? format(rounded) : rounded.toLocaleString("fr-FR");
  });
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      mv.set(value * 0.3);
      first.current = false;
    }
    mv.set(value);
  }, [value, mv]);

  return <motion.span className={className}>{display}</motion.span>;
}
