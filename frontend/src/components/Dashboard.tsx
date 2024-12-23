import React from 'react';
import { Assessment, TestData } from '../types/assessment';
import testData from '../tests/test_data_batch.json';

const Dashboard: React.FC = () => {
  const typedData = testData as TestData;

  // Assessment Status Distribution
  const statusData = [
    { name: 'Draft', value: typedData.assessments.filter((a: Assessment) => a.status === 'draft').length },
    { name: 'In Progress', value: typedData.assessments.filter((a: Assessment) => a.status === 'in_progress').length },
    { name: 'Completed', value: typedData.assessments.filter((a: Assessment) => a.status === 'completed').length },
    { name: 'Reviewed', value: typedData.assessments.filter((a: Assessment) => a.status === 'reviewed').length }
  ];

  // Assessment Type Distribution
  const assessmentTypeData = Object.entries(
    typedData.assessments.reduce((acc: Record<string, number>, assessment: Assessment) => {
      acc[assessment.assessment_type] = (acc[assessment.assessment_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({
    name: type,
    value: count
  }));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Assessment Status</h3>
          <div>
            {statusData.map(item => (
              <div key={item.name} className="mb-2">
                <div className="flex justify-between">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Assessment Types</h3>
          <div>
            {assessmentTypeData.map(item => (
              <div key={item.name} className="mb-2">
                <div className="flex justify-between">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;