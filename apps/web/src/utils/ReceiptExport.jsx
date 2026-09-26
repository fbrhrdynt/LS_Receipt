import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function getReceiptElement(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error('Receipt element not found');
  }

  return element;
}

export async function exportAsJPG(elementId, filename = 'receipt.jpg') {
  const element = getReceiptElement(elementId);
  const canvas = await html2canvas(element, {
    scale: 3,
    backgroundColor: '#ffffff',
    logging: false,
    useCORS: true,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/jpeg', 0.95);
  link.click();
  return true;
}

export async function exportAsPNG(elementId, filename = 'receipt.png') {
  const element = getReceiptElement(elementId);
  const canvas = await html2canvas(element, {
    scale: 3,
    backgroundColor: '#ffffff',
    logging: false,
    useCORS: true,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
  return true;
}

export async function exportAsPDF(elementId, filename = 'receipt.pdf') {
  const element = getReceiptElement(elementId);
  const canvas = await html2canvas(element, {
    scale: 3,
    backgroundColor: '#ffffff',
    logging: false,
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const pdf = new jsPDF({
    orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
    unit: 'px',
    format: [imgWidth / 3, imgHeight / 3],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth / 3, imgHeight / 3);
  pdf.save(filename);
  return true;
}

export function printReceipt(elementId) {
  getReceiptElement(elementId);

  const cleanup = () => {
    document.body.classList.remove('receipt-printing');
  };

  document.body.classList.add('receipt-printing');
  window.addEventListener('afterprint', cleanup, { once: true });

  requestAnimationFrame(() => {
    window.print();
  });

  window.setTimeout(cleanup, 30000);
  return true;
}
