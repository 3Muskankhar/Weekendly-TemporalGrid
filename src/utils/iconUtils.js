'use client';

// Icon mapping for common activity types
const ICON_MAPPING = {
  // Food & Dining
  'restaurant': 'Utensils',
  'cafe': 'Coffee',
  'bar': 'Wine',
  'food': 'Utensils',
  'cooking': 'ChefHat',
  'baking': 'ChefHat',
  
  // Outdoor & Nature
  'hiking': 'Hiking',
  'camping': 'Tent',
  'beach': 'Sun',
  'park': 'Trees',
  'garden': 'Flower',
  'outdoor': 'Sun',
  'nature': 'Trees',
  'sports': 'Activity',
  'running': 'Running',
  'cycling': 'Bike',
  'swimming': 'Waves',
  
  // Entertainment
  'movie': 'Film',
  'cinema': 'Film',
  'theater': 'Theater',
  'concert': 'Music',
  'music': 'Music',
  'gaming': 'Gamepad2',
  'reading': 'Book',
  'entertainment': 'Play',
  'party': 'PartyPopper',
  'dance': 'Music',
  
  // Relaxation & Wellness
  'spa': 'Sparkles',
  'massage': 'Hand',
  'yoga': 'Activity',
  'meditation': 'Zap',
  'relaxation': 'Moon',
  'sleep': 'Moon',
  'wellness': 'Heart',
  'gym': 'Dumbbell',
  'fitness': 'Activity',
  
  // Social & Creative
  'social': 'Users',
  'friends': 'Users',
  'family': 'Users',
  'date': 'Heart',
  'creative': 'Palette',
  'art': 'Palette',
  'craft': 'Scissors',
  'writing': 'PenTool',
  'photography': 'Camera',
  'drawing': 'PenTool',
  
  // Shopping & Errands
  'shopping': 'ShoppingBag',
  'store': 'Store',
  'market': 'ShoppingCart',
  'errands': 'CheckCircle',
  'cleaning': 'Broom',
  'organizing': 'Archive',
  
  // Travel & Transportation
  'travel': 'Plane',
  'roadtrip': 'Car',
  'walking': 'Footprints',
  'driving': 'Car',
  'public': 'Bus',
  
  // Technology & Learning
  'learning': 'BookOpen',
  'coding': 'Code',
  'tech': 'Laptop',
  'online': 'Globe',
  'study': 'BookOpen',
  
  // Home & Personal
  'home': 'Home',
  'personal': 'User',
  'selfcare': 'Sparkles',
  'bathroom': 'Droplets',
  'kitchen': 'ChefHat',
  
  // Work & Productivity
  'work': 'Briefcase',
  'meeting': 'Users',
  'project': 'Folder',
  'email': 'Mail',
  'call': 'Phone',
  
  // Default fallbacks
  'default': 'Star',
  'unknown': 'HelpCircle'
};

// Get icon name for an activity
export const getActivityIcon = (activity) => {
  if (!activity) return ICON_MAPPING.default;
  
  const name = activity.name?.toLowerCase() || '';
  const description = activity.description?.toLowerCase() || '';
  const category = activity.category?.toLowerCase() || '';
  
  // First, try to match by category
  if (ICON_MAPPING[category]) {
    return ICON_MAPPING[category];
  }
  
  // Then, try to match by keywords in name and description
  for (const [keyword, icon] of Object.entries(ICON_MAPPING)) {
    if (keyword === 'default' || keyword === 'unknown') continue;
    
    if (name.includes(keyword) || description.includes(keyword)) {
      return icon;
    }
  }
  
  // Fallback to default
  return ICON_MAPPING.default;
};

// Get icon using Gemini API for more specific suggestions
export const getActivityIconWithAI = async (activity) => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return getActivityIcon(activity);
  }

  try {
    const model = 'gemini-1.5-flash';
    const prompt = `Given this activity: "${activity.name}" (Category: ${activity.category}, Description: ${activity.description || 'N/A'}), suggest the most appropriate Lucide React icon name. 

Return only the icon name (e.g., "Coffee", "Hiking", "Music") from the Lucide React icon set. Choose from common icons like: Coffee, Utensils, Hiking, Music, Film, Book, Camera, Paintbrush, ShoppingBag, Home, Car, Plane, etc.

Activity: ${activity.name}
Category: ${activity.category}
Description: ${activity.description || 'No description'}

Icon name:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.3, 
          maxOutputTokens: 50,
          topP: 0.8,
          topK: 10
        }
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const iconName = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (iconName && iconName.length > 0 && iconName.length < 50) {
      // Clean up the response (remove quotes, extra text, etc.)
      const cleanIconName = iconName.replace(/['"]/g, '').split('\n')[0].trim();
      return cleanIconName;
    }
  } catch (error) {
    console.warn('Failed to get AI icon suggestion:', error);
  }

  // Fallback to regular icon mapping
  return getActivityIcon(activity);
};

// Check if an activity needs location-based search
export const needsLocation = (activity) => {
  if (!activity) return false;
  
  const locationBasedCategories = ['food', 'outdoor', 'entertainment', 'social'];
  const locationBasedKeywords = [
    'restaurant', 'cafe', 'bar', 'dining', 'food', 'eat', 'drink',
    'park', 'hiking', 'beach', 'outdoor', 'nature', 'garden',
    'museum', 'theater', 'cinema', 'movie', 'concert', 'show',
    'shopping', 'store', 'market', 'mall', 'gym', 'spa', 'salon',
    'hotel', 'accommodation', 'travel', 'tour', 'visit'
  ];
  
  const name = activity.name?.toLowerCase() || '';
  const description = activity.description?.toLowerCase() || '';
  const category = activity.category?.toLowerCase() || '';
  
  return locationBasedCategories.includes(category) || 
         locationBasedKeywords.some(keyword => 
           name.includes(keyword) || description.includes(keyword)
         );
};

const iconUtils = {
  getActivityIcon,
  getActivityIconWithAI,
  needsLocation,
  ICON_MAPPING
};

export default iconUtils;
