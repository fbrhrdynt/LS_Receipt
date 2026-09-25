import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export async function exportAsJPG(elementId, filename = 'receipt.jpg') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Receipt element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();

    return true;
  } catch (error) {
    console.error('Export JPG error:', error);
    throw error;
  }
}

export async function exportAsPNG(elementId, filename = 'receipt.png') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Receipt element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();

    return true;
  } catch (error) {
    console.error('Export PNG error:', error);
    throw error;
  }
}

export async function exportAsPDF(elementId, filename = 'receipt.pdf') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Receipt element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
      unit: 'px',
      format: [imgWidth / 3, imgHeight / 3]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth / 3, imgHeight / 3);
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('Export PDF error:', error);
    throw error;
  }
}

export function printReceipt(elementId) {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Receipt element not found');
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            body { margin: 0; padding: 20px; }
            @media print {
              body { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();

    return true;
  } catch (error) {
    console.error('Print error:', error);
    throw error;
  }
}