
const phoneNumberRegex = /^\+98[0-9]{10}$/;

export function isPhoneNumber(text: unknown) {
  return typeof text === 'string' && phoneNumberRegex.test(text);
}
