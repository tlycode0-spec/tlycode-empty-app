import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { HomeHeader } from '../../components/home/HomeHeader';
import { HomeFooter } from '../../components/home/HomeFooter';
import { ContactSection } from '../../components/home/ContactSection';
import { Reveal } from '../../components/home/Reveal';
import type { FreeSamplePageProps } from '../../components/free-sample/free-sample-types';

const HERO_BLUE = '#2E73C7';
const ORANGE = '#E94E1B';
const GREEN = '#7AB800';
const CREAM = '#FAF3EA';

export function FreeSamplePage(props: FreeSamplePageProps) {
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
                src={props.hero.image}
                alt={props.hero.imageAlt}
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
                  bgcolor: GREEN,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  px: 1.8,
                  py: 0.6,
                  borderRadius: 999,
                }}
              >
                Zdarma
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
                {props.hero.title}
              </Typography>
              <Typography
                sx={{
                  color: '#3a3a3a',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6,
                }}
              >
                {props.hero.intro}
              </Typography>
              <Box>
                <Button
                  href={props.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
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
                  ⬇️ {props.ctaLabel}
                </Button>
                <Typography
                  sx={{ color: '#666', fontSize: '0.85rem', mt: 1.2, fontStyle: 'italic' }}
                >
                  {props.ctaNote}
                </Typography>
              </Box>
            </Stack>
          </Reveal>
        </Box>
      </Container>

      {/* Steps */}
      <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 } }}>
        <Reveal>
          <Typography
            component="h2"
            sx={{
              color: ORANGE,
              fontWeight: 800,
              fontSize: { xs: '1.4rem', md: '1.7rem' },
              textAlign: 'center',
              mb: { xs: 3, md: 4 },
            }}
          >
            {props.stepsTitle}
          </Typography>
        </Reveal>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2.5, md: 3 },
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          {props.steps.map((step, i) => (
            <Reveal key={i} delay={i * 100}>
              <Box
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 4,
                  p: { xs: 3, md: 3.5 },
                  height: '100%',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    bgcolor: HERO_BLUE,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    mb: 2,
                  }}
                >
                  {step.number}
                </Box>
                <Typography
                  component="h3"
                  sx={{
                    color: HERO_BLUE,
                    fontWeight: 800,
                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                    mb: 1,
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  sx={{
                    color: '#3a3a3a',
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Container>

      {/* What's inside */}
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
              {props.insideTitle}
            </Typography>
            <Stack spacing={1.4}>
              {props.inside.map((line, i) => (
                <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: '#E8F4E0',
                      color: GREEN,
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
              {props.ctaTitle}
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
              {props.ctaText}
            </Typography>
            <Button
              href={props.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
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
              ⬇️ {props.ctaLabel}
            </Button>
          </Box>
        </Reveal>
      </Container>

      <ContactSection data={props.contact} />
      <HomeFooter data={props.footer} />
    </Box>
  );
}
