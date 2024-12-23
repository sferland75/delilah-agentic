import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Assessment, Documentation, Analysis, TestData } from '../types/assessment';
import testData from '../tests/test_data_batch.json';

const AssessmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<Assessment | undefined>();
  const [documentation, setDocumentation] = useState<Documentation | undefined>();
  const [analysis, setAnalysis] = useState<Analysis | undefined>();

  useEffect(() => {
    // Find the specific assessment
    const foundAssessment = (testData as TestData).assessments
      .find((a: Assessment) => a.id === id);
    setAssessment(foundAssessment);

    // Find corresponding documentation
    const foundDocumentation = (testData as TestData).documentations
      .find((d: Documentation) => d.assessment_id === id);
    setDocumentation(foundDocumentation);

    // Find corresponding analysis
    const foundAnalysis = (testData as TestData).analyses
      .find((a: Analysis) => a.assessment_id === id);
    setAnalysis(foundAnalysis);
  }, [id]);

  // Transform scores data for display
  const scoresData = assessment ? Object.entries(assessment.scores).map(
    ([domain, scores]) => ({
      domain,
      rawScore: scores.raw_score,
      percentile: scores.percentile
    })
  ) : [];

  if (!assessment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Assessment Detail</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Patient Information</h3>
        <p>Patient Name: {assessment.patient_name}</p>
        <p>Assessment Type: {assessment.assessment_type}</p>
        <p>Status: {assessment.status}</p>
        <p>Date: {assessment.date}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Scores</h3>
        {scoresData.map(score => (
          <div key={score.domain} className="mb-4">
            <p className="font-medium">{score.domain}:</p>
            <p>Raw Score: {score.rawScore}</p>
            <p>Percentile: {score.percentile}</p>
          </div>
        ))}
      </div>

      {documentation && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Documentation</h3>
          <p>{documentation.content}</p>
        </div>
      )}

      {analysis && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Analysis</h3>
          <p>{analysis.findings}</p>
        </div>
      )}
    </div>
  );
};

export default AssessmentDetail;