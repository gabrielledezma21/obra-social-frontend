import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Grid, Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import BrandLogo from './common/BrandLogo';
import './Footer.css';

export default function Footer({ sx }) {
  return (
    <Box component="footer" className="footer-container" sx={sx}>
      <Grid container className="footer-grid">
        <Grid className="footer-brand">
          <BrandLogo clickable size="medium" />

          <Typography variant="body2" className="footer-credit">
            Desarrollado por{' '}
            <Link
              href="https://github.com/gabrielledezma21"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-author"
              underline="hover"
            >
              Gabriel Ledezma
            </Link>{' '}
            · © 2026
          </Typography>
        </Grid>

        <Grid className="footer-actions">
          <Link
            href="https://github.com/gabrielledezma21"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-github-link"
            underline="none"
            aria-label="Ver perfil de Gabriel Ledezma en GitHub"
          >
            <GitHubIcon fontSize="small" />
            GitHub
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}

Footer.propTypes = {
  sx: PropTypes.object,
};
