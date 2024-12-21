import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip
} from '@mui/material';
import {
  PeopleOutline as PeopleIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import ClientService from '../services/client';
import TherapistService from '../services/therapist';
import AssessmentService from '../services/assessment';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: any }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  'scheduled': 'info',
  'in_progress': 'warning',
  'completed': 'success',
  'cancelled': 'error',
  'pending': 'default'
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalTherapists: 0,
    totalAssessments: 0,
    upcomingAssessments: 0
  });
  const [recentAssessments, setRecentAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [clients, therapists, assessments] = await Promise.all([
        ClientService.getClients(),
        TherapistService.getTherapists(),
        AssessmentService.getAssessments()
      ]);

      const upcoming = assessments.filter(a => 
        a.status === 'scheduled' && new Date(a.scheduled_date) > new Date()
      );

      setStats({
        totalClients: clients.length,
        totalTherapists: therapists.length,
        totalAssessments: assessments.length,
        upcomingAssessments: upcoming.length
      });

      setRecentAssessments(assessments.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Clients" 
            value={stats.totalClients}
            icon={PeopleIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Therapists" 
            value={stats.totalTherapists}
            icon={PersonIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Assessments" 
            value={stats.totalAssessments}
            icon={AssessmentIcon}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Upcoming Assessments" 
            value={stats.upcomingAssessments}
            icon={ScheduleIcon}
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent Assessments</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Therapist</TableCell>
                <TableCell>Scheduled Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentAssessments.map((assessment) => (
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
                </TableRow>
              ))}
              {recentAssessments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="textSecondary">
                      No recent assessments
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;