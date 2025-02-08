import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { BodyMap } from '../BodyMap';
import { PainFindingsTable } from './PainFindingsTable';
import EmotionalSymptoms from './EmotionalSymptoms';
import CognitiveSymptoms from './CognitiveSymptoms';

export default function SymptomsSection() {
  const [activeTab, setActiveTab] = React.useState("physical");
  const { getValues, setValue } = useFormContext();
  const [localPainData, setLocalPainData] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    const medical = getValues('medical');
    setLocalPainData(medical?.pain || {});
  }, [getValues]);

  const handlePainDataUpdate = (regionId: string, data: any) => {
    const newPainData = {
      ...localPainData,
      [regionId]: data
    };
    setLocalPainData(newPainData);

    const currentMedical = getValues('medical') || {};
    setValue('medical', {
      ...currentMedical,
      pain: newPainData
    }, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const tabs = [
    { id: 'physical', label: 'Physical', icon: '+' },
    { id: 'emotional', label: 'Emotional', icon: '♡' },
    { id: 'cognitive', label: 'Cognitive', icon: '◎' }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          {/* Tab Navigation */}
          <div className="bg-slate-100/80 p-1 rounded-md mb-6">
            <div className="flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-sm transition-colors
                    ${activeTab === tab.id 
                      ? 'bg-[#2563EB] text-white' 
                      : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {activeTab === "physical" && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Anterior View</h3>
                <div className="border rounded-md p-4">
                  <BodyMap 
                    view="anterior" 
                    onPainDataUpdate={handlePainDataUpdate}
                    painData={localPainData}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Posterior View</h3>
                <div className="border rounded-md p-4">
                  <BodyMap 
                    view="posterior"
                    onPainDataUpdate={handlePainDataUpdate}
                    painData={localPainData}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Pain Findings</h3>
                <div className="border rounded-md p-4">
                  <PainFindingsTable painData={localPainData} />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "emotional" && <EmotionalSymptoms />}
          
          {activeTab === "cognitive" && <CognitiveSymptoms />}
        </CardContent>
      </Card>
    </div>
  );
}