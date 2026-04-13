import type { ComponentType } from 'react';
import { Hello } from './pages/public/LandingPage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registry: Record<string, ComponentType<any>> = {
  Hello: Hello,
};
