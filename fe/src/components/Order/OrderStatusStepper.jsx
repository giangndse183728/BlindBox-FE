import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

// Custom styled connector for stepper
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(to right, #FFD700, #4CAF50)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(to right, #FFD700, #4CAF50)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1,
  },
}));

// Custom styled step icon
const ColorlibStepIconRoot = styled('div')(({ ownerState }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1,
  color: 'white',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  ...(ownerState.active && {
    backgroundColor: 'rgba(0, 0, 0)',
    border: '2px solid #FFD700',
    boxShadow: '0 0 10px #FFD700',
  }),
  ...(ownerState.completed && {
    backgroundColor: 'rgba(76, 175, 80)',
    border: '2px solid #4CAF50',
  }),
  ...(ownerState.status === 4 && {
    backgroundColor: 'rgba(244, 67, 54)',
    border: '2px solid #F44336',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className, icon, status } = props;

  const icons = {
    1: <PendingIcon />,
    2: <ReceiptIcon />,
    3: <LocalShippingIcon />,
    4: <CheckCircleIcon />,
  };

  // If cancelled, show cancel icon for all steps
  if (status === 4) {
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active, status }} className={className}>
        <CancelIcon />
      </ColorlibStepIconRoot>
    );
  }

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active, status }} className={className}>
      {icons[icon]}
    </ColorlibStepIconRoot>
  );
}

const OrderStatusStepper = ({ status }) => {
 
  const getActiveStep = () => {

    if (status === 4) return -1;
    
    return status;
  };

  return (
    <Box sx={{ mb: 4, mt: 3 }}>
      <Stepper 
        alternativeLabel 
        activeStep={getActiveStep()} 
        connector={<ColorlibConnector />}
      >
        <Step>
          <StepLabel 
            StepIconComponent={(props) => 
              <ColorlibStepIcon {...props} status={status} />
            }
            sx={{
              '& .MuiStepLabel-label': {
                color: 'white',
                marginTop: 1,
                ...(status >= 0 && status !== 4 && {
                  fontWeight: 'bold',
                })
              }
            }}
          >
            Pending
          </StepLabel>
        </Step>
        <Step>
          <StepLabel 
            StepIconComponent={(props) => 
              <ColorlibStepIcon {...props} status={status} />
            }
            sx={{
              '& .MuiStepLabel-label': {
                color: 'white',
                marginTop: 1,
                ...(status >= 1 && status !== 4 && {
                  fontWeight: 'bold',
                })
              }
            }}
          >
            Confirmed
          </StepLabel>
        </Step>
        <Step>
          <StepLabel 
            StepIconComponent={(props) => 
              <ColorlibStepIcon {...props} status={status} />
            }
            sx={{
              '& .MuiStepLabel-label': {
                color: 'white',
                marginTop: 1,
                ...(status >= 2 && status !== 4 && {
                  fontWeight: 'bold',
                })
              }
            }}
          >
            Processing
          </StepLabel>
        </Step>
        <Step>
          <StepLabel 
            StepIconComponent={(props) => 
              <ColorlibStepIcon {...props} status={status} />
            }
            sx={{
              '& .MuiStepLabel-label': {
                color: 'white',
                marginTop: 1,
                ...(status >= 3 && status !== 4 && {
                  fontWeight: 'bold',
                })
              }
            }}
          >
            Completed
          </StepLabel>
        </Step>
      </Stepper>
    </Box>
  );
};

export default OrderStatusStepper; 