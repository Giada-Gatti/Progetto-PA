import PDFDocument from 'pdfkit';
import { Move } from '../models/Move';

export const generatePDF = (moves: Move[]): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc.fontSize(16).text('Storico delle Mosse', { align: 'center' });
    doc.moveDown();

    moves.forEach((move) => {
      doc.fontSize(12).text(
        `Partita: ${move.matchId}, Posizione: ${move.position}, Data: ${move.createdAt.toLocaleString()}`
      );
      doc.moveDown(0.5);
    });

    doc.end();
  });
};