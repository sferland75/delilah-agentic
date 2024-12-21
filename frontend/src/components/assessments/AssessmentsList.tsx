import React from 'react';
import { 
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  RemoveRedEye as ViewIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const AssessmentsList = () => {
  const [loading, setLoading] = React.useState(true);
  const [assessments, setAssessments] = React.useState([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setAssessments([
        { 
          id: 1, 
          client: "John Doe", 
          type: "Initial Assessment",
          therapist: "Dr. Smith", 
          status: "Scheduled",
          dueDate: "2024-12-25",
          scheduledDate: "2024-12-22"
        },
        { 
          id: 2, 
          client: "Jane Smith", 
          type: "Follow-up",
          therapist: "Dr. Johnson", 
          status: "Pending",
          dueDate: "2024-12-28",
          scheduledDate: null
        },
        { 
          id: 3, 
          client: "Mike Johnson", 
          type: "Progress Review",
          therapist: "Dr. Wilson", 
          status: "In Progress",
          dueDate: "2024-12-23",
          scheduledDate: "2024-12-21"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'Scheduled': 'success',
      'Pending': 'warning',
      'In Progress': 'primary'
    };
    return statusColors[status] || 'default';
  };

  const getTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      'Initial Assessment': 'primary',
      'Follow-up': 'secondary',
      'Progress Review': 'info'
    };
    return typeColors[type] || 'default';
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Pending Assessments
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Therapist</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Scheduled Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assessments.map((assessment: any) => (
              <TableRow 
                key={assessment.id}
                hover
              >
                <TableCell>{assessment.id}</TableCell>
                <TableCell>{assessment.client}</TableCell>
                <TableCell>
                  <Chip 
                    label={assessment.type} 
                    color={getTypeColor(assessment.type) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{assessment.therapist}</TableCell>
                <TableCell>
                  <Chip 
                    label={assessment.status} 
                    color={getStatusColor(assessment.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{assessment.dueDate}</TableCell>
                <TableCell>{assessment.scheduledDate || 'Not scheduled'}</TableCell>
                <TableCell>
                  <Box>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => console.log('View assessment', assessment.id)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Assessment">
                      <IconButton size="small" onClick={() => console.log('Edit assessment', assessment.id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {!assessment.scheduledDate && (
                      <Tooltip title="Schedule Assessment">
                        <IconButton size="small" onClick={() => console.log('Schedule assessment', assessment.id)}>
                          <ScheduleIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssessmentsList;