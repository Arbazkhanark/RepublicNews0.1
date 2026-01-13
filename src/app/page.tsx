// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { 
//   TrendingUp, 
//   Calendar, 
//   Clock, 
//   Eye, 
//   Share2, 
//   Bookmark,
//   ChevronRight,
//   Home,
//   Newspaper,
//   Globe,
//   Briefcase,
//   Zap,
//   Megaphone,
//   Tag,
//   BarChart3,
//   Target,
//   PlayCircle,
//   Youtube,
//   ExternalLink
// } from "lucide-react";
// import { useLanguage } from "@/contexts/language-context";
// import { PublicHeader } from "@/components/public/header";
// import { PublicFooter } from "@/components/public/footer";
// import { HeroNewsCarousel } from "@/components/public/HeroNewsCaousel";
// import { GoogleAdSense } from "@/components/public/google-adsense";
// import { YouTubeVideosSection } from "@/components/public/youtube-videos-section";
// import { YouTubeSidebar } from "@/components/public/youtube-sidebar";

// interface NewsArticle {
//   _id: string;
//   title: string;
//   subtitle?: string;
//   excerpt: string;
//   featuredImage?: string;
//   category?: {
//     name: string;
//     slug: string;
//   };
//   author: {
//     name: string;
//   };
//   contributorName?: string;
//   publishedAt: string;
//   views: number;
//   readingTime: number;
//   isBreaking?: boolean;
//   isFeatured?: boolean;
//   language: "en" | "hi";
//   heroArticle?: boolean;
// }

// export default function HomePage() {
//   const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([]);
//   const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
//   const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [email, setEmail] = useState("");
//   const { language, t } = useLanguage();

//   useEffect(() => {
//     fetchNews();
//   }, [language]);

//   const fetchNews = async () => {
//     try {
//       setLoading(true);

//       // HERO ARTICLES
//       const featuredResponse = await fetch(
//         `/api/news?page=1&limit=10&language=${language}`
//       );
//       if (featuredResponse.ok) {
//         const featuredData = await featuredResponse.json();

//         const heroArticles = featuredData.data.articles
//           .filter((article: NewsArticle) => article.heroArticle)
//           .sort(
//             (a: NewsArticle, b: NewsArticle) =>
//               new Date(b.publishedAt).getTime() -
//               new Date(a.publishedAt).getTime()
//           );

//         const articlesToUse =
//           heroArticles.length > 0
//             ? heroArticles
//             : featuredData.data.articles
//                 .sort(
//                   (a: NewsArticle, b: NewsArticle) =>
//                     new Date(b.publishedAt).getTime() -
//                     new Date(a.publishedAt).getTime()
//                 )
//                 .slice(0, 3);

//         setFeaturedNews(articlesToUse.slice(0, 3));
//       }

//       // LATEST NEWS
//       const latestResponse = await fetch(
//         `/api/news?page=1&limit=25&language=${language}&status=published`
//       );
//       if (latestResponse.ok) {
//         const latestData = await latestResponse.json();
//         const sortedNews = latestData.data.articles.sort(
//           (a: NewsArticle, b: NewsArticle) =>
//             new Date(b.publishedAt).getTime() -
//             new Date(a.publishedAt).getTime()
//         );
//         setLatestNews(sortedNews);
//       }

//       // TRENDING NEWS
//       const trendingResponse = await fetch(
//         `/api/news?page=1&limit=10&language=${language}&status=published&sortBy=views&sortOrder=desc`
//       );
//       if (trendingResponse.ok) {
//         const trendingData = await trendingResponse.json();
//         setTrendingNews(trendingData.data.articles);
//       }
//     } catch (error) {
//       console.error("Failed to fetch news:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNewsletterSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("/api/newsletter/subscribe", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, language: "both" }),
//       });

//       if (response.ok) {
//         setEmail("");
//         alert("Successfully subscribed to newsletter!");
//       } else {
//         alert("Failed to subscribe. Please try again.");
//       }
//     } catch {
//       alert("Failed to subscribe. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <PublicHeader />
//         <div className="flex items-center justify-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
//         </div>
//         <PublicFooter />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <PublicHeader />

//       <main>
//         {/* ================= HERO ================= */}
//         <HeroNewsCarousel articles={featuredNews} />

//         {/* ================= Breaking News Ticker ================= */}
//         <div className="bg-red-600 text-white py-2">
//           <div className="container mx-auto px-4">
//             <div className="flex items-center gap-4 overflow-hidden">
//               <div className="flex items-center gap-2 bg-red-700 px-4 py-1 rounded-md whitespace-nowrap">
//                 <Zap className="w-4 h-4" />
//                 <span className="font-bold">BREAKING NEWS</span>
//               </div>
//               <div className="flex-1 overflow-hidden">
//                 <div className="animate-marquee whitespace-nowrap">
//                   <span className="mx-8">
//                     • Parliament passes new education bill • India wins gold in Asian Games • Stock market hits all-time high •
//                   </span>
//                   <span className="mx-8">
//                     • Parliament passes new education bill • India wins gold in Asian Games • Stock market hits all-time high •
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ================= Quick Navigation ================= */}
//         <div className="bg-gray-50 border-y">
//           <div className="container mx-auto px-4">
//             <div className="flex overflow-x-auto py-3 gap-6 no-scrollbar">
//               {[
//                 { icon: Home, label: "Home", color: "bg-red-600" },
//                 { icon: Newspaper, label: "National", color: "bg-blue-600" },
//                 { icon: Globe, label: "International", color: "bg-green-600" },
//                 { icon: Briefcase, label: "Business", color: "bg-purple-600" },
//                 { icon: Megaphone, label: "Politics", color: "bg-yellow-600" },
//                 { icon: "⚽", label: "Sports", color: "bg-orange-600" },
//                 { icon: "💻", label: "Technology", color: "bg-indigo-600" },
//                 { icon: "🎬", label: "Entertainment", color: "bg-pink-600" },
//                 { icon: "🏥", label: "Health", color: "bg-teal-600" },
//                 { icon: "🎓", label: "Education", color: "bg-cyan-600" },
//               ].map((item, index) => (
//                 <a
//                   key={index}
//                   href="#"
//                   className="flex flex-col items-center gap-1 min-w-[60px] hover:text-red-600 transition-colors group"
//                 >
//                   <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
//                     {typeof item.icon === 'string' ? (
//                       <span className="text-lg">{item.icon}</span>
//                     ) : (
//                       <item.icon className="w-4 h-4" />
//                     )}
//                   </div>
//                   <span className="text-xs font-medium">{item.label}</span>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ================= HERO BOTTOM AD ================= */}
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex justify-center">
//             <GoogleAdSense
//               adSlot="1234567890"
//               adFormat="horizontal"
//               className="max-w-[728px] w-full"
//             />
//           </div>
//         </div>

//         {/* ================= YOUTUBE VIDEOS SECTION ================= */}
//         <YouTubeVideosSection />

//         {/* ================= MAIN GRID ================= */}
//         <div className="container mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//             {/* ================= LEFT SIDEBAR ================= */}
//             <aside className="lg:col-span-3 space-y-8">
//               {/* Replace old Video News with YouTube Sidebar */}
//               <YouTubeSidebar />

//               {/* Trending Hashtags */}
//               <Card className="border shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <Tag className="w-5 h-5 text-red-600" />
//                     Trending Hashtags
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-wrap gap-2">
//                     {['#Budget2024', '#Election2024', '#ClimateChange', '#TechNews', '#SportsNews', '#HealthAlert', '#EducationReform', '#FarmersProtest'].map((tag) => (
//                       <a 
//                         key={tag}
//                         href="#" 
//                         className="px-3 py-1 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-full text-sm transition-colors"
//                       >
//                         {tag}
//                       </a>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Opinion Poll */}
//               <Card className="border shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg">Opinion Poll</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <h4 className="font-bold text-sm mb-4">Should India implement a 4-day work week?</h4>
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Yes, definitely</span>
//                       <span className="text-sm font-medium text-red-600">65%</span>
//                     </div>
//                     <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <div className="h-full bg-red-600 rounded-full" style={{ width: '65%' }}></div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">No, not ready</span>
//                       <span className="text-sm font-medium text-gray-600">25%</span>
//                     </div>
//                     <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <div className="h-full bg-gray-600 rounded-full" style={{ width: '25%' }}></div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Undecided</span>
//                       <span className="text-sm font-medium text-gray-600">10%</span>
//                     </div>
//                     <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <div className="h-full bg-gray-400 rounded-full" style={{ width: '10%' }}></div>
//                     </div>
//                   </div>
//                   <Button variant="outline" className="w-full mt-4">Vote Now</Button>
//                 </CardContent>
//               </Card>
//             </aside>

//             {/* ================= MAIN CONTENT (BIG CENTER AREA) ================= */}
//             <div className="lg:col-span-6">
//               {/* Today's Top Stories - BIG HIGHLIGHT */}
//               <section className="mb-10">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-2 h-10 bg-red-600 rounded-full"></div>
//                     <div>
//                       <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
//                         Today's Top Stories
//                       </h2>
//                       <p className="text-sm text-gray-600">Latest and most important news from around the world</p>
//                     </div>
//                   </div>
//                   <a href="#" className="text-red-600 text-sm font-medium flex items-center gap-1 hover:underline">
//                     View All <ChevronRight className="w-4 h-4" />
//                   </a>
//                 </div>

//                 {/* Main BIG Featured Story */}
//                 {latestNews.length > 0 && (
//                   <div className="mb-8">
//                     <div className="group cursor-pointer">
//                       <div className="relative overflow-hidden rounded-xl mb-6">
//                         <div className="aspect-[16/9] bg-gray-200 relative">
//                           {latestNews[0]?.featuredImage ? (
//                             <img
//                               src={latestNews[0].featuredImage}
//                               alt={latestNews[0].title}
//                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                             />
//                           ) : (
//                             <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
//                               <Newspaper className="w-16 h-16 text-gray-500" />
//                             </div>
//                           )}
//                           <div className="absolute top-4 left-4">
//                             <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg">
//                               TOP STORY
//                             </span>
//                           </div>
//                           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
//                             <div className="text-white">
//                               <div className="flex items-center gap-4 mb-2">
//                                 {latestNews[0]?.category && (
//                                   <span className="text-sm font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
//                                     {latestNews[0].category.name}
//                                   </span>
//                                 )}
//                                 <span className="text-sm flex items-center gap-1">
//                                   <Clock className="w-3 h-3" />
//                                   {latestNews[0] ? new Date(latestNews[0].publishedAt).toLocaleDateString('en-IN', { 
//                                     day: 'numeric', 
//                                     month: 'short',
//                                     hour: '2-digit',
//                                     minute: '2-digit'
//                                   }) : ''}
//                                 </span>
//                               </div>
//                               <h3 className="font-bold text-2xl md:text-3xl leading-tight mb-3">
//                                 {latestNews[0]?.title}
//                               </h3>
//                               <p className="text-gray-200 text-base leading-relaxed line-clamp-2">
//                                 {latestNews[0]?.excerpt}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
//                         <div className="flex items-center gap-2">
//                           <span className="font-medium">By {latestNews[0]?.author.name}</span>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <span className="flex items-center gap-1">
//                             <Eye className="w-4 h-4" />
//                             {latestNews[0]?.views} views
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Clock className="w-4 h-4" />
//                             {latestNews[0]?.readingTime} min read
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 justify-end">
//                           <button className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center gap-2 transition-colors">
//                             <Share2 className="w-4 h-4" />
//                             Share
//                           </button>
//                           <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors">
//                             <Bookmark className="w-4 h-4" />
//                             Save
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Big 2-Column Grid for Important Stories */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   {latestNews.slice(1, 5).map((article) => (
//                     <div key={article._id} className="group cursor-pointer">
//                       <div className="relative overflow-hidden rounded-lg mb-4">
//                         <div className="aspect-[16/9] bg-gray-200 relative">
//                           {article.featuredImage ? (
//                             <img
//                               src={article.featuredImage}
//                               alt={article.title}
//                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                             />
//                           ) : (
//                             <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
//                               <Newspaper className="w-12 h-12 text-gray-500" />
//                             </div>
//                           )}
//                           {article.isBreaking && (
//                             <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded">
//                               BREAKING
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="space-y-3">
//                         <div className="flex items-center gap-4">
//                           {article.category && (
//                             <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
//                               {article.category.name}
//                             </span>
//                           )}
//                           <span className="text-xs text-gray-500 flex items-center gap-1">
//                             <Clock className="w-3 h-3" />
//                             {new Date(article.publishedAt).toLocaleTimeString('en-IN', { 
//                               hour: '2-digit', 
//                               minute: '2-digit' 
//                             })}
//                           </span>
//                         </div>
//                         <h3 className="font-bold text-xl leading-tight group-hover:text-red-600 transition-colors">
//                           {article.title}
//                         </h3>
//                         <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
//                           {article.excerpt}
//                         </p>
//                         <div className="flex items-center justify-between pt-3 border-t">
//                           <div className="flex items-center gap-3 text-sm text-gray-500">
//                             <span className="font-medium">{article.author.name}</span>
//                             <span>•</span>
//                             <span>{article.readingTime} min read</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Eye className="w-4 h-4 text-gray-400" />
//                             <span className="text-sm text-gray-500">{article.views}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* More Stories in 3-Column Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {latestNews.slice(5, 11).map((article) => (
//                     <div key={article._id} className="group cursor-pointer">
//                       <div className="relative overflow-hidden rounded-lg mb-3">
//                         <div className="aspect-video bg-gray-200 relative">
//                           {article.featuredImage ? (
//                             <img
//                               src={article.featuredImage}
//                               alt={article.title}
//                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                             />
//                           ) : (
//                             <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
//                               <Newspaper className="w-10 h-10 text-gray-500" />
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-3">
//                           {article.category && (
//                             <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
//                               {article.category.name}
//                             </span>
//                           )}
//                           <span className="text-xs text-gray-500">
//                             {new Date(article.publishedAt).toLocaleTimeString('en-IN', { 
//                               hour: '2-digit', 
//                               minute: '2-digit' 
//                             })}
//                           </span>
//                         </div>
//                         <h3 className="font-bold text-base leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
//                           {article.title}
//                         </h3>
//                         <div className="flex items-center justify-between pt-2">
//                           <div className="flex items-center gap-3 text-xs text-gray-500">
//                             <span>{article.author.name}</span>
//                             <span>•</span>
//                             <span>{article.readingTime} min</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Eye className="w-3 h-3 text-gray-400" />
//                             <span className="text-xs text-gray-500">{article.views}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* ===== Inline Ad ===== */}
//               <div className="my-10 flex justify-center">
//                 <GoogleAdSense
//                   adSlot="0987654321"
//                   adFormat="rectangle"
//                   className="max-w-[336px] w-full"
//                 />
//               </div>

//               {/* Latest News Section - Full Width */}
//               <section className="mb-10">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
//                     <div>
//                       <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
//                         Latest News
//                       </h2>
//                       <p className="text-sm text-gray-600">Fresh updates from all categories</p>
//                     </div>
//                   </div>
//                   <a href="#" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
//                     More Stories <ChevronRight className="w-4 h-4" />
//                   </a>
//                 </div>

//                 <div className="space-y-6">
//                   {latestNews.slice(11, 17).map((article) => (
//                     <div key={article._id} className="group cursor-pointer">
//                       <div className="flex gap-6">
//                         <div className="w-32 h-32 flex-shrink-0">
//                           <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
//                             {article.featuredImage ? (
//                               <img
//                                 src={article.featuredImage}
//                                 alt={article.title}
//                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                               />
//                             ) : (
//                               <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
//                                 <Newspaper className="w-10 h-10 text-gray-500" />
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex items-center gap-4 mb-2">
//                             <span className="text-sm font-medium text-blue-600 uppercase tracking-wide bg-blue-50 px-3 py-1 rounded-full">
//                               {article.category?.name || "General"}
//                             </span>
//                             <span className="text-sm text-gray-500 flex items-center gap-1">
//                               <Clock className="w-3 h-3" />
//                               {new Date(article.publishedAt).toLocaleTimeString('en-IN', { 
//                                 hour: '2-digit', 
//                                 minute: '2-digit' 
//                               })}
//                             </span>
//                           </div>
//                           <h4 className="font-bold text-xl leading-tight group-hover:text-blue-600 transition-colors mb-3">
//                             {article.title}
//                           </h4>
//                           <p className="text-gray-600 text-base leading-relaxed line-clamp-2 mb-4">
//                             {article.excerpt}
//                           </p>
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-4 text-sm text-gray-500">
//                               <span className="font-medium">By {article.author.name}</span>
//                               <span>•</span>
//                               <span>{article.readingTime} min read</span>
//                             </div>
//                             <div className="flex items-center gap-4">
//                               <div className="flex items-center gap-2">
//                                 <Eye className="w-4 h-4 text-gray-400" />
//                                 <span className="text-sm text-gray-500">{article.views}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                                   <Share2 className="w-4 h-4 text-gray-500" />
//                                 </button>
//                                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                                   <Bookmark className="w-4 h-4 text-gray-500" />
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Fact-Check Highlight Section */}
//               <section className="mb-10 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
//                       <Target className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         Fact-Check Spotlight
//                       </h2>
//                       <p className="text-sm text-gray-600">Verified information and debunked myths</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {[
//                     {
//                       title: "Viral Video Claims: Deepfake Analysis",
//                       claim: "Video showing politician is manipulated",
//                       status: "False",
//                       color: "bg-red-500"
//                     },
//                     {
//                       title: "Health Misinformation Alert",
//                       claim: "Miracle cure claims debunked",
//                       status: "Misleading",
//                       color: "bg-yellow-500"
//                     }
//                   ].map((item, index) => (
//                     <div key={index} className="bg-white rounded-lg p-5 border shadow-sm">
//                       <div className="flex items-start justify-between mb-3">
//                         <h4 className="font-bold text-lg">{item.title}</h4>
//                         <span className={`${item.color} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
//                           {item.status}
//                         </span>
//                       </div>
//                       <p className="text-gray-600 text-sm mb-4">{item.claim}</p>
//                       <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
//                         Read Full Fact-Check
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             </div>

//             {/* ================= RIGHT SIDEBAR ================= */}
//             <aside className="lg:col-span-3 space-y-8">
//               {/* Sticky Sidebar Ad */}
//               <div className="sticky top-24">
//                 <GoogleAdSense
//                   adSlot="1122334455"
//                   adFormat="vertical"
//                   className="w-full"
//                 />
//               </div>

//               {/* Most Popular */}
//               <Card className="border shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <TrendingUp className="w-5 h-5 text-red-600" />
//                     Most Popular
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {trendingNews.slice(0, 8).map((article, index) => (
//                       <div key={article._id} className="group cursor-pointer">
//                         <div className="flex items-start gap-3">
//                           <div className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
//                             {index + 1}
//                           </div>
//                           <div className="flex-1">
//                             <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
//                               {article.title}
//                             </h4>
//                             <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
//                               <span className="flex items-center gap-1">
//                                 <Eye className="w-3 h-3" />
//                                 {article.views} views
//                               </span>
//                               <span>{article.category?.name}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Newsletter */}
//               <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg text-red-800 flex items-center gap-2">
//                     <Megaphone className="w-5 h-5" />
//                     Stay Informed
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-red-700 text-sm mb-4">
//                     Get daily news updates and exclusive analysis delivered to your inbox.
//                   </p>
//                   <form onSubmit={handleNewsletterSubmit} className="space-y-3">
//                     <Input
//                       type="email"
//                       placeholder="Enter your email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                       className="bg-white"
//                     />
//                     <Button
//                       type="submit"
//                       className="w-full bg-red-600 hover:bg-red-700"
//                     >
//                       Subscribe Now
//                     </Button>
//                   </form>
//                   <p className="text-xs text-gray-600 mt-3">
//                     By subscribing, you agree to our Privacy Policy
//                   </p>
//                 </CardContent>
//               </Card>

//               {/* Live Updates */}
//               <Card className="border shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
//                     Live Updates
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {[
//                       { time: "10:45 AM", text: "Stock market opens higher, Sensex up 150 points" },
//                       { time: "10:30 AM", text: "Cabinet meeting underway at PM's residence" },
//                       { time: "10:15 AM", text: "Heavy rainfall alert issued for Mumbai" },
//                       { time: "10:00 AM", text: "Supreme Court hearing on electoral bonds case" },
//                       { time: "9:45 AM", text: "India's GDP growth rate announced for Q2" },
//                       { time: "9:30 AM", text: "Foreign Secretary holds talks with US counterpart" },
//                       { time: "9:15 AM", text: "RBI announces new monetary policy measures" },
//                     ].map((update, index) => (
//                       <div key={index} className="pb-3 border-b last:border-b-0 last:pb-0">
//                         <div className="flex items-start gap-2">
//                           <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded whitespace-nowrap">
//                             {update.time}
//                           </span>
//                           <span className="text-sm text-gray-700 flex-1">{update.text}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Categories */}
//               <Card className="border shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg">Categories</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     {[
//                       { name: "National", count: 234, color: "bg-red-100 text-red-700" },
//                       { name: "International", count: 189, color: "bg-blue-100 text-blue-700" },
//                       { name: "Politics", count: 156, color: "bg-yellow-100 text-yellow-700" },
//                       { name: "Business", count: 142, color: "bg-purple-100 text-purple-700" },
//                       { name: "Sports", count: 128, color: "bg-orange-100 text-orange-700" },
//                       { name: "Technology", count: 115, color: "bg-indigo-100 text-indigo-700" },
//                       { name: "Entertainment", count: 98, color: "bg-pink-100 text-pink-700" },
//                       { name: "Health", count: 87, color: "bg-teal-100 text-teal-700" },
//                     ].map((category) => (
//                       <a
//                         key={category.name}
//                         href="#"
//                         className="flex items-center justify-between py-2.5 px-3 hover:bg-gray-50 rounded-lg transition-colors group"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className={`w-2 h-2 rounded-full ${category.color.split(' ')[0]}`}></div>
//                           <span className="text-sm font-medium group-hover:text-red-600 transition-colors">
//                             {category.name}
//                           </span>
//                         </div>
//                         <Badge variant="secondary" className="text-xs">
//                           {category.count}
//                         </Badge>
//                       </a>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </aside>
//           </div>
//         </div>

//         {/* ================= FOOTER TOP AD ================= */}
//         <div className="bg-gray-50 border-t py-6">
//           <div className="container mx-auto px-4">
//             <div className="flex justify-center">
//               <GoogleAdSense
//                 adSlot="6677889900"
//                 adFormat="horizontal"
//                 className="max-w-[970px] w-full"
//               />
//             </div>
//           </div>
//         </div>
//       </main>

//       <PublicFooter />
//     </div>
//   );
// }











// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { 
//   TrendingUp, 
//   Calendar, 
//   Clock, 
//   Eye, 
//   Share2, 
//   Bookmark,
//   ChevronRight,
//   Home,
//   Newspaper,
//   Globe,
//   Briefcase,
//   Zap,
//   Megaphone,
//   Tag,
//   BarChart3,
//   Target,
//   PlayCircle,
//   Youtube,
//   ExternalLink,
//   MessageSquare,
//   ThumbsUp,
//   ThumbsDown,
//   Heart,
//   TrendingUp as TrendingIcon,
//   Sparkles,
//   Users
// } from "lucide-react";
// import { useLanguage } from "@/contexts/language-context";
// import { PublicHeader } from "@/components/public/header";
// import { PublicFooter } from "@/components/public/footer";
// import { HeroNewsCarousel } from "@/components/public/HeroNewsCaousel";
// import { GoogleAdSense } from "@/components/public/google-adsense";
// import { YouTubeVideosSection } from "@/components/public/youtube-videos-section";
// import { YouTubeSidebar } from "@/components/public/youtube-sidebar";
// import Link from "next/link";
// import Image from "next/image";

// interface NewsArticle {
//   _id: string;
//   title: string;
//   subtitle?: string;
//   excerpt: string;
//   featuredImage?: string;
//   category?: {
//     name: string;
//     slug: string;
//   };
//   author: {
//     name: string;
//   };
//   contributorName?: string;
//   publishedAt: string;
//   views: number;
//   readingTime: number;
//   isBreaking?: boolean;
//   isFeatured?: boolean;
//   language: "en" | "hi";
//   heroArticle?: boolean;
// }

// interface Opinion {
//   _id: string;
//   title: string;
//   content: string;
//   topic: string;
//   imageUrl?: string;
//   tags: string[];
//   authorId: {
//     _id: string;
//     name: string;
//     avatar?: string;
//   };
//   likes: number;
//   dislikes: number;
//   views: number;
//   shares: number;
//   commentCount?: number;
//   createdAt: string;
//   updatedAt: string;
//   status: "pending" | "approved" | "rejected";
// }

// export default function HomePage() {
//   const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([]);
//   const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
//   const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([]);
//   const [topOpinions, setTopOpinions] = useState<Opinion[]>([]);
//   const [trendingOpinions, setTrendingOpinions] = useState<Opinion[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [opinionsLoading, setOpinionsLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const { language, t } = useLanguage();

//   useEffect(() => {
//     fetchNews();
//     fetchTopOpinions();
//   }, [language]);

//   const fetchNews = async () => {
//     try {
//       setLoading(true);

//       // HERO ARTICLES
//       const featuredResponse = await fetch(
//         `/api/news?page=1&limit=10&language=${language}`
//       );
//       if (featuredResponse.ok) {
//         const featuredData = await featuredResponse.json();

//         const heroArticles = featuredData.data.articles
//           .filter((article: NewsArticle) => article.heroArticle)
//           .sort(
//             (a: NewsArticle, b: NewsArticle) =>
//               new Date(b.publishedAt).getTime() -
//               new Date(a.publishedAt).getTime()
//           );

//         const articlesToUse =
//           heroArticles.length > 0
//             ? heroArticles
//             : featuredData.data.articles
//                 .sort(
//                   (a: NewsArticle, b: NewsArticle) =>
//                     new Date(b.publishedAt).getTime() -
//                     new Date(a.publishedAt).getTime()
//                 )
//                 .slice(0, 3);

//         setFeaturedNews(articlesToUse.slice(0, 3));
//       }

//       // LATEST NEWS
//       const latestResponse = await fetch(
//         `/api/news?page=1&limit=25&language=${language}&status=published`
//       );
//       if (latestResponse.ok) {
//         const latestData = await latestResponse.json();
//         const sortedNews = latestData.data.articles.sort(
//           (a: NewsArticle, b: NewsArticle) =>
//             new Date(b.publishedAt).getTime() -
//             new Date(a.publishedAt).getTime()
//         );
//         setLatestNews(sortedNews);
//       }

//       // TRENDING NEWS
//       const trendingResponse = await fetch(
//         `/api/news?page=1&limit=10&language=${language}&status=published&sortBy=views&sortOrder=desc`
//       );
//       if (trendingResponse.ok) {
//         const trendingData = await trendingResponse.json();
//         setTrendingNews(trendingData.data.articles);
//       }
//     } catch (error) {
//       console.error("Failed to fetch news:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTopOpinions = async () => {
//     try {
//       setOpinionsLoading(true);
      
//       // Fetch top opinions (most liked)
//       const response = await fetch(
//         `/api/opinions/public?limit=6&sort=-likes&status=approved`
//       );
      
//       if (response.ok) {
//         const data = await response.json();
//         setTopOpinions(data.opinions || []);
        
//         // Fetch trending opinions (most engaging)
//         const trendingResponse = await fetch(
//           `/api/opinions/public?limit=6&sort=-views&status=approved`
//         );
        
//         if (trendingResponse.ok) {
//           const trendingData = await trendingResponse.json();
//           setTrendingOpinions(trendingData.opinions || []);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch opinions:", error);
//     } finally {
//       setOpinionsLoading(false);
//     }
//   };

//   const handleNewsletterSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("/api/newsletter/subscribe", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, language: "both" }),
//       });

//       if (response.ok) {
//         setEmail("");
//         alert("Successfully subscribed to newsletter!");
//       } else {
//         alert("Failed to subscribe. Please try again.");
//       }
//     } catch {
//       alert("Failed to subscribe. Please try again.");
//     }
//   };

//   const formatTimeAgo = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return new Date(dateString).toLocaleDateString();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <PublicHeader />
//         <div className="flex items-center justify-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
//         </div>
//         <PublicFooter />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <PublicHeader />

//       <main>
//         {/* ================= HERO ================= */}
//         <HeroNewsCarousel articles={featuredNews} />

//         {/* ================= Breaking News Ticker ================= */}
//         <div className="bg-red-600 text-white py-2">
//           <div className="container mx-auto px-4">
//             <div className="flex items-center gap-4 overflow-hidden">
//               <div className="flex items-center gap-2 bg-red-700 px-4 py-1 rounded-md whitespace-nowrap">
//                 <Zap className="w-4 h-4" />
//                 <span className="font-bold">BREAKING NEWS</span>
//               </div>
//               <div className="flex-1 overflow-hidden">
//                 <div className="animate-marquee whitespace-nowrap">
//                   <span className="mx-8">
//                     • Parliament passes new education bill • India wins gold in Asian Games • Stock market hits all-time high •
//                   </span>
//                   <span className="mx-8">
//                     • Parliament passes new education bill • India wins gold in Asian Games • Stock market hits all-time high •
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ================= Quick Navigation ================= */}
//         <div className="bg-gray-50 border-y">
//           <div className="container mx-auto px-4">
//             <div className="flex overflow-x-auto py-3 gap-6 no-scrollbar">
//               {[
//                 { icon: Home, label: "Home", color: "bg-red-600", href: "/" },
//                 { icon: Newspaper, label: "National", color: "bg-blue-600", href: "/category/national" },
//                 { icon: Globe, label: "International", color: "bg-green-600", href: "/category/international" },
//                 { icon: Briefcase, label: "Business", color: "bg-purple-600", href: "/category/business" },
//                 { icon: Megaphone, label: "Politics", color: "bg-yellow-600", href: "/category/politics" },
//                 { icon: "⚽", label: "Sports", color: "bg-orange-600", href: "/category/sports" },
//                 { icon: "💻", label: "Technology", color: "bg-indigo-600", href: "/category/technology" },
//                 { icon: "🎬", label: "Entertainment", color: "bg-pink-600", href: "/category/entertainment" },
//                 { icon: "🏥", label: "Health", color: "bg-teal-600", href: "/category/health" },
//                 { icon: "🎓", label: "Education", color: "bg-cyan-600", href: "/category/education" },
//                 { icon: MessageSquare, label: "Opinions", color: "bg-violet-600", href: "/opinions" },
//               ].map((item, index) => (
//                 <Link
//                   key={index}
//                   href={item.href}
//                   className="flex flex-col items-center gap-1 min-w-[60px] hover:text-red-600 transition-colors group"
//                 >
//                   <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
//                     {typeof item.icon === 'string' ? (
//                       <span className="text-lg">{item.icon}</span>
//                     ) : (
//                       <item.icon className="w-4 h-4" />
//                     )}
//                   </div>
//                   <span className="text-xs font-medium">{item.label}</span>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ================= HERO BOTTOM AD ================= */}
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex justify-center">
//             <GoogleAdSense
//               adSlot="1234567890"
//               adFormat="horizontal"
//               className="max-w-[728px] w-full"
//             />
//           </div>
//         </div>

//         {/* ================= YOUTUBE VIDEOS SECTION ================= */}
//         <YouTubeVideosSection />

//         {/* ================= MAIN GRID ================= */}
//         <div className="container mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//             {/* ================= LEFT SIDEBAR ================= */}
//             <aside className="lg:col-span-3 space-y-8">
//               {/* Replace old Video News with YouTube Sidebar */}
//               <YouTubeSidebar />

//               {/* ================= TOP OPINIONS SECTION ================= */}
//               <Card className="border shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <Sparkles className="w-5 h-5 text-violet-600" />
//                     Top Opinions
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {opinionsLoading ? (
//                     <div className="space-y-3">
//                       {[1, 2, 3].map(i => (
//                         <div key={i} className="animate-pulse">
//                           <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                           <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : topOpinions.length > 0 ? (
//                     <div className="space-y-4">
//                       {topOpinions.slice(0, 3).map((opinion) => (
//                         <Link
//                           key={opinion._id}
//                           href={`/opinions/${opinion._id}`}
//                           className="group block hover:bg-gray-50 p-3 rounded-lg transition-colors"
//                         >
//                           <div className="flex items-start gap-3">
//                             <div className="flex-shrink-0">
//                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
//                                 <MessageSquare className="w-5 h-5 text-white" />
//                               </div>
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-violet-600 transition-colors mb-1">
//                                 {opinion.title}
//                               </h4>
//                               <div className="flex items-center gap-3 text-xs text-gray-500">
//                                 <span className="font-medium truncate">
//                                   {opinion.authorId.name}
//                                 </span>
//                                 <div className="flex items-center gap-2">
//                                   <div className="flex items-center gap-1">
//                                     <ThumbsUp className="w-3 h-3 text-green-500" />
//                                     <span>{opinion.likes}</span>
//                                   </div>
//                                   <div className="flex items-center gap-1">
//                                     <Eye className="w-3 h-3 text-blue-500" />
//                                     <span>{opinion.views}</span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </Link>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-4">
//                       <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
//                       <p className="text-sm text-gray-500">No opinions yet</p>
//                     </div>
//                   )}
                  
//                   {topOpinions.length > 0 && (
//                     <div className="mt-4 pt-4 border-t">
//                       <Link
//                         href="/opinions"
//                         className="text-violet-600 text-sm font-medium flex items-center justify-center gap-1 hover:underline"
//                       >
//                         View All Opinions
//                         <ChevronRight className="w-4 h-4" />
//                       </Link>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Trending Hashtags */}
//               <Card className="border shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <Tag className="w-5 h-5 text-red-600" />
//                     Trending Hashtags
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-wrap gap-2">
//                     {['#Budget2024', '#Election2024', '#ClimateChange', '#TechNews', '#SportsNews', '#HealthAlert', '#EducationReform', '#FarmersProtest'].map((tag) => (
//                       <a 
//                         key={tag}
//                         href="#" 
//                         className="px-3 py-1 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-full text-sm transition-colors"
//                       >
//                         {tag}
//                       </a>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Opinion Poll */}
//               <Card className="border shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg">Opinion Poll</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <h4 className="font-bold text-sm mb-4">Should India implement a 4-day work week?</h4>
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Yes, definitely</span>
//                       <span className="text-sm font-medium text-red-600">65%</span>
//                     </div>
//                     <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <div className="h-full bg-red-600 rounded-full" style={{ width: '65%' }}></div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">No, not ready</span>
//                       <span className="text-sm font-medium text-gray-600">25%</span>
//                     </div>
//                     <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <div className="h-full bg-gray-600 rounded-full" style={{ width: '25%' }}></div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Undecided</span>
//                       <span className="text-sm font-medium text-gray-600">10%</span>
//                     </div>
//                     <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <div className="h-full bg-gray-400 rounded-full" style={{ width: '10%' }}></div>
//                     </div>
//                   </div>
//                   <Button variant="outline" className="w-full mt-4">Vote Now</Button>
//                 </CardContent>
//               </Card>
//             </aside>

//             {/* ================= MAIN CONTENT (BIG CENTER AREA) ================= */}
//             <div className="lg:col-span-6">
//               {/* ================= POPULAR OPINIONS SECTION ================= */}
//               <section className="mb-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-2 h-10 bg-violet-600 rounded-full"></div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         Popular Opinions
//                       </h2>
//                       <p className="text-sm text-gray-600">What people are saying about current affairs</p>
//                     </div>
//                   </div>
//                   <Link
//                     href="/opinions"
//                     className="text-violet-600 text-sm font-medium flex items-center gap-1 hover:underline"
//                   >
//                     View All <ChevronRight className="w-4 h-4" />
//                   </Link>
//                 </div>

//                 {opinionsLoading ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {[1, 2].map(i => (
//                       <Card key={i} className="border animate-pulse">
//                         <CardContent className="p-6">
//                           <div className="h-4 bg-gray-200 rounded mb-4"></div>
//                           <div className="h-3 bg-gray-200 rounded mb-2"></div>
//                           <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 ) : topOpinions.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {topOpinions.slice(0, 2).map((opinion) => (
//                       <Link
//                         key={opinion._id}
//                         href={`/opinions/${opinion._id}`}
//                         className="group block"
//                       >
//                         <Card className="border hover:border-violet-300 hover:shadow-md transition-all duration-300 h-full">
//                           <CardContent className="p-6">
//                             <div className="flex items-start justify-between mb-4">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
//                                   <MessageSquare className="w-5 h-5 text-white" />
//                                 </div>
//                                 <div>
//                                   <h4 className="font-semibold text-sm text-gray-600">
//                                     {opinion.authorId.name}
//                                   </h4>
//                                   <p className="text-xs text-gray-500">
//                                     {formatTimeAgo(opinion.createdAt)}
//                                   </p>
//                                 </div>
//                               </div>
//                               <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
//                                 Opinion
//                               </Badge>
//                             </div>
                            
//                             <h3 className="font-bold text-xl mb-3 group-hover:text-violet-600 transition-colors line-clamp-2">
//                               {opinion.title}
//                             </h3>
                            
//                             <p className="text-gray-600 mb-4 line-clamp-3">
//                               {opinion.content.length > 150 
//                                 ? opinion.content.substring(0, 150) + '...'
//                                 : opinion.content
//                               }
//                             </p>

//                             <div className="flex flex-wrap gap-2 mb-4">
//                               {opinion.tags.slice(0, 2).map((tag, idx) => (
//                                 <Badge key={idx} variant="outline" className="text-xs">
//                                   {tag}
//                                 </Badge>
//                               ))}
//                             </div>

//                             <div className="flex items-center justify-between pt-4 border-t">
//                               <div className="flex items-center gap-4">
//                                 <div className="flex items-center gap-1 text-green-600">
//                                   <ThumbsUp className="w-4 h-4" />
//                                   <span className="text-sm font-medium">{opinion.likes}</span>
//                                 </div>
//                                 <div className="flex items-center gap-1 text-red-600">
//                                   <ThumbsDown className="w-4 h-4" />
//                                   <span className="text-sm font-medium">{opinion.dislikes}</span>
//                                 </div>
//                                 <div className="flex items-center gap-1 text-blue-600">
//                                   <MessageSquare className="w-4 h-4" />
//                                   <span className="text-sm font-medium">{opinion.commentCount || 0}</span>
//                                 </div>
//                               </div>
//                               <div className="flex items-center gap-1 text-gray-500 text-sm">
//                                 <Eye className="w-4 h-4" />
//                                 <span>{opinion.views}</span>
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       </Link>
//                     ))}
//                   </div>
//                 ) : (
//                   <Card className="border">
//                     <CardContent className="p-8 text-center">
//                       <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <h3 className="text-lg font-semibold text-gray-700 mb-2">No Opinions Yet</h3>
//                       <p className="text-gray-500 mb-4">Be the first to share your opinion on current affairs</p>
//                       <Button variant="outline" className="border-violet-300 text-violet-600 hover:bg-violet-50">
//                         Share Your Opinion
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 )}
//               </section>

//               {/* Today's Top Stories - BIG HIGHLIGHT */}
//               <section className="mb-10">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-2 h-10 bg-red-600 rounded-full"></div>
//                     <div>
//                       <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
//                         Today's Top Stories
//                       </h2>
//                       <p className="text-sm text-gray-600">Latest and most important news from around the world</p>
//                     </div>
//                   </div>
//                   <a href="#" className="text-red-600 text-sm font-medium flex items-center gap-1 hover:underline">
//                     View All <ChevronRight className="w-4 h-4" />
//                   </a>
//                 </div>

//                 {/* Main BIG Featured Story */}
//                 {latestNews.length > 0 && (
//                   <div className="mb-8">
//                     <div className="group cursor-pointer">
//                       <div className="relative overflow-hidden rounded-xl mb-6">
//                         <div className="aspect-[16/9] bg-gray-200 relative">
//                           {latestNews[0]?.featuredImage ? (
//                             <img
//                               src={latestNews[0].featuredImage}
//                               alt={latestNews[0].title}
//                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                             />
//                           ) : (
//                             <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
//                               <Newspaper className="w-16 h-16 text-gray-500" />
//                             </div>
//                           )}
//                           <div className="absolute top-4 left-4">
//                             <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg">
//                               TOP STORY
//                             </span>
//                           </div>
//                           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
//                             <div className="text-white">
//                               <div className="flex items-center gap-4 mb-2">
//                                 {latestNews[0]?.category && (
//                                   <span className="text-sm font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
//                                     {latestNews[0].category.name}
//                                   </span>
//                                 )}
//                                 <span className="text-sm flex items-center gap-1">
//                                   <Clock className="w-3 h-3" />
//                                   {latestNews[0] ? new Date(latestNews[0].publishedAt).toLocaleDateString('en-IN', { 
//                                     day: 'numeric', 
//                                     month: 'short',
//                                     hour: '2-digit',
//                                     minute: '2-digit'
//                                   }) : ''}
//                                 </span>
//                               </div>
//                               <h3 className="font-bold text-2xl md:text-3xl leading-tight mb-3">
//                                 {latestNews[0]?.title}
//                               </h3>
//                               <p className="text-gray-200 text-base leading-relaxed line-clamp-2">
//                                 {latestNews[0]?.excerpt}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
//                         <div className="flex items-center gap-2">
//                           <span className="font-medium">By {latestNews[0]?.author.name}</span>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <span className="flex items-center gap-1">
//                             <Eye className="w-4 h-4" />
//                             {latestNews[0]?.views} views
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Clock className="w-4 h-4" />
//                             {latestNews[0]?.readingTime} min read
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 justify-end">
//                           <button className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center gap-2 transition-colors">
//                             <Share2 className="w-4 h-4" />
//                             Share
//                           </button>
//                           <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors">
//                             <Bookmark className="w-4 h-4" />
//                             Save
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Big 2-Column Grid for Important Stories */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   {latestNews.slice(1, 5).map((article) => (
//                     <div key={article._id} className="group cursor-pointer">
//                       <div className="relative overflow-hidden rounded-lg mb-4">
//                         <div className="aspect-[16/9] bg-gray-200 relative">
//                           {article.featuredImage ? (
//                             <img
//                               src={article.featuredImage}
//                               alt={article.title}
//                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                             />
//                           ) : (
//                             <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
//                               <Newspaper className="w-12 h-12 text-gray-500" />
//                             </div>
//                           )}
//                           {article.isBreaking && (
//                             <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded">
//                               BREAKING
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="space-y-3">
//                         <div className="flex items-center gap-4">
//                           {article.category && (
//                             <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
//                               {article.category.name}
//                             </span>
//                           )}
//                           <span className="text-xs text-gray-500 flex items-center gap-1">
//                             <Clock className="w-3 h-3" />
//                             {new Date(article.publishedAt).toLocaleTimeString('en-IN', { 
//                               hour: '2-digit', 
//                               minute: '2-digit' 
//                             })}
//                           </span>
//                         </div>
//                         <h3 className="font-bold text-xl leading-tight group-hover:text-red-600 transition-colors">
//                           {article.title}
//                         </h3>
//                         <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
//                           {article.excerpt}
//                         </p>
//                         <div className="flex items-center justify-between pt-3 border-t">
//                           <div className="flex items-center gap-3 text-sm text-gray-500">
//                             <span className="font-medium">{article.author.name}</span>
//                             <span>•</span>
//                             <span>{article.readingTime} min read</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Eye className="w-4 h-4 text-gray-400" />
//                             <span className="text-sm text-gray-500">{article.views}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* More Stories in 3-Column Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {latestNews.slice(5, 11).map((article) => (
//                     <div key={article._id} className="group cursor-pointer">
//                       <div className="relative overflow-hidden rounded-lg mb-3">
//                         <div className="aspect-video bg-gray-200 relative">
//                           {article.featuredImage ? (
//                             <img
//                               src={article.featuredImage}
//                               alt={article.title}
//                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                             />
//                           ) : (
//                             <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
//                               <Newspaper className="w-10 h-10 text-gray-500" />
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-3">
//                           {article.category && (
//                             <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
//                               {article.category.name}
//                             </span>
//                           )}
//                           <span className="text-xs text-gray-500">
//                             {new Date(article.publishedAt).toLocaleTimeString('en-IN', { 
//                               hour: '2-digit', 
//                               minute: '2-digit' 
//                             })}
//                           </span>
//                         </div>
//                         <h3 className="font-bold text-base leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
//                           {article.title}
//                         </h3>
//                         <div className="flex items-center justify-between pt-2">
//                           <div className="flex items-center gap-3 text-xs text-gray-500">
//                             <span>{article.author.name}</span>
//                             <span>•</span>
//                             <span>{article.readingTime} min</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Eye className="w-3 h-3 text-gray-400" />
//                             <span className="text-xs text-gray-500">{article.views}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* ===== Inline Ad ===== */}
//               <div className="my-10 flex justify-center">
//                 <GoogleAdSense
//                   adSlot="0987654321"
//                   adFormat="rectangle"
//                   className="max-w-[336px] w-full"
//                 />
//               </div>

//               {/* Latest News Section - Full Width */}
//               <section className="mb-10">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
//                     <div>
//                       <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
//                         Latest News
//                       </h2>
//                       <p className="text-sm text-gray-600">Fresh updates from all categories</p>
//                     </div>
//                   </div>
//                   <a href="#" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
//                     More Stories <ChevronRight className="w-4 h-4" />
//                   </a>
//                 </div>

//                 <div className="space-y-6">
//                   {latestNews.slice(11, 17).map((article) => (
//                     <div key={article._id} className="group cursor-pointer">
//                       <div className="flex gap-6">
//                         <div className="w-32 h-32 flex-shrink-0">
//                           <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
//                             {article.featuredImage ? (
//                               <img
//                                 src={article.featuredImage}
//                                 alt={article.title}
//                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                               />
//                             ) : (
//                               <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
//                                 <Newspaper className="w-10 h-10 text-gray-500" />
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex items-center gap-4 mb-2">
//                             <span className="text-sm font-medium text-blue-600 uppercase tracking-wide bg-blue-50 px-3 py-1 rounded-full">
//                               {article.category?.name || "General"}
//                             </span>
//                             <span className="text-sm text-gray-500 flex items-center gap-1">
//                               <Clock className="w-3 h-3" />
//                               {new Date(article.publishedAt).toLocaleTimeString('en-IN', { 
//                                 hour: '2-digit', 
//                                 minute: '2-digit' 
//                               })}
//                             </span>
//                           </div>
//                           <h4 className="font-bold text-xl leading-tight group-hover:text-blue-600 transition-colors mb-3">
//                             {article.title}
//                           </h4>
//                           <p className="text-gray-600 text-base leading-relaxed line-clamp-2 mb-4">
//                             {article.excerpt}
//                           </p>
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-4 text-sm text-gray-500">
//                               <span className="font-medium">By {article.author.name}</span>
//                               <span>•</span>
//                               <span>{article.readingTime} min read</span>
//                             </div>
//                             <div className="flex items-center gap-4">
//                               <div className="flex items-center gap-2">
//                                 <Eye className="w-4 h-4 text-gray-400" />
//                                 <span className="text-sm text-gray-500">{article.views}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                                   <Share2 className="w-4 h-4 text-gray-500" />
//                                 </button>
//                                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                                   <Bookmark className="w-4 h-4 text-gray-500" />
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* ================= TRENDING OPINIONS SECTION ================= */}
//               <section className="mb-10 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-xl p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
//                       <TrendingIcon className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         Trending Opinions
//                       </h2>
//                       <p className="text-sm text-gray-600">Most discussed opinions this week</p>
//                     </div>
//                   </div>
//                   <Link
//                     href="/opinions"
//                     className="text-violet-600 text-sm font-medium flex items-center gap-1 hover:underline"
//                   >
//                     View All
//                     <ChevronRight className="w-4 h-4" />
//                   </Link>
//                 </div>

//                 {opinionsLoading ? (
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {[1, 2, 3].map(i => (
//                       <div key={i} className="animate-pulse">
//                         <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
//                         <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                         <div className="h-3 bg-gray-200 rounded w-3/4"></div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : trendingOpinions.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {trendingOpinions.slice(0, 3).map((opinion) => (
//                       <Link
//                         key={opinion._id}
//                         href={`/opinions/${opinion._id}`}
//                         className="group block"
//                       >
//                         <Card className="border hover:border-violet-300 hover:shadow-md transition-all duration-300 h-full">
//                           <CardContent className="p-4">
//                             <div className="flex items-center gap-2 mb-3">
//                               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
//                                 <span className="text-xs font-bold text-white">
//                                   {opinion.authorId.name.charAt(0)}
//                                 </span>
//                               </div>
//                               <div>
//                                 <h4 className="text-sm font-semibold">
//                                   {opinion.authorId.name}
//                                 </h4>
//                               </div>
//                             </div>
                            
//                             <h3 className="font-bold text-base mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
//                               {opinion.title}
//                             </h3>
                            
//                             <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-3 border-t">
//                               <div className="flex items-center gap-3">
//                                 <div className="flex items-center gap-1">
//                                   <ThumbsUp className="w-3 h-3 text-green-500" />
//                                   <span>{opinion.likes}</span>
//                                 </div>
//                                 <div className="flex items-center gap-1">
//                                   <MessageSquare className="w-3 h-3 text-blue-500" />
//                                   <span>{opinion.commentCount || 0}</span>
//                                 </div>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Eye className="w-3 h-3" />
//                                 <span>{opinion.views}</span>
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       </Link>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-6">
//                     <TrendingIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                     <p className="text-gray-500">No trending opinions yet</p>
//                   </div>
//                 )}

//                 <div className="mt-6 pt-6 border-t">
//                   <Link
//                     href="/opinions/new"
//                     className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-violet-300 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
//                   >
//                     <MessageSquare className="w-4 h-4" />
//                     Share Your Opinion
//                   </Link>
//                   <p className="text-xs text-gray-500 mt-2">
//                     Join the conversation and share your perspective on current affairs
//                   </p>
//                 </div>
//               </section>

//               {/* Fact-Check Highlight Section */}
//               <section className="mb-10 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
//                       <Target className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         Fact-Check Spotlight
//                       </h2>
//                       <p className="text-sm text-gray-600">Verified information and debunked myths</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {[
//                     {
//                       title: "Viral Video Claims: Deepfake Analysis",
//                       claim: "Video showing politician is manipulated",
//                       status: "False",
//                       color: "bg-red-500"
//                     },
//                     {
//                       title: "Health Misinformation Alert",
//                       claim: "Miracle cure claims debunked",
//                       status: "Misleading",
//                       color: "bg-yellow-500"
//                     }
//                   ].map((item, index) => (
//                     <div key={index} className="bg-white rounded-lg p-5 border shadow-sm">
//                       <div className="flex items-start justify-between mb-3">
//                         <h4 className="font-bold text-lg">{item.title}</h4>
//                         <span className={`${item.color} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
//                           {item.status}
//                         </span>
//                       </div>
//                       <p className="text-gray-600 text-sm mb-4">{item.claim}</p>
//                       <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
//                         Read Full Fact-Check
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             </div>

//             {/* ================= RIGHT SIDEBAR ================= */}
//             <aside className="lg:col-span-3 space-y-8">
//               {/* Sticky Sidebar Ad */}
//               <div className="sticky top-24">
//                 <GoogleAdSense
//                   adSlot="1122334455"
//                   adFormat="vertical"
//                   className="w-full"
//                 />
//               </div>

//               {/* Most Popular */}
//               <Card className="border shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <TrendingUp className="w-5 h-5 text-red-600" />
//                     Most Popular
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {trendingNews.slice(0, 8).map((article, index) => (
//                       <div key={article._id} className="group cursor-pointer">
//                         <div className="flex items-start gap-3">
//                           <div className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
//                             {index + 1}
//                           </div>
//                           <div className="flex-1">
//                             <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
//                               {article.title}
//                             </h4>
//                             <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
//                               <span className="flex items-center gap-1">
//                                 <Eye className="w-3 h-3" />
//                                 {article.views} views
//                               </span>
//                               <span>{article.category?.name}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* ================= OPINION LEADERBOARD ================= */}
//               <Card className="border shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <Users className="w-5 h-5 text-violet-600" />
//                     Opinion Leaders
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {opinionsLoading ? (
//                     <div className="space-y-3">
//                       {[1, 2, 3].map(i => (
//                         <div key={i} className="animate-pulse">
//                           <div className="h-10 bg-gray-200 rounded"></div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : topOpinions.length > 0 ? (
//                     <div className="space-y-3">
//                       {Array.from(new Set(topOpinions.map(o => o.authorId._id)))
//                         .slice(0, 3)
//                         .map((authorId, index) => {
//                           const authorOpinions = topOpinions.filter(o => o.authorId._id === authorId);
//                           const author = authorOpinions[0].authorId;
//                           const totalLikes = authorOpinions.reduce((sum, o) => sum + o.likes, 0);
//                           const totalViews = authorOpinions.reduce((sum, o) => sum + o.views, 0);
                          
//                           return (
//                             <Link
//                               key={authorId}
//                               href={`/profile/${authorId}`}
//                               className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
//                             >
//                               <div className="relative">
//                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
//                                   {author.name.charAt(0)}
//                                 </div>
//                                 <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold border-2 border-white">
//                                   {index + 1}
//                                 </div>
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <h4 className="font-semibold text-sm group-hover:text-violet-600 transition-colors truncate">
//                                   {author.name}
//                                 </h4>
//                                 <div className="flex items-center gap-3 text-xs text-gray-500">
//                                   <span className="flex items-center gap-1">
//                                     <ThumbsUp className="w-3 h-3" />
//                                     {totalLikes}
//                                   </span>
//                                   <span className="flex items-center gap-1">
//                                     <Eye className="w-3 h-3" />
//                                     {totalViews}
//                                   </span>
//                                 </div>
//                               </div>
//                             </Link>
//                           );
//                         })}
//                     </div>
//                   ) : (
//                     <div className="text-center py-4">
//                       <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
//                       <p className="text-sm text-gray-500">No opinion leaders yet</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Newsletter */}
//               <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg text-red-800 flex items-center gap-2">
//                     <Megaphone className="w-5 h-5" />
//                     Stay Informed
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-red-700 text-sm mb-4">
//                     Get daily news updates and exclusive analysis delivered to your inbox.
//                   </p>
//                   <form onSubmit={handleNewsletterSubmit} className="space-y-3">
//                     <Input
//                       type="email"
//                       placeholder="Enter your email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                       className="bg-white"
//                     />
//                     <Button
//                       type="submit"
//                       className="w-full bg-red-600 hover:bg-red-700"
//                     >
//                       Subscribe Now
//                     </Button>
//                   </form>
//                   <p className="text-xs text-gray-600 mt-3">
//                     By subscribing, you agree to our Privacy Policy
//                   </p>
//                 </CardContent>
//               </Card>

//               {/* Live Updates */}
//               <Card className="border shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
//                     Live Updates
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {[
//                       { time: "10:45 AM", text: "Stock market opens higher, Sensex up 150 points" },
//                       { time: "10:30 AM", text: "Cabinet meeting underway at PM's residence" },
//                       { time: "10:15 AM", text: "Heavy rainfall alert issued for Mumbai" },
//                       { time: "10:00 AM", text: "Supreme Court hearing on electoral bonds case" },
//                       { time: "9:45 AM", text: "India's GDP growth rate announced for Q2" },
//                       { time: "9:30 AM", text: "Foreign Secretary holds talks with US counterpart" },
//                       { time: "9:15 AM", text: "RBI announces new monetary policy measures" },
//                     ].map((update, index) => (
//                       <div key={index} className="pb-3 border-b last:border-b-0 last:pb-0">
//                         <div className="flex items-start gap-2">
//                           <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded whitespace-nowrap">
//                             {update.time}
//                           </span>
//                           <span className="text-sm text-gray-700 flex-1">{update.text}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Categories */}
//               <Card className="border shadow-sm">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg">Categories</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     {[
//                       { name: "National", count: 234, color: "bg-red-100 text-red-700" },
//                       { name: "International", count: 189, color: "bg-blue-100 text-blue-700" },
//                       { name: "Politics", count: 156, color: "bg-yellow-100 text-yellow-700" },
//                       { name: "Business", count: 142, color: "bg-purple-100 text-purple-700" },
//                       { name: "Sports", count: 128, color: "bg-orange-100 text-orange-700" },
//                       { name: "Technology", count: 115, color: "bg-indigo-100 text-indigo-700" },
//                       { name: "Entertainment", count: 98, color: "bg-pink-100 text-pink-700" },
//                       { name: "Health", count: 87, color: "bg-teal-100 text-teal-700" },
//                       { name: "Opinions", count: topOpinions.length, color: "bg-violet-100 text-violet-700" },
//                     ].map((category) => (
//                       <Link
//                         key={category.name}
//                         href={category.name === "Opinions" ? "/opinions" : `/category/${category.name.toLowerCase()}`}
//                         className="flex items-center justify-between py-2.5 px-3 hover:bg-gray-50 rounded-lg transition-colors group"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className={`w-2 h-2 rounded-full ${category.color.split(' ')[0]}`}></div>
//                           <span className="text-sm font-medium group-hover:text-red-600 transition-colors">
//                             {category.name}
//                           </span>
//                         </div>
//                         <Badge variant="secondary" className="text-xs">
//                           {category.count}
//                         </Badge>
//                       </Link>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </aside>
//           </div>
//         </div>

//         {/* ================= FOOTER TOP AD ================= */}
//         <div className="bg-gray-50 border-t py-6">
//           <div className="container mx-auto px-4">
//             <div className="flex justify-center">
//               <GoogleAdSense
//                 adSlot="6677889900"
//                 adFormat="horizontal"
//                 className="max-w-[970px] w-full"
//               />
//             </div>
//           </div>
//         </div>
//       </main>

//       <PublicFooter />
//     </div>
//   );
// }














"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Eye, 
  Share2, 
  Bookmark,
  ChevronRight,
  Home,
  Newspaper,
  Globe,
  Briefcase,
  Zap,
  Megaphone,
  Tag,
  BarChart3,
  Target,
  PlayCircle,
  Youtube,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  PenSquare,
  Users,
  Search,
  Menu,
  Bell,
  User
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { PublicHeader } from "@/components/public/header";
import { PublicFooter } from "@/components/public/footer";
import { HeroNewsCarousel } from "@/components/public/HeroNewsCaousel";
import { GoogleAdSense } from "@/components/public/google-adsense";
import { YouTubeVideosSection } from "@/components/public/youtube-videos-section";
import { YouTubeSidebar } from "@/components/public/youtube-sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NewsArticle {
  _id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  featuredImage?: string;
  category?: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
  };
  contributorName?: string;
  publishedAt: string;
  views: number;
  readingTime: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  language: "en" | "hi";
  heroArticle?: boolean;
}

interface Opinion {
  _id: string;
  title: string;
  content: string;
  topic: string;
  tags: string[];
  authorId: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    designation?: string;
  };
  status: "approved" | "pending" | "rejected" | "draft";
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  views: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
}

export default function HomePage() {
  const router = useRouter();
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [trendingNews, setTrendingNews] = useState<NewsArticle[]>([]);
  const [topOpinions, setTopOpinions] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchNews();
    fetchOpinions();
  }, [language]);

  const fetchNews = async () => {
    try {
      setLoading(true);

      // HERO ARTICLES
      const featuredResponse = await fetch(
        `/api/news?page=1&limit=10&language=${language}`
      );
      if (featuredResponse.ok) {
        const featuredData = await featuredResponse.json();

        const heroArticles = featuredData.data.articles
          .filter((article: NewsArticle) => article.heroArticle)
          .sort(
            (a: NewsArticle, b: NewsArticle) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          );

        const articlesToUse =
          heroArticles.length > 0
            ? heroArticles
            : featuredData.data.articles
                .sort(
                  (a: NewsArticle, b: NewsArticle) =>
                    new Date(b.publishedAt).getTime() -
                    new Date(a.publishedAt).getTime()
                )
                .slice(0, 3);

        setFeaturedNews(articlesToUse.slice(0, 3));
      }

      // LATEST NEWS
      const latestResponse = await fetch(
        `/api/news?page=1&limit=25&language=${language}&status=published`
      );
      if (latestResponse.ok) {
        const latestData = await latestResponse.json();
        const sortedNews = latestData.data.articles.sort(
          (a: NewsArticle, b: NewsArticle) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
        setLatestNews(sortedNews);
      }

      // TRENDING NEWS
      const trendingResponse = await fetch(
        `/api/news?page=1&limit=10&language=${language}&status=published&sortBy=views&sortOrder=desc`
      );
      if (trendingResponse.ok) {
        const trendingData = await trendingResponse.json();
        setTrendingNews(trendingData.data.articles);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpinions = async () => {
    try {
      const response = await fetch(`/api/admin/opinions?status=approved&limit=3&sortBy=views&sortOrder=desc`);
      if (response.ok) {
        const data = await response.json();
        const approvedOpinions = data.opinions?.filter((op: Opinion) => op.status === 'approved') || [];
        setTopOpinions(approvedOpinions.slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to fetch opinions:", error);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, language: "both" }),
      });

      if (response.ok) {
        setEmail("");
        alert("Successfully subscribed to newsletter!");
      } else {
        alert("Failed to subscribe. Please try again.");
      }
    } catch {
      alert("Failed to subscribe. Please try again.");
    }
  };

  const navigateToOpinion = (opinionId: string) => {
    router.push(`/opinion/${opinionId}`);
  };

  const getReadTime = (content?: string) => {
    if (!content || typeof content !== 'string') {
      return "1 min read";
    }
    
    try {
      const words = content.split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      return `${minutes} min read`;
    } catch (error) {
      return "1 min read";
    }
  };

  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins} minutes ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} days ago`;
      }
    } catch (error) {
      return "Recently";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <main className="bg-gray-50">
        {/* ================= HERO CAROUSEL ================= */}
        <div className="bg-white">
          <HeroNewsCarousel articles={featuredNews} />
        </div>

        {/* ================= BREAKING NEWS TICKER ================= */}
        {/* <div className="bg-red-600 text-white py-2 border-b border-red-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="flex items-center gap-2 bg-red-800 px-4 py-1.5 whitespace-nowrap">
                <Zap className="w-4 h-4" />
                <span className="font-bold text-sm tracking-wide">BREAKING NEWS</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  <span className="mx-8">
                    • Parliament passes new education bill • India wins gold in Asian Games • Stock market hits all-time high •
                  </span>
                  <span className="mx-8">
                    • Parliament passes new education bill • India wins gold in Asian Games • Stock market hits all-time high •
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* ================= QUICK NAVIGATION BAR ================= */}
        {/* <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto py-4 gap-6 no-scrollbar">
              {[
                { icon: Home, label: "Home", color: "text-red-600", link: "/" },
                { icon: Newspaper, label: "National", color: "text-blue-700", link: "/category/national" },
                { icon: Globe, label: "International", color: "text-green-700", link: "/category/international" },
                { icon: Briefcase, label: "Business", color: "text-purple-700", link: "/category/business" },
                { icon: Megaphone, label: "Politics", color: "text-yellow-700", link: "/category/politics" },
                { icon: "⚽", label: "Sports", color: "text-orange-700", link: "/category/sports" },
                { icon: "💻", label: "Technology", color: "text-indigo-700", link: "/category/technology" },
                { icon: "🎬", label: "Entertainment", color: "text-pink-700", link: "/category/entertainment" },
                { icon: "🏥", label: "Health", color: "text-teal-700", link: "/category/health" },
                { icon: "🎓", label: "Education", color: "text-cyan-700", link: "/category/education" },
                { icon: MessageSquare, label: "Opinions", color: "text-red-700", link: "/opinions" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="flex items-center gap-2 whitespace-nowrap text-sm font-medium hover:text-red-600 transition-colors pb-1 border-b-2 border-transparent hover:border-red-600"
                >
                  {typeof item.icon === 'string' ? (
                    <span className="text-lg">{item.icon}</span>
                  ) : (
                    <item.icon className="w-4 h-4" />
                  )}
                  <span className={item.color}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div> */}

        {/* ================= HERO BOTTOM AD ================= */}
        {/* <div className="bg-white py-4 border-b">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <GoogleAdSense
                adSlot="1234567890"
                adFormat="horizontal"
                className="max-w-[728px] w-full"
              />
            </div>
          </div>
        </div> */}

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ================= LEFT SIDEBAR ================= */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Top Stories */}
              <div className="bg-white border p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Top Stories</h3>
                <div className="space-y-4">
                  {latestNews.slice(0, 5).map((article, index) => (
                    <Link 
                      key={article._id}
                      href={`/news/${article._id}`}
                      className="group block"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-gray-100 text-gray-700 rounded flex items-center justify-center text-sm font-bold group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-red-600 transition-colors">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span>{article.category?.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trending Hashtags */}
              <div className="bg-white border p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Trending Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['#Budget2024', '#Election2024', '#ClimateChange', '#TechNews', '#SportsNews'].map((tag) => (
                    <a 
                      key={tag}
                      href="#" 
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="bg-white border p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Newsletter</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get daily news updates delivered to your inbox.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-50"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>
            </aside>

            {/* ================= MAIN CONTENT AREA ================= */}
            <div className="lg:col-span-6">
              {/* TODAY'S TOP STORIES - PRIMARY FOCUS */}
              <div className="bg-white p-6 mb-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Today's Top Stories</h2>
                    <p className="text-sm text-gray-600">Latest and most important news</p>
                  </div>
                  <Link href="/news" className="text-red-600 hover:text-red-700 text-sm font-medium">
                    View All →
                  </Link>
                </div>

                {/* Main Featured Story */}
                {latestNews.length > 0 && (
                  <div className="mb-8">
                    <Link href={`/news/${latestNews[0]._id}`} className="group block">
                      <div className="relative mb-4">
                        <div className="aspect-[16/9] bg-gray-200">
                          {latestNews[0]?.featuredImage ? (
                            <img
                              src={latestNews[0].featuredImage}
                              alt={latestNews[0].title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                              <Newspaper className="w-16 h-16 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5">
                            TOP STORY
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {latestNews[0]?.category && (
                            <span className="font-medium text-red-600">
                              {latestNews[0].category.name}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {latestNews[0] ? new Date(latestNews[0].publishedAt).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : ''}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-bold group-hover:text-red-600 transition-colors">
                          {latestNews[0]?.title}
                        </h3>
                        
                        <p className="text-gray-700 leading-relaxed">
                          {latestNews[0]?.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t text-sm text-gray-600">
                          <span className="font-medium">By {latestNews[0]?.author.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {latestNews[0]?.views} views
                            </span>
                            <span>{latestNews[0]?.readingTime} min read</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* 2-Column Grid for Other Top Stories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {latestNews.slice(1, 5).map((article) => (
                    <Link 
                      key={article._id} 
                      href={`/news/${article._id}`}
                      className="group block border-b pb-6"
                    >
                      <div className="flex gap-4">
                        <div className="w-32 h-24 flex-shrink-0">
                          <div className="w-full h-full bg-gray-200">
                            {article.featuredImage ? (
                              <img
                                src={article.featuredImage}
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                <Newspaper className="w-10 h-10 text-gray-500" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {article.category && (
                              <span className="text-xs font-medium text-red-600">
                                {article.category.name}
                              </span>
                            )}
                            {article.isBreaking && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 font-bold">
                                BREAKING
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                            <span>{article.readingTime} min read</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* More Stories List */}
                <div className="space-y-4">
                  {latestNews.slice(5, 10).map((article) => (
                    <Link 
                      key={article._id} 
                      href={`/news/${article._id}`}
                      className="group block py-3 border-b last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium group-hover:text-red-600 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            {article.category && (
                              <span className="text-red-600">{article.category.name}</span>
                            )}
                            <span>{article.readingTime} min read</span>
                            <span>•</span>
                            <span>{new Date(article.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </div>
                        <div className="w-20 h-14 flex-shrink-0 bg-gray-200">
                          {article.featuredImage && (
                            <img
                              src={article.featuredImage}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* YouTube Videos Section */}
              <div className="mb-8">
                <YouTubeVideosSection />
              </div>

              {/* LATEST NEWS SECTION */}
              <div className="bg-white p-6 mb-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
                    <p className="text-sm text-gray-600">Fresh updates from all categories</p>
                  </div>
                  <Link href="/news" className="text-red-600 hover:text-red-700 text-sm font-medium">
                    More Stories →
                  </Link>
                </div>

                <div className="space-y-6">
                  {latestNews.slice(11, 17).map((article) => (
                    <Link 
                      key={article._id} 
                      href={`/news/${article._id}`}
                      className="group block pb-6 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1">
                              {article.category?.name || "General"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(article.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <h4 className="text-xl font-bold group-hover:text-red-600 transition-colors mb-3">
                            {article.title}
                          </h4>
                          <p className="text-gray-700 leading-relaxed line-clamp-2 mb-4">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                              <span className="font-medium">By {article.author.name}</span>
                              <span>{article.readingTime} min read</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{article.views}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-40 h-28 flex-shrink-0">
                          <div className="w-full h-full bg-gray-200">
                            {article.featuredImage ? (
                              <img
                                src={article.featuredImage}
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                <Newspaper className="w-10 h-10 text-gray-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* INLINE AD */}
              <div className="mb-8">
                <GoogleAdSense
                  adSlot="0987654321"
                  adFormat="horizontal"
                  className="max-w-[728px] mx-auto"
                />
              </div>

              {/* TOP OPINIONS SECTION - MOVED TO BOTTOM */}
              {topOpinions.length > 0 && (
                <div className="bg-white p-6 mb-8 border-t-4 border-red-600">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Top Opinions</h2>
                        <p className="text-sm text-gray-600">Expert perspectives on current affairs</p>
                      </div>
                    </div>
                    <Link 
                      href="/opinions" 
                      className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 text-sm"
                    >
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topOpinions.map((opinion, index) => (
                      <div 
                        key={opinion._id} 
                        className="border hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => navigateToOpinion(opinion._id)}
                      >
                        <div className="p-4">
                          {/* Opinion Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                                OPINION
                              </span>
                              {opinion.topic && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1">
                                  {opinion.topic}
                                </span>
                              )}
                            </div>
                            {index < 3 && (
                              <div className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1">
                                #{index + 1}
                              </div>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-bold text-lg leading-tight mb-3 hover:text-red-600 transition-colors line-clamp-2">
                            {opinion.title}
                          </h3>

                          {/* Author Info */}
                          <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                              {/* {opinion.authorId.name.charAt(0)} */}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{opinion.authorId.name}</p>
                              <p className="text-xs text-gray-500">
                                {opinion.authorId.designation || 'Columnist'}
                              </p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                {opinion.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {opinion.views}
                              </span>
                            </div>
                            <span className="text-gray-500">
                              {getReadTime(opinion.content)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}
            <aside className="lg:col-span-3 space-y-6">
              {/* YouTube Sidebar */}
              <YouTubeSidebar />

              {/* Most Popular */}
              <div className="bg-white border p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Most Popular
                </h3>
                <div className="space-y-4">
                  {trendingNews.slice(0, 8).map((article, index) => (
                    <Link 
                      key={article._id} 
                      href={`/news/${article._id}`}
                      className="group block"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-sm font-medium text-gray-500 w-6 text-right">
                          {index + 1}.
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium group-hover:text-red-600 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views}
                            </span>
                            <span>•</span>
                            <span>{article.category?.name}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white border p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Categories</h3>
                <div className="space-y-2">
                  {[
                    { name: "National", count: 234 },
                    { name: "International", count: 189 },
                    { name: "Politics", count: 156 },
                    { name: "Business", count: 142 },
                    { name: "Sports", count: 128 },
                    { name: "Technology", count: 115 },
                    { name: "Entertainment", count: 98 },
                    { name: "Health", count: 87 },
                    { name: "Opinions", count: 76, link: "/opinions" },
                  ].map((category) => (
                    <Link
                      key={category.name}
                      href={category.link || "#"}
                      className="flex items-center justify-between py-2.5 px-2 hover:bg-gray-50 rounded transition-colors group"
                    >
                      <span className="text-sm font-medium group-hover:text-red-600 transition-colors">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Fact Check */}
              <div className="bg-white border p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Fact Check
                </h3>
                <div className="space-y-3">
                  {[
                    { title: "Viral Video Claims: Deepfake Analysis", status: "False" },
                    { title: "Health Misinformation Alert", status: "Misleading" }
                  ].map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 border rounded">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                          {item.status}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-sm p-0 h-auto"
                      >
                        Read Full Fact-Check →
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sticky Ad */}
              <div className="sticky top-24">
                <GoogleAdSense
                  adSlot="1122334455"
                  adFormat="vertical"
                  className="w-full"
                />
              </div>
            </aside>
          </div>
        </div>

        {/* ================= FOOTER TOP AD ================= */}
        <div className="bg-gray-50 border-t py-6">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <GoogleAdSense
                adSlot="6677889900"
                adFormat="horizontal"
                className="max-w-[970px] w-full"
              />
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}