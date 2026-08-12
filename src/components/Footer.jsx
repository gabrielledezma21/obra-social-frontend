import { Box, Grid, Typography } from '@mui/material';
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
            <a
              href="https://github.com/DesApp-2025c2-Grupo3"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              © 2025 - Medicina Integral Group
            </a>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

Footer.propTypes = {
  sx: PropTypes.object,
};
