'use server';

import { readFile } from 'fs/promises';
import { join } from 'path';

// =================================================
// Helper function for the rules PDF file
// - to make sure user can download the PDF
// =================================================
export async function downloadRulesPDF() {
  try {
    const pdfPath = join(
      process.cwd(),
      'public',
      'PvPPetBattleTournamentRules.pdf',
    );
    const pdfBuffer = await readFile(pdfPath);

    return {
      success: true,
      data: pdfBuffer.toString('base64'),
      mimeType: 'application/pdf',
    };
  } catch (error) {
    console.error('Error reading rules document:', error);
    return { success: false, error: 'Rules document not found' };
  }
}
