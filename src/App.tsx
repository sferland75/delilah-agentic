import React from 'react';
import AssessmentForm from './components/forms/AssessmentForm';
import { FormProvider } from './context/FormProvider';
import { Toaster } from "@/components/ui/toaster";
import { SaveControls } from './components/SaveControls';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FormProvider>
        <div className="flex flex-col min-h-screen">
          <div className="h-16 border-b bg-white flex items-center justify-between px-4">
            <div className="text-lg font-semibold">Delilah Assessment System</div>
            <SaveControls />
          </div>
          <main className="flex-1 container mx-auto py-6">
            <AssessmentForm />
          </main>
        </div>
        <Toaster />
      </FormProvider>
    </div>
  );
}

export default App;