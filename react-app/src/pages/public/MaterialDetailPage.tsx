import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { HomeHeader } from '../../components/home/HomeHeader';
import { HomeFooter } from '../../components/home/HomeFooter';
import { ContactSection } from '../../components/home/ContactSection';
import { Reveal } from '../../components/home/Reveal';
import type {
  MaterialDetailContent,
  MaterialDetailPageProps,
} from '../../components/materials/materials-types';

const HERO_BLUE = '#2E73C7';
const ORANGE = '#E94E1B';
const GREEN = '#7AB800';
const GRAY = '#9E9E9E';
const CREAM = '#FAF3EA';

function badgeBg(color: MaterialDetailContent['badgeColor']): string {
  if (color === 'orange') return ORANGE;
  if (color === 'blue') return HERO_BLUE;
  if (color === 'gray') return GRAY;
  return GREEN;
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function MaterialDetailPage(props: MaterialDetailPageProps) {
  const { detail } = props;
  const external = isExternal(detail.ctaHref);
  const ctaProps = {
    href: detail.ctaHref,
    component: 'a' as const,
    target: external ? '_blank' : undefined,
    rel: external ? 'noopener noreferrer' : undefined,
  };
  const ctaIcon = detail.isComingSoon ? '⏳' : external ? '🛒' : '✉️';
  return (
    <Box sx={{ bgcolor: CREAM, minHeight: '100vh' }}>
      <HomeHeader data={props.header} />

      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 4 } }}>
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

      {/* Hero */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 3, md: 6 },
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            alignItems: 'center',
          }}
        >
          <Reveal>
            <Box
              sx={{
                position: 'relative',
                bgcolor: '#FFEFD8',
                borderRadius: 4,
                overflow: 'hidden',
                aspectRatio: '4/3',
                boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
              }}
            >
              <Box
                component="img"
                src={detail.image}
                alt={detail.imageAlt}
                loading="eager"
                decoding="async"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: badgeBg(detail.badgeColor),
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  px: 1.8,
                  py: 0.6,
                  borderRadius: 999,
                }}
              >
                {detail.badge}
              </Box>
            </Box>
          </Reveal>

          <Reveal delay={120}>
            <Stack spacing={2.5}>
              <Typography
                component="h1"
                sx={{
                  color: HERO_BLUE,
                  fontWeight: 800,
                  fontSize: { xs: '1.8rem', md: '2.4rem' },
                  lineHeight: 1.2,
                }}
              >
                {detail.title}
              </Typography>
              <Typography
                sx={{
                  color: '#3a3a3a',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6,
                }}
              >
                {detail.tagline}
              </Typography>
              <Stack direction="row" spacing={1.2} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                <Box
                  sx={{
                    bgcolor: '#FFEFD8',
                    color: ORANGE,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    px: 1.6,
                    py: 0.6,
                    borderRadius: 999,
                  }}
                >
                  {detail.ageRange}
                </Box>
                <Box
                  sx={{
                    bgcolor: '#E8F4FF',
                    color: HERO_BLUE,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    px: 1.6,
                    py: 0.6,
                    borderRadius: 999,
                  }}
                >
                  {detail.price}
                </Box>
              </Stack>
              <Box>
                {detail.isComingSoon ? (
                  <Button
                    disabled
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      borderRadius: 999,
                      py: 1.3,
                      px: 3.5,
                      fontWeight: 700,
                      fontSize: '1rem',
                      '&.Mui-disabled': { bgcolor: '#E0E0E0', color: '#888' },
                    }}
                  >
                    ⏳ {detail.ctaLabel}
                  </Button>
                ) : (
                  <Button
                    {...ctaProps}
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      borderRadius: 999,
                      py: 1.3,
                      px: 3.5,
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    {ctaIcon} {detail.ctaLabel}
                  </Button>
                )}
                <Typography
                  sx={{ color: '#666', fontSize: '0.85rem', mt: 1.2, fontStyle: 'italic' }}
                >
                  {detail.ctaNote}
                </Typography>
              </Box>
            </Stack>
          </Reveal>
        </Box>
      </Container>

      {/* Description paragraphs */}
      <Container maxWidth="md" sx={{ pb: { xs: 4, md: 6 } }}>
        <Reveal>
          <Stack spacing={2.2}>
            {detail.paragraphs.map((p, i) => (
              <Typography
                key={i}
                sx={{
                  color: '#3a3a3a',
                  fontSize: { xs: '1rem', md: '1.05rem' },
                  lineHeight: 1.8,
                }}
              >
                {p}
              </Typography>
            ))}
          </Stack>
        </Reveal>
      </Container>

      {/* Highlights + Facts */}
      <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
          }}
        >
          <Reveal>
            <Box
              sx={{
                bgcolor: '#fff',
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
              }}
            >
              <Typography
                component="h2"
                sx={{
                  color: ORANGE,
                  fontWeight: 800,
                  fontSize: { xs: '1.2rem', md: '1.4rem' },
                  mb: 2,
                }}
              >
                {detail.highlightsTitle}
              </Typography>
              <Stack spacing={1.4}>
                {detail.highlights.map((h, i) => (
                  <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: '#FFEFD8',
                        color: ORANGE,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        mt: 0.3,
                      }}
                    >
                      ✓
                    </Box>
                    <Typography
                      sx={{
                        color: '#3a3a3a',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        lineHeight: 1.6,
                      }}
                    >
                      {h}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Reveal>

          <Reveal delay={120}>
            <Box
              sx={{
                bgcolor: '#fff',
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
              }}
            >
              <Typography
                component="h2"
                sx={{
                  color: HERO_BLUE,
                  fontWeight: 800,
                  fontSize: { xs: '1.2rem', md: '1.4rem' },
                  mb: 2,
                }}
              >
                {detail.factsTitle}
              </Typography>
              <Stack divider={<Box sx={{ borderTop: '1px solid #f0e8db' }} />} spacing={0}>
                {detail.facts.map((f, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                    sx={{ py: 1.2, gap: 2 }}
                  >
                    <Typography sx={{ color: '#666', fontSize: '0.92rem' }}>
                      {f.label}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#222',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        textAlign: 'right',
                      }}
                    >
                      {f.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Reveal>
        </Box>
      </Container>

      {/* For whom */}
      <Container maxWidth="md" sx={{ pb: { xs: 4, md: 6 } }}>
        <Reveal>
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 4,
              p: { xs: 3, md: 4 },
              boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
            }}
          >
            <Typography
              component="h2"
              sx={{
                color: GREEN,
                fontWeight: 800,
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                mb: 2,
              }}
            >
              {detail.forWhomTitle}
            </Typography>
            <Stack spacing={1.2}>
              {detail.forWhom.map((line, i) => (
                <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      flexShrink: 0,
                      mt: 0.7,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: GREEN,
                    }}
                  />
                  <Typography
                    sx={{
                      color: '#3a3a3a',
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      lineHeight: 1.6,
                    }}
                  >
                    {line}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Reveal>
      </Container>

      {/* Final CTA */}
      <Container maxWidth="md" sx={{ pb: { xs: 6, md: 10 } }}>
        <Reveal>
          <Box
            sx={{
              bgcolor: HERO_BLUE,
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              textAlign: 'center',
              boxShadow: '0 12px 40px rgba(46,115,199,0.25)',
            }}
          >
            <Typography
              component="h2"
              sx={{
                color: '#fff',
                fontWeight: 800,
                fontSize: { xs: '1.3rem', md: '1.6rem' },
                mb: 1.5,
              }}
            >
              Pojďte do toho s námi
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.92)',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                mb: 3,
                maxWidth: 520,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Napište mi a já vám materiál pošlu i s krátkým návodem, jak začít. Bez závazků,
              bez složitých objednávek.
            </Typography>
            {detail.isComingSoon ? (
              <Button
                disabled
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 999,
                  py: 1.4,
                  px: 4,
                  fontWeight: 700,
                  fontSize: '1rem',
                  '&.Mui-disabled': { bgcolor: '#E0E0E0', color: '#888' },
                }}
              >
                ⏳ {detail.ctaLabel}
              </Button>
            ) : (
              <Button
                {...ctaProps}
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 999,
                  py: 1.4,
                  px: 4,
                  fontWeight: 700,
                  fontSize: '1rem',
                  bgcolor: '#fff',
                  color: HERO_BLUE,
                  '&:hover': { bgcolor: '#f4f4f4' },
                }}
              >
                {ctaIcon} {detail.ctaLabel}
              </Button>
            )}
          </Box>
        </Reveal>
      </Container>

      <ContactSection data={props.contact} />
      <HomeFooter data={props.footer} />
    </Box>
  );
}
