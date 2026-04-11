const forceReveal = true;

export const revealDate = new Date(2026, 3, 12, 0, 0, 0);
export const isHidden = revealDate > new Date() && !forceReveal;
