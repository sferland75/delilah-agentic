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
  Chip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Schedule as ScheduleIcon 
} from '@mui/icons-material';
import AssessmentService, { Assessment } from '../services/assessment';
import { format } from 'date-fns';

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  'scheduled': 'info',
  'in_progress': 'warning',
  'completed': 'success',
  'cancelled': 'error',
  'pending': 'default'
};

const AssessmentList = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const data = await AssessmentService.getAssessments();
      setAssessments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load assessments');
      console.error('Error loading assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
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
        <Typography variant="h4">Assessments</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<ScheduleIcon />}
        >
          Schedule New Assessment
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Assessment Type</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Therapist</TableCell>
              <TableCell>Scheduled Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell>{assessment.assessment_type}</TableCell>
                <TableCell>{assessment.client_id}</TableCell>
                <TableCell>{assessment.therapist_id}</TableCell>
                <TableCell>{formatDate(assessment.scheduled_date)}</TableCell>
                <TableCell>
                  <Chip 
                    label={assessment.status}
                    color={statusColors[assessment.status] || 'default'}
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

export default AssessmentList;