import * as pdfjsLib from 'pdfjs-dist';

// Bundle worker locally or configure workerSrc safely (DI-06)
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (e) {
    // Fallback to local static or CDN worker if import URL resolves cross-origin
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
  }
}

/**
 * Extracts plain contract text from a PDF ArrayBuffer or File object.
 */
export async function parsePdfFile(file) {
  if (!file) {
    throw new Error('No PDF file provided.');
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
