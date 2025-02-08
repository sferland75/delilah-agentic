import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { BodyMap } from '../BodyMap';
import { PainFindingsTable } from './PainFindingsTable';
import EmotionalSymptoms from './EmotionalSymptoms';
import CognitiveSymptoms from './CognitiveSymptoms';

export default function SymptomsSection() {
  const [activeTab, setActiveTab] = React.useState("physical");
  const { getValues, setValue } = useFormContext();
  const [localPainData, setLocalPainData] = React.useState<Record<string, any>>({});

  // Initialize or update pain data when form values change
  React.useEffect(() => {
    const medical = getValues('medical');
    console.log('Current medical data:', medical);
    
    // Initialize or update pain data
    setLocalPainData(medical?.pain || {});
  }, [getValues]);

  const handlePainDataUpdate = (regionId: string, data: any) => {
    console.log('Updating pain data:', { regionId, data });

    // Update local state
    const newPainData = {
      ...localPainData,
      [regionId]: data
    };
    setLocalPainData(newPainData);

    // Update form state
    const currentMedical = getValues('medical') || {};
    setValue('medical', {
      ...currentMedical,
      pain: newPainData
    }, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });

    // Verify the update
    console.log('Local pain data after update:', newPainData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Symptoms Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={activeTab === "physical" ? "default" : "outline"}
              onClick={() => setActiveTab("physical")}
            >
              Physical
            </Button>
            <Button
              variant={activeTab === "emotional" ? "default" : "outline"}
              onClick={() => setActiveTab("emotional")}
            >
              Emotional
            </Button>
            <Button
              variant={activeTab === "cognitive" ? "default" : "outline"}
              onClick={() => setActiveTab("cognitive")}
            >
              Cognitive
            </Button>
          </div>

          {/* Content */}
          {activeTab === "physical" && (
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Anterior View</h3>
                <BodyMap 
                  view="anterior" 
                  onPainDataUpdate={handlePainDataUpdate}
                  painData={localPainData}
                />
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Posterior View</h3>
                <BodyMap 
                  view="posterior"
                  onPainDataUpdate={handlePainDataUpdate}
                  painData={localPainData}
                />
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Pain Findings</h3>
                <PainFindingsTable painData={localPainData} />
              </Card>
            </div>
          )}
          
          {activeTab === "emotional" && <EmotionalSymptoms />}
          
          {activeTab === "cognitive" && <CognitiveSymptoms />}
        </CardContent>
      </Card>
    </div>
  );
}