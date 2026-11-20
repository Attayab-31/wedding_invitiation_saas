'use client';

import React from 'react';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return <div className="smooth-scroll-wrapper h-full w-full overflow-hidden">{children}</div>;
}
