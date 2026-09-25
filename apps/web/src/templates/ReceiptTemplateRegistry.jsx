import { RECEIPT_TEMPLATES as REACT_RECEIPT_TEMPLATES_SOURCE } from '@/utils/ReceiptTemplates.jsx';
import { CLASSIC_RECEIPT_TEMPLATES } from '@/templates/ClassicReceiptTemplates';

// Existing React templates stay untouched and are grouped separately.
export const REACT_RECEIPT_TEMPLATES = REACT_RECEIPT_TEMPLATES_SOURCE.map((template) => ({
  ...template,
  category: 'react',
}));

export { CLASSIC_RECEIPT_TEMPLATES };

export const RECEIPT_TEMPLATES = [
  ...REACT_RECEIPT_TEMPLATES,
  ...CLASSIC_RECEIPT_TEMPLATES,
];
