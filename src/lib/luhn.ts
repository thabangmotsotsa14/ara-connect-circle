export function luhnCheck(id: string): boolean {
  if (!/^\d{13}$/.test(id)) return false;
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let d = parseInt(id[i], 10);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export function validateRsaId(id: string): { ok: boolean; reason?: string } {
  if (!/^\d{13}$/.test(id)) return { ok: false, reason: "RSA ID must be exactly 13 digits" };
  // DOB sanity: YYMMDD
  const mm = parseInt(id.slice(2, 4), 10);
  const dd = parseInt(id.slice(4, 6), 10);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return { ok: false, reason: "Invalid date in ID" };
  if (!luhnCheck(id)) return { ok: false, reason: "ID checksum failed" };
  return { ok: true };
}