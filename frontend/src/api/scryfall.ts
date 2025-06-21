// Proxy Scryfall search and prints endpoints to backend

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
    image: card.image_uris?.small || card.card_faces?.[0]?.image_uris?.small || '',
    set: card.set_name,
    lang: card.lang,
    ...card,
  }));
}

// Fetch prints for a card by Scryfall ID
export async function getScryfallPrints(id: string) {
  if (!id) return [];
  const res = await fetch(`${API_URL}/scryfall/prints?id=${encodeURIComponent(id)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}
