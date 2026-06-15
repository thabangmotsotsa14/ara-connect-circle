// Browser-only SHA-256 verification hash for the vote receipt.
// Not cryptographically binding — purely a tamper-evident receipt for the member.
export async function makeVoteHash(profileId: string, issueId: string, choice: string) {
  const payload = `${profileId}|${issueId}|${choice}|${Date.now()}`;
  const enc = new TextEncoder().encode(payload);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}