// YouTube video caching utilities

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  duration: string;
  videoUrl: string;
  type: string;
}

export interface CacheItem {
  data: YouTubeVideo[];
  timestamp: number;
  expiresAt: number;
}

export class YouTubeCache {
  private static readonly CACHE_KEY_PREFIX = 'yt_cache_';
  private static readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes
  private static readonly MIN_REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes minimum between API calls

  // Store the last API call time for each type
  private static lastApiCallTimes = new Map<string, number>();

  static async getVideos(type: 'latest' | 'popular', limit: number = 8): Promise<YouTubeVideo[]> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}${type}_${limit}`;
    
    // Check localStorage cache first
    const cached = this.getFromLocalStorage(cacheKey);
    if (cached && !this.isCacheExpired(cached)) {
      console.log(`Using ${type} videos from localStorage cache`);
      return cached.data;
    }

    // Check if we should make API call (respect rate limiting)
    const now = Date.now();
    const lastCall = this.lastApiCallTimes.get(type) || 0;
    
    if (now - lastCall < this.MIN_REFRESH_INTERVAL) {
      console.log(`Rate limiting ${type} API call, using cached data if available`);
      if (cached) {
        return cached.data;
      }
    }

    // Make API call
    try {
      this.lastApiCallTimes.set(type, now);
      
      const response = await fetch(`/api/youtube?type=${type}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const videos = await response.json();
      
      // Cache the result
      this.saveToLocalStorage(cacheKey, videos);
      
      return videos;
    } catch (error) {
      console.error(`Failed to fetch ${type} videos:`, error);
      
      // Return cached data even if expired (better than nothing)
      if (cached) {
        console.log(`Using expired cache for ${type} videos`);
        return cached.data;
      }
      
      // Return empty array if no cache available
      return [];
    }
  }

  static async refreshVideos(type: 'latest' | 'popular', limit: number = 8): Promise<YouTubeVideo[]> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}${type}_${limit}`;
    
    try {
      // Force refresh with refresh parameter
      const response = await fetch(`/api/youtube?type=${type}&limit=${limit}&refresh=true`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const videos = await response.json();
      
      // Update cache
      this.saveToLocalStorage(cacheKey, videos);
      this.lastApiCallTimes.set(type, Date.now());
      
      return videos;
    } catch (error) {
      console.error(`Failed to refresh ${type} videos:`, error);
      
      // Try to return cached data
      const cached = this.getFromLocalStorage(cacheKey);
      if (cached) {
        return cached.data;
      }
      
      return [];
    }
  }

  static clearCache(): void {
    if (typeof window === 'undefined') return;
    
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    this.lastApiCallTimes.clear();
    
    console.log('Cleared YouTube cache');
  }

  static getCacheInfo(): { [key: string]: { timestamp: number; count: number } } {
    const info: { [key: string]: { timestamp: number; count: number } } = {};
    
    if (typeof window === 'undefined') return info;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_KEY_PREFIX)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          if (item.data && Array.isArray(item.data)) {
            info[key.replace(this.CACHE_KEY_PREFIX, '')] = {
              timestamp: item.timestamp,
              count: item.data.length
            };
          }
        } catch (e) {
          // Skip invalid items
        }
      }
    }
    
    return info;
  }

  private static getFromLocalStorage(key: string): CacheItem | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  private static saveToLocalStorage(key: string, data: YouTubeVideo[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheItem: CacheItem = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.DEFAULT_TTL
      };
      
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      // localStorage might be full, clear old cache
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.clearOldCache();
        // Try again
        try {
          const cacheItem: CacheItem = {
            data,
            timestamp: Date.now(),
            expiresAt: Date.now() + this.DEFAULT_TTL
          };
          localStorage.setItem(key, JSON.stringify(cacheItem));
        } catch (e) {
          console.error('Failed to save after clearing cache');
        }
      }
    }
  }

  private static isCacheExpired(cacheItem: CacheItem): boolean {
    return Date.now() > cacheItem.expiresAt;
  }

  private static clearOldCache(): void {
    if (typeof window === 'undefined') return;
    
    const now = Date.now();
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_KEY_PREFIX)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          if (now > (item.expiresAt || 0)) {
            keysToRemove.push(key);
          }
        } catch (e) {
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}