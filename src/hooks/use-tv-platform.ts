import { useEffect, useState } from 'react';

export type TVPlatform = 'androidtv' | 'tizen' | 'webos' | 'browser';

export function useTVPlatform() {
  const [platform, setPlatform] = useState<TVPlatform>('browser');

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('tizen')) {
      setPlatform('tizen');
    } else if (userAgent.includes('webos')) {
      setPlatform('webos');
    } else if (userAgent.includes('android tv') || userAgent.includes('androidtv')) {
      setPlatform('androidtv');
    }
  }, []);

  const isTVPlatform = platform !== 'browser';
  const isAndroidTV = platform === 'androidtv';
  const isTizen = platform === 'tizen';
  const isWebOS = platform === 'webos';

  return {
    platform,
    isTVPlatform,
    isAndroidTV,
    isTizen,
    isWebOS
  };
}