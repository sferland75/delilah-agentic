export const loadJSONFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        console.log('Loaded file content:', data);

        // Extract assessment data
        const assessmentData = data.metadata && data.assessment ? data.assessment : data;
        console.log('Extracted assessment data:', assessmentData);
        
        // Save to localStorage
        localStorage.setItem('form_draft', JSON.stringify(assessmentData));
        localStorage.setItem('form_last_saved', new Date().toISOString());
        
        resolve(assessmentData);
      } catch (error) {
        console.error('Error parsing file:', error);
        reject(new Error('Failed to parse JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};