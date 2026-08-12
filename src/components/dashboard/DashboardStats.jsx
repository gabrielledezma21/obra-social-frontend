import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Link as MuiLink,
} from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Link as RouterLink } from 'react-router-dom';

export default function DashboardStats({ stats = [] }) {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="stretch">
        {stats.map((item, index) => (
          <Grid
            key={index}
            size={{ xs: 12, sm: 6, md: 3 }}
            sx={{ display: 'flex' }}
          >
            <Card
              sx={{
                background: item.color,
                color: item.textColor,
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: '100%',
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 500, width: '100%' }}
                  >
                    {item.title}
                  </Typography>

                  {item.link && (
                    <MuiLink
                      component={RouterLink}
                      to={item.link}
                      underline="none"
                      sx={{
                        backgroundColor: '#fff',
                        padding: '5px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #D9D9D9',
                        boxSizing: 'border-box',
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'scale(1.1)' },
                      }}
                    >
                      <ArrowOutwardIcon
                        sx={{
                          fontSize: 22,
                          opacity: 0.8,
                          color: '#000',
                        }}
                      />
                    </MuiLink>
                  )}
                </Box>

                <Typography variant="h3" sx={{ fontWeight: 700, mt: 2 }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

DashboardStats.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      color: PropTypes.string.isRequired,
      textColor: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ),
};
