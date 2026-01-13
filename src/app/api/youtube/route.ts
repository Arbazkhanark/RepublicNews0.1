// // app/api/youtube-videos/route.ts
// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     // const CHANNEL_ID = 'UCuNl5JS7Ye29A74qcosrkYw'; // आपका YouTube Channel ID
//     // const CHANNEL_ID = 'UCuNl5JS7Ye29A74qcosrkYw'; // .env.local में सेट करें
//     const CHANNEL_ID = 'UC5OfTkVERVIwFVXufshOIJA';
//     // const API_KEY = process.env.YOUTUBE_API_KEY; // .env.local में सेट करें
//     const API_KEY = 'AIzaSyCbOesiWeITnnnvDwv8Fn_vpz9Jw_RwDOE'
    
//     if (!API_KEY) {
//       return NextResponse.json(
//         { error: 'YouTube API key not configured' },
//         { status: 500 }
//       );
//     }

//     // Latest videos fetch करें
//     const latestResponse = await fetch(
//       `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10&type=video`
//     );
    
//     // Top/most popular videos fetch करें
//     const popularResponse = await fetch(
//       `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=viewCount&maxResults=10&type=video`
//     );

//     console.log('YouTube Latest Response Status:', latestResponse.status);
//     console.log('YouTube Popular Response Status:', popularResponse.status);

//     if (!latestResponse.ok || !popularResponse.ok) {
//       throw new Error('Failed to fetch YouTube data');
//     }

//     const latestData = await latestResponse.json();
//     const popularData = await popularResponse.json();

//     // Video details और statistics fetch करें
//     const videoIds = [
//       ...latestData.items.map((item: any) => item.id.videoId),
//       ...popularData.items.map((item: any) => item.id.videoId)
//     ].slice(0, 20);

//     const detailsResponse = await fetch(
//       `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds.join(',')}&part=snippet,statistics,contentDetails`
//     );

//     console.log('YouTube Details Response Status:', detailsResponse.status);
//     const detailsData = await detailsResponse.json();

//     console.log('YouTube Details Data:', detailsData);
//     // Data structure बनाएं
//     const videos = detailsData.items.map((item: any) => ({
//       id: item.id,
//       title: item.snippet.title,
//       description: item.snippet.description,
//       thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
//       channelTitle: item.snippet.channelTitle,
//       publishedAt: item.snippet.publishedAt,
//       viewCount: item.statistics.viewCount,
//       likeCount: item.statistics.likeCount,
//       duration: item.contentDetails.duration,
//       videoUrl: `https://www.youtube.com/watch?v=${item.id}`
//     }));

//     // Latest और popular में separate करें
//     const latestVideos = videos
//       .filter(video => latestData.items.some((item: any) => item.id.videoId === video.id))
//       .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
//       .slice(0, 10);

//     const topVideos = videos
//       .filter(video => popularData.items.some((item: any) => item.id.videoId === video.id))
//       .sort((a, b) => parseInt(b.viewCount) - parseInt(a.viewCount))
//       .slice(0, 10);

//     return NextResponse.json({
//       latestVideos,
//       topVideos
//     });

//   } catch (error) {
//     console.error('YouTube API Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch YouTube videos' },
//       { status: 500 }
//     );
//   }
// }













// app/api/youtube/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'latest';
    const limit = parseInt(searchParams.get('limit') || '10');
    const channelId = searchParams.get('channelId') || 'UC5OfTkVERVIwFVXufshOIJA';

    const API_KEY = process.env.YOUTUBE_API_KEY;
    
    console.log('API Key exists:', !!API_KEY);
    console.log('Channel ID:', channelId);
    console.log('Request type:', type);

    if (!API_KEY) {
      console.error('API Key missing from environment');
      return NextResponse.json(
        { 
          error: 'YouTube API key not configured',
          details: 'Please check your .env.local file' 
        },
        { status: 500 }
      );
    }

    // Validate API key format (basic check)
    if (API_KEY.length < 30) {
      console.error('API Key appears invalid (too short):', API_KEY);
      return NextResponse.json(
        { 
          error: 'Invalid API key format',
          details: 'API key seems too short. Please check your Google Cloud Console' 
        },
        { status: 500 }
      );
    }

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

    console.log('Making request to:', apiUrl.substring(0, 100) + '...');

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      let errorMessage = 'Failed to fetch YouTube data';
      if (response.status === 403) {
        errorMessage = 'Access forbidden. Check API key and quota.';
      } else if (response.status === 429) {
        errorMessage = 'API quota exceeded. Try again later.';
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          status: response.status,
          details: errorText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Data received, items count:', data.items?.length || 0);

    // For channel info
    if (type === 'channel') {
      if (!data.items || data.items.length === 0) {
        return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
        );
      }

      const channel = data.items[0];
      return NextResponse.json({
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
      });
    }

    // For videos
    if (!data.items || data.items.length === 0) {
      return NextResponse.json([]);
    }

    // Get video details for statistics
    const videoIds = data.items
      .filter((item: any) => item.id.videoId)
      .map((item: any) => item.id.videoId)
      .slice(0, 10);

    if (videoIds.length > 0) {
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds.join(',')}&part=snippet,statistics,contentDetails`;
      
      try {
        const detailsResponse = await fetch(detailsUrl);
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          
          // Merge search results with video details
          const videos = data.items.map((item: any) => {
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

          return NextResponse.json(videos);
        }
      } catch (error) {
        console.error('Failed to fetch video details:', error);
      }
    }

    // Fallback: return basic video info without statistics
    const basicVideos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      type: type
    }));

    return NextResponse.json(basicVideos);

  } catch (error) {
    console.error('YouTube API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch YouTube videos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}