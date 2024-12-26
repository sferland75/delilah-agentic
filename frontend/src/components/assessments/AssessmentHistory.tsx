import React, { useState, useEffect } from 'react';
import { ChangelogEntry, changelogApi } from '../../api/changelogApi';

interface AssessmentHistoryProps {
  assessmentId: string;
}

const AssessmentHistory: React.FC<AssessmentHistoryProps> = ({ assessmentId }) => {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await changelogApi.getAssessmentHistory(assessmentId);
        setEntries(history);
      } catch (err) {
        console.error('Error loading assessment history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [assessmentId]);

  const formatChange = (change: any) => {
    if (typeof change === 'object' && change !== null) {
      const { old, new: newValue } = change;
      return (
        <span>
          <span className="line-through text-red-500">{JSON.stringify(old)}</span>
          <span className="mx-2">→</span>
          <span className="text-green-500">{JSON.stringify(newValue)}</span>
        </span>
      );
    }
    return JSON.stringify(change);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading history...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        Error: {error}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No history entries found for this assessment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Assessment History</h2>
      
      <div className="flow-root">
        <ul className="-mb-8">
          {entries.map((entry, entryIdx) => (
            <li key={entry.id}>
              <div className="relative pb-8">
                {entryIdx !== entries.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                
                <div className="relative flex space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    {entry.action === 'create' && (
                      <span className="text-green-500">+</span>
                    )}
                    {entry.action === 'update' && (
                      <span className="text-blue-500">↻</span>
                    )}
                    {entry.action === 'review' && (
                      <span className="text-purple-500">✓</span>
                    )}
                  </div>
                  
                  <div className="flex min-w-0 flex-1 justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">
                          {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                        </span>
                        {' by User '}<span className="font-medium">{entry.userId}</span>
                      </p>
                      
                      {Object.entries(entry.changes).length > 0 && (
                        <div className="mt-2 text-sm text-gray-700">
                          <details>
                            <summary className="cursor-pointer hover:text-gray-900">
                              View Changes
                            </summary>
                            <div className="mt-2 pl-4 border-l-2 border-gray-200">
                              {Object.entries(entry.changes).map(([key, value]) => (
                                <div key={key} className="py-1">
                                  <span className="font-medium">{key}:</span>{' '}
                                  {formatChange(value)}
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}
                      
                      {entry.metadata && (
                        <div className="mt-2 text-sm text-gray-500">
                          <details>
                            <summary className="cursor-pointer hover:text-gray-700">
                              Additional Details
                            </summary>
                            <div className="mt-2 pl-4 border-l-2 border-gray-200">
                              <pre className="text-xs">
                                {JSON.stringify(entry.metadata, null, 2)}
                              </pre>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                    
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={entry.createdAt}>
                        {new Date(entry.createdAt).toLocaleString()}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AssessmentHistory;