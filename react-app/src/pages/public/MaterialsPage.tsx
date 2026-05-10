import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import { HomeHeader } from '../../components/home/HomeHeader';
import { HomeFooter } from '../../components/home/HomeFooter';
import { ContactSection } from '../../components/home/ContactSection';
import { Reveal } from '../../components/home/Reveal';
import type { MaterialsPageProps, MaterialItem } from '../../components/materials/materials-types';

const HERO_BLUE = '#2E73C7';
const ORANGE = '#E94E1B';
const GREEN = '#7AB800';
const GRAY = '#9E9E9E';
const CREAM = '#FAF3EA';

function badgeBg(color: MaterialItem['badgeColor']): string {
  if (color === 'orange') return ORANGE;
  if (color === 'blue') return HERO_BLUE;
  if (color === 'gray') return GRAY;
  return GREEN;
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function MaterialsPage(props: MaterialsPageProps) {
  return (
    <Box sx={{ bgcolor: CREAM, minHeight: '100vh' }}>
      <HomeHeader data={props.header} />
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 4 }, pb: 0 }}>
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
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, textAlign: 'center' }}>
        <Typography
          component="h1"
          sx={{
            color: HERO_BLUE,
            fontWeight: 800,
            fontSize: { xs: '1.9rem', md: '2.4rem' },
            mb: { xs: 2, md: 2.5 },
          }}
        >
          {props.hero.title}
        </Typography>
        <Typography
          sx={{
            color: '#3a3a3a',
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.7,
            maxWidth: 680,
            mx: 'auto',
            mb: 2,
          }}
        >
          {props.hero.intro}
        </Typography>
        <Typography
          sx={{
            color: '#666',
            fontStyle: 'italic',
            fontSize: '0.95rem',
            maxWidth: 620,
            mx: 'auto',
          }}
        >
          {props.hero.note}
        </Typography>
      </Container>
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            maxWidth: 1000,
            mx: 'auto',
          }}
        >
          {props.items.map((item) => {
            const external = isExternal(item.ctaHref);
            return (
              <Reveal key={item.title}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: '#fff',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <Box sx={{ position: 'relative', bgcolor: '#FFEFD8', aspectRatio: '4/3', overflow: 'hidden' }}>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.imageAlt}
                      loading="lazy"
                      decoding="async"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        filter: item.isComingSoon ? 'grayscale(0.4) opacity(0.85)' : 'none',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        bgcolor: badgeBg(item.badgeColor),
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        px: 1.6,
                        py: 0.5,
                        borderRadius: 999,
                      }}
                    >
                      {item.badge}
                    </Box>
                  </Box>
                  <Box sx={{ p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1.5 }}>
                    <Typography
                      component="h3"
                      sx={{ fontWeight: 800, color: '#222', fontSize: '1.1rem', lineHeight: 1.3 }}
                    >
                      {item.title}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
                      <Box
                        sx={{
                          bgcolor: '#FFEFD8',
                          color: ORANGE,
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          px: 1.2,
                          py: 0.4,
                          borderRadius: 999,
                        }}
                      >
                        {item.ageRange}
                      </Box>
                      <Box
                        sx={{
                          bgcolor: '#E8F4FF',
                          color: HERO_BLUE,
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          px: 1.2,
                          py: 0.4,
                          borderRadius: 999,
                        }}
                      >
                        {item.price}
                      </Box>
                    </Stack>
                    <Typography sx={{ color: '#666', fontSize: '0.92rem', lineHeight: 1.6, flexGrow: 1 }}>
                      {item.description}
                    </Typography>
                    {item.isComingSoon ? (
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
                        ⏳ {item.ctaLabel}
                      </Button>
                    ) : (
                      <Button
                        href={item.ctaHref}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ borderRadius: 999, py: 1.1, mt: 1, fontWeight: 700 }}
                      >
                        🛒 {item.ctaLabel}
                      </Button>
                    )}
                  </Box>
                </Card>
              </Reveal>
            );
          })}
        </Box>
      </Container>
      <ContactSection data={props.contact} />
      <HomeFooter data={props.footer} />
    </Box>
  );
}
