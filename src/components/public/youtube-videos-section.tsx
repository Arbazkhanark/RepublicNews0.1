// components/public/youtube-videos-section.tsx
"use client";

import { useState, useEffect } from 'react';
import { 
  Youtube, 
  Play, 
  Eye, 
  ThumbsUp, 
  Clock, 
  ExternalLink,
  TrendingUp,
  Calendar,
  Users,
  Film
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount?: string;
  duration: string;
  videoUrl: string;
}

interface ChannelStats {
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
}

export function YouTubeVideosSection() {
  const [latestVideos, setLatestVideos] = useState<YouTubeVideo[]>([]);
  const [popularVideos, setPopularVideos] = useState<YouTubeVideo[]>([]);
  const [channelStats, setChannelStats] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');

  useEffect(() => {
    fetchYouTubeData();
  }, []);

  const fetchYouTubeData = async () => {
    try {
      setLoading(true);
      
      // Fetch latest videos
      const latestRes = await fetch('/api/youtube?type=latest&limit=8');
      const latestData = await latestRes.json();
      if (latestData.videos) {
        setLatestVideos(latestData.videos);
      }

      // Fetch popular videos
      const popularRes = await fetch('/api/youtube?type=popular&limit=8');
      const popularData = await popularRes.json();
      if (popularData.videos) {
        setPopularVideos(popularData.videos);
      }

      // Fetch channel stats
      const channelRes = await fetch('/api/youtube?type=channel');
      const channelData = await channelRes.json();
      if (channelData.channel) {
        setChannelStats(channelData.channel);
      }
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const currentVideos = activeTab === 'latest' ? latestVideos : popularVideos;

  return (
    <section className="py-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header with Channel Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center">
              <Youtube className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Official YouTube Channel</h2>
              <p className="text-gray-600">Watch latest news, interviews and exclusive content</p>
              
              {channelStats && !loading && (
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium">
                      {formatViewCount(channelStats.subscriberCount)} subscribers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium">
                      {formatViewCount(channelStats.videoCount)} videos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium">
                      {formatViewCount(channelStats.viewCount)} views
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <a
            href="https://www.youtube.com/channel/UC5OfTkVERVIwFVXufshOIJA"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Youtube className="w-5 h-5" />
            Subscribe Now
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('latest')}
            className={`px-6 py-3 font-medium text-lg flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'latest'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Latest Videos
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-6 py-3 font-medium text-lg flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'popular'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Most Popular
          </button>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : currentVideos.length > 0 ? (
          <>
            {/* Featured Video (First video in large format) */}
            {currentVideos.length > 0 && (
              <div className="mb-10">
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={currentVideos[0].thumbnail}
                          alt={currentVideos[0].title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <a
                          href={currentVideos[0].videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors hover:scale-110 transform duration-300">
                            <Play className="w-10 h-10 text-white" fill="white" />
                          </div>
                        </a>
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg">
                            {activeTab === 'latest' ? 'NEW VIDEO' : 'TOP VIDEO'}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 bg-black/80 text-white text-sm px-3 py-1.5 rounded">
                          {formatDuration(currentVideos[0].duration)}
                        </div>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                          Featured
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatTimeAgo(currentVideos[0].publishedAt)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 line-clamp-2">
                        {currentVideos[0].title}
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {currentVideos[0].description}
                      </p>
                      <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-2">
                          <Eye className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">
                            {formatViewCount(currentVideos[0].viewCount)} views
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">
                            {formatViewCount(currentVideos[0].likeCount)} likes
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">
                            {formatDuration(currentVideos[0].duration)}
                          </span>
                        </div>
                      </div>
                      <a
                        href={currentVideos[0].videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Play className="w-5 h-5" />
                        Watch Now
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentVideos.slice(1).map((video) => (
                <Card key={video.id} className="group border-0 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video.duration)}
                      </div>
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-white" fill="white" />
                        </div>
                      </a>
                    </div>
                    <div className="p-4">
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h4 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {video.title}
                        </h4>
                      </a>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatViewCount(video.viewCount)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {formatViewCount(video.likeCount)}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        {formatTimeAgo(video.publishedAt)}
                      </div>
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1 text-red-600 font-medium hover:underline text-sm"
                      >
                        Watch Video
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View More Button */}
            <div className="text-center mt-10">
              <a
                href="https://www.youtube.com/channel/UC5OfTkVERVIwFVXufshOIJA/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gray-100 text-gray-800 font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                View All Videos on YouTube
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Videos Available</h3>
            <p className="text-gray-500">Unable to fetch videos from YouTube channel</p>
          </div>
        )}
      </div>
    </section>
  );
}