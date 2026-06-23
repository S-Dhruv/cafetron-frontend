import { HttpErrorResponse } from '@angular/common/http';

const GENERIC_HTTP_MESSAGES = new Set([
  '400 bad request',
  '401 unauthorized',
  '403 forbidden',
  '404 not found',
  '409 conflict',
  '500 internal server error',
  'bad request',
  'unauthorized',
  'forbidden',
  'not found',
  'conflict',
  'internal server error',
]);

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallbackMessage;
  }

  if (error.status === 0) {
    return 'Unable to reach the server. Please check your connection and try again.';
  }

  const payload = error.error;

  if (typeof payload === 'string') {
    return normalizeMessage(payload) || fallbackMessage;
  }

  if (payload && typeof payload === 'object') {
    const message = firstUsefulString(payload as Record<string, unknown>, [
      'message',
      'error',
      'detail',
      'reason',
      'title',
    ]);

    if (message) {
      return message;
    }

    const fieldErrors = getFieldErrorMessages(payload as Record<string, unknown>);
    if (fieldErrors.length > 0) {
      return fieldErrors.join(' ');
    }
  }

  return fallbackMessage;
}

export function isBadCredentialError(error: unknown): boolean {
  if (!(error instanceof HttpErrorResponse)) {
    return false;
  }

  const payload = error.error;
  if (!payload || typeof payload !== 'object') {
    return error.status === 401;
  }

  const values = Object.values(payload as Record<string, unknown>)
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim().toLowerCase());

  return values.some((value) =>
    value.includes('bad credentials')
    || value.includes('invalid employee id')
    || value.includes('invalid employee id or password')
    || value.includes('no user found with employee id')
  );
}

function firstUsefulString(payload: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string') {
      const normalized = normalizeMessage(value);
      if (normalized) {
        return normalized;
      }
    }
  }

  return '';
}

function normalizeMessage(value: string): string {
  const normalized = value.trim();
  return normalized && !GENERIC_HTTP_MESSAGES.has(normalized.toLowerCase()) ? normalized : '';
}

function getFieldErrorMessages(payload: Record<string, unknown>): string[] {
  const rawErrors = payload['errors'];
  if (!rawErrors) {
    return [];
  }

  if (Array.isArray(rawErrors)) {
    return rawErrors
      .map((item) => {
        if (typeof item === 'string') {
          return normalizeMessage(item);
        }

        if (item && typeof item === 'object') {
          return firstUsefulString(item as Record<string, unknown>, ['defaultMessage', 'message']);
        }

        return '';
      })
      .filter((message) => message.length > 0);
  }

  if (typeof rawErrors === 'object') {
    return Object.values(rawErrors as Record<string, unknown>)
      .map((value) => {
        if (typeof value === 'string') {
          return normalizeMessage(value);
        }

        if (Array.isArray(value)) {
          return value
            .filter((item): item is string => typeof item === 'string')
            .map(normalizeMessage)
            .filter(Boolean)
            .join(' ');
        }

        return '';
      })
      .filter((message) => message.length > 0);
  }

  return [];
}
