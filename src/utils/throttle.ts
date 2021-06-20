export function throttle<T extends (...args: any[]) => void>(func: T, timeFrame: number): T {
  let lastTime = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= timeFrame) {
      func(...args);
      lastTime = now;
    }
  }) as T;
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate = false): T {
  let timeout: NodeJS.Timeout | null;
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func(...args);
    }, wait);
    if (immediate && !timeout) func(...args);
  }) as T;
}
