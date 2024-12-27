import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { extract } from 'unrar-promise';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  const { cbr } = await request.json();
  const cbrPath = path.resolve('/path/to/cbr/files', cbr);
  const outputDir = path.resolve('/path/to/output/dir');

  try {
    // Extract CBR file
    await extract(cbrPath, outputDir);

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Read extracted images and add them to the PDF
    const files = fs.readdirSync(outputDir);
    for (const file of files) {
      const filePath = path.join(outputDir, file);
      const imageBytes = fs.readFileSync(filePath);
      const image = await pdfDoc.embedJpg(imageBytes); // Assuming images are in JPG format
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();

    // Save the PDF to a file
    const pdfPath = path.resolve(outputDir, 'output.pdf');
    fs.writeFileSync(pdfPath, pdfBytes);

    return NextResponse.json({ status: 'ok', pdfPath });
  } catch (error) {
    console.error(`Error: ${error}`);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}