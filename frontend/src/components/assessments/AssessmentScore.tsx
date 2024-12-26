import React, { useState, useEffect } from 'react';
import { ScoringResult, scoringApi } from '../../api/scoringApi';

interface AssessmentScoreProps {
  assessmentId: string;
  onScoreUpdate?: (score: ScoringResult) => void;
}

const scoreLabelColors = {
  High: 'text-green-700 bg-green-100',
  Medium: 'text-yellow-700 bg-yellow-100',
  Low: 'text-red-700 bg-red-100',
};

const AssessmentScore: React.FC<AssessmentScoreProps> = ({
  assessmentId,
  onScoreUpdate,
}) => {
  const [score, setScore] = useState<ScoringResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScore = async () => {
      try {
        const scoreData = await scoringApi.getAssessmentScore(assessmentId);
        setScore(scoreData);
        onScoreUpdate?.(scoreData);
      } catch (err) {
        console.error('Error loading assessment score:', err);
        setError(err instanceof Error ? err.message : 'Failed to load score');
      } finally {
        setLoading(false);
      }
    };

    loadScore();
  }, [assessmentId, onScoreUpdate]);

  const recalculateScore = async () => {
    setLoading(true);
    setError(null);
    try {
      const newScore = await scoringApi.scoreAssessment(assessmentId);
      setScore(newScore);
      onScoreUpdate?.(newScore);
    } catch (err) {
      console.error('Error calculating assessment score:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate score');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-gray-600">Loading score...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="text-gray-500 text-center py-4">
        No score available
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold">Assessment Score</h2>
        <button
          onClick={recalculateScore}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Recalculate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Score */}
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-gray-700">
            {score.totalScore.toFixed(1)}
          </div>
          {score.scoreLabel && (
            <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
              scoreLabelColors[score.scoreLabel as keyof typeof scoreLabelColors]
            }`}>
              {score.scoreLabel}
            </div>
          )}
          <div className="mt-2 text-sm text-gray-500">Total Score</div>
        </div>

        {/* Section Scores */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Section Scores</h3>
          {Object.entries(score.sectionScores).map(([sectionId, sectionScore]) => (
            <div key={sectionId} className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Section {sectionId}</div>
              <div className="font-medium">{sectionScore.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Scores */}
      {Object.keys(score.fieldScores).length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Field Scores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(score.fieldScores).map(([fieldId, fieldScore]) => (
              <div
                key={fieldId}
                className="bg-gray-50 p-3 rounded flex justify-between items-center"
              >
                <div className="text-sm text-gray-600">{fieldId}</div>
                <div className="font-medium">{fieldScore.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score Details */}
      {score.details && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Details</h3>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(score.details, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentScore;