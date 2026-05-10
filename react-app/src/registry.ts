import type { ComponentType } from 'react';
import { HelloWorldPage } from './pages/public/HelloWorldPage';
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { LegalPage } from './pages/public/LegalPage';
import { MaterialsPage } from './pages/public/MaterialsPage';
import { MaterialDetailPage } from './pages/public/MaterialDetailPage';
import { FreeSamplePage } from './pages/public/FreeSamplePage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registry: Record<string, ComponentType<any>> = {
  HelloWorld: HelloWorldPage,
  HomePage: HomePage,
  AboutPage: AboutPage,
  LegalPage: LegalPage,
  MaterialsPage: MaterialsPage,
  MaterialDetailPage: MaterialDetailPage,
  FreeSamplePage: FreeSamplePage,
};
