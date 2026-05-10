export interface NavLink {
  label: string;
  href: string;
  highlight?: boolean;
}

export interface HeaderData {
  logo: string;
  logoAlt: string;
  brandName: string;
  links: NavLink[];
}

export interface HeroData {
  image: string;
  imageAlt: string;
  headingBefore: string;
  headingHighlight: string;
  headingAfter: string;
  subheading: string;
  note: string;
  ctaLabel: string;
  ctaHref: string;
  badges: string[];
  quote: string;
}

export interface ProductCard {
  image: string;
  imageAlt: string;
  badge: string;
  badgeColor: 'orange' | 'green' | 'gray';
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  isComingSoon?: boolean;
}

export interface ProductsData {
  heading: string;
  intro: string;
  introHighlight: string;
  introAfter: string;
  products: ProductCard[];
}

export interface AudienceItem {
  icon: string;
  iconAlt: string;
  line1: string;
  line2: string;
}

export interface AudienceData {
  heading: string;
  subheading: string;
  items: AudienceItem[];
}

export interface BenefitsData {
  heading: string;
  intro: string;
  bullets: string[];
  image: string;
  imageAlt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqData {
  heading: string;
  items: FaqItem[];
}

export interface ContactData {
  instagramHandle: string;
  instagramUrl: string;
  email: string;
  linktreeLabel?: string;
  linktreeUrl?: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterData {
  links: FooterLink[];
  copyright: string;
}

export interface HomePageProps {
  header: HeaderData;
  hero: HeroData;
  products: ProductsData;
  audience: AudienceData;
  benefits: BenefitsData;
  faq: FaqData;
  contact: ContactData;
  footer: FooterData;
}
