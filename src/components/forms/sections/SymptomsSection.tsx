import React from 'react';
import { useForm as useFormContext } from '@/context/FormContext';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BodyMap } from '@/components/BodyMap';
import { PainAssessment } from '@/components/BodyMap/PainAssessment';
import { Badge } from "@/components/ui/badge";
import { locationToSegmentMap } from '@/components/BodyMap/segments';

export const SymptomsSection: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const [selectedRegion, setSelectedRegion] = React.useState<any>(null);

  // Convert symptoms to pain data format for body map
  const painData = React.useMemo(() => {
    if (!formData?.medical?.symptoms) return {};
    
    const result = formData.medical.symptoms.reduce((acc: any, symptom: any) => {
      if (symptom.type.includes('Pain')) {
        // Get mapped segments for this location
        const segmentIds = locationToSegmentMap[symptom.location] || [symptom.location.toLowerCase()];

        // Parse severity - extract number from format like "7/10"
        const severityValue = parseInt(symptom.severity.split('/')[0], 10);

        // Apply pain data to all mapped segments
        segmentIds.forEach(segmentId => {
          acc[segmentId] = {
            severity: severityValue,
            qualifiers: symptom.aggravating?.reduce((q: any, factor: string) => {
              q[factor] = true;
              return q;
            }, {}) || {},
            comments: symptom.comments || ''
          };
        });
      }
      return acc;
    }, {});

    return result;
  }, [formData?.medical?.symptoms]);

  const handleRegionSelect = (region: any) => {
    setSelectedRegion(region);
  };

  const handlePainAssessmentSave = (painAssessmentData: any) => {
    const existingSymptoms = formData.medical?.symptoms || [];
    const regionIndex = existingSymptoms.findIndex(
      (s: any) => locationToSegmentMap[s.location]?.includes(selectedRegion.id) ||
                  s.location.toLowerCase() === selectedRegion.id
    );

    let updatedSymptoms;
    if (regionIndex >= 0) {
      updatedSymptoms = existingSymptoms.map((symptom: any, index: number) =>
        index === regionIndex
          ? {
              location: selectedRegion.label,
              type: 'Pain',
              severity: painAssessmentData.severity.toString(),
              frequency: painAssessmentData.frequency || 'As reported',
              aggravating: Object.keys(painAssessmentData.qualifiers || {})
                .filter(k => painAssessmentData.qualifiers[k] && k.includes('With')),
              relieving: Object.keys(painAssessmentData.qualifiers || {})
                .filter(k => painAssessmentData.qualifiers[k] && !k.includes('With')),
              comments: painAssessmentData.comments
            }
          : symptom
      );
    } else {
      updatedSymptoms = [
        ...existingSymptoms,
        {
          location: selectedRegion.label,
          type: 'Pain',
          severity: painAssessmentData.severity.toString(),
          frequency: painAssessmentData.frequency || 'As reported',
          aggravating: Object.keys(painAssessmentData.qualifiers || {})
            .filter(k => painAssessmentData.qualifiers[k] && k.includes('With')),
          relieving: Object.keys(painAssessmentData.qualifiers || {})
            .filter(k => painAssessmentData.qualifiers[k] && !k.includes('With')),
          comments: painAssessmentData.comments
        }
      ];
    }

    updateFormData({
      ...formData,
      medical: {
        ...formData.medical,
        symptoms: updatedSymptoms
      }
    });

    setSelectedRegion(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Body Map */}
        <Card>
          <CardContent className="pt-6">
            <Label className="text-lg font-semibold mb-4">Body Map</Label>
            <BodyMap 
              onRegionSelect={handleRegionSelect}
              painData={painData}
            />
          </CardContent>
        </Card>

        {/* Pain Assessment */}
        <div>
          {selectedRegion ? (
            <PainAssessment
              region={selectedRegion}
              initialData={painData[selectedRegion.id]}
              onSave={handlePainAssessmentSave}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  Select a region on the body map to assess pain
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Symptoms Summary */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="text-lg font-semibold mb-4">Symptoms Summary</h4>
          <div className="space-y-4">
            {formData?.medical?.symptoms?.map((symptom: any, index: number) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <h5 className="font-medium">{symptom.location}</h5>
                  <Badge variant="secondary">{symptom.type}</Badge>
                  <Badge variant="outline">Severity: {symptom.severity}</Badge>
                  <Badge>{symptom.frequency}</Badge>
                </div>

                {symptom.aggravating?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Aggravating Factors:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {symptom.aggravating.map((factor: string, i: number) => (
                        <Badge key={i} variant="destructive">{factor}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {symptom.relieving?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Relieving Factors:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {symptom.relieving.map((factor: string, i: number) => (
                        <Badge key={i} variant="secondary">{factor}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {symptom.comments && (
                  <p className="mt-2 text-sm text-muted-foreground">{symptom.comments}</p>
                )}
              </div>
            ))}

            {(!formData?.medical?.symptoms || formData.medical.symptoms.length === 0) && (
              <p className="text-muted-foreground text-center">No symptoms recorded yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SymptomsSection;