import { AssessmentFormData } from '@/lib/validation/assessment-schema';

interface AssessmentFile {
  metadata: {
    version: string;
    exportDate: string;
    lastModified: string;
    exportType: 'draft' | 'final';
  };
  assessment: AssessmentFormData;
}

export const fileService = {
  async saveAssessment(content: AssessmentFile): Promise<string> {
    try {
      const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessment_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return 'saved';
    } catch (error) {
      console.error('Error saving assessment:', error);
      throw error;
    }
  },

  async loadAssessment(file: File): Promise<AssessmentFile> {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          try {
            const content = JSON.parse(event.target.result as string);
            
            // Validate structure
            if (!content.metadata || !content.assessment) {
              throw new Error('Invalid assessment file structure');
            }
            
            // Store in localStorage as draft
            localStorage.setItem('assessment_form_draft', JSON.stringify({
              version: '1.0.0',
              timestamp: Date.now(),
              data: content.assessment
            }));
            
            resolve(content);
          } catch (error) {
            reject(error);
          }
        };
        
        reader.onerror = () => reject(new Error('Error reading file'));
        reader.readAsText(file);
      });
    } catch (error) {
      console.error('Error loading assessment:', error);
      throw error;
    }
  }
};