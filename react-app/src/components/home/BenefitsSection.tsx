import { Box, Container, Stack, Typography } from '@mui/material';
import type { BenefitsData } from './shared-types';

const GREEN = '#5E8F00';
const CREAM = '#FAF3EA';

export function BenefitsSection({ data }: { data?: BenefitsData }) {
  if (!data) return null;
  return (
    <Box component="section" sx={{ bgcolor: CREAM, py: { xs: 5, md: 9 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 4, md: 6 },
            alignItems: 'center',
          }}
        >
          <Stack spacing={2.5}>
            <Typography
              component="h2"
              sx={{ color: GREEN, fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.9rem' }, lineHeight: 1.2 }}
            >
              {data.heading}
            </Typography>
            <Typography sx={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6 }}>{data.intro}</Typography>
            <Stack spacing={1.4}>
              {data.bullets.map((b) => (
                <Stack key={b} direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: '#7AB800',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      flexShrink: 0,
                      fontSize: '0.78rem',
                    }}
                  >
                    ✓
                  </Box>
                  <Typography sx={{ color: '#3a3a3a', fontSize: '0.95rem' }}>{b}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
          <Box
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 10px 32px rgba(0,0,0,0.1)',
              aspectRatio: { xs: '4/3', md: '4/5' },
              maxHeight: 520,
            }}
          >
            <Box
              component="img"
              src={data.image}
              alt={data.imageAlt}
              loading="lazy"
              decoding="async"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
