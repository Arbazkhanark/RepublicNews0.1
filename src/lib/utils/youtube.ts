// utils/youtube.ts
export const youtubeUtils = {
  getVideoId(url: string): string | null {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  },

  getEmbedUrl(url: string): string {
    const videoId = this.getVideoId(url);
    return `https://www.youtube.com/embed/${videoId}`;
  },

  formatDuration(duration: string): string {
    // ISO 8601 duration format (PT1H2M3S)
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    
    if (!match) return '0:00';
    
    const hours = match[1] ? match[1].replace('H', '') : '';
    const minutes = match[2] ? match[2].replace('M', '') : '0';
    const seconds = match[3] ? match[3].replace('S', '') : '00';
    
    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    
    return `${parseInt(minutes)}:${seconds.padStart(2, '0')}`;
  },

  formatViewCount(views: string): string {
    const count = parseInt(views);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }
};