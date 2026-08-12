import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export default function FadeSlide({ children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      style={{ overflow: 'hidden' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

FadeSlide.propTypes = {
  children: PropTypes.node.isRequired,
};
