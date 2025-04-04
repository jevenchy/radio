export const formatDuration = (ms) => {
  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / 60000) % 60;
  const hr = Math.floor(ms / 3600000);
  return [hr, min, sec].map(n => String(n).padStart(2, '0')).join(':');
};
