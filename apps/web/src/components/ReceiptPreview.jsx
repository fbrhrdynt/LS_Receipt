import React from 'react';
import { RECEIPT_TEMPLATES } from '@/utils/ReceiptTemplates';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ReceiptPreview({ formData }) {
  const { t, language } = useLanguage();
  const { template } = formData;
  
  // Find the selected template object
  const selectedTemplate = RECEIPT_TEMPLATES.find(tpl => tpl.id === template) || RECEIPT_TEMPLATES[0];
  const TemplateRenderer = selectedTemplate.render;

  return (
    <div id="receipt-preview" className="relative transition-all duration-300">
      {/* Pass both formData and translated context (t, language) to the template component */}
      <TemplateRenderer formData={formData} t={t} language={language} />
    </div>
  );
}