export type CreateSectionPayload = {
  title: string;
  description?: string;
  coverMediaId?: string;
};

export async function fetchProfileByUsername(username: string) {
  const res = await fetch(`/api/v2/profiles/by-username/${encodeURIComponent(username)}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('PROFILE_NOT_FOUND');
  return res.json() as Promise<{ id: string; username: string }>;
}

export async function createSection(profileId: string, payload: CreateSectionPayload) {
  const res = await fetch(`/api/v2/profiles/${encodeURIComponent(profileId)}/sections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Create section failed (${res.status})`);
  }
  return res.json() as Promise<{ id: string }>;
}
