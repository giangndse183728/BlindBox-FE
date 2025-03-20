import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

export default function CardAlert() {
  // Get notes from localStorage or use empty string if none exists
  const [notes, setNotes] = React.useState(() => {
    const savedNotes = localStorage.getItem('dashboard_notes');
    return savedNotes || '';
  });

  // Save notes to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('dashboard_notes', notes);
  }, [notes]);

  // Handle note changes
  const handleNoteChange = (event) => {
    setNotes(event.target.value);
  };

  // Handle save button click (for visual feedback)
  const handleSave = () => {
    // Notes are already saved in the useEffect, but we can add visual feedback here
    const saveButton = document.getElementById('save-note-button');
    if (saveButton) {
      saveButton.innerText = 'Saved!';
      setTimeout(() => {
        saveButton.innerText = 'Save';
      }, 1500);
    }
  };

  return (
    <Card variant="outlined" sx={{ m: 1.5, flexShrink: 0 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <NoteAltOutlinedIcon 
            color="primary" 
            fontSize="small" 
            sx={{ mr: 1 }} 
          />
          <Typography variant="h6" component="div">
            Quick Notes
          </Typography>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Type your notes here..."
          value={notes}
          onChange={handleNoteChange}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'divider',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            }
          }}
        />
        
        <Button
          id="save-note-button"
          variant="contained"
          size="small"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSave}
          sx={{ mt: 1 }}
        >
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
