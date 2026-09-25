import React from 'react';
import { RECEIPT_TEMPLATES } from '@/templates/ReceiptTemplateRegistry';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ReceiptPreview({ formData }) {
  const { t, language } = useLanguage();
  const { template } = formData;

  const selectedTemplate = RECEIPT_TEMPLATES.find((tpl) => tpl.id === template) || RECEIPT_TEMPLATES[0];
  const TemplateRenderer = selectedTemplate.render;
  const showWatermark = Boolean(formData.visibility?.showWatermark);
  const showPaidStamp = Boolean(formData.isPaid);

  return (
    <div id="receipt-preview" className="relative transition-all duration-300">
      <TemplateRenderer formData={formData} t={t} language={language} />

      {showWatermark && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-25deg)',
            fontSize: '24px',
            fontWeight: 700,
            color: 'rgba(0,0,0,0.3)',
            textAlign: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            lineHeight: 1.4,
            zIndex: 1,
            width: '80%',
          }}
        >
          {formData.storeName}
          {formData.address && (
            <>
              <br />
              <span style={{ fontSize: '14px' }}>{formData.address}</span>
            </>
          )}
        </div>
      )}

      {showPaidStamp && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-20deg)',
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'rgba(255,0,0,.5)',
            border: '4px solid rgba(255,0,0,.5)',
            padding: '20px 40px',
            borderRadius: '10px',
            pointerEvents: 'none',
            userSelect: 'none',
            textTransform: 'uppercase',
            fontFamily: "'Impact', Arial, sans-serif",
            zIndex: 2,
            whiteSpace: 'nowrap',
          }}
        >
          {language === 'en' ? 'PAID' : 'LUNAS'}
        </div>
      )}
    </div>
  );
}
