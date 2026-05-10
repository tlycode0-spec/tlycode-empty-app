import { Box, Button, Container, Stack, Typography } from '@mui/material';
import type { HeroData } from './shared-types';

const HERO_BLUE = '#2E73C7';
const ORANGE = '#FFB454';
const CREAM = '#FAF3EA';

export function HomeHero({ data }: { data?: HeroData }) {
  if (!data) return null;
  return (
    <Box component="section" sx={{ bgcolor: CREAM, position: 'relative', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: 560, sm: 600, md: 660 },
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Box
          component="img"
          src={data.image}
          alt={data.imageAlt}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: { xs: '70% center', md: 'center' },
            display: 'block',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 32%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0) 85%)',
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            pb: { xs: 4, md: 6 },
            pt: { xs: 6, md: 8 },
            color: '#fff',
          }}
        >
          <Stack spacing={{ xs: 2.2, md: 3 }} sx={{ maxWidth: 760 }}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.1rem', sm: '2.6rem', md: '3.4rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.5px',
                color: '#fff',
                textShadow: '0 2px 14px rgba(0,0,0,0.35)',
              }}
            >
              {data.headingBefore}
              <Box component="span" sx={{ color: ORANGE }}>
                {data.headingHighlight}
              </Box>
              {data.headingAfter}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 2.5 }} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Button
                href={data.ctaHref}
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  borderRadius: 999,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 12px 28px rgba(233,78,27,0.45)',
                }}
              >
                {data.ctaLabel}
              </Button>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.6, sm: 2 }} sx={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, opacity: 0.92 }}>
                {data.badges.map((b) => (
                  <Stack key={b} direction="row" alignItems="center" spacing={0.6}>
                    <Box component="span" sx={{ color: ORANGE, fontSize: '1rem' }}>★</Box>
                    <Box component="span">{b}</Box>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pt: { xs: 4, md: 5 }, pb: { xs: 3, md: 4 }, textAlign: 'center' }}>
        <Typography
          component="h2"
          sx={{
            color: HERO_BLUE,
            fontWeight: 700,
            fontSize: { xs: '1.05rem', md: '1.2rem' },
            maxWidth: 720,
            mx: 'auto',
            mb: 1.5,
          }}
        >
          {data.subheading}
        </Typography>
        <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>{data.note}</Typography>
      </Container>
      <Container maxWidth="sm" sx={{ pb: { xs: 4, md: 6 } }}>
        <Typography
          sx={{
            color: '#888',
            fontStyle: 'italic',
            textAlign: 'center',
            fontSize: '0.95rem',
            lineHeight: 1.5,
          }}
        >
          {data.quote}
        </Typography>
      </Container>
    </Box>
  );
}
