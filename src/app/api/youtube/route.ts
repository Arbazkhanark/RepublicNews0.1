// // app/api/youtube/route.ts
// import { NextResponse } from 'next/server';

// export async function GET(request: Request) {
//   try {
//     // Get query parameters
//     const { searchParams } = new URL(request.url);
//     const type = searchParams.get('type') || 'latest';
//     const limit = parseInt(searchParams.get('limit') || '10');
//     // const channelId = searchParams.get('channelId') || 'UC5OfTkVERVIwFVXufshOIJA';
//     const channelId = searchParams.get('channelId') || 'UCuNl5JS7Ye29A74qcosrkYw'

//     const API_KEY = process.env.YOUTUBE_API_KEY;
    
//     console.log('API Key exists:', !!API_KEY);
//     console.log('Channel ID:', channelId);
//     console.log('Request type:', type);

//     if (!API_KEY) {
//       console.error('API Key missing from environment');
//       return NextResponse.json(
//         { 
//           error: 'YouTube API key not configured',
//           details: 'Please check your .env.local file' 
//         },
//         { status: 500 }
//       );
//     }

//     // Validate API key format (basic check)
//     if (API_KEY.length < 30) {
//       console.error('API Key appears invalid (too short):', API_KEY);
//       return NextResponse.json(
//         { 
//           error: 'Invalid API key format',
//           details: 'API key seems too short. Please check your Google Cloud Console' 
//         },
//         { status: 500 }
//       );
//     }

//     let apiUrl = '';
//     let orderBy = 'date';
    
//     if (type === 'channel') {
//       // Get channel info
//       apiUrl = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${channelId}&part=snippet,statistics`;
//     } else if (type === 'popular') {
//       // Get popular videos
//       orderBy = 'viewCount';
//       apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=${orderBy}&maxResults=${limit}&type=video`;
//     } else {
//       // Get latest videos (default)
//       apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${limit}&type=video`;
//     }

//     console.log('Making request to:', apiUrl.substring(0, 100) + '...');

//     const response = await fetch(apiUrl, {
//       headers: {
//         'Accept': 'application/json',
//       },
//       next: { revalidate: 3600 } // Cache for 1 hour
//     });

//     console.log('Response status:', response.status);
//     console.log('Response', response);
//     console.log('Response headers:', Object.fromEntries(response.headers.entries()));

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('API Error Response:', errorText);
      
//       let errorMessage = 'Failed to fetch YouTube data';
//       if (response.status === 403) {
//         errorMessage = 'Access forbidden. Check API key and quota.';
//       } else if (response.status === 429) {
//         errorMessage = 'API quota exceeded. Try again later.';
//       }

//       return NextResponse.json(
//         { 
//           error: errorMessage,
//           status: response.status,
//           details: errorText 
//         },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();
//     console.log('Data received, items count:', data.items?.length || 0);

//     // For channel info
//     if (type === 'channel') {
//       if (!data.items || data.items.length === 0) {
//         return NextResponse.json(
//           { error: 'Channel not found' },
//           { status: 404 }
//         );
//       }

//       const channel = data.items[0];
//       return NextResponse.json({
//         id: channel.id,
//         title: channel.snippet.title,
//         description: channel.snippet.description,
//         thumbnail: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default.url,
//         customUrl: channel.snippet.customUrl,
//         subscriberCount: channel.statistics?.subscriberCount || '0',
//         videoCount: channel.statistics?.videoCount || '0',
//         viewCount: channel.statistics?.viewCount || '0',
//         publishedAt: channel.snippet.publishedAt,
//         country: channel.snippet.country,
//         channelUrl: `https://www.youtube.com/${channel.snippet.customUrl || 'channel/' + channel.id}`
//       });
//     }

//     // For videos
//     if (!data.items || data.items.length === 0) {
//       return NextResponse.json([]);
//     }

//     // Get video details for statistics
//     const videoIds = data.items
//       .filter((item: any) => item.id.videoId)
//       .map((item: any) => item.id.videoId)
//       .slice(0, 10);

//     if (videoIds.length > 0) {
//       const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds.join(',')}&part=snippet,statistics,contentDetails`;
      
//       try {
//         const detailsResponse = await fetch(detailsUrl);
//         if (detailsResponse.ok) {
//           const detailsData = await detailsResponse.json();
          
//           // Merge search results with video details
//           const videos = data.items.map((item: any) => {
//             const details = detailsData.items?.find((d: any) => d.id === item.id.videoId);
//             return {
//               id: item.id.videoId,
//               title: item.snippet.title,
//               description: item.snippet.description,
//               thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
//               channelTitle: item.snippet.channelTitle,
//               publishedAt: item.snippet.publishedAt,
//               viewCount: details?.statistics?.viewCount || '0',
//               likeCount: details?.statistics?.likeCount || '0',
//               duration: details?.contentDetails?.duration || 'PT0S',
//               videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
//               type: type
//             };
//           });

//           console.log('Videos with details:', videos);

//           return NextResponse.json(videos);
//         }
//       } catch (error) {
//         console.error('Failed to fetch video details:', error);
//       }
//     }

//     // Fallback: return basic video info without statistics
//     const basicVideos = data.items.map((item: any) => ({
//       id: item.id.videoId,
//       title: item.snippet.title,
//       description: item.snippet.description,
//       thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
//       channelTitle: item.snippet.channelTitle,
//       publishedAt: item.snippet.publishedAt,
//       videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
//       type: type
//     }));

//     return NextResponse.json(basicVideos);

//   } catch (error) {
//     console.error('YouTube API Error:', error);
//     return NextResponse.json(
//       { 
//         error: 'Failed to fetch YouTube videos',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from 'next/server';

// In-memory cache for development (production में Redis या database use करें)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds

// Channel ID के लिए fallback options
const CHANNEL_IDS = [
  'UCuNl5JS7Ye29A74qcosrkYw', // Primary channel
  'UC5OfTkVERVIwFVXufshOIJA', // Backup channel
];

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'latest';
    const limit = parseInt(searchParams.get('limit') || '10');
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    // Cache key based on parameters
    const cacheKey = `${type}_${limit}`;
    
    // Check cache first (unless force refresh)
    if (!forceRefresh && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Serving from cache:', cacheKey);
        return NextResponse.json(cached.data);
      } else {
        // Remove expired cache
        cache.delete(cacheKey);
      }
    }

    const API_KEY = process.env.YOUTUBE_API_KEY;
    
    if (!API_KEY) {
      console.error('YouTube API key not configured');
      return NextResponse.json(
        { 
          error: 'YouTube API key not configured',
          details: 'Please check your .env.local file' 
        },
        { status: 500 }
      );
    }

    // Try each channel ID until one works
    let data = null;
    let lastError = null;
    
    for (const channelId of CHANNEL_IDS) {
      try {
        console.log('Trying channel ID:', channelId);
        
        let apiUrl = '';
        let orderBy = 'date';
        
        if (type === 'channel') {
          // Get channel info
          apiUrl = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${channelId}&part=snippet,statistics`;
        } else if (type === 'popular') {
          // Get popular videos
          orderBy = 'viewCount';
          apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=${orderBy}&maxResults=${limit}&type=video`;
        } else {
          // Get latest videos (default)
          apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${limit}&type=video`;
        }

        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const responseData = await response.json();
        
        // If no items found, try next channel
        if (!responseData.items || responseData.items.length === 0) {
          continue;
        }

        data = responseData;
        break;
        
      } catch (error) {
        lastError = error;
        console.log(`Channel ${channelId} failed, trying next...`);
        continue;
      }
    }

    if (!data) {
      console.error('All channels failed:', lastError);
      
      // Return empty array instead of error to prevent page breaking
      const emptyResult = type === 'channel' ? { error: 'Channel not available' } : [];
      cache.set(cacheKey, { data: emptyResult, timestamp: Date.now() });
      
      return NextResponse.json(emptyResult);
    }

    // For channel info
    if (type === 'channel') {
      const channel = data.items[0];
      const result = {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default.url,
        customUrl: channel.snippet.customUrl,
        subscriberCount: channel.statistics?.subscriberCount || '0',
        videoCount: channel.statistics?.videoCount || '0',
        viewCount: channel.statistics?.viewCount || '0',
        publishedAt: channel.snippet.publishedAt,
        country: channel.snippet.country,
        channelUrl: `https://www.youtube.com/${channel.snippet.customUrl || 'channel/' + channel.id}`
      };
      
      // Cache the result
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      return NextResponse.json(result);
    }

    // For videos
    // Get video details for statistics
    const videoIds = data.items
      .filter((item: any) => item.id.videoId)
      .map((item: any) => item.id.videoId)
      .slice(0, limit);

    let videos = [];
    
    if (videoIds.length > 0) {
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds.join(',')}&part=snippet,statistics,contentDetails`;
      
      try {
        const detailsResponse = await fetch(detailsUrl);
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          
          // Merge search results with video details
          videos = data.items.map((item: any) => {
            const details = detailsData.items?.find((d: any) => d.id === item.id.videoId);
            return {
              id: item.id.videoId,
              title: item.snippet.title,
              description: item.snippet.description,
              thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
              channelTitle: item.snippet.channelTitle,
              publishedAt: item.snippet.publishedAt,
              viewCount: details?.statistics?.viewCount || '0',
              likeCount: details?.statistics?.likeCount || '0',
              duration: details?.contentDetails?.duration || 'PT0S',
              videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              type: type
            };
          });
        }
      } catch (error) {
        console.error('Failed to fetch video details, using basic info:', error);
        // Fallback to basic info
        videos = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          viewCount: '0',
          likeCount: '0',
          duration: 'PT0S',
          videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          type: type
        }));
      }
    }

    // Cache the result
    cache.set(cacheKey, { data: videos, timestamp: Date.now() });
    
    return NextResponse.json(videos);

  } catch (error) {
    console.error('YouTube API Error:', error);
    
    // Return cached data if available (even if expired)
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'latest';
    const limit = parseInt(searchParams.get('limit') || '10');
    const cacheKey = `${type}_${limit}`;
    
    if (cache.has(cacheKey)) {
      console.log('Returning expired cached data due to error');
      return NextResponse.json(cache.get(cacheKey)!.data);
    }
    
    // Return empty result to prevent page breaking
    return NextResponse.json(type === 'channel' ? { error: 'Service unavailable' } : [], { status: 200 });
  }
}

// Cache cleanup function (optional)
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION * 2) {
      cache.delete(key);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupCache, 3600 * 1000);