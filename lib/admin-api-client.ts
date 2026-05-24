export function redirectToAdminLogin() {
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login'
  }
}

export async function parseAdminJson<T>(res: Response): Promise<T | null> {
  if (res.status === 401 || res.status === 403) {
    redirectToAdminLogin()
    return null
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? 'Request failed')
  }
  return res.json() as Promise<T>
}

export async function patchAdmin<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await parseAdminJson<T>(res)
  if (data === null) throw new Error('Unauthorized')
  return data
}
