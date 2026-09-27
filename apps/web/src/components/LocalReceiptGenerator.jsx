import React, { useState } from 'react';
import { FilePenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateLocalReceipt } from '@/utils/LocalReceiptGenerator';

export default function LocalReceiptGenerator({ onGenerate }) {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [missingFields, setMissingFields] = useState([]);
  const [message, setMessage] = useState('');

  const handleGenerate = () => {
    const result = generateLocalReceipt(prompt);

    if (!result.ok) {
      setMissingFields(result.missingFields);
      setMessage('');
      return;
    }

    setMissingFields([]);
    setMessage(t('smartGenerator.success'));
    onGenerate(result.formData);
  };

  return (
    <section className="mb-8 rounded-lg border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <FilePenLine className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-semibold">{t('smartGenerator.title')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {t('smartGenerator.description')}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="smart-receipt-prompt" className="text-sm font-medium">
          {t('smartGenerator.promptLabel')}
        </label>

        <Textarea
          id="smart-receipt-prompt"
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value);
            setMissingFields([]);
            setMessage('');
          }}
          placeholder={t('smartGenerator.placeholder')}
          rows={4}
          maxLength={1000}
          className="mt-2 resize-y"
        />

        <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{t('smartGenerator.requiredHint')}</span>
          <span>{t('smartGenerator.localHint')}</span>
        </div>
      </div>

      {missingFields.length > 0 && (
        <div
          role="alert"
          className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm"
        >
          <div className="font-semibold">{t('smartGenerator.missingTitle')}</div>
          <div className="mt-1 text-muted-foreground">
            {missingFields
              .map((field) => t(`smartGenerator.fields.${field}`))
              .join(', ')}
          </div>
        </div>
      )}

      {message && (
        <div
          role="status"
          className="mt-4 rounded-md border border-border bg-muted px-4 py-3 text-sm"
        >
          {message}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button type="button" size="lg" onClick={handleGenerate}>
          <FilePenLine aria-hidden="true" />
          {t('smartGenerator.generate')}
        </Button>
      </div>
    </section>
  );
}
