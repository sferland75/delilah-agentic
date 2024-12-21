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
  Chip
} from '@mui/material';

const CasesList = () => {
  const [loading, setLoading] = React.useState(true);
  const [cases, setCases] = React.useState([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setCases([
        { 
          id: 1, 
          client: "John Doe", 
          therapist: "Dr. Smith", 
          status: "In Progress", 
          priority: "High",
          lastUpdated: "2024-12-20" 
        },
        { 
          id: 2, 
          client: "Jane Smith", 
          therapist: "Dr. Johnson", 
          status: "Scheduled", 
          priority: "Medium",
          lastUpdated: "2024-12-19" 
        },
        { 
          id: 3, 
          client: "Mike Johnson", 
          therapist: "Dr. Wilson", 
          status: "Pending Review", 
          priority: "Low",
          lastUpdated: "2024-12-18" 
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
      'In Progress': 'primary',
      'Scheduled': 'secondary',
      'Pending Review': 'warning'
    };
    return statusColors[status] || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const priorityColors: { [key: string]: string } = {
      'High': 'error',
      'Medium': 'warning',
      'Low': 'success'
    };
    return priorityColors[priority] || 'default';
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Active Cases
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Therapist</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map((caseItem: any) => (
              <TableRow 
                key={caseItem.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => console.log('Navigate to case details', caseItem.id)}
              >
                <TableCell>{caseItem.id}</TableCell>
                <TableCell>{caseItem.client}</TableCell>
                <TableCell>{caseItem.therapist}</TableCell>
                <TableCell>
                  <Chip 
                    label={caseItem.status} 
                    color={getStatusColor(caseItem.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={caseItem.priority} 
                    color={getPriorityColor(caseItem.priority) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{caseItem.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CasesList;