import type { ComponentType } from 'react';
import { HelloWorldPage } from './pages/public/HelloWorldPage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registry: Record<string, ComponentType<any>> = {
  HelloWorld: HelloWorldPage,
};
