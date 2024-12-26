import React from 'react';

type Overview = {
  total_assessments: number;
}

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
      <p className="text-gray-600">Analytics functionality coming soon!</p>
    </div>
  );
};

export default AnalyticsDashboard;