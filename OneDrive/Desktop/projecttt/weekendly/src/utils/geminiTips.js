'use client';

// Get tips and guidance for activities that don't need location
export async function getActivityTips(activity) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return getDefaultTips(activity);
  }

  try {
    const model = 'gemini-1.5-flash';
    const prompt = `Provide helpful tips and guidance for this activity: "${activity.name}"

Activity Details:
- Name: ${activity.name}
- Category: ${activity.category}
- Duration: ${activity.duration} minutes
- Description: ${activity.description}

Please provide:
1. 3-5 practical tips on how to do this activity effectively
2. What you'll need (materials, equipment, etc.)
3. Beginner-friendly advice
4. 2-3 reference video suggestions (YouTube channels or specific videos)
5. Common mistakes to avoid

Format your response as a JSON object with these keys:
{
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "materials": ["item1", "item2", "item3"],
  "beginnerAdvice": "advice text",
  "videos": [
    {"title": "Video Title", "channel": "Channel Name", "url": "youtube.com/watch?v=..."},
    {"title": "Video Title 2", "channel": "Channel Name 2", "url": "youtube.com/watch?v=..."}
  ],
  "mistakes": ["mistake1", "mistake2", "mistake3"]
}

Keep the response concise and practical.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.7, 
          maxOutputTokens: 1000,
          topP: 0.8,
          topK: 20
        }
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (text) {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const tipsData = JSON.parse(jsonMatch[0]);
        return {
          ...tipsData,
          source: 'ai',
          activity: activity.name
        };
      }
    }
  } catch (error) {
    console.warn('Failed to get AI tips:', error);
  }

  // Fallback to default tips
  return getDefaultTips(activity);
}

// Default tips for common activities
function getDefaultTips(activity) {
  const defaultTips = {
    'reading': {
      tips: [
        'Choose a comfortable, well-lit spot with minimal distractions',
        'Set a timer for your reading session to maintain focus',
        'Keep a notebook nearby to jot down interesting quotes or thoughts',
        'Start with shorter sessions and gradually increase duration',
        'Try different genres to find what you enjoy most'
      ],
      materials: ['Book or e-reader', 'Comfortable seating', 'Good lighting', 'Notebook and pen'],
      beginnerAdvice: 'Start with books that interest you and don\'t worry about reading speed. Focus on comprehension and enjoyment.',
      videos: [
        { title: 'How to Read More Books', channel: 'Better Than Yesterday', url: 'https://youtube.com/watch?v=example1' },
        { title: 'Speed Reading Techniques', channel: 'Thomas Frank', url: 'https://youtube.com/watch?v=example2' }
      ],
      mistakes: ['Trying to read too fast', 'Choosing books that don\'t interest you', 'Reading in poor lighting'],
      source: 'default',
      activity: activity.name
    },
    'gaming': {
      tips: [
        'Set time limits to avoid overplaying',
        'Take regular breaks every hour to rest your eyes',
        'Play with friends for a more social experience',
        'Try different game genres to find your preferences',
        'Keep your gaming setup ergonomic and comfortable'
      ],
      materials: ['Gaming device/PC', 'Comfortable chair', 'Good lighting', 'Headphones'],
      beginnerAdvice: 'Start with simple, beginner-friendly games and gradually work your way up to more complex ones.',
      videos: [
        { title: 'Gaming Setup Guide', channel: 'Linus Tech Tips', url: 'https://youtube.com/watch?v=example1' },
        { title: 'Best Games for Beginners', channel: 'GameSpot', url: 'https://youtube.com/watch?v=example2' }
      ],
      mistakes: ['Playing for too long without breaks', 'Poor posture while gaming', 'Ignoring real-life responsibilities'],
      source: 'default',
      activity: activity.name
    },
    'yoga': {
      tips: [
        'Start with basic poses and gradually progress',
        'Focus on your breathing throughout the practice',
        'Listen to your body and don\'t push beyond your limits',
        'Practice regularly, even if just for 10-15 minutes',
        'Use props like blocks or straps to help with poses'
      ],
      materials: ['Yoga mat', 'Comfortable clothing', 'Water bottle', 'Optional: blocks, straps, blanket'],
      beginnerAdvice: 'Begin with gentle poses and focus on proper alignment rather than depth. Consistency is more important than intensity.',
      videos: [
        { title: 'Yoga for Beginners', channel: 'Yoga with Adriene', url: 'https://youtube.com/watch?v=example1' },
        { title: 'Morning Yoga Routine', channel: 'Boho Beautiful', url: 'https://youtube.com/watch?v=example2' }
      ],
      mistakes: ['Pushing too hard too soon', 'Ignoring proper alignment', 'Skipping warm-up'],
      source: 'default',
      activity: activity.name
    },
    'gardening': {
      tips: [
        'Start with easy-to-grow plants like herbs or succulents',
        'Check soil moisture regularly - most plants prefer slightly moist soil',
        'Provide adequate sunlight based on plant requirements',
        'Use proper tools for different gardening tasks',
        'Learn about your local climate and growing seasons'
      ],
      materials: ['Seeds or plants', 'Potting soil', 'Pots or garden space', 'Watering can', 'Basic gardening tools'],
      beginnerAdvice: 'Start small with a few plants and gradually expand. Research each plant\'s specific needs.',
      videos: [
        { title: 'Gardening for Beginners', channel: 'Epic Gardening', url: 'https://youtube.com/watch?v=example1' },
        { title: 'Indoor Plant Care', channel: 'Planterina', url: 'https://youtube.com/watch?v=example2' }
      ],
      mistakes: ['Overwatering plants', 'Not providing enough light', 'Choosing plants unsuitable for your climate'],
      source: 'default',
      activity: activity.name
    },
    'meditation': {
      tips: [
        'Start with just 5-10 minutes daily',
        'Find a quiet, comfortable space',
        'Focus on your breathing or use guided meditations',
        'Don\'t judge your thoughts, just observe them',
        'Be consistent with your practice'
      ],
      materials: ['Quiet space', 'Comfortable seating', 'Optional: meditation app or timer'],
      beginnerAdvice: 'Start with guided meditations to help you focus. It\'s normal for your mind to wander - gently bring it back to your breath.',
      videos: [
        { title: 'Meditation for Beginners', channel: 'Headspace', url: 'https://youtube.com/watch?v=example1' },
        { title: '5-Minute Meditation', channel: 'Calm', url: 'https://youtube.com/watch?v=example2' }
      ],
      mistakes: ['Expecting immediate results', 'Getting frustrated with wandering thoughts', 'Skipping practice'],
      source: 'default',
      activity: activity.name
    },
    'exercise': {
      tips: [
        'Start with a proper warm-up to prevent injury',
        'Choose exercises that match your fitness level',
        'Focus on proper form over intensity',
        'Include both cardio and strength training',
        'Stay hydrated and listen to your body'
      ],
      materials: ['Comfortable workout clothes', 'Water bottle', 'Optional: weights, resistance bands', 'Exercise mat'],
      beginnerAdvice: 'Start slowly and gradually increase intensity. Consistency is more important than perfection.',
      videos: [
        { title: 'Beginner Workout Routine', channel: 'Fitness Blender', url: 'https://youtube.com/watch?v=example1' },
        { title: 'Home Workout No Equipment', channel: 'Chloe Ting', url: 'https://youtube.com/watch?v=example2' }
      ],
      mistakes: ['Skipping warm-up', 'Pushing too hard too soon', 'Poor form', 'Not staying hydrated'],
      source: 'default',
      activity: activity.name
    }
  };

  return defaultTips[activity.id] || {
    tips: ['Take your time and enjoy the activity', 'Find a comfortable space to work', 'Stay focused and present'],
    materials: ['Basic supplies for the activity'],
    beginnerAdvice: 'Start simple and gradually build your skills.',
    videos: [
      { title: 'How to Get Started', channel: 'General Guide', url: 'https://youtube.com' }
    ],
    mistakes: ['Rushing through the activity', 'Not being patient with yourself'],
    source: 'default',
    activity: activity.name
  };
}

const geminiTipsUtils = {
  getActivityTips,
  getDefaultTips
};

export default geminiTipsUtils;
