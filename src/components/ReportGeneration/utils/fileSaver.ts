import { format } from 'date-fns';

export class FileSaver {
  private sanitizeFilename(name: string): string {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }

  private getDefaultFilename(firstName: string, lastName: string): string {
    const date = format(new Date(), 'yyyy-MM-dd');
    const sanitizedName = this.sanitizeFilename(`${lastName}_${firstName}`);
    return `OT_Report_${sanitizedName}_${date}.docx`;
  }

  public async saveReport(content: string, firstName: string, lastName: string): Promise<void> {
    try {
      const filename = this.getDefaultFilename(firstName, lastName);
      const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving report:', error);
      throw new Error('Failed to save report');
    }
  }

  public async saveDraft(content: string, firstName: string, lastName: string): Promise<void> {
    try {
      const date = format(new Date(), 'yyyy-MM-dd');
      const sanitizedName = this.sanitizeFilename(`${lastName}_${firstName}`);
      const filename = `OT_Report_DRAFT_${sanitizedName}_${date}.docx`;
      
      const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving draft:', error);
      throw new Error('Failed to save draft report');
    }
  }
}

export default new FileSaver();