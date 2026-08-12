import PropTypes from 'prop-types';
import { Stack, IconButton, Link, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function CopyItem({ text, link, label, onCopy }) {
  return (
    <Stack
      component="li"
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ color: 'black' }}
    >
      <Typography sx={{ mr: 1 }}>•</Typography>
      <Link
        href={link}
        underline="always"
        color="text.primary"
        sx={{ fontSize: '0.9rem', fontWeight: 500 }}
      >
        {text}
      </Link>
      <Tooltip title="Copiar">
        <IconButton
          size="small"
          onClick={() => onCopy(text, label)}
          sx={{
            ml: 0.5,
          }}
        >
          <ContentCopyIcon fontSize="inherit" sx={{ fontSize: '1rem' }} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

CopyItem.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onCopy: PropTypes.func.isRequired,
};
