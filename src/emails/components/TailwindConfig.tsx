import { Tailwind } from '@react-email/components';
import React from 'react';

interface ITailwindConfig {
  children: React.ReactNode;
}

export function TailwindConfig({ children }: ITailwindConfig) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: '#940202',
              eerie: {
                black: '#1D1C1D',
              },
            },
          },
        },
      }}
    >
      {children}
    </Tailwind>
  );
}
