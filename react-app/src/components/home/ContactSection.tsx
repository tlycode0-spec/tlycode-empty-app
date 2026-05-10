import { Box, Container, Stack } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import type { ContactData } from './shared-types';

const SAND = '#F2E9D8';

export function ContactSection({ data }: { data?: ContactData }) {
  if (!data) return null;
  return (
    <Box component="section" sx={{ bgcolor: SAND, py: { xs: 3, md: 4 } }}>
      <Container maxWidth="md">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 4 }}
          alignItems="center"
          justifyContent="center"
          sx={{ color: '#666', fontSize: '0.92rem' }}
        >
          <Box
            component="a"
            href={data.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': { color: '#E94E1B' },
            }}
          >
            <InstagramIcon sx={{ fontSize: '1.15rem' }} />
            {data.instagramHandle}
          </Box>
          <Box
            component="a"
            href={`mailto:${data.email}`}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': { color: '#E94E1B' },
            }}
          >
            <Box component="span" sx={{ fontSize: '1.05rem' }}>✉️</Box>
            {data.email}
          </Box>
          {data.linktreeUrl ? (
            <Box
              component="a"
              href={data.linktreeUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { color: '#E94E1B' },
              }}
            >
              <AccountTreeIcon sx={{ fontSize: '1.15rem' }} />
              {data.linktreeLabel || 'Linktree'}
            </Box>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}
