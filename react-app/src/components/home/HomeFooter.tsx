import { Box, Container, Stack, Typography } from '@mui/material';
import type { FooterData } from './shared-types';

export function HomeFooter({ data }: { data?: FooterData }) {
  if (!data) return null;
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#EDE3D0',
        py: { xs: 3, md: 4 },
        borderTop: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={1.2} alignItems="center" sx={{ textAlign: 'center' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 3 }}
            alignItems="center"
            justifyContent="center"
          >
            {data.links.map((l) => (
              <Box
                key={l.href}
                component="a"
                href={l.href}
                sx={{
                  color: '#555',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  '&:hover': { color: '#E94E1B' },
                }}
              >
                {l.label}
              </Box>
            ))}
          </Stack>
          <Typography sx={{ color: '#999', fontSize: '0.82rem' }}>{data.copyright}</Typography>
        </Stack>
      </Container>
    </Box>
  );
}
