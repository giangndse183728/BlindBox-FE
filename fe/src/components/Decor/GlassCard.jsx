import { Card } from '@mui/material';

const GlassCard = ({ children, sx, ...props }) => {
  return (
    <Card
      sx={{
        background: 'rgba(94, 94, 94, 0.25)',
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        width: { xs: '90%', sm: '300px' }, // Responsive width
        padding: 2, 
        ...sx, // Ensure sx prop properly merges
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default GlassCard;
