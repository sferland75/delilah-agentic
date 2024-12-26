import React from 'react';

interface PatientAnalyticsProps {
  patientId: string;
}

const PatientAnalytics: React.FC<PatientAnalyticsProps> = ({ patientId }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Patient Analytics</h2>
      <p className="text-gray-600">Patient analytics functionality coming soon!</p>
      <p className="text-sm text-gray-500">Patient ID: {patientId}</p>
    </div>
  );
};

export default PatientAnalytics;