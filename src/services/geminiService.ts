import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface HealthTip {
  title: string;
  description: string;
  benefit: string;
}

export interface HealthNews {
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  imageKeyword: string;
}

const CACHE_KEY_TIPS = "health_tips_cache";
const CACHE_KEY_NEWS = "health_news_cache";
const CACHE_EXPIRY = 3600000; // 1 hour

export const fetchHealthTips = async (): Promise<HealthTip[]> => {
  try {
    try {
      const cached = localStorage.getItem(CACHE_KEY_TIPS);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return data;
        }
      }
    } catch (e) {
      console.warn("LocalStorage access failed in fetchHealthTips");
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 3 practical health tips with a title, a short description, and a specific health benefit. Target a general audience.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              benefit: { type: Type.STRING },
            },
            required: ["title", "description", "benefit"],
          },
        },
      },
    });

    const text = response.text;
    if (text) {
      const data = JSON.parse(text);
      localStorage.setItem(CACHE_KEY_TIPS, JSON.stringify({ data, timestamp: Date.now() }));
      return data;
    }
    return [];
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('quota')) {
      console.warn("Gemini API quota exceeded. Using fallback health tips.");
    } else {
      console.error("Error fetching health tips:", error);
    }
    
    // Check if we have even expired cache to use as better fallback than hardcoded
    try {
      const cached = localStorage.getItem(CACHE_KEY_TIPS);
      if (cached) return JSON.parse(cached).data;
    } catch (e) {}
    
    return [
      {
        title: "Stay Hydrated",
        description: "Drink at least 8 glasses of water a day to keep your body functioning optimally.",
        benefit: "Improves energy levels and brain function."
      },
      {
        title: "Regular Exercise",
        description: "Engage in at least 30 minutes of moderate activity like brisk walking daily.",
        benefit: "Boosts cardiovascular health and mood."
      },
      {
        title: "Quality Sleep",
        description: "Aim for 7-9 hours of restful sleep each night to allow your body to recover.",
        benefit: "Strengthens the immune system and sharpens focus."
      }
    ];
  }
};

export const fetchHealthNews = async (): Promise<HealthNews[]> => {
  try {
    try {
      const cached = localStorage.getItem(CACHE_KEY_NEWS);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return data;
        }
      }
    } catch (e) {
      console.warn("LocalStorage access failed in fetchHealthNews");
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Provide 3 current, professional health-related news summaries or trending medical topics. Include a title, a brief 1-sentence summary, a long detailed paragraph (content) of 3-4 sentences, a relative date (e.g., '2 days ago'), a category, and a specific keyword (1-2 words) for a medical stock photo.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              content: { type: Type.STRING },
              date: { type: Type.STRING },
              category: { type: Type.STRING },
              imageKeyword: { type: Type.STRING },
            },
            required: ["title", "summary", "content", "date", "category", "imageKeyword"],
          },
        },
      },
    });

    const text = response.text;
    if (text) {
      const data = JSON.parse(text);
      localStorage.setItem(CACHE_KEY_NEWS, JSON.stringify({ data, timestamp: Date.now() }));
      return data;
    }
    return [];
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('quota')) {
      console.warn("Gemini API quota exceeded. Using fallback health news.");
    } else {
      console.error("Error fetching health news:", error);
    }

    // Check if we have even expired cache to use as better fallback than hardcoded
    try {
      const cached = localStorage.getItem(CACHE_KEY_NEWS);
      if (cached) return JSON.parse(cached).data;
    } catch (e) {}

    return [
      {
        title: "Advances in Preventive Care",
        summary: "New studies show that personalized nutrition plans can significantly reduce the risk of chronic diseases.",
        content: "Researchers have discovered that DNA-based nutrition plans are more effective than generic diets. By analyzing individual genetic markers, clinicians can now prescribe specific nutrients that mitigate inherited health risks. This marks a significant shift towards truly personalized medicine.",
        date: "Recent",
        category: "Research",
        imageKeyword: "nutrition"
      },
      {
        title: "Mental Health Awareness Gains Momentum",
        summary: "Global initiatives are successfully reducing the stigma around seeking professional mental health support.",
        content: "The latest reports from health organizations indicate a 25% increase in individuals seeking mental health services globally. This surge is attributed to large-scale workplace wellness programs and social media campaigns that normalize discussions about anxiety and depression. Experts emphasize that early intervention remains the key to long-term recovery.",
        date: "Last week",
        category: "Wellness",
        imageKeyword: "mental health"
      },
      {
        title: "Breakthrough in Vaccine Technology",
        summary: "Researchers report successful trials of next-generation vaccines targeting seasonal respiratory viruses.",
        content: "New mRNA-based vaccines are showing promise in targeting multiple strains of respiratory viruses simultaneously. This 'universal' approach could eliminate the need for seasonal updates. Clinical trials are now entering phase 3, with potential public availability within the next 18 months.",
        date: "Today",
        category: "Technology",
        imageKeyword: "medical lab"
      }
    ];
  }
};
