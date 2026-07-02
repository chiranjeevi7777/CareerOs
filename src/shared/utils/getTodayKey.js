/** Returns today's date as an ISO key string: "YYYY-MM-DD". */
export const getTodayKey = () => new Date().toISOString().split('T')[0];
