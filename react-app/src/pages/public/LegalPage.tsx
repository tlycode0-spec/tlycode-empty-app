import { Box, Container, Stack, Typography } from '@mui/material';
import { HomeHeader } from '../../components/home/HomeHeader';
import { HomeFooter } from '../../components/home/HomeFooter';
import { ContactSection } from '../../components/home/ContactSection';
import type { LegalPageProps, LegalBlock } from '../../components/legal/legal-types';

const HERO_BLUE = '#2E73C7';
const ORANGE = '#E94E1B';

function renderBlock(block: LegalBlock, key: number) {
  if (block.kind === 'subheading') {
    return (
      <Typography
        key={key}
        component="h3"
        sx={{ color: '#222', fontWeight: 700, fontSize: '1rem', mt: 2 }}
      >
        {block.text}
      </Typography>
    );
  }
  if (block.kind === 'list') {
    return (
      <Box key={key} component="ul" sx={{ pl: 3, m: 0, color: '#3a3a3a', fontSize: '0.95rem', lineHeight: 1.7 }}>
        {block.items.map((item, j) => (
          <li key={j} style={{ marginBottom: 6 }}>
            {item}
          </li>
        ))}
      </Box>
    );
  }
  return (
    <Typography key={key} sx={{ color: '#3a3a3a', fontSize: '0.95rem', lineHeight: 1.75 }}>
      {block.text}
    </Typography>
  );
}

export function LegalPage(props: LegalPageProps) {
  return (
    <Box sx={{ bgcolor: '#FAF3EA', minHeight: '100vh' }}>
      <HomeHeader data={props.header} />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          component="a"
          href={props.backHref}
          sx={{
            display: 'inline-block',
            color: ORANGE,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            mb: { xs: 2, md: 3 },
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {props.backLabel}
        </Box>
        <Typography
          component="h1"
          sx={{
            color: HERO_BLUE,
            fontWeight: 800,
            fontSize: { xs: '1.8rem', md: '2.2rem' },
            mb: { xs: 3, md: 4 },
          }}
        >
          {props.pageTitle}
        </Typography>
        {props.intro.length > 0 && (
          <Stack spacing={1.4} sx={{ mb: { xs: 3, md: 4 } }}>
            {props.intro.map((b, i) => renderBlock(b, i))}
          </Stack>
        )}
        <Stack spacing={{ xs: 3, md: 4 }}>
          {props.sections.map((s, i) => (
            <Box key={i}>
              <Typography
                component="h2"
                sx={{ color: HERO_BLUE, fontWeight: 800, fontSize: { xs: '1.15rem', md: '1.3rem' }, mb: 1.4 }}
              >
                {s.title}
              </Typography>
              <Stack spacing={1.2}>{s.blocks.map((b, j) => renderBlock(b, j))}</Stack>
            </Box>
          ))}
        </Stack>
        {props.closing && (
          <Typography sx={{ color: '#666', fontStyle: 'italic', mt: { xs: 4, md: 5 }, fontSize: '0.92rem' }}>
            {props.closing}
          </Typography>
        )}
      </Container>
      <ContactSection data={props.contact} />
      <HomeFooter data={props.footer} />
    </Box>
  );
}
