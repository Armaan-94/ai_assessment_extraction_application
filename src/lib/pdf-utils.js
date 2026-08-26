export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function fileToImages(file) {
  if (file.type === 'application/pdf') {
    return await pdfToImages(file);
  }
  // For image files, return as-is in base64
  const base64 = await fileToBase64(file);
  return [base64];
}

async function pdfToImages(file) {
  const arrayBuffer = await file.arrayBuffer();
  
  // Dynamically import pdfjs-dist to ensure it only runs on the client
  const pdfJS = await import('pdfjs-dist');
  
  // Point to the worker source in the public directory
  pdfJS.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  
  const loadingTask = pdfJS.getDocument(arrayBuffer);
  const pdf = await loadingTask.promise;
  const images = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    // Render at a higher scale for better OCR accuracy
    const viewport = page.getViewport({ scale: 2.0 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    images.push(canvas.toDataURL('image/jpeg', 0.6));
  }
  
  return images;
}
