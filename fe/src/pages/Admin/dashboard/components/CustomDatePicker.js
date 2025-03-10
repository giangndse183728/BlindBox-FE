import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function ButtonField(props) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      size="small"
      onClick={() => setOpen?.((prev) => !prev)}
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: 'fit-content' }}
    >
      {label ? `${label}` : 'Pick a date'}
    </Button>
  );
}

ButtonField.propTypes = {
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  id: PropTypes.string,
  inputProps: PropTypes.shape({
    'aria-label': PropTypes.string,
  }),
  InputProps: PropTypes.shape({
    endAdornment: PropTypes.node,
    startAdornment: PropTypes.node,
  }),
  label: PropTypes.node,
  setOpen: PropTypes.func,
};

export default function CustomDatePicker() {
  const [currentDate, setCurrentDate] = React.useState(dayjs());

  // Update the date every minute to keep it current
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(dayjs());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Format the date as "Month DD, YYYY"
  const formattedDate = currentDate.format('MMM DD, YYYY');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        variant="outlined"
        disabled={true} // Disable the button to prevent clicking
        size="small"
        startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
        sx={{ 
          minWidth: 'fit-content',
          cursor: 'default', // Show default cursor instead of pointer
          '&.Mui-disabled': {
            color: 'text.primary', // Keep text color visible even when disabled
            borderColor: 'divider', // Keep border visible
          }
        }}
      >
        {formattedDate}
      </Button>
    </Box>
  );
}
