// Force cache refresh - 2025-01-13
import { Toaster } from "@/components/ui/toaster";
import { AssessmentForm } from "@/components/forms/AssessmentForm";

export default function App() {
  return (
    <>
      <main>
        <AssessmentForm />
      </main>
      <Toaster />
    </>
  );
}