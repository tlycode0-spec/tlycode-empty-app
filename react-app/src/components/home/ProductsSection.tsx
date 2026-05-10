import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import type { ProductCard, ProductsData } from './shared-types';

const ORANGE = '#E94E1B';
const GREEN = '#7AB800';
const GRAY = '#9E9E9E';
const CREAM = '#FAF3EA';

function badgeBg(color: ProductCard['badgeColor']): string {
  if (color === 'orange') return ORANGE;
  if (color === 'gray') return GRAY;
  return GREEN;
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function ProductsSection({ data }: { data?: ProductsData }) {
  if (!data) return null;
  return (
    <Box component="section" id="materialy" sx={{ bgcolor: CREAM, py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center" sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography
            component="h2"
            sx={{ color: ORANGE, fontWeight: 800, fontSize: { xs: '1.6rem', md: '2rem' } }}
          >
            {data.heading}
          </Typography>
          <Typography sx={{ color: '#666', maxWidth: 720, fontSize: '0.95rem', lineHeight: 1.6 }}>
            {data.intro}
            <Box
              component="span"
              sx={{ color: ORANGE, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 4 }}
            >
              {data.introHighlight}
            </Box>
            {data.introAfter}
          </Typography>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            maxWidth: 900,
            mx: 'auto',
          }}
        >
          {data.products.map((p) => {
            const external = isExternal(p.ctaHref);
            return (
              <Card
                key={p.title}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  bgcolor: '#fff',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ position: 'relative', bgcolor: '#FFEFD8', aspectRatio: '4/3', overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={p.image}
                    alt={p.imageAlt}
                    loading="lazy"
                    decoding="async"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      filter: p.isComingSoon ? 'grayscale(0.4) opacity(0.85)' : 'none',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      bgcolor: badgeBg(p.badgeColor),
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      px: 1.6,
                      py: 0.5,
                      borderRadius: 999,
                    }}
                  >
                    {p.badge}
                  </Box>
                </Box>
                <Box sx={{ p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1.5 }}>
                  <Typography
                    component="h3"
                    sx={{ fontWeight: 800, color: '#222', fontSize: '1.1rem', lineHeight: 1.3 }}
                  >
                    {p.title}
                  </Typography>
                  <Typography sx={{ color: '#666', fontSize: '0.92rem', lineHeight: 1.6, flexGrow: 1 }}>
                    {p.description}
                  </Typography>
                  {p.isComingSoon ? (
                    <Button
                      disabled
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        borderRadius: 999,
                        py: 1.1,
                        mt: 1,
                        fontWeight: 700,
                        '&.Mui-disabled': {
                          bgcolor: '#E0E0E0',
                          color: '#888',
                        },
                      }}
                    >
                      ⏳ {p.ctaLabel}
                    </Button>
                  ) : (
                    <Button
                      href={p.ctaHref}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ borderRadius: 999, py: 1.1, mt: 1, fontWeight: 700 }}
                    >
                      🛒 {p.ctaLabel}
                    </Button>
                  )}
                </Box>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
