import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { useForm as useDelilahForm } from '@/context/FormContext';
import { BodyMap } from '../BodyMap';
import { PainFindingsTable } from './PainFindingsTable';
import EmotionalSymptoms from './EmotionalSymptoms';
import CognitiveSymptoms from './CognitiveSymptoms';

// First let's just create a simple tab navigation with buttons
export default function SymptomsSection() {
  const [activeTab, setActiveTab] = React.useState("physical");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Symptoms Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Simple Button Navigation */}
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
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <BodyMap onUpdate={() => {}} />
              </div>
              <PainFindingsTable />
            </>
          )}
          
          {activeTab === "emotional" && <EmotionalSymptoms />}
          
          {activeTab === "cognitive" && <CognitiveSymptoms />}
        </CardContent>
      </Card>
    </div>
  );
}