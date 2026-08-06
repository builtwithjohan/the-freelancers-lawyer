import * as pdfjsLib from 'pdfjs-dist';

// Set up CDN worker for Vite compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extracts plain contract text from a PDF ArrayBuffer or File object.
 */
export async function parsePdfFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }

    if (!fullText.trim()) {
      throw new Error('PDF appears to be scanned or contains no readable text layer.');
    }

    return fullText;
  } catch (err) {
    console.warn('PDF.js parsing failed, attempting fallback text decoding...', err);
    return fallbackPdfStreamExtract(file);
  }
}

/**
 * Basic text extraction fallback for unencrypted PDFs
 */
async function fallbackPdfStreamExtract(file) {
  const text = await file.text();
  // Filter out printable ASCII characters from PDF stream
  const matches = text.match(/[\x20-\x7E\s]{4,}/g);
  if (matches) {
    return matches
      .filter(line => !line.includes('PDF') && !line.includes('obj') && !line.includes('endobj'))
      .join('\n');
  }
  return text;
}
