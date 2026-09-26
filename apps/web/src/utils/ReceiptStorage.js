const STORAGE_KEY = 'receipts';

export function readReceipts() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return { receipts: [], error: null };
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error('Stored receipt history is not a list.');
    }

    return { receipts: parsed, error: null };
  } catch (error) {
    try {
      localStorage.setItem(`${STORAGE_KEY}_corrupt_backup_${Date.now()}`, raw);
    } catch {
      // The original value is still left untouched when a backup cannot be created.
    }

    return {
      receipts: [],
      error: error instanceof Error ? error : new Error('Receipt history could not be read.'),
    };
  }
}

export function writeReceipts(receipts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
    return { ok: true, error: null };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Receipt history could not be saved.'),
    };
  }
}

export function clearReceipts() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return { ok: true, error: null };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Receipt history could not be cleared.'),
    };
  }
}

export function createReceiptId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `receipt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
