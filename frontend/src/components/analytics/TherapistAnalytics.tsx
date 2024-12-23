import React, { useState, useEffect } from 'react';
import { TherapistMetrics, analyticsApi } from '../../api/analyticsApi';

interface TherapistAnalyticsProps {
  therapistId: string;
}

const TherapistAnalytics: React.FC<TherapistAnalyticsProps> = ({ therapistId }) => {
  const [metrics, setMetrics] = useState<TherapistMetrics | null>(null);
  const [timeframeDays, setTimeframeDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await analyticsApi.getTherapistMetrics(therapistId, timeframeDays);
        setMetrics(data);
      } catch (err) {
        console.error('Error loading therapist metrics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [therapistId, timeframeDays]);