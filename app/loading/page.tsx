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
          <img
            id="landing-image"
            src="/logos/Staworth_103_30_Black_Close.png"
            alt="Staworth Logo"
            style={{ display: 'block' }}
          />
        )}
      </div>
      <SiteFooter />
    </>
  );
}
