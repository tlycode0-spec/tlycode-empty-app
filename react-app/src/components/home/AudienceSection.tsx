import { Box, Container, Stack, Typography } from '@mui/material';
import type { AudienceData } from './shared-types';

const HERO_BLUE = '#2E73C7';
const CREAM = '#FAF3EA';

export function AudienceSection({ data }: { data?: AudienceData }) {
  if (!data) return null;
  return (
    <Box component="section" sx={{ bgcolor: CREAM, py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1.2} alignItems="center" sx={{ mb: { xs: 4, md: 5 }, textAlign: 'center' }}>
          <Typography
            component="h2"
            sx={{ color: HERO_BLUE, fontWeight: 800, fontSize: { xs: '1.6rem', md: '2rem' } }}
          >
            {data.heading}
          </Typography>
          <Typography sx={{ color: '#444', fontWeight: 700, fontSize: '0.98rem' }}>
            {data.subheading}
          </Typography>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            maxWidth: 1000,
            mx: 'auto',
          }}
        >
          {data.items.map((it) => (
            <Box
              key={it.line1 + it.line2}
              sx={{
                bgcolor: '#fff',
                borderRadius: 3,
                p: { xs: 2, md: 2.5 },
                boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                component="img"
                src={it.icon}
                alt={it.iconAlt}
                loading="lazy"
                decoding="async"
                sx={{ width: { xs: 72, md: 96 }, height: { xs: 72, md: 96 }, objectFit: 'contain' }}
              />
              <Typography
                sx={{
                  color: '#2b2b2b',
                  fontSize: '0.88rem',
                  lineHeight: 1.4,
                  fontWeight: 600,
                }}
              >
                {it.line1}
                <br />
                {it.line2}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
