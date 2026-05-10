import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import type { HeaderData } from './shared-types';

function BookLogo() {
  return (
    <Box
      component="svg"
      viewBox="0 0 32 26"
      sx={{ width: 36, height: 30, flexShrink: 0 }}
      aria-hidden="true"
    >
      <path
        d="M2 4.5C2 3.67 2.67 3 3.5 3H12c2.21 0 4 1.79 4 4v17c0-.83-.67-1.5-1.5-1.5H3.5C2.67 22.5 2 21.83 2 21V4.5z"
        fill="#E94E1B"
      />
      <path
        d="M30 4.5C30 3.67 29.33 3 28.5 3H20c-2.21 0-4 1.79-4 4v17c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5-.67 1.5-1.5V4.5z"
        fill="#F97A3D"
      />
      <path d="M16 7v17" stroke="#fff" strokeWidth="1.2" opacity="0.85" />
    </Box>
  );
}

export function HomeHeader({ data }: { data?: HeaderData }) {
  const [open, setOpen] = useState(false);
  if (!data) return null;
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        color: '#2E73C7',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, gap: 2 }}>
          <Box
            component="a"
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: 1,
            }}
          >
            <BookLogo />
            <Box
              sx={{
                fontFamily: '"Caveat", "Open Sans", cursive',
                fontWeight: 700,
                fontSize: { xs: '1.15rem', md: '1.4rem' },
                fontStyle: 'italic',
                color: '#2E73C7',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              {data.brandName}
            </Box>
          </Box>
          <Stack
            direction="row"
            spacing={{ xs: 1.5, md: 3 }}
            alignItems="center"
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            {data.links.map((link) =>
              link.highlight ? (
                <Button
                  key={link.href}
                  href={link.href}
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 999, px: 2.4, py: 0.8, fontSize: '0.9rem' }}
                >
                  {link.label}
                </Button>
              ) : (
                <Box
                  key={link.href}
                  component="a"
                  href={link.href}
                  sx={{
                    color: '#2b2b2b',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    '&:hover': { color: '#2E73C7' },
                  }}
                >
                  {link.label}
                </Box>
              )
            )}
          </Stack>
          <IconButton
            aria-label="Otevřít menu"
            onClick={() => setOpen(true)}
            sx={{
              display: { xs: 'inline-flex', sm: 'none' },
              color: '#2E73C7',
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 280, bgcolor: '#FAF3EA' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton
            aria-label="Zavřít menu"
            onClick={() => setOpen(false)}
            sx={{ color: '#2E73C7' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Stack spacing={1.2} sx={{ px: 3, pt: 1, pb: 4 }}>
          {data.links.map((link) =>
            link.highlight ? (
              <Button
                key={link.href}
                href={link.href}
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setOpen(false)}
                sx={{ borderRadius: 999, py: 1.1, fontSize: '0.95rem', mt: 1 }}
              >
                {link.label}
              </Button>
            ) : (
              <Box
                key={link.href}
                component="a"
                href={link.href}
                onClick={() => setOpen(false)}
                sx={{
                  color: '#2b2b2b',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  py: 1.2,
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  '&:hover': { color: '#2E73C7' },
                }}
              >
                {link.label}
              </Box>
            )
          )}
        </Stack>
      </Drawer>
    </AppBar>
  );
}
