import React, { useState } from 'react';
import { ReportResult } from '../../api/reportingApi';

interface ReportViewerProps {
  report: ReportResult;
  onBack: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report, onBack }) => {
  const [selectedView, setSelectedView] = useState<'table' | 'summary'>('table');

  const renderValue = (value: any) => {
    if (typeof value === 'number') {
      return value.toFixed(1);
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return String(value);
  };

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Object.keys(report.data[0] || {}).map((key) => (
              <th
                key={key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {key.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {report.data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value: any, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {renderValue(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSummaryView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(report.summary || {}).map(([metric, stats]) => (
        <div key={metric} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 capitalize mb-4">
            {metric.replace(/_/g, ' ')}
          </h3>
          <dl className="grid grid-cols-2 gap-4">
            {Object.entries(stats as Record<string, number>).map(([stat, value]) => (
              <div key={stat}>
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  {stat.replace(/_/g, ' ')}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {renderValue(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{report.configId}</h2>
          <p className="text-sm text-gray-500">
            Generated on {new Date(report.generatedAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Reports
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setSelectedView('table')}
          className={`py-2 px-4 text-sm font-medium ${
            selectedView === 'table'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Data Table
        </button>
        {report.summary && (
          <button
            onClick={() => setSelectedView('summary')}
            className={`py-2 px-4 text-sm font-medium ${
              selectedView === 'summary'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Summary
          </button>
        )}
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {selectedView === 'table' ? renderTableView() : renderSummaryView()}
      </div>

      {/* Metadata */}
      {report.metadata && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(report.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => {
            // TODO: Implement CSV export
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Export CSV
        </button>
        <button
          onClick={() => {
            // TODO: Implement PDF export
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default ReportViewer;