'use client';
import React, { useEffect } from 'react';
import gsap from 'gsap';

export default function LoadingComponent() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.dot', { y: -8, repeat: -1, yoyo: true, stagger: 0.12, duration: 0.5 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-primary rounded-full dot" />
      <div className="w-2 h-2 bg-primary rounded-full dot" />
      <div className="w-2 h-2 bg-primary rounded-full dot" />
    </div>
  );
}
