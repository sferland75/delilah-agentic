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
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
  Share as ShareIcon
} from '@mui/icons-material';

const ReportsList = () => {
  const [loading, setLoading] = React.useState(true);
  const [reports, setReports] = React.useState([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setReports([
        { 
          id: 1, 
          client: "John Doe", 
          type: "Initial Assessment",
          therapist: "Dr. Smith", 
          status: "Final",
          completedDate: "2024-12-15",
          lastModified: "2024-12-16"
        },
        { 
          id: 2, 
          client: "Jane Smith", 
          type: "Progress Report",
          therapist: "Dr. Johnson", 
          status: "Draft",
          completedDate: null,
          lastModified: "2024-12-18"
        },
        { 
          id: 3, 
          client: "Mike Johnson", 
          type: "Discharge Summary",
          therapist: "Dr. Wilson", 
          status: "Under Review",
          completedDate: null,
          lastModified: "2024-12-17"
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
      'Final': 'success',
      'Draft': 'warning',
      'Under Review': 'info'
    };
    return statusColors[status] || 'default';
  };

  const getTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      'Initial Assessment': 'primary',
      'Progress Report': 'secondary',
      'Discharge Summary': 'error'
    };
    return typeColors[type] || 'default';
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Completed Reports
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
              <TableCell>Completed Date</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report: any) => (
              <TableRow 
                key={report.id}
                hover
              >
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.client}</TableCell>
                <TableCell>
                  <Chip 
                    label={report.type} 
                    color={getTypeColor(report.type) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{report.therapist}</TableCell>
                <TableCell>
                  <Chip 
                    label={report.status} 
                    color={getStatusColor(report.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{report.completedDate || 'Not completed'}</TableCell>
                <TableCell>{report.lastModified}</TableCell>
                <TableCell>
                  <Box>
                    <Tooltip title="Download PDF">
                      <IconButton size="small" onClick={() => console.log('Download PDF', report.id)}>
                        <PdfIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print Report">
                      <IconButton size="small" onClick={() => console.log('Print report', report.id)}>
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share Report">
                      <IconButton size="small" onClick={() => console.log('Share report', report.id)}>
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
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

export default ReportsList;