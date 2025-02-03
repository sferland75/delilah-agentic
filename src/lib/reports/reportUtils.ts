import { Assessment } from '@/types/assessment';
import { Document, Paragraph, TextRun, HeadingLevel, TableRow, TableCell, Table, WidthType, AlignmentType } from 'docx';

export function formatSectionTitle(sectionName: string): string {
  return sectionName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

export function generateWordDocument(sections: Record<string, string>, assessment: Assessment): Document {
  const doc = new Document({
    title: "Occupational Therapy Assessment Report",
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: "Calibri",
            size: 24,  // 12pt
            color: "000000"
          },
          paragraph: {
            spacing: {
              line: 360,  // 1.5 line spacing
              before: 240,  // 12pt before
              after: 240   // 12pt after
            }
          }
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: "Calibri",
            size: 32,  // 16pt
            bold: true,
            color: "000000"
          },
          paragraph: {
            spacing: {
              before: 480,  // 24pt before
              after: 240    // 12pt after
            }
          }
        }
      ]
    }
  });

  // Add header
  doc.addSection({
    children: [
      new Paragraph({
        text: "OCCUPATIONAL THERAPY ASSESSMENT REPORT",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        text: `Date: ${new Date().toLocaleDateString()}`,
        alignment: AlignmentType.RIGHT
      }),
      new Paragraph({
        text: "CONFIDENTIAL MEDICO-LEGAL REPORT",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Client Name: ",
            bold: true
          }),
          new TextRun(`${assessment.demographics.firstName} ${assessment.demographics.lastName}`),
          new TextRun({
            text: "\nDate of Birth: ",
            bold: true
          }),
          new TextRun(assessment.demographics.dateOfBirth)
        ]
      })
    ]
  });

  // Add each section
  Object.entries(sections).forEach(([name, content]) => {
    doc.addParagraph(
      new Paragraph({
        text: formatSectionTitle(name),
        heading: HeadingLevel.HEADING_1
      })
    );

    // Split content into paragraphs and add each
    content.split('\n\n').forEach(paragraph => {
      doc.addParagraph(new Paragraph(paragraph));
    });
  });

  // Add footer
  doc.addParagraph(
    new Paragraph({
      children: [
        new TextRun({
          text: "\n\nPROFESSIONAL STATEMENT",
          bold: true
        }),
        new TextRun({
          text: "\nThis report has been generated based on a comprehensive occupational therapy assessment. All findings are based on objective measurements, standardized assessment protocols, and professional clinical judgment."
        })
      ]
    })
  );

  return doc;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatList(items: string[]): string {
  if (!items.length) return 'None reported.';
  return items.map(item => `• ${item}`).join('\n');
}

export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'Not assessed';
  return score.toString();
}