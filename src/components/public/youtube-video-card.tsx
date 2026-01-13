// components/public/youtube-video-card.tsx
import { Play, Eye, ThumbsUp, Clock } from 'lucide-react';

interface YouTubeVideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    viewCount: string;
    likeCount: string;
    duration: string;
    publishedAt: string;
    videoUrl: string;
  };
  size?: 'small' | 'medium' | 'large';
}

export function YouTubeVideoCard({ video, size = 'medium' }: YouTubeVideoCardProps) {
  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';
    
    const hours = match[1]?.replace('H', '') || '';
    const minutes = match[2]?.replace('M', '') || '0';
    const seconds = match[3]?.replace('S', '') || '00';
    
    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const formatViewCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const sizes = {
    small: {
      container: 'w-full',
      image: 'h-32',
      title: 'text-sm',
      stats: 'text-xs'
    },
    medium: {
      container: 'w-full',
      image: 'h-48',
      title: 'text-base',
      stats: 'text-sm'
    },
    large: {
      container: 'w-full',
      image: 'h-64',
      title: 'text-lg',
      stats: 'text-base'
    }
  };

  const currentSize = sizes[size];

  return (
    <a
      href={video.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${currentSize.container} group block`}
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        <div className={`${currentSize.image} w-full bg-gray-200 relative`}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
              <Play className="w-6 h-6 text-white" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
      </div>
      <h4 className={`font-bold ${currentSize.title} line-clamp-2 group-hover:text-red-600 transition-colors mb-2`}>
        {video.title}
      </h4>
      <div className={`flex items-center gap-4 ${currentSize.stats} text-gray-600`}>
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {formatViewCount(video.viewCount)}
        </span>
        <span className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" />
          {formatViewCount(video.likeCount)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {new Date(video.publishedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
          })}
        </span>
      </div>
    </a>
  );
}