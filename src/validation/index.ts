import { MIN_PASSWORD_LENGTH, MIN_MESSAGE_LENGTH } from '../constants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRequired(value: string, fieldLabel = 'This field'): string {
  if (!value.trim()) {
    return `${fieldLabel} is required.`;
  }
  return '';
}

export function validateEmail(value: string): string {
  if (!value.trim()) {
    return 'Email is required.';
  }
  if (!EMAIL_REGEX.test(value.trim())) {
    return 'Enter a valid email address.';
  }
  return '';
}

export function validatePassword(value: string): string {
  if (!value) {
    return 'Password is required.';
  }
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return '';
}

export function validateMinLength(value: string, min: number, fieldLabel = 'This field'): string {
  if (!value.trim()) {
    return `${fieldLabel} is required.`;
  }
  if (value.trim().length < min) {
    return `${fieldLabel} must be at least ${min} characters.`;
  }
  return '';
}

export function validateMessage(value: string): string {
  return validateMinLength(value, MIN_MESSAGE_LENGTH, 'Message');
}
