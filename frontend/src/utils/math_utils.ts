export const safeDiv = (num, den) => {
  if (den === 0) return 0;
  return num / den;
};
