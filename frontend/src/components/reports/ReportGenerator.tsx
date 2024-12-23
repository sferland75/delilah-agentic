import React, { useState } from 'react';
import { ReportConfig, reportingApi } from '../../api/reportingApi';

const reportTypes = [
  { value: 'assessment', label: 'Assessment Report' },
  { value: 'patient', label: 'Patient Report' },
  { value: 'therapist', label: 'Therapist Report' },
  { value: 'summary', label: 'Summary Report' },
];

interface ReportGeneratorProps {
  onReportGenerated: (report: any) => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onReportGenerated }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'assessment' | 'patient' | 'therapist' | 'summary'>('assessment');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);