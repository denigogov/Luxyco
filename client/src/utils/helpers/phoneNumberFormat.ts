export const phoneNumberFormat = (phoneNumber: string) => {
  if (!phoneNumber) return;

  const local = phoneNumber.startsWith("+389")
    ? "0" + phoneNumber.slice(4)
    : phoneNumber;
  const digits = local.replace(/\D/g, "");

  // format as 0XX XXX XXX (best for mobile numbers 070/071/072/075/076/077/078)
  if (digits.length === 9 && digits.startsWith("0")) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }

  // fallback: just show local
  return local;
};
