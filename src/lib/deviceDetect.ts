export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    || window.innerWidth < 768;
};

export const isLowEndDevice = () => {
  if (typeof window === 'undefined') return false;
  // @ts-ignore - navigator.deviceMemory is not in standard TS lib
  const memory = navigator?.deviceMemory;
  const cores = navigator?.hardwareConcurrency;
  return (memory && memory < 4) || (cores && cores < 4);
};

export const getDeviceProfile = () => {
  if (isLowEndDevice()) return 'low';
  if (isMobileDevice()) return 'mid';
  return 'high';
};
