import { Box } from '@mui/material';
import { HomeHeader } from '../../components/home/HomeHeader';
import { HomeHero } from '../../components/home/HomeHero';
import { ProductsSection } from '../../components/home/ProductsSection';
import { AudienceSection } from '../../components/home/AudienceSection';
import { BenefitsSection } from '../../components/home/BenefitsSection';
import { FaqSection } from '../../components/home/FaqSection';
import { ContactSection } from '../../components/home/ContactSection';
import { HomeFooter } from '../../components/home/HomeFooter';
import { Reveal } from '../../components/home/Reveal';
import type { HomePageProps } from '../../components/home/shared-types';

export function HomePage(props: HomePageProps) {
  return (
    <Box sx={{ bgcolor: '#FAF3EA', minHeight: '100vh' }}>
      <HomeHeader data={props.header} />
      <HomeHero data={props.hero} />
      <Reveal>
        <ProductsSection data={props.products} />
      </Reveal>
      <Reveal>
        <AudienceSection data={props.audience} />
      </Reveal>
      <Reveal>
        <BenefitsSection data={props.benefits} />
      </Reveal>
      <Reveal>
        <FaqSection data={props.faq} />
      </Reveal>
      <Reveal>
        <ContactSection data={props.contact} />
      </Reveal>
      <HomeFooter data={props.footer} />
    </Box>
  );
}
