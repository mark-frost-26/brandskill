// GoHighLevel CRM integration
const GHL_BASE = 'https://rest.gohighlevel.com/v1'

interface GHLContact {
  email: string
  firstName?: string
  lastName?: string
  tags?: string[]
  customField?: Record<string, string>
}

export async function createOrUpdateGHLContact(contact: GHLContact): Promise<string | null> {
  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) return null

  try {
    const res = await fetch(`${GHL_BASE}/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...contact,
        locationId: process.env.GHL_LOCATION_ID,
      }),
    })
    const data = await res.json()
    return data.contact?.id || null
  } catch {
    return null
  }
}

export async function addGHLTag(contactId: string, tag: string): Promise<void> {
  if (!process.env.GHL_API_KEY) return
  try {
    await fetch(`${GHL_BASE}/contacts/${contactId}/tags/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: [tag] }),
    })
  } catch {
    // silently fail
  }
}
