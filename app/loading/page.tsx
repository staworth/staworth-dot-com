"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoadingAnimation } from '../../src/hooks/useLoadingAnimation';
import SiteFooter from '../../src/components/page-general/SiteFooter';

export default function LoadingPage() {
  const [showImage, setShowImage] = useState(true);
  const router = useRouter();
  useLoadingAnimation(setShowImage, router);

  return (
    <>
      <div id="landing-container">
        {showImage && (
          <video
            id="landing-video"
            src="/logos/staworth.mp4"
            autoPlay
            muted
            playsInline
            loop
          />
        )}
      </div>
      <SiteFooter />
    </>
  );
}
