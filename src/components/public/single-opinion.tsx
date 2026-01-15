// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   Clock,
//   Calendar,
//   User,
//   Eye,
//   MessageCircle,
//   Facebook,
//   Twitter,
//   Linkedin,
//   Link as LinkIcon,
//   Check,
//   Tag,
//   Bookmark,
//   MoreVertical,
//   ThumbsUp,
//   ThumbsDown,
//   Share2,
//   Newspaper,
//   TrendingUp,
//   Home,
//   Search,
//   ChevronRight,
//   Quote,
//   Image as ImageIcon,
//   Globe,
//   Languages,
//   AlertCircle,
//   AlertTriangle,
//   MessageSquare,
//   Maximize2,
//   CheckCircle,
//   Type,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { toast } from "sonner";
// import Link from "next/link";
// import { Separator } from "@/components/ui/separator";
// import { Skeleton } from "@/components/ui/skeleton";
// import { GoogleAdSense } from "./google-adsense";

// interface Author {
//   _id: string;
//   name: string;
//   email: string;
//   profileImage?: string;
//   createdAt?: string;
// }

// interface Opinion {
//   _id: string;
//   title: string;
//   titleHi: string;
//   content: string;
//   contentHi: string;
//   topic: string;
//   tags: string[];
//   authorId: Author;
//   status: "approved" | "pending" | "rejected" | "draft";
//   likes: number;
//   dislikes: number;
//   likedBy: (Author | string)[];
//   dislikedBy: (Author | string)[];
//   views: number;
//   shares: number;
//   sharePlatforms: string[];
//   createdAt: string;
//   updatedAt: string;
//   originalLanguage?: 'en' | 'hi';
//   hasHindiTranslation?: boolean;
// }

// interface CurrentUser {
//   _id: string;
//   name: string;
//   email: string;
//   role?: string;
// }

// interface ContentBlock {
//   type: 'text' | 'heading' | 'quote' | 'image' | 'caption' | 'bold' | 'italic' | 'underline' | 
//          'list' | 'orderedList' | 'link' | 'lead' | 'keyfact' | 'impact' | 'next' | 'warning' | 
//          'divider' | 'paragraph' | 'h1' | 'h2' | 'h3' | 'blockquote';
//   content: string;
//   meta?: {
//     source?: string;
//     imageUrl?: string;
//     caption?: { en: string; hi: string };
//     enCaption?: string;
//     hiCaption?: string;
//     linkText?: string;
//     linkUrl?: string;
//     level?: number;
//   };
// }

// export default function SingleOpinionPage() {
//   const params = useParams();
//   const router = useRouter();
//   const opinionId = params.id as string;

//   const [opinion, setOpinion] = useState<Opinion | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
//   const [copied, setCopied] = useState(false);
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isDisliked, setIsDisliked] = useState(false);
//   const [isViewTracked, setIsViewTracked] = useState(false);
//   const [relatedOpinions, setRelatedOpinions] = useState<Opinion[]>([]);
//   const [parsedContent, setParsedContent] = useState<ContentBlock[]>([]);
//   const [parsedContentHi, setParsedContentHi] = useState<ContentBlock[]>([]);
//   const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
//   const [showLanguageSelector, setShowLanguageSelector] = useState(false);

//   // Function to parse content with all formatting - FIXED VERSION
//   const parseContent = useCallback((content: string): ContentBlock[] => {
//     if (!content) return [];
    
//     const blocks: ContentBlock[] = [];
//     const lines = content.split('\n');
    
//     let i = 0;
//     while (i < lines.length) {
//       let line = lines[i];
      
//       if (!line.trim()) {
//         i++;
//         continue;
//       }

//       // First check for standalone image block
//       const standaloneImageMatch = line.match(/^\[IMAGE:(.+?)\]$/i);
//       if (standaloneImageMatch) {
//         const imageUrl = standaloneImageMatch[1].trim();
        
//         // Check if next line is a caption
//         let caption = { en: '', hi: '' };
//         if (i + 1 < lines.length) {
//           const nextLine = lines[i + 1].trim();
//           const captionMatch = nextLine.match(/^\[CAPTION:(.+?)\]$/i);
//           if (captionMatch) {
//             const captionContent = captionMatch[1];
//             // Check if caption contains bilingual separator (||)
//             if (captionContent.includes('||')) {
//               const [enCaption, hiCaption] = captionContent.split('||');
//               caption = { 
//                 en: enCaption.trim(), 
//                 hi: hiCaption.trim() 
//               };
//             } else {
//               caption = { 
//                 en: captionContent.trim(), 
//                 hi: captionContent.trim() 
//               };
//             }
//             i++; // Skip caption line
//           }
//         }
        
//         blocks.push({
//           type: 'image',
//           content: '',
//           meta: { 
//             imageUrl,
//             caption
//           }
//         });
//         i++;
//         continue;
//       }

//       // Check for image blocks that are part of text
//       const imageRegex = /\[IMAGE:(.+?)\]/gi;
//       const matches = Array.from(line.matchAll(imageRegex));
      
//       if (matches.length > 0) {
//         let lastIndex = 0;
        
//         // Process text and images in the line
//         for (const match of matches) {
//           const matchIndex = match.index!;
//           const matchText = match[0];
//           const imageUrl = match[1].trim();
          
//           // Add text before image if exists
//           if (matchIndex > lastIndex) {
//             const textBefore = line.substring(lastIndex, matchIndex).trim();
//             if (textBefore) {
//               const formattedText = applyInlineFormatting(textBefore);
//               blocks.push({
//                 type: 'paragraph',
//                 content: formattedText
//               });
//             }
//           }
          
//           // Add image block
//           blocks.push({
//             type: 'image',
//             content: '',
//             meta: { imageUrl }
//           });
          
//           lastIndex = matchIndex + matchText.length;
//         }
        
//         // Add text after last image if exists
//         if (lastIndex < line.length) {
//           const textAfter = line.substring(lastIndex).trim();
//           if (textAfter) {
//             const formattedText = applyInlineFormatting(textAfter);
//             blocks.push({
//               type: 'paragraph',
//               content: formattedText
//             });
//           }
//         }
        
//         i++;
//         continue;
//       }

//       // Skip caption lines (they're handled with images)
//       if (line.trim().startsWith('[CAPTION:')) {
//         i++;
//         continue;
//       }

//       // Check for special templates
//       const templateMatch = line.match(/^\[([A-Z\s'_-]+):(.+?)\]$/i);
//       if (templateMatch) {
//         const [, templateType, templateContent] = templateMatch;
        
//         switch (templateType.toUpperCase()) {
//           case 'LEAD PARAGRAPH':
//             blocks.push({
//               type: 'lead',
//               content: templateContent.trim(),
//             });
//             break;
//           case 'KEY FACT':
//             blocks.push({
//               type: 'keyfact',
//               content: templateContent.trim(),
//             });
//             break;
//           case 'IMPACT':
//             blocks.push({
//               type: 'impact',
//               content: templateContent.trim(),
//             });
//             break;
//           case 'WHAT\'S NEXT':
//             blocks.push({
//               type: 'next',
//               content: templateContent.trim(),
//             });
//             break;
//           case 'WARNING':
//             blocks.push({
//               type: 'warning',
//               content: templateContent.trim(),
//             });
//             break;
//           case 'QUOTE':
//             const sourceMatch = templateContent.match(/"(.+?)"\s*-\s*(.+)/);
//             if (sourceMatch) {
//               const [, quote, source] = sourceMatch;
//               blocks.push({
//                 type: 'quote',
//                 content: quote.trim(),
//                 meta: { source: source.trim() }
//               });
//             } else {
//               blocks.push({
//                 type: 'quote',
//                 content: templateContent.trim(),
//               });
//             }
//             break;
//           default:
//             const formattedLine = applyInlineFormatting(line);
//             blocks.push({
//               type: 'paragraph',
//               content: formattedLine,
//             });
//         }
//         i++;
//         continue;
//       }

//       // Check for heading (h1, h2, h3)
//       if (line.startsWith('# ')) {
//         blocks.push({
//           type: 'h1',
//           content: line.substring(2).trim(),
//         });
//         i++;
//         continue;
//       }
//       if (line.startsWith('## ')) {
//         blocks.push({
//           type: 'h2',
//           content: line.substring(3).trim(),
//         });
//         i++;
//         continue;
//       }
//       if (line.startsWith('### ')) {
//         blocks.push({
//           type: 'h3',
//           content: line.substring(4).trim(),
//         });
//         i++;
//         continue;
//       }

//       // Check for horizontal rule
//       if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
//         blocks.push({
//           type: 'divider',
//           content: '',
//         });
//         i++;
//         continue;
//       }

//       // Check for blockquote
//       if (line.startsWith('> ')) {
//         blocks.push({
//           type: 'blockquote',
//           content: line.substring(2).trim(),
//         });
//         i++;
//         continue;
//       }

//       // Check for unordered list item
//       if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ ')) {
//         const listContent = applyInlineFormatting(line.substring(2).trim());
//         blocks.push({
//           type: 'list',
//           content: listContent,
//         });
//         i++;
//         continue;
//       }

//       // Check for ordered list item
//       const orderedListMatch = line.match(/^(\d+)\.\s+(.+)/);
//       if (orderedListMatch) {
//         const listContent = applyInlineFormatting(orderedListMatch[2].trim());
//         blocks.push({
//           type: 'orderedList',
//           content: listContent,
//         });
//         i++;
//         continue;
//       }

//       // Regular paragraph with inline formatting
//       const formattedLine = applyInlineFormatting(line.trim());
//       if (formattedLine.trim()) {
//         blocks.push({
//           type: 'paragraph',
//           content: formattedLine
//         });
//       }
      
//       i++;
//     }
    
//     return blocks;
//   }, []);

//   // Helper function to apply inline formatting
//   const applyInlineFormatting = (text: string): string => {
//     if (!text) return '';
    
//     let formatted = text;
    
//     // Apply bold formatting
//     formatted = formatted.replace(
//       /\*\*(.+?)\*\*/g, 
//       '<strong class="font-bold">$1</strong>'
//     );
    
//     // Apply italic formatting
//     formatted = formatted.replace(
//       /\*(?!\*)(.+?)(?<!\*)\*/g,
//       '<em class="italic">$1</em>'
//     );
    
//     // Apply underline formatting
//     formatted = formatted.replace(
//       /__(.+?)__/g,
//       '<u class="underline">$1</u>'
//     );
    
//     // Apply links
//     formatted = formatted.replace(
//       /\[(.+?)\]\((.+?)\)/g,
//       '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
//     );

//     return formatted;
//   };

//   // Function to render parsed content blocks - FIXED IMAGE RENDERING
//   const renderContentBlock = useCallback((block: ContentBlock, index: number, language: 'en' | 'hi') => {
//     const getCaption = (caption: { en: string; hi: string } | undefined) => {
//       if (!caption) return '';
//       return language === 'en' ? caption.en : caption.hi;
//     };

//     // Generate unique key for each block
//     const blockKey = `${block.type}-${index}-${language}`;

//     switch (block.type) {
//       case 'h1':
//         return (
//           <h1 key={blockKey} className="text-3xl font-bold mt-8 mb-4 text-gray-900">
//             {block.content}
//           </h1>
//         );
      
//       case 'h2':
//         return (
//           <h2 key={blockKey} className="text-2xl font-bold mt-6 mb-3 text-gray-800">
//             {block.content}
//           </h2>
//         );
      
//       case 'h3':
//         return (
//           <h3 key={blockKey} className="text-xl font-bold mt-5 mb-2 text-gray-700">
//             {block.content}
//           </h3>
//         );
      
//       case 'lead':
//         return (
//           <div key={blockKey} className="my-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
//             <div className="flex items-start gap-2">
//               <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="font-bold text-blue-700 mb-1">LEAD PARAGRAPH:</p>
//                 <p className="text-gray-800">{block.content}</p>
//               </div>
//             </div>
//           </div>
//         );
      
//       case 'keyfact':
//         return (
//           <div key={blockKey} className="my-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
//             <div className="flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="font-bold text-yellow-700 mb-1">KEY FACT:</p>
//                 <p className="text-gray-800">{block.content}</p>
//               </div>
//             </div>
//           </div>
//         );
      
//       case 'impact':
//         return (
//           <div key={blockKey} className="my-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
//             <div className="flex items-start gap-2">
//               <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="font-bold text-green-700 mb-1">IMPACT:</p>
//                 <p className="text-gray-800">{block.content}</p>
//               </div>
//             </div>
//           </div>
//         );
      
//       case 'next':
//         return (
//           <div key={blockKey} className="my-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
//             <div className="flex items-start gap-2">
//               <Maximize2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="font-bold text-purple-700 mb-1">WHAT'S NEXT:</p>
//                 <p className="text-gray-800">{block.content}</p>
//               </div>
//             </div>
//           </div>
//         );
      
//       case 'warning':
//         return (
//           <div key={blockKey} className="my-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
//             <div className="flex items-start gap-2">
//               <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="font-bold text-red-700 mb-1">WARNING:</p>
//                 <p className="text-gray-800">{block.content}</p>
//               </div>
//             </div>
//           </div>
//         );
      
//       case 'quote':
//         return (
//           <div key={blockKey} className="my-6 p-6 border-l-4 border-gray-400 bg-gray-50 rounded-r-lg">
//             <div className="flex items-start gap-3">
//               <Quote className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
//               <div className="flex-1">
//                 <p className="text-lg italic text-gray-700 mb-2">"{block.content}"</p>
//                 {block.meta?.source && (
//                   <p className="text-sm text-gray-600 font-medium">— {block.meta.source}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         );
      
//       case 'image':
//         const imageUrl = block.meta?.imageUrl || '';
//         const caption = getCaption(block.meta?.caption);
        
//         // Validate URL
//         const isValidUrl = imageUrl && 
//                          (imageUrl.startsWith('http://') || 
//                           imageUrl.startsWith('https://') || 
//                           imageUrl.startsWith('/'));
        
//         // Clean URL - remove any trailing brackets or special characters
//         const cleanImageUrl = isValidUrl ? imageUrl.replace(/[<>]/g, '') : '';
        
//         return (
//           <div key={blockKey} className="my-8">
//             <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
//               {isValidUrl ? (
//                 <div className="relative w-full">
//                   <img
//                     src={cleanImageUrl}
//                     alt={caption || 'Article image'}
//                     className="w-full h-auto max-h-[500px] object-contain mx-auto"
//                     loading="lazy"
//                     onError={(e) => {
//                       console.error('Failed to load image:', cleanImageUrl);
//                       const target = e.target as HTMLImageElement;
//                       target.style.display = 'none';
//                       const parent = target.parentElement;
//                       if (parent) {
//                         const fallbackDiv = document.createElement('div');
//                         fallbackDiv.className = 'flex flex-col items-center justify-center min-h-[200px] w-full bg-gray-100 p-4';
//                         fallbackDiv.innerHTML = `
//                           <div class="flex flex-col items-center justify-center">
//                             <svg class="h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                             </svg>
//                             <p class="text-sm font-medium text-gray-500">Image failed to load</p>
//                             <p class="text-xs text-gray-400 mt-1 text-center truncate max-w-full">URL: ${cleanImageUrl.substring(0, 50)}...</p>
//                           </div>
//                         `;
//                         parent.appendChild(fallbackDiv);
//                       }
//                     }}
//                     onLoad={(e) => {
//                       console.log('Image loaded successfully:', cleanImageUrl);
//                     }}
//                   />
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center min-h-[200px] w-full p-4">
//                   <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
//                   <p className="text-sm font-medium text-gray-500">Image not available</p>
//                   {imageUrl && (
//                     <p className="text-xs text-gray-400 mt-1 text-center truncate max-w-full">
//                       Invalid URL: {imageUrl}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//             {caption && (
//               <p className="text-sm text-gray-600 text-center mt-3 italic px-4">
//                 {caption}
//               </p>
//             )}
//           </div>
//         );
      
//       case 'divider':
//         return (
//           <hr key={blockKey} className="my-8 border-t border-gray-300" />
//         );
      
//       case 'blockquote':
//         return (
//           <blockquote key={blockKey} className="my-4 pl-4 border-l-4 border-gray-300 text-gray-700 italic">
//             {block.content}
//           </blockquote>
//         );
      
//       case 'list':
//         return (
//           <div key={blockKey} className="ml-6 mb-2">
//             <li className="list-disc text-gray-800">
//               <span dangerouslySetInnerHTML={{ __html: block.content }} />
//             </li>
//           </div>
//         );
      
//       case 'orderedList':
//         return (
//           <div key={blockKey} className="ml-6 mb-2">
//             <li className="list-decimal text-gray-800">
//               <span dangerouslySetInnerHTML={{ __html: block.content }} />
//             </li>
//           </div>
//         );
      
//       case 'paragraph':
//         return (
//           <div 
//             key={blockKey} 
//             className="my-4 text-gray-800 leading-relaxed"
//             dangerouslySetInnerHTML={{ __html: block.content }}
//           />
//         );
      
//       default:
//         return (
//           <p key={blockKey} className="my-4 text-gray-800 leading-relaxed">
//             {block.content}
//           </p>
//         );
//     }
//   }, []);

//   // Fetch opinion data
//   const fetchOpinion = useCallback(async () => {
//     try {
//       setLoading(true);
      
//       console.log('Fetching opinion with ID:', opinionId);
      
//       // First try to get the full opinion data
//       const response = await fetch(`/api/admin/opinions/${opinionId}`);
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log('API Response:', data.opinion);
//         setOpinion(data.opinion);
        
//         // Parse both English and Hindi content
//         if (data.opinion?.content) {
//           console.log('English content length:', data.opinion.content.length);
//           const parsed = parseContent(data.opinion.content);
//           console.log('Number of English blocks:', parsed.length);
          
//           // Log image blocks
//           const imageBlocks = parsed.filter(block => block.type === 'image');
//           console.log('Number of image blocks in English:', imageBlocks.length);
//           imageBlocks.forEach((block, index) => {
//             console.log(`Image ${index + 1} URL:`, block.meta?.imageUrl);
//             console.log(`Image ${index + 1} caption:`, block.meta?.caption);
//           });
          
//           setParsedContent(parsed);
//         }
        
//         if (data.opinion?.contentHi) {
//           console.log('Hindi content length:', data.opinion.contentHi.length);
//           const parsedHi = parseContent(data.opinion.contentHi);
//           console.log('Number of Hindi blocks:', parsedHi.length);
          
//           // Log image blocks
//           const imageBlocksHi = parsedHi.filter(block => block.type === 'image');
//           console.log('Number of image blocks in Hindi:', imageBlocksHi.length);
          
//           setParsedContentHi(parsedHi);
//         }
        
//         // Set initial language based on originalLanguage
//         if (data.opinion?.originalLanguage) {
//           setCurrentLanguage(data.opinion.originalLanguage);
//         }
        
//         // Fetch related opinions based on topic
//         if (data.opinion?.topic) {
//           fetchRelatedOpinions(data.opinion.topic, data.opinion._id);
//         }
//         return;
//       }
      
//       // If admin endpoint fails, try public endpoint
//       const publicResponse = await fetch(`/api/public/opinion/${opinionId}/view`);
      
//       if (publicResponse.ok) {
//         const publicData = await publicResponse.json();
//         const opinionData = publicData.opinion || publicData;
//         console.log('Public API Response:', opinionData);
//         setOpinion(opinionData);
        
//         // Parse both English and Hindi content
//         if (opinionData?.content) {
//           setParsedContent(parseContent(opinionData.content));
//         }
//         if (opinionData?.contentHi) {
//           setParsedContentHi(parseContent(opinionData.contentHi));
//         }
        
//         // Set initial language based on originalLanguage
//         if (opinionData?.originalLanguage) {
//           setCurrentLanguage(opinionData.originalLanguage);
//         }
        
//         // Fetch related opinions based on topic
//         if (opinionData?.topic) {
//           fetchRelatedOpinions(opinionData.topic, opinionData._id);
//         }
//       } else {
//         throw new Error("Failed to fetch opinion");
//       }
//     } catch (error) {
//       console.error("Error fetching opinion:", error);
//       toast.error("Failed to load opinion");
//     } finally {
//       setLoading(false);
//     }
//   }, [opinionId, parseContent]);

//   // Fetch related opinions
//   const fetchRelatedOpinions = async (topic: string, excludeId: string) => {
//     try {
//       const response = await fetch(`/api/admin/opinions`);
//       if (response.ok) {
//         const data = await response.json();
//         const filtered = data.opinions?.filter((op: Opinion) => 
//           op.status === 'approved' && 
//           op.topic === topic && 
//           op._id !== excludeId
//         ).slice(0, 2) || [];
//         setRelatedOpinions(filtered);
//       }
//     } catch (error) {
//       console.error("Error fetching related opinions:", error);
//     }
//   };

//   // Track view
//   const trackView = useCallback(async () => {
//     if (!opinionId || isViewTracked) return;

//     try {
//       const token = localStorage.getItem("admin-token");
//       const headers: HeadersInit = {
//         'Accept': '*/*',
//       };

//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }

//       await fetch(`/api/public/opinion/${opinionId}/view`, {
//         method: 'POST',
//         headers,
//       });
      
//       setIsViewTracked(true);
//     } catch (error) {
//       console.error("Error tracking view:", error);
//     }
//   }, [opinionId, isViewTracked]);

//   // Handle like
//   const handleLike = async () => {
//     if (!opinion || !currentUser) {
//       toast.error("Please login to like opinions");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("admin-token");
//       if (!token) {
//         toast.error("Please login to like opinions");
//         return;
//       }

//       // Optimistic update
//       const newOpinion = { ...opinion };
//       if (isLiked) {
//         newOpinion.likes = Math.max(0, newOpinion.likes - 1);
//         setIsLiked(false);
//       } else {
//         if (isDisliked) {
//           newOpinion.dislikes = Math.max(0, newOpinion.dislikes - 1);
//           setIsDisliked(false);
//         }
//         newOpinion.likes += 1;
//         setIsLiked(true);
//       }
//       setOpinion(newOpinion);

//       // API call
//       const response = await fetch(`/api/public/opinion/${opinionId}/like`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ type: isLiked ? 'remove' : 'like' }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update like");
//       }

//       const data = await response.json();
//       if (data.opinion) {
//         setOpinion(data.opinion);
//       }
//       toast.success(isLiked ? "Like removed" : "Opinion liked!");
//     } catch (error) {
//       console.error("Error liking opinion:", error);
//       toast.error("Failed to update reaction");
//       fetchOpinion(); // Revert on error
//     }
//   };

//   // Handle dislike
//   const handleDislike = async () => {
//     if (!opinion || !currentUser) {
//       toast.error("Please login to dislike opinions");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("admin-token");
//       if (!token) {
//         toast.error("Please login to dislike opinions");
//         return;
//       }

//       // Optimistic update
//       const newOpinion = { ...opinion };
//       if (isDisliked) {
//         newOpinion.dislikes = Math.max(0, newOpinion.dislikes - 1);
//         setIsDisliked(false);
//       } else {
//         if (isLiked) {
//           newOpinion.likes = Math.max(0, newOpinion.likes - 1);
//           setIsLiked(false);
//         }
//         newOpinion.dislikes += 1;
//         setIsDisliked(true);
//       }
//       setOpinion(newOpinion);

//       // API call
//       const response = await fetch(`/api/public/opinion/${opinionId}/like`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ type: isDisliked ? 'remove' : 'dislike' }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update dislike");
//       }

//       const data = await response.json();
//       if (data.opinion) {
//         setOpinion(data.opinion);
//       }
//       toast.success(isDisliked ? "Dislike removed" : "Opinion disliked!");
//     } catch (error) {
//       console.error("Error disliking opinion:", error);
//       toast.error("Failed to update reaction");
//       fetchOpinion(); // Revert on error
//     }
//   };

//   // Handle share
//   const handleShare = async (platform: string) => {
//     if (!opinion) return;

//     try {
//       const token = localStorage.getItem("admin-token");
//       const headers: HeadersInit = {
//         'Content-Type': 'application/json',
//         'Accept': '*/*',
//       };

//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }

//       // Optimistic update
//       const newOpinion = { ...opinion };
//       newOpinion.shares += 1;
//       setOpinion(newOpinion);

//       const response = await fetch(`/api/public/opinion/${opinionId}/share`, {
//         method: 'PATCH',
//         headers,
//         body: JSON.stringify({ platform }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to share");
//       }

//       const data = await response.json();
      
//       // Open share URL
//       if (data.shareUrl) {
//         window.open(data.shareUrl, '_blank');
//       }
      
//       toast.success(`Shared on ${platform}`);
      
//     } catch (error) {
//       console.error("Error sharing:", error);
//       toast.error("Failed to share");
//       fetchOpinion(); // Revert on error
//     }
//   };

//   // Copy link to clipboard
//   const copyToClipboard = () => {
//     const url = window.location.href;
//     navigator.clipboard.writeText(url)
//       .then(() => {
//         setCopied(true);
//         toast.success("Link copied to clipboard!");
//         setTimeout(() => setCopied(false), 2000);
//       })
//       .catch(() => {
//         toast.error("Failed to copy link");
//       });
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//       });
//     } catch (error) {
//       return "Invalid date";
//     }
//   };

//   // Format time
//   const formatTime = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//       });
//     } catch (error) {
//       return "Invalid time";
//     }
//   };

//   // Get read time
//   const getReadTime = (content?: string) => {
//     if (!content || typeof content !== 'string') {
//       return "1 min read";
//     }
    
//     try {
//       const words = content.split(/\s+/).length;
//       const minutes = Math.ceil(words / 200);
//       return `${minutes} min read`;
//     } catch (error) {
//       return "1 min read";
//     }
//   };

//   // Get relative time
//   const getRelativeTime = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffMs = now.getTime() - date.getTime();
//       const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
//       if (diffHours < 1) {
//         const diffMins = Math.floor(diffMs / (1000 * 60));
//         return `${diffMins} minutes ago`;
//       } else if (diffHours < 24) {
//         return `${diffHours} hours ago`;
//       } else {
//         const diffDays = Math.floor(diffHours / 24);
//         return `${diffDays} days ago`;
//       }
//     } catch (error) {
//       return "Recently";
//     }
//   };

//   // Check user interaction
//   const checkUserInteraction = useCallback(() => {
//     if (!opinion || !currentUser) return;

//     const liked = opinion.likedBy.some(
//       item => typeof item === 'string' ? item === currentUser._id : item._id === currentUser._id
//     );
//     const disliked = opinion.dislikedBy.some(
//       item => typeof item === 'string' ? item === currentUser._id : item._id === currentUser._id
//     );

//     setIsLiked(liked);
//     setIsDisliked(disliked);
//   }, [opinion, currentUser]);

//   // Load current user
//   useEffect(() => {
//     const token = localStorage.getItem("admin-token");
//     const userData = localStorage.getItem("user-data");

//     if (userData) {
//       try {
//         setCurrentUser(JSON.parse(userData));
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//       }
//     } else if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         setCurrentUser({
//           _id: payload.userId,
//           name: payload.name || 'User',
//           email: payload.email,
//           role: payload.role,
//         });
//       } catch (error) {
//         console.error("Error parsing token:", error);
//       }
//     }
//   }, []);

//   // Fetch data
//   useEffect(() => {
//     if (opinionId) {
//       fetchOpinion();
//       trackView();
//     }
//   }, [opinionId, fetchOpinion, trackView]);

//   // Check user interaction when opinion loads
//   useEffect(() => {
//     checkUserInteraction();
//   }, [checkUserInteraction]);

//   // Handle language change - Update to sync with localStorage
//   const handleLanguageChange = (lang: 'en' | 'hi') => {
//     setCurrentLanguage(lang);
//     setShowLanguageSelector(false);
    
//     // Save language preference to localStorage
//     localStorage.setItem('preferred-language', lang);
    
//     // If you have a language context, update it here
//     // Example: updateLanguageContext(lang);
    
//     toast.success(`Switched to ${lang === 'en' ? 'English' : 'Hindi'}`);
//   };

//   // Get current content based on language
//   const getCurrentContent = () => {
//     return currentLanguage === 'en' ? parsedContent : parsedContentHi;
//   };

//   // Get current title based on language
//   const getCurrentTitle = () => {
//     if (!opinion) return "Untitled Opinion";
//     return currentLanguage === 'en' ? opinion.title : (opinion.titleHi || opinion.title);
//   };

//   // Add debug effect for parsed content
//   useEffect(() => {
//     console.log('Current language:', currentLanguage);
//     console.log('Parsed content blocks:', parsedContent);
//     console.log('Parsed Hindi content blocks:', parsedContentHi);
    
//     // Log all image blocks
//     const englishImages = parsedContent.filter(block => block.type === 'image');
//     const hindiImages = parsedContentHi.filter(block => block.type === 'image');
    
//     console.log('English image blocks:', englishImages.length);
//     console.log('Hindi image blocks:', hindiImages.length);
//   }, [parsedContent, parsedContentHi, currentLanguage]);

//   // Load language preference from localStorage on mount
//   useEffect(() => {
//     const savedLanguage = localStorage.getItem('preferred-language') as 'en' | 'hi';
//     if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
//       setCurrentLanguage(savedLanguage);
//     }
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white">
//         {/* News Header Skeleton */}
//         <header className="border-b">
//           <div className="container mx-auto px-4">
//             <div className="flex items-center justify-between py-4">
//               <Skeleton className="h-8 w-40" />
//               <div className="hidden md:flex flex-1 max-w-2xl mx-8">
//                 <Skeleton className="h-10 w-full" />
//               </div>
//               <Skeleton className="h-8 w-32" />
//             </div>
//           </div>
//         </header>

//         <div className="container mx-auto px-4 py-8 max-w-4xl">
//           {/* Article Header Skeleton */}
//           <div className="mb-8">
//             <Skeleton className="h-6 w-32 mb-4" />
//             <Skeleton className="h-12 w-3/4 mb-6" />
//             <Skeleton className="h-4 w-48" />
//             <Skeleton className="h-64 w-full mt-6" />
//           </div>
          
//           {/* Content Skeleton */}
//           <div className="space-y-4">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <Skeleton key={i} className="h-4 w-full" />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!opinion) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4 text-gray-900">Opinion not found</h2>
//           <Button asChild className="bg-red-600 hover:bg-red-700">
//             <Link href="/opinions">Back to Opinions</Link>
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const author = opinion.authorId || { _id: '', name: 'Unknown Author', email: '' };
//   const readTime = getReadTime(currentLanguage === 'en' ? opinion.content : opinion.contentHi);
//   const publishDate = formatDate(opinion.createdAt);
//   const publishTime = formatTime(opinion.createdAt);
//   const safeTags = opinion.tags || [];
//   const currentTitle = getCurrentTitle();
//   const currentContent = getCurrentContent();
//   const hasHindiTranslation = opinion.hasHindiTranslation && opinion.contentHi && opinion.contentHi.trim().length > 0;

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="container mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2">
//             {/* Breadcrumb */}
//             <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
//               <Link href="/" className="hover:text-red-600">Home</Link>
//               <ChevronRight className="h-4 w-4" />
//               <Link href="/opinions" className="hover:text-red-600">Opinions</Link>
//               <ChevronRight className="h-4 w-4" />
//               <span className="font-medium text-gray-900">{opinion.topic}</span>
//             </div>

//             {/* Article Header */}
//             <header className="mb-8">
//               {/* Language Toggle for Mobile */}
//               {hasHindiTranslation && (
//                 <div className="md:hidden mb-4">
//                   <div className="flex items-center gap-2">
//                     <Badge 
//                       className={`cursor-pointer ${currentLanguage === 'en' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
//                       onClick={() => handleLanguageChange('en')}
//                     >
//                       English
//                     </Badge>
//                     <Badge 
//                       className={`cursor-pointer ${currentLanguage === 'hi' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
//                       onClick={() => handleLanguageChange('hi')}
//                     >
//                       Hindi
//                     </Badge>
//                   </div>
//                 </div>
//               )}

//               <div className="mb-4">
//                 <Badge className="bg-red-600 text-white rounded-none mb-2 px-3 py-1">OPINION</Badge>
//                 <Badge variant="outline" className="ml-2 rounded-none border-gray-300">
//                   {opinion.topic}
//                 </Badge>
//                 {hasHindiTranslation && (
//                   <Badge variant="outline" className="ml-2 rounded-none border-blue-500 text-blue-600">
//                     <Globe className="h-3 w-3 mr-1" />
//                     {currentLanguage === 'en' ? 'English' : 'Hindi'}
//                   </Badge>
//                 )}
//               </div>

//               <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
//                 {currentTitle}
//               </h1>

//               {/* Author and Metadata */}
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//                 <div className="flex items-center gap-4">
//                   <Avatar className="w-12 h-12 border">
//                     <AvatarImage src={author.profileImage} />
//                     <AvatarFallback className="bg-gray-100">
//                       {author.name?.charAt(0) || 'A'}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-semibold text-gray-900">{author.name}</p>
//                     <p className="text-sm text-gray-600">Opinion Columnist</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-6 text-sm text-gray-600">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     <span>{publishDate}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Clock className="w-4 h-4" />
//                     <span>{readTime}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Eye className="w-4 h-4" />
//                     <span>{opinion.views || 0} views</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Top Ad */}
//               <div className="my-6 flex justify-center">
//                 <GoogleAdSense
//                   adSlot="0987654321"
//                   adFormat="leaderboard"
//                   className="max-w-[728px] w-full h-[90px]"
//                 />
//               </div>

//               {/* Engagement Stats */}
//               <div className="flex items-center gap-6 py-4 border-y">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900">{opinion.likes || 0}</div>
//                   <div className="text-xs text-gray-600">Likes</div>
//                 </div>
//                 <Separator orientation="vertical" className="h-8" />
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900">{opinion.dislikes || 0}</div>
//                   <div className="text-xs text-gray-600">Dislikes</div>
//                 </div>
//                 <Separator orientation="vertical" className="h-8" />
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900">{opinion.shares || 0}</div>
//                   <div className="text-xs text-gray-600">Shares</div>
//                 </div>
//               </div>

//               {/* Reaction Buttons */}
//               <div className="flex items-center gap-4 mt-6">
//                 <Button
//                   variant={isLiked ? "default" : "outline"}
//                   size="lg"
//                   onClick={handleLike}
//                   disabled={!currentUser}
//                   className={`rounded-none ${isLiked ? "bg-green-600 hover:bg-green-700 border-green-600" : "border-gray-300"}`}
//                 >
//                   <ThumbsUp className="w-5 h-5 mr-2" />
//                   Like
//                 </Button>
//                 <Button
//                   variant={isDisliked ? "default" : "outline"}
//                   size="lg"
//                   onClick={handleDislike}
//                   disabled={!currentUser}
//                   className={`rounded-none ${isDisliked ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-gray-300"}`}
//                 >
//                   <ThumbsDown className="w-5 h-5 mr-2" />
//                   Dislike
//                 </Button>
//                 {!currentUser && (
//                   <p className="text-sm text-gray-600">
//                     <Link href="/login" className="text-red-600 hover:underline font-medium">
//                       Login
//                     </Link> to react
//                   </p>
//                 )}
//               </div>
//             </header>

//             {/* Article Content */}
//             <main className="mb-8">
//               <div className="prose prose-lg max-w-none">
//                 <div className="text-gray-800 leading-relaxed text-lg">
//                   {currentContent.length > 0 ? (
//                     <div className="space-y-4">
//                       {currentContent.map((block, index) => renderContentBlock(block, index, currentLanguage))}
//                     </div>
//                   ) : (
//                     <div className="p-8 text-center border rounded-lg">
//                       <p className="text-gray-600 italic">
//                         {currentLanguage === 'en' ? 'Content not available' : 'सामग्री उपलब्ध नहीं है'}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Mid-Content Ad */}
//               <div className="my-10 flex justify-center">
//                 <GoogleAdSense
//                   adSlot="0987654321"
//                   adFormat="rectangle"
//                   className="max-w-[336px] w-full h-[280px]"
//                 />
//               </div>

//               {/* Tags */}
//               {safeTags.length > 0 && (
//                 <div className="mb-8">
//                   <div className="flex items-center gap-2 mb-3">
//                     <Tag className="w-4 h-4 text-gray-500" />
//                     <span className="text-sm font-medium text-gray-700">TAGS</span>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {safeTags.map((tag) => (
//                       <Badge key={tag} variant="outline" className="rounded-none border-gray-300 text-gray-700 hover:bg-gray-50">
//                         #{tag}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </main>

//             {/* Share Section */}
//             <footer className="border-t pt-8 mb-8">
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold mb-4 text-gray-900">Share this article</h3>
//                 <div className="flex flex-wrap gap-3">
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     className="rounded-none border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
//                     onClick={() => handleShare('facebook')}
//                   >
//                     <Facebook className="w-5 h-5 mr-2" />
//                     Facebook
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     className="rounded-none border-sky-500 text-sky-500 hover:bg-sky-50 hover:text-sky-600"
//                     onClick={() => handleShare('twitter')}
//                   >
//                     <Twitter className="w-5 h-5 mr-2" />
//                     Twitter
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     className="rounded-none border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
//                     onClick={() => handleShare('whatsapp')}
//                   >
//                     <MessageCircle className="w-5 h-5 mr-2" />
//                     WhatsApp
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     className="rounded-none border-blue-700 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
//                     onClick={() => handleShare('linkedin')}
//                   >
//                     <Linkedin className="w-5 h-5 mr-2" />
//                     LinkedIn
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     onClick={copyToClipboard}
//                     className="rounded-none"
//                   >
//                     {copied ? (
//                       <Check className="w-5 h-5 mr-2" />
//                     ) : (
//                       <LinkIcon className="w-5 h-5 mr-2" />
//                     )}
//                     {copied ? 'Copied' : 'Copy Link'}
//                   </Button>
//                 </div>
//               </div>

//               {/* Author Bio */}
//               <Card className="mb-8 border">
//                 <CardContent className="p-6">
//                   <div className="flex items-start gap-6">
//                     <Avatar className="w-20 h-20 border-2">
//                       <AvatarImage src={author.profileImage} />
//                       <AvatarFallback className="text-xl bg-gray-100">
//                         {author.name?.charAt(0) || 'A'}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1">
//                       <h4 className="text-xl font-bold mb-2 text-gray-900">{author.name}</h4>
//                       <p className="text-gray-600 mb-3">
//                         Opinion columnist at NewsDaily. Specializing in {opinion.topic.toLowerCase()} and political analysis.
//                       </p>
//                       <div className="flex items-center text-sm text-gray-500">
//                         <Calendar className="w-4 h-4 mr-2" />
//                         <span>Published on {publishDate} at {publishTime}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Language Toggle */}
//               {hasHindiTranslation && (
//                 <div className="mb-6">
//                   <div className="flex items-center gap-4">
//                     <span className="text-sm font-medium text-gray-700">Read in:</span>
//                     <div className="flex gap-2">
//                       <Button
//                         variant={currentLanguage === 'en' ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => handleLanguageChange('en')}
//                         className={currentLanguage === 'en' ? "bg-red-600 hover:bg-red-700" : ""}
//                       >
//                         English
//                       </Button>
//                       <Button
//                         variant={currentLanguage === 'hi' ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => handleLanguageChange('hi')}
//                         className={currentLanguage === 'hi' ? "bg-red-600 hover:bg-red-700" : ""}
//                       >
//                         Hindi
//                       </Button>
//                     </div>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-2">
//                     This article is available in both English and Hindi. Switch languages to read in your preferred language.
//                   </p>
//                 </div>
//               )}

//               {/* Bottom Ad */}
//               <div className="my-8 flex justify-center">
//                 <GoogleAdSense
//                   adSlot="0987654321"
//                   adFormat="banner"
//                   className="max-w-[468px] w-full h-[60px]"
//                 />
//               </div>
//             </footer>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-8">
//             {/* Newsletter Signup */}
//             <Card className="border border-gray-200">
//               <CardContent className="p-6">
//                 <h3 className="text-lg font-bold mb-3 text-gray-900">Subscribe to Newsletter</h3>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Get daily updates and opinion pieces delivered to your inbox.
//                 </p>
//                 <div className="space-y-3">
//                   <input
//                     type="email"
//                     placeholder="Your email address"
//                     className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-red-500"
//                   />
//                   <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
//                     Subscribe
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Sidebar Ad */}
//             <div className="flex justify-center">
//               <GoogleAdSense
//                 adSlot="0987654321"
//                 adFormat="rectangle"
//                 className="w-full h-[250px]"
//               />
//             </div>

//             {/* Trending Now */}
//             <div>
//               <h3 className="text-lg font-bold mb-4 pb-2 border-b text-gray-900">TRENDING NOW</h3>
//               <div className="space-y-4">
//                 {[1, 2, 3].map((i) => (
//                   <div key={i} className="border-b pb-4 last:border-0">
//                     <div className="flex items-start">
//                       <span className="text-2xl font-bold text-gray-300 mr-3">{i}</span>
//                       <div>
//                         <Badge className="bg-gray-100 text-gray-800 text-xs mb-1 px-2">Politics</Badge>
//                         <h4 className="font-semibold text-gray-900 hover:text-red-600 cursor-pointer">
//                           Trending opinion #{i} on current affairs
//                         </h4>
//                         <div className="flex items-center text-xs text-gray-500 mt-2">
//                           <Clock className="h-3 w-3 mr-1" />
//                           <span>{i} hours ago</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Another Sidebar Ad */}
//             <div className="flex justify-center">
//               <GoogleAdSense
//                 adSlot="0987654321"
//                 adFormat="rectangle"
//                 className="w-full h-[250px]"
//               />
//             </div>

//             {/* Follow Us */}
//             <Card className="border border-gray-200">
//               <CardContent className="p-6">
//                 <h3 className="text-lg font-bold mb-4 text-gray-900">FOLLOW US</h3>
//                 <div className="flex gap-3">
//                   <Button variant="outline" size="icon" className="border-blue-600 text-blue-600">
//                     <Facebook className="h-5 w-5" />
//                   </Button>
//                   <Button variant="outline" size="icon" className="border-sky-500 text-sky-500">
//                     <Twitter className="h-5 w-5" />
//                   </Button>
//                   <Button variant="outline" size="icon" className="border-blue-700 text-blue-700">
//                     <Linkedin className="h-5 w-5" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Related Articles */}
//         <div className="mt-12 pt-8 border-t">
//           <h2 className="text-2xl font-bold mb-6 text-gray-900">MORE ON {opinion.topic.toUpperCase()}</h2>
          
//           {/* Ad before related articles */}
//           <div className="my-6 flex justify-center">
//             <GoogleAdSense
//               adSlot="0987654321"
//               adFormat="leaderboard"
//               className="max-w-[728px] w-full h-[90px]"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {relatedOpinions.length > 0 ? (
//               relatedOpinions.map((related) => (
//                 <Card key={related._id} className="border hover:shadow-md transition-shadow cursor-pointer">
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-2 mb-3">
//                       <Badge className="bg-red-600 text-white text-xs">OPINION</Badge>
//                       <Badge variant="outline" className="text-xs">{related.topic}</Badge>
//                     </div>
//                     <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-red-600">
//                       {related.title}
//                     </h3>
//                     <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                       {related.content.substring(0, 150)}...
//                     </p>
//                     <div className="flex items-center justify-between text-xs text-gray-500">
//                       <div className="flex items-center">
//                         <User className="h-3 w-3 mr-1" />
//                         <span>{related.authorId.name}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Clock className="h-3 w-3 mr-1" />
//                         <span>{getRelativeTime(related.createdAt)}</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               <>
//                 {/* Placeholder related articles */}
//                 {[1, 2].map((i) => (
//                   <Card key={i} className="border hover:shadow-md transition-shadow">
//                     <CardContent className="p-6">
//                       <div className="flex items-center gap-2 mb-3">
//                         <Badge className="bg-red-600 text-white text-xs">OPINION</Badge>
//                         <Badge variant="outline" className="text-xs">{opinion.topic}</Badge>
//                       </div>
//                       <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-red-600">
//                         More opinions on {opinion.topic.toLowerCase()}
//                       </h3>
//                       <p className="text-gray-600 text-sm mb-3">
//                         Explore different perspectives and analysis on this topic.
//                       </p>
//                       <div className="flex items-center justify-between text-xs text-gray-500">
//                         <div className="flex items-center">
//                           <User className="h-3 w-3 mr-1" />
//                           <span>Staff Writer</span>
//                         </div>
//                         <div className="flex items-center">
//                           <Clock className="h-3 w-3 mr-1" />
//                           <span>Recently</span>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Eye,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Check,
  Tag,
  Bookmark,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Newspaper,
  TrendingUp,
  Home,
  Search,
  ChevronRight,
  Quote,
  Image as ImageIcon,
  Globe,
  Languages,
  AlertCircle,
  AlertTriangle,
  MessageSquare,
  Maximize2,
  CheckCircle,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleAdSense } from "./google-adsense";
import { useLanguage } from "@/contexts/language-context";

interface Author {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt?: string;
}

interface Opinion {
  _id: string;
  title: string;
  titleHi: string;
  content: string;
  contentHi: string;
  topic: string;
  tags: string[];
  authorId: Author;
  status: "approved" | "pending" | "rejected" | "draft";
  likes: number;
  dislikes: number;
  likedBy: (Author | string)[];
  dislikedBy: (Author | string)[];
  views: number;
  shares: number;
  sharePlatforms: string[];
  createdAt: string;
  updatedAt: string;
  originalLanguage?: 'en' | 'hi';
  hasHindiTranslation?: boolean;
}

interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

interface ContentBlock {
  type: 'text' | 'heading' | 'quote' | 'image' | 'caption' | 'bold' | 'italic' | 'underline' | 
         'list' | 'orderedList' | 'link' | 'lead' | 'keyfact' | 'impact' | 'next' | 'warning' | 
         'divider' | 'paragraph' | 'h1' | 'h2' | 'h3' | 'blockquote';
  content: string;
  meta?: {
    source?: string;
    imageUrl?: string;
    caption?: { en: string; hi: string };
    enCaption?: string;
    hiCaption?: string;
    linkText?: string;
    linkUrl?: string;
    level?: number;
  };
}

export default function SingleOpinionPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const opinionId = params.id as string;

  const [opinion, setOpinion] = useState<Opinion | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isViewTracked, setIsViewTracked] = useState(false);
  const [relatedOpinions, setRelatedOpinions] = useState<Opinion[]>([]);
  const [parsedContent, setParsedContent] = useState<ContentBlock[]>([]);
  const [parsedContentHi, setParsedContentHi] = useState<ContentBlock[]>([]);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Helper functions to get localized content
  const getTitle = () => {
    if (!opinion) return '';
    return language === 'hi' && opinion.titleHi ? opinion.titleHi : opinion.title;
  };

  const getContent = () => {
    if (!opinion) return '';
    return language === 'hi' && opinion.contentHi ? opinion.contentHi : opinion.content;
  };

  // Get current content blocks based on language
  const getCurrentContent = () => {
    return language === 'hi' && opinion?.contentHi ? parsedContentHi : parsedContent;
  };

  // Function to parse content with all formatting - FIXED VERSION
  const parseContent = useCallback((content: string): ContentBlock[] => {
    if (!content) return [];
    
    const blocks: ContentBlock[] = [];
    const lines = content.split('\n');
    
    let i = 0;
    while (i < lines.length) {
      let line = lines[i];
      
      if (!line.trim()) {
        i++;
        continue;
      }

      // First check for standalone image block
      const standaloneImageMatch = line.match(/^\[IMAGE:(.+?)\]$/i);
      if (standaloneImageMatch) {
        const imageUrl = standaloneImageMatch[1].trim();
        
        // Check if next line is a caption
        let caption = { en: '', hi: '' };
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          const captionMatch = nextLine.match(/^\[CAPTION:(.+?)\]$/i);
          if (captionMatch) {
            const captionContent = captionMatch[1];
            // Check if caption contains bilingual separator (||)
            if (captionContent.includes('||')) {
              const [enCaption, hiCaption] = captionContent.split('||');
              caption = { 
                en: enCaption.trim(), 
                hi: hiCaption.trim() 
              };
            } else {
              caption = { 
                en: captionContent.trim(), 
                hi: captionContent.trim() 
              };
            }
            i++; // Skip caption line
          }
        }
        
        blocks.push({
          type: 'image',
          content: '',
          meta: { 
            imageUrl,
            caption
          }
        });
        i++;
        continue;
      }

      // Check for image blocks that are part of text
      const imageRegex = /\[IMAGE:(.+?)\]/gi;
      const matches = Array.from(line.matchAll(imageRegex));
      
      if (matches.length > 0) {
        let lastIndex = 0;
        
        // Process text and images in the line
        for (const match of matches) {
          const matchIndex = match.index!;
          const matchText = match[0];
          const imageUrl = match[1].trim();
          
          // Add text before image if exists
          if (matchIndex > lastIndex) {
            const textBefore = line.substring(lastIndex, matchIndex).trim();
            if (textBefore) {
              const formattedText = applyInlineFormatting(textBefore);
              blocks.push({
                type: 'paragraph',
                content: formattedText
              });
            }
          }
          
          // Add image block
          blocks.push({
            type: 'image',
            content: '',
            meta: { imageUrl }
          });
          
          lastIndex = matchIndex + matchText.length;
        }
        
        // Add text after last image if exists
        if (lastIndex < line.length) {
          const textAfter = line.substring(lastIndex).trim();
          if (textAfter) {
            const formattedText = applyInlineFormatting(textAfter);
            blocks.push({
              type: 'paragraph',
              content: formattedText
            });
          }
        }
        
        i++;
        continue;
      }

      // Skip caption lines (they're handled with images)
      if (line.trim().startsWith('[CAPTION:')) {
        i++;
        continue;
      }

      // Check for special templates
      const templateMatch = line.match(/^\[([A-Z\s'_-]+):(.+?)\]$/i);
      if (templateMatch) {
        const [, templateType, templateContent] = templateMatch;
        
        switch (templateType.toUpperCase()) {
          case 'LEAD PARAGRAPH':
            blocks.push({
              type: 'lead',
              content: templateContent.trim(),
            });
            break;
          case 'KEY FACT':
            blocks.push({
              type: 'keyfact',
              content: templateContent.trim(),
            });
            break;
          case 'IMPACT':
            blocks.push({
              type: 'impact',
              content: templateContent.trim(),
            });
            break;
          case 'WHAT\'S NEXT':
            blocks.push({
              type: 'next',
              content: templateContent.trim(),
            });
            break;
          case 'WARNING':
            blocks.push({
              type: 'warning',
              content: templateContent.trim(),
            });
            break;
          case 'QUOTE':
            const sourceMatch = templateContent.match(/"(.+?)"\s*-\s*(.+)/);
            if (sourceMatch) {
              const [, quote, source] = sourceMatch;
              blocks.push({
                type: 'quote',
                content: quote.trim(),
                meta: { source: source.trim() }
              });
            } else {
              blocks.push({
                type: 'quote',
                content: templateContent.trim(),
              });
            }
            break;
          default:
            const formattedLine = applyInlineFormatting(line);
            blocks.push({
              type: 'paragraph',
              content: formattedLine,
            });
        }
        i++;
        continue;
      }

      // Check for heading (h1, h2, h3)
      if (line.startsWith('# ')) {
        blocks.push({
          type: 'h1',
          content: line.substring(2).trim(),
        });
        i++;
        continue;
      }
      if (line.startsWith('## ')) {
        blocks.push({
          type: 'h2',
          content: line.substring(3).trim(),
        });
        i++;
        continue;
      }
      if (line.startsWith('### ')) {
        blocks.push({
          type: 'h3',
          content: line.substring(4).trim(),
        });
        i++;
        continue;
      }

      // Check for horizontal rule
      if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
        blocks.push({
          type: 'divider',
          content: '',
        });
        i++;
        continue;
      }

      // Check for blockquote
      if (line.startsWith('> ')) {
        blocks.push({
          type: 'blockquote',
          content: line.substring(2).trim(),
        });
        i++;
        continue;
      }

      // Check for unordered list item
      if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ ')) {
        const listContent = applyInlineFormatting(line.substring(2).trim());
        blocks.push({
          type: 'list',
          content: listContent,
        });
        i++;
        continue;
      }

      // Check for ordered list item
      const orderedListMatch = line.match(/^(\d+)\.\s+(.+)/);
      if (orderedListMatch) {
        const listContent = applyInlineFormatting(orderedListMatch[2].trim());
        blocks.push({
          type: 'orderedList',
          content: listContent,
        });
        i++;
        continue;
      }

      // Regular paragraph with inline formatting
      const formattedLine = applyInlineFormatting(line.trim());
      if (formattedLine.trim()) {
        blocks.push({
          type: 'paragraph',
          content: formattedLine
        });
      }
      
      i++;
    }
    
    return blocks;
  }, []);

  // Helper function to apply inline formatting
  const applyInlineFormatting = (text: string): string => {
    if (!text) return '';
    
    let formatted = text;
    
    // Apply bold formatting
    formatted = formatted.replace(
      /\*\*(.+?)\*\*/g, 
      '<strong class="font-bold">$1</strong>'
    );
    
    // Apply italic formatting
    formatted = formatted.replace(
      /\*(?!\*)(.+?)(?<!\*)\*/g,
      '<em class="italic">$1</em>'
    );
    
    // Apply underline formatting
    formatted = formatted.replace(
      /__(.+?)__/g,
      '<u class="underline">$1</u>'
    );
    
    // Apply links
    formatted = formatted.replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
    );

    return formatted;
  };

  // Function to render parsed content blocks - FIXED IMAGE RENDERING
  const renderContentBlock = useCallback((block: ContentBlock, index: number) => {
    const getCaption = (caption: { en: string; hi: string } | undefined) => {
      if (!caption) return '';
      return language === 'en' ? caption.en : caption.hi;
    };

    // Generate unique key for each block
    const blockKey = `${block.type}-${index}-${language}`;

    switch (block.type) {
      case 'h1':
        return (
          <h1 key={blockKey} className="text-3xl font-bold mt-8 mb-4 text-gray-900">
            {block.content}
          </h1>
        );
      
      case 'h2':
        return (
          <h2 key={blockKey} className="text-2xl font-bold mt-6 mb-3 text-gray-800">
            {block.content}
          </h2>
        );
      
      case 'h3':
        return (
          <h3 key={blockKey} className="text-xl font-bold mt-5 mb-2 text-gray-700">
            {block.content}
          </h3>
        );
      
      case 'lead':
        return (
          <div key={blockKey} className="my-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-blue-700 mb-1">
                  {language === 'hi' ? 'मुख्य पैराग्राफ:' : 'LEAD PARAGRAPH:'}
                </p>
                <p className="text-gray-800">{block.content}</p>
              </div>
            </div>
          </div>
        );
      
      case 'keyfact':
        return (
          <div key={blockKey} className="my-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-yellow-700 mb-1">
                  {language === 'hi' ? 'मुख्य तथ्य:' : 'KEY FACT:'}
                </p>
                <p className="text-gray-800">{block.content}</p>
              </div>
            </div>
          </div>
        );
      
      case 'impact':
        return (
          <div key={blockKey} className="my-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-green-700 mb-1">
                  {language === 'hi' ? 'प्रभाव:' : 'IMPACT:'}
                </p>
                <p className="text-gray-800">{block.content}</p>
              </div>
            </div>
          </div>
        );
      
      case 'next':
        return (
          <div key={blockKey} className="my-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
            <div className="flex items-start gap-2">
              <Maximize2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-purple-700 mb-1">
                  {language === 'hi' ? 'आगे क्या:' : 'WHAT\'S NEXT:'}
                </p>
                <p className="text-gray-800">{block.content}</p>
              </div>
            </div>
          </div>
        );
      
      case 'warning':
        return (
          <div key={blockKey} className="my-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-700 mb-1">
                  {language === 'hi' ? 'चेतावनी:' : 'WARNING:'}
                </p>
                <p className="text-gray-800">{block.content}</p>
              </div>
            </div>
          </div>
        );
      
      case 'quote':
        return (
          <div key={blockKey} className="my-6 p-6 border-l-4 border-gray-400 bg-gray-50 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Quote className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-lg italic text-gray-700 mb-2">"{block.content}"</p>
                {block.meta?.source && (
                  <p className="text-sm text-gray-600 font-medium">— {block.meta.source}</p>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'image':
        const imageUrl = block.meta?.imageUrl || '';
        const caption = getCaption(block.meta?.caption);
        
        // Validate URL
        const isValidUrl = imageUrl && 
                         (imageUrl.startsWith('http://') || 
                          imageUrl.startsWith('https://') || 
                          imageUrl.startsWith('/'));
        
        // Clean URL - remove any trailing brackets or special characters
        const cleanImageUrl = isValidUrl ? imageUrl.replace(/[<>]/g, '') : '';
        
        return (
          <div key={blockKey} className="my-8">
            <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              {isValidUrl ? (
                <div className="relative w-full">
                  <img
                    src={cleanImageUrl}
                    alt={caption || (language === 'hi' ? 'लेख छवि' : 'Article image')}
                    className="w-full h-auto max-h-[500px] object-contain mx-auto"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Failed to load image:', cleanImageUrl);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.className = 'flex flex-col items-center justify-center min-h-[200px] w-full bg-gray-100 p-4';
                        fallbackDiv.innerHTML = `
                          <div class="flex flex-col items-center justify-center">
                            <svg class="h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p class="text-sm font-medium text-gray-500">${language === 'hi' ? 'छवि लोड नहीं हो सकी' : 'Image failed to load'}</p>
                            <p class="text-xs text-gray-400 mt-1 text-center truncate max-w-full">URL: ${cleanImageUrl.substring(0, 50)}...</p>
                          </div>
                        `;
                        parent.appendChild(fallbackDiv);
                      }
                    }}
                    onLoad={(e) => {
                      console.log('Image loaded successfully:', cleanImageUrl);
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[200px] w-full p-4">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-500">
                    {language === 'hi' ? 'छवि उपलब्ध नहीं' : 'Image not available'}
                  </p>
                  {imageUrl && (
                    <p className="text-xs text-gray-400 mt-1 text-center truncate max-w-full">
                      {language === 'hi' ? 'अमान्य यूआरएल:' : 'Invalid URL:'} {imageUrl}
                    </p>
                  )}
                </div>
              )}
            </div>
            {caption && (
              <p className="text-sm text-gray-600 text-center mt-3 italic px-4">
                {caption}
              </p>
            )}
          </div>
        );
      
      case 'divider':
        return (
          <hr key={blockKey} className="my-8 border-t border-gray-300" />
        );
      
      case 'blockquote':
        return (
          <blockquote key={blockKey} className="my-4 pl-4 border-l-4 border-gray-300 text-gray-700 italic">
            {block.content}
          </blockquote>
        );
      
      case 'list':
        return (
          <div key={blockKey} className="ml-6 mb-2">
            <li className="list-disc text-gray-800">
              <span dangerouslySetInnerHTML={{ __html: block.content }} />
            </li>
          </div>
        );
      
      case 'orderedList':
        return (
          <div key={blockKey} className="ml-6 mb-2">
            <li className="list-decimal text-gray-800">
              <span dangerouslySetInnerHTML={{ __html: block.content }} />
            </li>
          </div>
        );
      
      case 'paragraph':
        return (
          <div 
            key={blockKey} 
            className="my-4 text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );
      
      default:
        return (
          <p key={blockKey} className="my-4 text-gray-800 leading-relaxed">
            {block.content}
          </p>
        );
    }
  }, [language]);

  // Fetch opinion data
  const fetchOpinion = useCallback(async () => {
    try {
      setLoading(true);
      
      // First try to get the full opinion data
      const response = await fetch(`/api/admin/opinions/${opinionId}`);
      
      if (response.ok) {
        const data = await response.json();
        setOpinion(data.opinion);
        
        // Parse both English and Hindi content
        if (data.opinion?.content) {
          const parsed = parseContent(data.opinion.content);
          
          // Log image blocks
          const imageBlocks = parsed.filter(block => block.type === 'image');
          imageBlocks.forEach((block, index) => {
            console.log(`Image ${index + 1} URL:`, block.meta?.imageUrl);
            console.log(`Image ${index + 1} caption:`, block.meta?.caption);
          });
          
          setParsedContent(parsed);
        }
        
        if (data.opinion?.contentHi) {
          const parsedHi = parseContent(data.opinion.contentHi);
          // Log image blocks
          const imageBlocksHi = parsedHi.filter(block => block.type === 'image');
          setParsedContentHi(parsedHi);
        }
        
        // Fetch related opinions based on topic
        if (data.opinion?.topic) {
          fetchRelatedOpinions(data.opinion.topic, data.opinion._id);
        }
        return;
      }
      
      // If admin endpoint fails, try public endpoint
      const publicResponse = await fetch(`/api/public/opinion/${opinionId}/view`);
      
      if (publicResponse.ok) {
        const publicData = await publicResponse.json();
        const opinionData = publicData.opinion || publicData;
        setOpinion(opinionData);
        
        // Parse both English and Hindi content
        if (opinionData?.content) {
          setParsedContent(parseContent(opinionData.content));
        }
        if (opinionData?.contentHi) {
          setParsedContentHi(parseContent(opinionData.contentHi));
        }
        
        // Fetch related opinions based on topic
        if (opinionData?.topic) {
          fetchRelatedOpinions(opinionData.topic, opinionData._id);
        }
      } else {
        throw new Error("Failed to fetch opinion");
      }
    } catch (error) {
      console.error("Error fetching opinion:", error);
      toast.error(language === 'hi' ? "राय लोड करने में विफल" : "Failed to load opinion");
    } finally {
      setLoading(false);
    }
  }, [opinionId, parseContent, language]);

  // Fetch related opinions
  const fetchRelatedOpinions = async (topic: string, excludeId: string) => {
    try {
      const response = await fetch(`/api/admin/opinions`);
      if (response.ok) {
        const data = await response.json();
        const filtered = data.opinions?.filter((op: Opinion) => 
          op.status === 'approved' && 
          op.topic === topic && 
          op._id !== excludeId
        ).slice(0, 2) || [];
        setRelatedOpinions(filtered);
      }
    } catch (error) {
      console.error("Error fetching related opinions:", error);
    }
  };

  // Track view
  const trackView = useCallback(async () => {
    if (!opinionId || isViewTracked) return;

    try {
      const token = localStorage.getItem("admin-token");
      const headers: HeadersInit = {
        'Accept': '*/*',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch(`/api/public/opinion/${opinionId}/view`, {
        method: 'POST',
        headers,
      });
      
      setIsViewTracked(true);
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  }, [opinionId, isViewTracked]);

  // Handle like
  const handleLike = async () => {
    if (!opinion || !currentUser) {
      toast.error(language === 'hi' ? "कृपया राय पसंद करने के लिए लॉगिन करें" : "Please login to like opinions");
      return;
    }

    try {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        toast.error(language === 'hi' ? "कृपया राय पसंद करने के लिए लॉगिन करें" : "Please login to like opinions");
        return;
      }

      // Optimistic update
      const newOpinion = { ...opinion };
      if (isLiked) {
        newOpinion.likes = Math.max(0, newOpinion.likes - 1);
        setIsLiked(false);
      } else {
        if (isDisliked) {
          newOpinion.dislikes = Math.max(0, newOpinion.dislikes - 1);
          setIsDisliked(false);
        }
        newOpinion.likes += 1;
        setIsLiked(true);
      }
      setOpinion(newOpinion);

      // API call
      const response = await fetch(`/api/public/opinion/${opinionId}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ type: isLiked ? 'remove' : 'like' }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const data = await response.json();
      if (data.opinion) {
        setOpinion(data.opinion);
      }
      toast.success(isLiked ? 
        (language === 'hi' ? "पसंद हटाई गई" : "Like removed") : 
        (language === 'hi' ? "राय पसंद की गई!" : "Opinion liked!")
      );
    } catch (error) {
      console.error("Error liking opinion:", error);
      toast.error(language === 'hi' ? "प्रतिक्रिया अपडेट करने में विफल" : "Failed to update reaction");
      fetchOpinion(); // Revert on error
    }
  };

  // Handle dislike
  const handleDislike = async () => {
    if (!opinion || !currentUser) {
      toast.error(language === 'hi' ? "कृपया राय नापसंद करने के लिए लॉगिन करें" : "Please login to dislike opinions");
      return;
    }

    try {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        toast.error(language === 'hi' ? "कृपया राय नापसंद करने के लिए लॉगिन करें" : "Please login to dislike opinions");
        return;
      }

      // Optimistic update
      const newOpinion = { ...opinion };
      if (isDisliked) {
        newOpinion.dislikes = Math.max(0, newOpinion.dislikes - 1);
        setIsDisliked(false);
      } else {
        if (isLiked) {
          newOpinion.likes = Math.max(0, newOpinion.likes - 1);
          setIsLiked(false);
        }
        newOpinion.dislikes += 1;
        setIsDisliked(true);
      }
      setOpinion(newOpinion);

      // API call
      const response = await fetch(`/api/public/opinion/${opinionId}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ type: isDisliked ? 'remove' : 'dislike' }),
      });

      if (!response.ok) {
        throw new Error("Failed to update dislike");
      }

      const data = await response.json();
      if (data.opinion) {
        setOpinion(data.opinion);
      }
      toast.success(isDisliked ? 
        (language === 'hi' ? "नापसंद हटाई गई" : "Dislike removed") : 
        (language === 'hi' ? "राय नापसंद की गई!" : "Opinion disliked!")
      );
    } catch (error) {
      console.error("Error disliking opinion:", error);
      toast.error(language === 'hi' ? "प्रतिक्रिया अपडेट करने में विफल" : "Failed to update reaction");
      fetchOpinion(); // Revert on error
    }
  };

  // Handle share
  const handleShare = async (platform: string) => {
    if (!opinion) return;

    try {
      const token = localStorage.getItem("admin-token");
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Optimistic update
      const newOpinion = { ...opinion };
      newOpinion.shares += 1;
      setOpinion(newOpinion);

      const response = await fetch(`/api/public/opinion/${opinionId}/share`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ platform }),
      });

      if (!response.ok) {
        throw new Error("Failed to share");
      }

      const data = await response.json();
      
      // Open share URL
      if (data.shareUrl) {
        window.open(data.shareUrl, '_blank');
      }
      
      toast.success(language === 'hi' ? `${platform} पर शेयर किया गया` : `Shared on ${platform}`);
      
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error(language === 'hi' ? "शेयर करने में विफल" : "Failed to share");
      fetchOpinion(); // Revert on error
    }
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        toast.success(language === 'hi' ? "लिंक क्लिपबोर्ड पर कॉपी किया गया!" : "Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error(language === 'hi' ? "लिंक कॉपी करने में विफल" : "Failed to copy link");
      });
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return language === 'hi' ? "अमान्य तिथि" : "Invalid date";
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return language === 'hi' ? "अमान्य समय" : "Invalid time";
    }
  };

  // Get read time
  const getReadTime = () => {
    if (!opinion) return language === 'hi' ? "1 मिनट पढ़ना" : "1 min read";
    
    const content = language === 'hi' && opinion.contentHi ? opinion.contentHi : opinion.content;
    if (!content || typeof content !== 'string') {
      return language === 'hi' ? "1 मिनट पढ़ना" : "1 min read";
    }
    
    try {
      const words = content.split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      return language === 'hi' ? `${minutes} मिनट पढ़ना` : `${minutes} min read`;
    } catch (error) {
      return language === 'hi' ? "1 मिनट पढ़ना" : "1 min read";
    }
  };

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return language === 'hi' ? `${diffMins} मिनट पहले` : `${diffMins} minutes ago`;
      } else if (diffHours < 24) {
        return language === 'hi' ? `${diffHours} घंटे पहले` : `${diffHours} hours ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return language === 'hi' ? `${diffDays} दिन पहले` : `${diffDays} days ago`;
      }
    } catch (error) {
      return language === 'hi' ? "हाल ही में" : "Recently";
    }
  };

  // Check user interaction
  const checkUserInteraction = useCallback(() => {
    if (!opinion || !currentUser) return;

    const liked = opinion.likedBy.some(
      item => typeof item === 'string' ? item === currentUser._id : item._id === currentUser._id
    );
    const disliked = opinion.dislikedBy.some(
      item => typeof item === 'string' ? item === currentUser._id : item._id === currentUser._id
    );

    setIsLiked(liked);
    setIsDisliked(disliked);
  }, [opinion, currentUser]);

  // Load current user
  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    const userData = localStorage.getItem("user-data");

    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({
          _id: payload.userId,
          name: payload.name || 'User',
          email: payload.email,
          role: payload.role,
        });
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  // Fetch data
  useEffect(() => {
    if (opinionId) {
      fetchOpinion();
      trackView();
    }
  }, [opinionId, fetchOpinion, trackView]);

  // Check user interaction when opinion loads
  useEffect(() => {
    checkUserInteraction();
  }, [checkUserInteraction]);

  // Add debug effect for parsed content
  useEffect(() => {    
    // Log all image blocks
    const englishImages = parsedContent.filter(block => block.type === 'image');
    const hindiImages = parsedContentHi.filter(block => block.type === 'image');
  }, [parsedContent, parsedContentHi, language]);

  const hasHindiTranslation = opinion?.contentHi && opinion.contentHi.trim().length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* News Header Skeleton */}
        <header className="border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <Skeleton className="h-8 w-40" />
              <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Article Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-64 w-full mt-6" />
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!opinion) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {language === 'hi' ? 'राय नहीं मिली' : 'Opinion not found'}
          </h2>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/opinions">
              {language === 'hi' ? 'सभी राय पर वापस जाएं' : 'Back to Opinions'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const author = opinion.authorId || { _id: '', name: language === 'hi' ? 'अज्ञात लेखक' : 'Unknown Author', email: '' };
  const readTime = getReadTime();
  const publishDate = formatDate(opinion.createdAt);
  const publishTime = formatTime(opinion.createdAt);
  const safeTags = opinion.tags || [];
  const currentContent = getCurrentContent();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href="/" className="hover:text-red-600">
                {language === 'hi' ? 'होम' : 'Home'}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/opinions" className="hover:text-red-600">
                {language === 'hi' ? 'राय' : 'Opinions'}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-gray-900">{opinion.topic}</span>
            </div>

            {/* Language Indicator */}
            <div className="mb-4">
              <Badge variant="outline" className="rounded-full px-3">
                {language === 'hi' ? 'हिंदी' : 'English'} 
                <span className="ml-1 text-xs opacity-70">
                  ({language === 'hi' ? 'हिंदी में पढ़ें' : 'Reading in English'})
                </span>
              </Badge>
              {hasHindiTranslation && (
                <Badge variant="outline" className="ml-2 rounded-full border-blue-500 text-blue-600">
                  <Globe className="h-3 w-3 mr-1" />
                  {language === 'hi' ? 'हिंदी अनुवाद उपलब्ध' : 'Hindi translation available'}
                </Badge>
              )}
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <div className="mb-4">
                <Badge className="bg-red-600 text-white rounded-none mb-2 px-3 py-1">
                  {language === 'hi' ? 'राय' : 'OPINION'}
                </Badge>
                <Badge variant="outline" className="ml-2 rounded-none border-gray-300">
                  {opinion.topic}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {getTitle()}
              </h1>

              {/* Author and Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border">
                    <AvatarImage src={author.profileImage} />
                    <AvatarFallback className="bg-gray-100">
                      {author.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{author.name}</p>
                    <p className="text-sm text-gray-600">
                      {language === 'hi' ? 'राय स्तंभकार' : 'Opinion Columnist'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{publishDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{opinion.views || 0} {language === 'hi' ? 'दृश्य' : 'views'}</span>
                  </div>
                </div>
              </div>

              {/* Top Ad */}
              <div className="my-6 flex justify-center">
                <GoogleAdSense
                  adSlot="0987654321"
                  adFormat="leaderboard"
                  className="max-w-[728px] w-full h-[90px]"
                />
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-6 py-4 border-y">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{opinion.likes || 0}</div>
                  <div className="text-xs text-gray-600">
                    {language === 'hi' ? 'पसंद' : 'Likes'}
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{opinion.dislikes || 0}</div>
                  <div className="text-xs text-gray-600">
                    {language === 'hi' ? 'नापसंद' : 'Dislikes'}
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{opinion.shares || 0}</div>
                  <div className="text-xs text-gray-600">
                    {language === 'hi' ? 'शेयर' : 'Shares'}
                  </div>
                </div>
              </div>

              {/* Reaction Buttons */}
              <div className="flex items-center gap-4 mt-6">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="lg"
                  onClick={handleLike}
                  disabled={!currentUser}
                  className={`rounded-none ${isLiked ? "bg-green-600 hover:bg-green-700 border-green-600" : "border-gray-300"}`}
                >
                  <ThumbsUp className="w-5 h-5 mr-2" />
                  {language === 'hi' ? 'पसंद' : 'Like'}
                </Button>
                <Button
                  variant={isDisliked ? "default" : "outline"}
                  size="lg"
                  onClick={handleDislike}
                  disabled={!currentUser}
                  className={`rounded-none ${isDisliked ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-gray-300"}`}
                >
                  <ThumbsDown className="w-5 h-5 mr-2" />
                  {language === 'hi' ? 'नापसंद' : 'Dislike'}
                </Button>
                {!currentUser && (
                  <p className="text-sm text-gray-600">
                    <Link href="/login" className="text-red-600 hover:underline font-medium">
                      {language === 'hi' ? 'लॉगिन करें' : 'Login'}
                    </Link> {language === 'hi' ? 'प्रतिक्रिया देने के लिए' : 'to react'}
                  </p>
                )}
              </div>
            </header>

            {/* Article Content */}
            <main className="mb-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 leading-relaxed text-lg">
                  {currentContent.length > 0 ? (
                    <div className="space-y-4">
                      {currentContent.map((block, index) => renderContentBlock(block, index))}
                    </div>
                  ) : (
                    <div className="p-8 text-center border rounded-lg">
                      <p className="text-gray-600 italic">
                        {language === 'hi' ? 'सामग्री उपलब्ध नहीं है' : 'Content not available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mid-Content Ad */}
              <div className="my-10 flex justify-center">
                <GoogleAdSense
                  adSlot="0987654321"
                  adFormat="rectangle"
                  className="max-w-[336px] w-full h-[280px]"
                />
              </div>

              {/* Tags */}
              {safeTags.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'hi' ? 'टैग' : 'TAGS'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {safeTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-none border-gray-300 text-gray-700 hover:bg-gray-50">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </main>

            {/* Share Section */}
            <footer className="border-t pt-8 mb-8">
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  {language === 'hi' ? 'इस लेख को शेयर करें' : 'Share this article'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-none border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="w-5 h-5 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-none border-sky-500 text-sky-500 hover:bg-sky-50 hover:text-sky-600"
                    onClick={() => handleShare('twitter')}
                  >
                    <Twitter className="w-5 h-5 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-none border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={() => handleShare('whatsapp')}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-none border-blue-700 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                    onClick={() => handleShare('linkedin')}
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={copyToClipboard}
                    className="rounded-none"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 mr-2" />
                    ) : (
                      <LinkIcon className="w-5 h-5 mr-2" />
                    )}
                    {copied ? 
                      (language === 'hi' ? 'कॉपी किया' : 'Copied') : 
                      (language === 'hi' ? 'लिंक कॉपी करें' : 'Copy Link')
                    }
                  </Button>
                </div>
              </div>

              {/* Author Bio */}
              <Card className="mb-8 border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="w-20 h-20 border-2">
                      <AvatarImage src={author.profileImage} />
                      <AvatarFallback className="text-xl bg-gray-100">
                        {author.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-2 text-gray-900">{author.name}</h4>
                      <p className="text-gray-600 mb-3">
                        {language === 'hi' 
                          ? `न्यूज़डेली में राय स्तंभकार। ${opinion.topic.toLowerCase()} और राजनीतिक विश्लेषण में विशेषज्ञता।`
                          : `Opinion columnist at NewsDaily. Specializing in ${opinion.topic.toLowerCase()} and political analysis.`
                        }
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {language === 'hi' ? 'प्रकाशित' : 'Published'} {language === 'hi' ? 'पर' : 'on'} {publishDate} {language === 'hi' ? 'पर' : 'at'} {publishTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Language Information */}
              {hasHindiTranslation && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {language === 'hi' ? 'भाषा जानकारी:' : 'Language Information:'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {language === 'hi' 
                      ? 'यह लेख अंग्रेजी और हिंदी दोनों में उपलब्ध है। अपनी पसंदीदा भाषा में पढ़ने के लिए हेडर से भाषा बदलें।'
                      : 'This article is available in both English and Hindi. Change language from the header to read in your preferred language.'
                    }
                  </p>
                </div>
              )}

              {/* Bottom Ad */}
              <div className="my-8 flex justify-center">
                <GoogleAdSense
                  adSlot="0987654321"
                  adFormat="banner"
                  className="max-w-[468px] w-full h-[60px]"
                />
              </div>
            </footer>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Newsletter Signup */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  {language === 'hi' ? 'न्यूज़लेटर की सदस्यता लें' : 'Subscribe to Newsletter'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {language === 'hi' 
                    ? 'दैनिक अपडेट और राय आपके इनबॉक्स में प्राप्त करें।'
                    : 'Get daily updates and opinion pieces delivered to your inbox.'
                  }
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder={language === 'hi' ? "आपका ईमेल पता" : "Your email address"}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-red-500"
                  />
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    {language === 'hi' ? 'सदस्यता लें' : 'Subscribe'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Ad */}
            <div className="flex justify-center">
              <GoogleAdSense
                adSlot="0987654321"
                adFormat="rectangle"
                className="w-full h-[250px]"
              />
            </div>

            {/* Trending Now */}
            <div>
              <h3 className="text-lg font-bold mb-4 pb-2 border-b text-gray-900">
                {language === 'hi' ? 'अभी ट्रेंडिंग' : 'TRENDING NOW'}
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b pb-4 last:border-0">
                    <div className="flex items-start">
                      <span className="text-2xl font-bold text-gray-300 mr-3">{i}</span>
                      <div>
                        <Badge className="bg-gray-100 text-gray-800 text-xs mb-1 px-2">
                          {language === 'hi' ? 'राजनीति' : 'Politics'}
                        </Badge>
                        <h4 className="font-semibold text-gray-900 hover:text-red-600 cursor-pointer">
                          {language === 'hi' 
                            ? `ट्रेंडिंग राय #${i} वर्तमान मामलों पर`
                            : `Trending opinion #${i} on current affairs`
                          }
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {language === 'hi' ? `${i} घंटे पहले` : `${i} hours ago`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Another Sidebar Ad */}
            <div className="flex justify-center">
              <GoogleAdSense
                adSlot="0987654321"
                adFormat="rectangle"
                className="w-full h-[250px]"
              />
            </div>

            {/* Follow Us */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">
                  {language === 'hi' ? 'हमें फॉलो करें' : 'FOLLOW US'}
                </h3>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon" className="border-blue-600 text-blue-600">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-sky-500 text-sky-500">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-blue-700 text-blue-700">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {language === 'hi' ? 'संबंधित राय' : 'MORE ON'} {opinion.topic.toUpperCase()}
          </h2>
          
          {/* Ad before related articles */}
          <div className="my-6 flex justify-center">
            <GoogleAdSense
              adSlot="0987654321"
              adFormat="leaderboard"
              className="max-w-[728px] w-full h-[90px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedOpinions.length > 0 ? (
              relatedOpinions.map((related) => (
                <Card 
                  key={related._id} 
                  className="border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/opinion/${related._id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-red-600 text-white text-xs">
                        {language === 'hi' ? 'राय' : 'OPINION'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{related.topic}</Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-red-600">
                      {language === 'hi' && related.titleHi ? related.titleHi : related.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {language === 'hi' && related.contentHi 
                        ? related.contentHi.substring(0, 150) + '...'
                        : related.content.substring(0, 150) + '...'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{related.authorId.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{getRelativeTime(related.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                {/* Placeholder related articles */}
                {[1, 2].map((i) => (
                  <Card key={i} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-red-600 text-white text-xs">
                          {language === 'hi' ? 'राय' : 'OPINION'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{opinion.topic}</Badge>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-red-600">
                        {language === 'hi' 
                          ? `${opinion.topic} पर अधिक राय`
                          : `More opinions on ${opinion.topic.toLowerCase()}`
                        }
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {language === 'hi' 
                          ? 'इस विषय पर विभिन्न दृष्टिकोण और विश्लेषण का पता लगाएं।'
                          : 'Explore different perspectives and analysis on this topic.'
                        }
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>{language === 'hi' ? 'स्टाफ लेखक' : 'Staff Writer'}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{language === 'hi' ? 'हाल ही में' : 'Recently'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}