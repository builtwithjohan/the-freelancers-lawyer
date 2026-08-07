import workerUrl from 'pdfjs-dist/build/pdf.worker.js?url';

/**
 * Lazy-loaded PDF document parser (DI-05, DI-06, bundle splitting)
 */
export async function parsePdfFile(file) {
  if (!file) {
    throw new Error('No PDF file provided.');
  }

  // Dynamically import pdfjs-dist only when a PDF file is uploaded
  const pdfjsLib = await import('pdfjs-dist');
  
  if (pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, useSystemFonts: true });
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
    // Surface clear error instead of silent binary stream fallback (DI-05)
    throw new Error('Unable to extract text layer from PDF. Document may be scanned, image-only, or password-protected.');
  }

  return fullText.trim();
}
