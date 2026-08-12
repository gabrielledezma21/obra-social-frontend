export const sleepIfLocal = async (ms) => {
  if (window.location.hostname === 'localhost') {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  return Promise.resolve();
};
