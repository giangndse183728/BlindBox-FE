import { Card } from '@mui/material';

const GlassCard = ({ children, theme = 'light', isBlur = false, sx, ...props }) => {
  return (
    <Card
      sx={{
        background: theme === 'dark'
          ? 'rgba(40, 40, 40, 0.25)' // Dark mode background
          : 'rgba(94, 94, 94, 0.25)', // Light mode background
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        width: { xs: '90%', sm: '300px' },
        padding: 2,
        backdropFilter: isBlur ? 'blur(1px)' : 'none', 
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default GlassCard;
