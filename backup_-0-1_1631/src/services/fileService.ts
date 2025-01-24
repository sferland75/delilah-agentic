import { ipcRenderer } from 'electron';

export const fileService = {
  async saveAssessment(content: any, filePath: string) {
    try {
      const result = await ipcRenderer.invoke('save-file', {
        content: JSON.stringify(content, null, 2),
        filePath
      });
      return result;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  },

  async loadAssessment(filePath: string) {
    try {
      const result = await ipcRenderer.invoke('open-file', filePath);
      if (result.success) {
        return JSON.parse(result.content);
      }
      throw new Error(result.error);
    } catch (error) {
      console.error('Error loading file:', error);
      throw error;
    }
  }
};