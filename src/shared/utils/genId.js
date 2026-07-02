/** Generates a collision-resistant unique ID for client-side records. */
export const genId = () =>
  Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
