import React, { useState, useEffect } from 'react';
import { AssessmentStatus as Status, workflowApi } from '../../api/workflowApi';

interface AssessmentStatusProps {
  assessmentId: string;
  currentStatus: Status;
  userId: string;
  onStatusChange: (newStatus: Status) => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  pending_review: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  returned: 'bg-red-100 text-red-800',
};

const statusLabels = {
  draft: 'Draft',
  in_progress: 'In Progress',
  pending_review: 'Pending Review',
  reviewed: 'Reviewed',
  completed: 'Completed',
  returned: 'Returned for Revision',
};

const AssessmentStatus: React.FC<AssessmentStatusProps> = ({
  assessmentId,
  currentStatus,
  userId,
  onStatusChange,
}) => {
  const [possibleTransitions, setPossibleTransitions] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTransitionMenu, setShowTransitionMenu] = useState(false);

  useEffect(() => {
    const loadPossibleTransitions = async () => {
      try {
        const transitions = await workflowApi.getPossibleTransitions(
          assessmentId,
          currentStatus,
          userId
        );
        setPossibleTransitions(transitions);
      } catch (err) {
        console.error('Error loading possible transitions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load transitions');
      }
    };

    loadPossibleTransitions();
  }, [assessmentId, currentStatus, userId]);

  const handleTransition = async (newStatus: Status) => {
    setLoading(true);
    setError(null);
    try {
      await workflowApi.transitionStatus(
        assessmentId,
        currentStatus,
        newStatus,
        userId
      );
      onStatusChange(newStatus);
      setShowTransitionMenu(false);
    } catch (err) {
      console.error('Error transitioning status:', err);
      setError(err instanceof Error ? err.message : 'Failed to change status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[currentStatus]}`}>
          {statusLabels[currentStatus]}
        </span>
        
        {possibleTransitions.length > 0 && (
          <button
            onClick={() => setShowTransitionMenu(!showTransitionMenu)}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            <svg
              className="h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {showTransitionMenu && possibleTransitions.length > 0 && (
        <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu">
            {possibleTransitions.map(status => (
              <button
                key={status}
                onClick={() => handleTransition(status)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
                role="menuitem"
              >
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${statusColors[status]}`} />
                {statusLabels[status]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentStatus;