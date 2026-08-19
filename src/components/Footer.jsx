import { Box, Grid, Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import BrandLogo from './common/BrandLogo';
import './Footer.css';

export default function Footer({ sx }) {
  return (
    <Box className="footer-container" sx={sx}>
      <Grid container className="footer-grid">
        <Grid className="footer-logo">
          <BrandLogo clickable size="medium" />
        </Grid>

        <Grid className="footer-text">
          <Typography variant="body2" className="footer-rights">
            MedIntegral · Desarrollado por{' '}
            <Link
              href="https://github.com/gabrielledezma21"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
            >
              Gabriel Ledezma
            </Link>{' '}
            ·{' '}
            <Link
              href="https://github.com/gabrielledezma21/obra-social-frontend"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
            >
              Frontend
            </Link>{' '}
            ·{' '}
            <Link
              href="https://github.com/gabrielledezma21/obra-social"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              underline="hover"
            >
              Backend
            </Link>{' '}
            · © 2026
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

Footer.propTypes = {
  sx: PropTypes.object,
};
