import React, { useState, useEffect } from 'react';
import { PatientMetrics, analyticsApi } from '../../api/analyticsApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PatientAnalyticsProps {
  patientId: string;
}

const PatientAnalytics: React.FC<PatientAnalyticsProps> = ({ patientId }) => {
  const [metrics, setMetrics] = useState<PatientMetrics | null>(null);
  const [timeframeDays, setTimeframeDays] = useState(90);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await analyticsApi.getPatientMetrics(patientId, timeframeDays);
        setMetrics(data);
      } catch (err) {
        console.error('Error loading patient metrics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [patientId, timeframeDays]);