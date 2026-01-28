import { useEffect } from 'react';

export function useLoadingAnimation(setShowImage: (show: boolean) => void, router: any) {
  useEffect(() => {
    const hideTimeout = setTimeout(() => {
      setShowImage(true);
    }, 2000);
    const redirectTimeout = setTimeout(() => {
      router.replace('/presence');
    }, 2000);
    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [router, setShowImage]);
}
