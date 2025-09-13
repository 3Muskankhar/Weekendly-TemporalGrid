'use client';

// Enhanced Gemini prompt to expand user intent into robust place queries with budget and location context
export async function suggestPlaceQueries({ seed, budget = 'any', context = '', location = null }) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    // Fallback to basic keyword expansion if no API key
    return expandSearchQueries(seed, budget);
  }

  const model = 'gemini-1.5-flash';
  const system = `You are a local search query generator for finding places near a user's location. Given an activity description, generate 5-8 short, specific search terms that would find relevant places on Google Maps or OpenStreetMap.

Rules:
- Each phrase must be 2-4 words maximum
- Focus on place types, not activities
- Use common business/location terms that work well with map search APIs
- Consider budget preferences: "budget"=affordable/cheap places, "mid-range"=moderate pricing, "upscale"=expensive/premium
- Include budget indicators in search terms when relevant (e.g., "budget restaurants", "upscale dining")
- Consider the activity context (e.g., "brunch" should suggest breakfast/brunch places, not just restaurants)
- Return ONLY a JSON array of strings
- No explanations, just the array

Examples:
Input: "brunch" with budget="any" → ["brunch restaurants", "breakfast cafes", "brunch spots", "morning cafes", "breakfast diners"]
Input: "coffee" with budget="budget" → ["budget coffee shops", "cheap cafes", "affordable coffee", "local cafes"]
Input: "dinner" with budget="upscale" → ["fine dining", "upscale restaurants", "premium dining", "gourmet restaurants"]
Input: "hiking" → ["hiking trails", "nature parks", "outdoor recreation", "scenic trails", "hiking areas"]`;

  const locationContext = location ? `Location: ${location.latitude}, ${location.longitude}` : 'Location: Not specified';
  
  const user = `Activity: "${seed}"
Budget: ${budget}
${locationContext}
Context: ${context}

Generate search queries:`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: system + '\n\n' + user }] }
        ],
        generationConfig: { 
          temperature: 0.4, 
          maxOutputTokens: 200,
          topP: 0.8
        }
      })
    });

    if (!res.ok) {
      console.warn('Gemini API failed, using fallback');
      return expandSearchQueries(seed);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON array from response
    const match = text.match(/\[[\s\S]*?\]/);
    if (!match) {
      console.warn('No valid JSON found in Gemini response');
      return expandSearchQueries(seed);
    }

    const arr = JSON.parse(match[0]);
    const validQueries = Array.isArray(arr) ? 
      arr.filter(s => typeof s === 'string' && s.trim().length > 0).slice(0, 8) : 
      [];
    
    return validQueries.length > 0 ? validQueries : expandSearchQueries(seed);
  } catch (error) {
    console.warn('Error with Gemini suggestions:', error);
    return expandSearchQueries(seed);
  }
}

// Fallback function to expand search queries without AI
function expandSearchQueries(seed, budget = 'any') {
  if (!seed) return ['restaurants'];
  
  const query = seed.toLowerCase();
  const queries = [];
  
  // Helper function to add budget prefix
  const addBudgetPrefix = (baseQueries) => {
    if (budget === 'budget') {
      return baseQueries.map(q => `budget ${q}`).concat(baseQueries.map(q => `cheap ${q}`));
    } else if (budget === 'upscale') {
      return baseQueries.map(q => `upscale ${q}`).concat(baseQueries.map(q => `fine ${q}`));
    }
    return baseQueries;
  };

  
  // Food-related
  if (query.includes('restaurant') || query.includes('dining') || query.includes('food') || query.includes('eat')) {
    queries.push(...addBudgetPrefix(['restaurants', 'dining', 'food places', 'eateries', 'local restaurants']));
  }
  if (query.includes('coffee') || query.includes('cafe')) {
    queries.push(...addBudgetPrefix(['coffee shops', 'cafes', 'espresso bars', 'coffee houses', 'local cafes']));
  }
  if (query.includes('bar') || query.includes('drink') || query.includes('pub')) {
    queries.push(...addBudgetPrefix(['bars', 'pubs', 'lounges', 'cocktail bars', 'wine bars']));
  }
  if (query.includes('brunch') || query.includes('breakfast')) {
    queries.push(...addBudgetPrefix(['brunch places', 'breakfast restaurants', 'diners', 'brunch spots', 'morning cafes', 'breakfast cafes']));
  }
  if (query.includes('lunch')) {
    queries.push(...addBudgetPrefix(['lunch spots', 'lunch restaurants', 'casual dining', 'lunch cafes']));
  }
  if (query.includes('dinner')) {
    queries.push(...addBudgetPrefix(['dinner restaurants', 'fine dining', 'dinner spots', 'evening dining']));
  }
  
  // Entertainment
  if (query.includes('movie') || query.includes('cinema') || query.includes('film')) {
    queries.push('movie theaters', 'cinemas', 'film theaters', 'multiplex');
  }
  if (query.includes('music') || query.includes('concert')) {
    queries.push('music venues', 'concert halls', 'live music', 'music bars', 'live venues');
  }
  if (query.includes('game') || query.includes('gaming')) {
    queries.push('gaming cafes', 'arcades', 'board game cafes', 'game centers', 'gaming lounges');
  }
  if (query.includes('entertainment') || query.includes('fun')) {
    queries.push('entertainment venues', 'fun activities', 'recreation centers', 'entertainment centers');
  }
  
  // Outdoor
  if (query.includes('hiking') || query.includes('trail') || query.includes('nature')) {
    queries.push('hiking trails', 'nature parks', 'outdoor recreation', 'scenic trails', 'hiking areas', 'nature reserves');
  }
  if (query.includes('park') || query.includes('garden')) {
    queries.push('parks', 'gardens', 'green spaces', 'public parks', 'botanical gardens', 'city parks');
  }
  if (query.includes('beach') || query.includes('water')) {
    queries.push('beaches', 'waterfronts', 'lakes', 'water activities', 'beach areas');
  }
  if (query.includes('outdoor') || query.includes('fresh air')) {
    queries.push('outdoor activities', 'outdoor recreation', 'nature spots', 'outdoor venues');
  }
  
  // Shopping
  if (query.includes('shopping') || query.includes('mall') || query.includes('store')) {
    queries.push('shopping malls', 'retail stores', 'shopping centers', 'boutiques', 'shopping districts');
  }
  
  // Wellness
  if (query.includes('spa') || query.includes('massage') || query.includes('wellness')) {
    queries.push('spas', 'massage therapy', 'wellness centers', 'beauty salons', 'relaxation centers');
  }
  if (query.includes('gym') || query.includes('fitness')) {
    queries.push('gyms', 'fitness centers', 'sports facilities', 'workout centers', 'fitness clubs');
  }
  
  // Social
  if (query.includes('social') || query.includes('friends') || query.includes('meet')) {
    queries.push('social venues', 'meeting places', 'social clubs', 'community centers');
  }
  
  // Creative
  if (query.includes('creative') || query.includes('art') || query.includes('museum')) {
    queries.push('art galleries', 'museums', 'creative spaces', 'art centers', 'cultural venues');
  }
  
  // Default fallback
  if (queries.length === 0) {
    // Try to extract meaningful words
    const words = query.split(/\s+/).filter(w => w.length > 2);
    if (words.length > 0) {
      queries.push(words[0], ...words.slice(1, 3));
    } else {
      queries.push('restaurants', 'cafes', 'entertainment', 'local places', 'nearby spots');
    }
  }
  
  // Always add some general fallbacks to ensure we get results
  if (queries.length < 3) {
    queries.push('local places', 'nearby spots', 'popular venues');
  }
  
  const finalQueries = [...new Set(queries)].slice(0, 6); // Remove duplicates and limit
  return finalQueries;
}

// Extract search query from activity
export function extractSearchQuery(activity) {
  if (!activity) return 'restaurants';
  
  const name = activity.name || '';
  const description = activity.description || '';
  const category = activity.category || '';
  
  // Combine and clean the text
  const text = `${name} ${description} ${category}`.toLowerCase();
  
  // Remove common non-place words
  const cleanText = text
    .replace(/\b(go|to|at|with|for|a|an|the|and|or|but|in|on|of|is|was|will|would|could|should|might|may|can|have|has|had|do|does|did|get|got|make|made|take|took|come|came|find|found|see|saw|look|looking|visit|visiting)\b/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleanText || name || 'restaurants';
}

const geminiSuggestUtils = { suggestPlaceQueries, extractSearchQuery };
export default geminiSuggestUtils;