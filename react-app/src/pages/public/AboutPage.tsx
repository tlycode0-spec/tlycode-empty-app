import { Box, Container, Stack, Typography } from '@mui/material';
import { HomeHeader } from '../../components/home/HomeHeader';
import { HomeFooter } from '../../components/home/HomeFooter';
import { ContactSection } from '../../components/home/ContactSection';
import type { AboutPageProps } from '../../components/legal/legal-types';

const HERO_BLUE = '#2E73C7';
const ORANGE = '#E94E1B';

export function AboutPage(props: AboutPageProps) {
  return (
    <Box sx={{ bgcolor: '#FAF3EA', minHeight: '100vh' }}>
      <HomeHeader data={props.header} />
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 4 }, pb: 0 }}>
        <Box
          component="a"
          href={props.backHref}
          sx={{
            display: 'inline-block',
            color: ORANGE,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {props.backLabel}
        </Box>
      </Container>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography
          component="h1"
          sx={{
            color: HERO_BLUE,
            fontWeight: 800,
            fontSize: { xs: '1.9rem', md: '2.4rem' },
            textAlign: 'center',
            mb: { xs: 3, md: 4 },
          }}
        >
          {props.pageTitle}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1.1fr' },
            gap: { xs: 3, md: 5 },
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
              aspectRatio: '3/4',
              maxHeight: 540,
              mx: { xs: 'auto', md: 0 },
              width: '100%',
              maxWidth: 420,
            }}
          >
            <Box
              component="img"
              src={props.hero.image}
              alt={props.hero.imageAlt}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </Box>
          <Stack spacing={2.5}>
            <Typography
              sx={{
                color: '#444',
                fontStyle: 'italic',
                fontSize: { xs: '1.05rem', md: '1.2rem' },
                lineHeight: 1.5,
                borderLeft: `3px solid ${ORANGE}`,
                pl: 2,
              }}
            >
              {props.hero.quote}
            </Typography>
            <Typography
              sx={{ color: HERO_BLUE, fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.3rem' } }}
            >
              {props.hero.intro}
            </Typography>
          </Stack>
        </Box>
      </Container>
      <Box sx={{ bgcolor: '#fff', py: { xs: 5, md: 7 } }}>
        <Container maxWidth="md">
          <Typography
            component="h2"
            sx={{
              color: ORANGE,
              fontWeight: 800,
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              mb: { xs: 2.5, md: 3.5 },
            }}
          >
            {props.body.heading}
          </Typography>
          <Stack spacing={2}>
            {props.body.paragraphs.map((p, i) => (
              <Typography
                key={i}
                sx={{ color: '#3a3a3a', fontSize: { xs: '1rem', md: '1.05rem' }, lineHeight: 1.75 }}
              >
                {p}
              </Typography>
            ))}
          </Stack>
          <Typography
            sx={{
              color: HERO_BLUE,
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              textAlign: 'right',
              mt: { xs: 4, md: 5 },
            }}
          >
            {props.body.signature}
          </Typography>
        </Container>
      </Box>
      <ContactSection data={props.contact} />
      <HomeFooter data={props.footer} />
    </Box>
  );
}
