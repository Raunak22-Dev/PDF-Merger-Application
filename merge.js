import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import cron from 'node-cron';

function pagerange(range, totalPages) {
  if (range === 'all') {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const pages = new Set();
  const parts = range.split(',');

  parts.forEach((part) => {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map((n) => parseInt(n, 10) - 1);
      if (start >= 0 && end < totalPages && start <= end) {
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      }
    } else {
      const page = parseInt(part, 10) - 1;
      if (page >= 0 && page < totalPages) {
        pages.add(page);
      }
    }
  });

  return Array.from(pages).sort((a, b) => a - b);
}

export async function mergePdf(filePath1, pages1, filePath2, pages2) {
  const pdfDoc1 = fs.readFileSync(filePath1);
  const pdfDoc2 = fs.readFileSync(filePath2);

  const pdf1 = await PDFDocument.load(pdfDoc1);
  const pdf2 = await PDFDocument.load(pdfDoc2);

  const mergedPdf = await PDFDocument.create();

  const addPages = async (sourcePdf, pageRange) => {
    const totalPages = sourcePdf.getPageCount();
    const pageIndices = pagerange(pageRange, totalPages);

    if (pageIndices.length === 0) {
      throw new Error('No valid pages selected');
    }

    const copiedPages = await mergedPdf.copyPages(sourcePdf, pageIndices);
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  };

  await addPages(pdf1, pages1);
  await addPages(pdf2, pages2);

  const outputFile = `${Date.now()}.pdf`;
const outputPath = `public/${outputFile}`;

// Save the merged PDF to the output file
const mergedPdfBytes = await mergedPdf.save();
fs.writeFileSync(outputPath, mergedPdfBytes);

// Schedule file deletion after 10 minutes
cron.schedule('*/1 * * * *', () => {
  const fileAge = Date.now() - fs.statSync(outputPath).mtimeMs;
  if (fileAge > 600000) { // 10 minutes in ms
      fs.unlink(outputPath, (err) => {
          if (err) {
              console.error('Error deleting the file:', err);
          } else {
              console.log(`File ${outputFile} deleted after 10 minutes.`);
          }
      });
  }
});

return outputFile;

}
