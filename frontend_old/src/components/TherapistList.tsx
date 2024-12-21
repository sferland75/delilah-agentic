import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Rating,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import TherapistService, { Therapist } from '../services/therapist';

const TherapistList = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async () => {
    try {
      const data = await TherapistService.getTherapists();
      setTherapists(data);
      setError(null);
    } catch (err) {
      setError('Failed to load therapists');
      console.error('Error loading therapists:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Therapists</Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<PersonIcon />}
        >
          Add New Therapist
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {therapists.map((therapist) => (
              <TableRow key={therapist.id}>
                <TableCell>{`${therapist.first_name} ${therapist.last_name}`}</TableCell>
                <TableCell>
                  {`${therapist.license_number} (${therapist.license_state})`}
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{therapist.email}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {therapist.phone || '-'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {therapist.years_of_experience} years
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {therapist.assessment_count} assessments
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Rating 
                    value={therapist.rating} 
                    readOnly 
                    precision={0.5}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={therapist.is_active ? 'Active' : 'Inactive'}
                    color={therapist.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TherapistList;