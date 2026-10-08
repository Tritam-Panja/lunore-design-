/**
 * Robust iOS detection recognizing iPhone, iPod, iPad, and iPadOS devices
 * reporting desktop MacIntel platform with multi-touch capability.
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  // Direct iOS devices (iPhone, iPod, legacy iPad)
  const isDirectIOS = /iPhone|iPad|iPod/i.test(ua) || /iPhone|iPad|iPod/i.test(platform);

  // Modern iPadOS (iOS 13+) reporting desktop Safari / MacIntel user agent with touch points
  const isIPadOS = (platform === 'MacIntel' || /Macintosh/i.test(ua)) && maxTouchPoints > 1;

  return isDirectIOS || isIPadOS;
}

/**
 * Robust Android detection recognizing Android phones and tablets.
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  const ua = navigator.userAgent || '';
  return /Android/i.test(ua);
}

/**
 * Checks if the current client is an iOS or Android device (phones & tablets).
 * Preserves desktop platforms as non-mobile.
 */
export function isMobileDevice(): boolean {
  return isIOS() || isAndroid();
}

