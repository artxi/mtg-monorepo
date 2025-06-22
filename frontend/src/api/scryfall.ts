// Proxy Scryfall search endpoint to backend

const API_URL = process.env.REACT_APP_API_URL!;

// Scryfall API search utility
// Returns a promise of an array of card objects (id, name, image, etc)
export async function searchScryfallCards(query: string) {
  if (!query) return [];
  // Send the raw text input as 'text' param now
  const res = await fetch(`${API_URL}/scryfall/search?text=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.data) return [];
  return data.data.map((card: any) => ({
    id: card.id,
    name: card.name,
    image: card.image_uris?.normal || card.image_uris?.small || card.card_faces?.[0]?.image_uris?.normal || '',
    set: card.set_name,
    lang: card.lang,
    ...card,
  }));
}

// Scryfall API autocomplete utility
// Returns a promise of an array of card name strings
export async function autocompleteScryfallNames(query: string) {
  if (!query) return [];
  const res = await fetch(`${API_URL}/scryfall/autocomplete?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

// Get card image by Scryfall ID
export async function getCardImage(scryfallId: string): Promise<string | null> {
  if (!scryfallId) return null;
  const res = await fetch(`${API_URL}/scryfall/card/${scryfallId}`);
  if (!res.ok) return null;
  const card = await res.json();
  return card.image_uris?.normal || card.image_uris?.small || card.card_faces?.[0]?.image_uris?.normal || null;
}
