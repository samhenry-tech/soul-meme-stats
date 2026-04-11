const forceReveal = false;

export const revealDate = new Date(2026, 3, 12, 0, 0, 0);
const beforeReveal = revealDate > new Date();

export const isHidden =
  process.env.NODE_ENV === "production"
    ? beforeReveal
    : beforeReveal && !forceReveal;
