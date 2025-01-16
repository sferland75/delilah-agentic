// Force cache refresh - 2025-01-14
import { Toaster } from "@/components/ui/toaster";
import AssessmentForm from "@/components/forms/AssessmentForm";
import { FormProvider } from './context/FormContext';
import { Header } from './components/Header';

export default function App() {
  return (
    <FormProvider>
      <Header />
      <main className="container mx-auto p-4">
        <AssessmentForm />
      </main>
      <Toaster />
    </FormProvider>
  );
}