import { useState } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import type { FaqData } from './shared-types';

const HERO_BLUE = '#2E73C7';
const SAND = '#F2E9D8';

export function FaqSection({ data }: { data?: FaqData }) {
  if (!data) return null;
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Box component="section" sx={{ bgcolor: SAND, py: { xs: 5, md: 8 } }}>
      <Container maxWidth="md">
        <Typography
          component="h2"
          sx={{
            color: HERO_BLUE,
            fontWeight: 800,
            fontSize: { xs: '1.5rem', md: '1.9rem' },
            textAlign: 'center',
            mb: { xs: 3, md: 5 },
          }}
        >
          {data.heading}
        </Typography>
        <Stack spacing={1.5}>
          {data.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Box
                key={item.question}
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 2,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  sx={{
                    width: '100%',
                    p: { xs: 1.8, md: 2.2 },
                    bgcolor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <Typography sx={{ color: '#2b2b2b', fontWeight: 600, fontSize: '0.95rem' }}>
                    {item.question}
                  </Typography>
                  <Box
                    sx={{
                      color: '#999',
                      fontSize: '0.7rem',
                      transition: 'transform 0.2s',
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                    }}
                  >
                    ▼
                  </Box>
                </Box>
                {isOpen && (
                  <Box sx={{ px: { xs: 1.8, md: 2.2 }, pb: 2.2, color: '#555', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {item.answer}
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}
