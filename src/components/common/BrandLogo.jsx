import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function BrandLogo({ size = 'medium', clickable = true }) {
  const sizes = {
    small: { fontSize: '0.9rem', imgWidth: 28 },
    medium: { fontSize: '1.1rem', imgWidth: 32 },
    large: { fontSize: '1.2rem', imgWidth: 40 },
  };

  const { fontSize, imgWidth } = sizes[size] || sizes.medium;

  const Wrapper = clickable ? RouterLink : Box;

  return (
    <Wrapper
      to={clickable ? '/' : undefined}
      style={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: clickable ? 'pointer' : 'default',
      }}
      className="navbar-header"
    >
      <img
        src="/medIntegralLogo.png"
        alt="Logo MedIntegral"
        className="navbar-logo"
        style={{ width: imgWidth, height: 'auto' }}
      />
      <Typography
        sx={{
          color: '#00AEEF',
          fontSize,
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        Med<span style={{ color: '#FFFFFF' }}>Integral</span>
      </Typography>
    </Wrapper>
  );
}

BrandLogo.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  clickable: PropTypes.bool,
};
