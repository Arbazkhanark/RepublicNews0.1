"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, Eye, Upload, Tag, User, Loader2, Image as ImageIcon, X, Copy, Check, ExternalLink, Globe, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Link2,
  Minus,
  Maximize2,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Trash2,
  Download,
  AlertTriangle,
  Type,
  FileText
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Author {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  heading: 'h1' | 'h2' | 'h3' | 'normal' | null;
}

interface UploadedImage {
  url: string;
  caption: { en: string; hi: string };
  alt: { en: string; hi: string };
  id: string;
  publicId?: string;
}

interface Opinion {
  _id: string;
  title: string;
  titleHi: string;
  imageUrl?: string;
  content: string;
  contentHi: string;
  topic: string;
  tags: string[];
  authorId: Author | string;
  status: "pending" | "approved" | "rejected" | "draft";
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  createdAt: string;
  updatedAt: string;
  excerpt?: string;
  readTime?: number;
  originalLanguage: 'en' | 'hi';
  hasHindiTranslation: boolean;
}

interface FormData {
  title: string;
  titleHi: string;
  featuredImageUrl: string;
  content: string;
  contentHi: string;
  topic: string;
  tags: string[];
  status: "draft" | "pending";
  originalLanguage: 'en' | 'hi';
  hasHindiTranslation: boolean;
}

// Cloudinary Upload Function
const uploadToCloudinary = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dummyname'}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { 
      url: data.secure_url, 
      publicId: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export default function EditOpinionPage() {
  const router = useRouter();
  const params = useParams();
  const opinionId = params.id as string;
  
  const textareaRefEn = useRef<HTMLTextAreaElement>(null);
  const textareaRefHi = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState({ en: "", hi: "" });
  const [imageCaption, setImageCaption] = useState({ en: "", hi: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [imagePosition, setImagePosition] = useState<"left" | "center" | "right">("center");
  const [activeImageTab, setActiveImageTab] = useState<"upload" | "url" | "gallery">("upload");
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    heading: null,
  });
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [opinion, setOpinion] = useState<Opinion | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'hi'>('en');
  const [previewLanguage, setPreviewLanguage] = useState<'en' | 'hi'>('en');
  const [syncTemplates, setSyncTemplates] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    titleHi: "",
    featuredImageUrl: "",
    content: "",
    contentHi: "",
    topic: "",
    tags: [],
    status: "draft",
    originalLanguage: "en",
    hasHindiTranslation: false,
  });

  const [newTag, setNewTag] = useState("");

  // Helper function to get active textarea
  const getActiveTextarea = () => {
    return activeLanguage === "en" ? textareaRefEn.current : textareaRefHi.current;
  };

  // Helper function to get active content
  const getActiveContent = () => {
    return activeLanguage === "en" ? formData.content : formData.contentHi;
  };

  // Fetch opinion data on component mount
  useEffect(() => {
    fetchOpinion();
    fetchAuthors();
    
    // Load saved images from localStorage
    const savedImages = localStorage.getItem('opinion_editor_images');
    if (savedImages) {
      try {
        setUploadedImages(JSON.parse(savedImages));
      } catch (error) {
        console.error('Error loading saved images:', error);
      }
    }
  }, [opinionId]);

  // Save images to localStorage whenever uploadedImages changes
  useEffect(() => {
    if (uploadedImages.length > 0) {
      localStorage.setItem('opinion_editor_images', JSON.stringify(uploadedImages));
    }
  }, [uploadedImages]);

  // Update format state when content changes
  useEffect(() => {
    updateFormatState();
  }, [formData.content, formData.contentHi, activeLanguage]);

  const updateFormatState = () => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = getActiveContent();
    
    if (start === end) {
      // No selection, get the word at cursor
      const textBefore = currentContent.substring(0, start);
      const textAfter = currentContent.substring(end);
      const wordStart = Math.max(0, textBefore.lastIndexOf(" "), textBefore.lastIndexOf("\n")) + 1;
      const wordEnd = Math.min(
        currentContent.length,
        textAfter.indexOf(" ") === -1 ? currentContent.length : end + textAfter.indexOf(" "),
        textAfter.indexOf("\n") === -1 ? currentContent.length : end + textAfter.indexOf("\n")
      );
      
      const selectedText = currentContent.substring(wordStart, wordEnd);
      
      // Check for formatting markers around the word
      const isBold = selectedText.startsWith("**") && selectedText.endsWith("**");
      const isItalic = selectedText.startsWith("*") && selectedText.endsWith("*");
      const isUnderline = selectedText.startsWith("__") && selectedText.endsWith("__");
      
      setFormatState(prev => ({
        ...prev,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
      }));
    } else {
      // There's a selection
      const selectedText = currentContent.substring(start, end);
      
      // Check if selected text has formatting markers
      const isBold = selectedText.startsWith("**") && selectedText.endsWith("**");
      const isItalic = selectedText.startsWith("*") && selectedText.endsWith("*");
      const isUnderline = selectedText.startsWith("__") && selectedText.endsWith("__");
      
      setFormatState(prev => ({
        ...prev,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
      }));
    }
  };

  const fetchOpinion = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin-token");
      const response = await fetch(`/api/admin/opinions/${opinionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch opinion");
      }

      const data = await response.json();
      setOpinion(data.opinion);
      
      // Set form data with fetched opinion
      if (data.opinion) {
        const opinionData = data.opinion;
        
        // API returns separate fields for English and Hindi
        setFormData({
          title: opinionData.title || "",
          titleHi: opinionData.titleHi || "",
          featuredImageUrl: opinionData.imageUrl || "",
          content: opinionData.content || "",
          contentHi: opinionData.contentHi || "",
          topic: opinionData.topic || "",
          tags: opinionData.tags || [],
          status: opinionData.status || "draft",
          originalLanguage: opinionData.originalLanguage || 'en',
          hasHindiTranslation: opinionData.hasHindiTranslation || false,
        });

        // Set active language based on original language
        setActiveLanguage(opinionData.originalLanguage || 'en');
      }
    } catch (error) {
      console.error("Error fetching opinion:", error);
      toast.error("Failed to load opinion");
      router.push("/admin/opinions");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const token = localStorage.getItem("admin-token");
      const response = await fetch("/api/admin/authors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuthors(data.authors || []);
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Editor functions
  const insertTextAtCursor = (text: string, removeFormat?: boolean) => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    textarea.focus();
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = getActiveContent();
    const selectedText = currentContent.substring(start, end);
    
    let newText = currentContent.substring(0, start) + text + currentContent.substring(end);

    // Update content
    if (activeLanguage === "en") {
      handleInputChange('content', newText);
    } else {
      handleInputChange('contentHi', newText);
    }

    // Set cursor position after inserted text
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        if (removeFormat) {
          // Place cursor at the end of inserted text
          textarea.setSelectionRange(start + text.length, start + text.length);
        } else {
          // If text was selected, select the inserted formatted text
          if (selectedText) {
            textarea.setSelectionRange(start + 2, start + text.length - 2);
          } else {
            // Place cursor in middle of formatting markers for easy typing
            textarea.setSelectionRange(start + 2, start + 2);
          }
        }
        updateFormatState();
      }
    }, 10);
  };

  const toggleFormat = (format: 'bold' | 'italic' | 'underline') => {
    const textarea = getActiveTextarea();
    if (!textarea) {
      console.error("No textarea found for active language:", activeLanguage);
      return;
    }

    textarea.focus();
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = getActiveContent();
    
    if (start === end) {
      // No text selected, insert format markers with placeholder
      const formatMarkers = {
        bold: "**",
        italic: "*",
        underline: "__",
      };
      
      const marker = formatMarkers[format];
      const placeholderText = `${marker}text${marker}`;
      
      insertTextAtCursor(placeholderText);
      
      setTimeout(() => {
        if (textarea) {
          // Select the placeholder text
          textarea.setSelectionRange(start + marker.length, start + marker.length + 4);
          textarea.focus();
        }
      }, 10);
    } else {
      // Text is selected, apply format to selection
      const selectedText = currentContent.substring(start, end);
      
      let newText = "";
      const formatMarkers = {
        bold: "**",
        italic: "*",
        underline: "__",
      };

      const marker = formatMarkers[format];
      const hasFormat = selectedText.startsWith(marker) && selectedText.endsWith(marker);

      if (hasFormat) {
        // Remove format
        newText =
          currentContent.substring(0, start) +
          selectedText.substring(marker.length, selectedText.length - marker.length) +
          currentContent.substring(end);
      } else {
        // Add format
        newText =
          currentContent.substring(0, start) +
          marker +
          selectedText +
          marker +
          currentContent.substring(end);
      }

      if (activeLanguage === "en") {
        handleInputChange('content', newText);
      } else {
        handleInputChange('contentHi', newText);
      }
      
      // Update selection to keep the formatted text selected
      setTimeout(() => {
        if (textarea) {
          const newLengthChange = hasFormat ? -2 * marker.length : 2 * marker.length;
          textarea.setSelectionRange(start, end + newLengthChange);
          textarea.focus();
        }
        updateFormatState();
      }, 10);
    }
    
    toast.success(`${format.charAt(0).toUpperCase() + format.slice(1)} formatting applied`);
  };

  const applyHeading = (level: 'h1' | 'h2' | 'h3') => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    textarea.focus();
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = getActiveContent();
    
    // Find the start of the current line
    const lineStart = currentContent.lastIndexOf("\n", start - 1) + 1;
    
    // Find the end of the current line
    let lineEnd = currentContent.indexOf("\n", end);
    if (lineEnd === -1) lineEnd = currentContent.length;
    
    const currentLine = currentContent.substring(lineStart, lineEnd);
    
    let newLine = currentLine;
    const markers = { h1: "# ", h2: "## ", h3: "### " };
    const marker = markers[level];

    // Remove existing heading markers if any
    newLine = newLine.replace(/^#+\s*/, "").trim();
    
    // Add new heading marker
    newLine = marker + newLine;

    const newText =
      currentContent.substring(0, lineStart) + newLine + currentContent.substring(lineEnd);
    
    if (activeLanguage === "en") {
      handleInputChange('content', newText);
    } else {
      handleInputChange('contentHi', newText);
    }
    
    // Update format state
    setFormatState((prev) => ({ ...prev, heading: level }));
    
    // Move cursor to end of heading
    setTimeout(() => {
      if (textarea) {
        const newPosition = lineStart + newLine.length;
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
      }
    }, 10);
    
    toast.success(`Heading ${level} applied`);
  };

  const removeHeading = () => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    textarea.focus();
    
    const start = textarea.selectionStart;
    const currentContent = getActiveContent();
    
    // Find the start of the current line
    const lineStart = currentContent.lastIndexOf("\n", start - 1) + 1;
    
    // Find the end of the current line
    let lineEnd = currentContent.indexOf("\n", start);
    if (lineEnd === -1) lineEnd = currentContent.length;
    
    const currentLine = currentContent.substring(lineStart, lineEnd);

    // Remove heading markers
    const newLine = currentLine.replace(/^#+\s*/, "").trim();
    
    const newText = currentContent.substring(0, lineStart) + newLine + currentContent.substring(lineEnd);
    
    if (activeLanguage === "en") {
      handleInputChange('content', newText);
    } else {
      handleInputChange('contentHi', newText);
    }
    
    setFormatState((prev) => ({ ...prev, heading: null }));
    
    // Move cursor to same relative position
    setTimeout(() => {
      if (textarea) {
        const newPosition = lineStart + Math.min(newLine.length, start - lineStart);
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
      }
    }, 10);
    
    toast.success("Heading removed");
  };

  const insertTemplate = (template: string, templateName: string) => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    textarea.focus();
    
    insertTextAtCursor(`\n${template}\n`);
    
    // If sync is enabled, insert empty template in other language too
    if (syncTemplates && activeLanguage === "en") {
      // Insert empty template in Hindi
      const emptyTemplate = template.replace(/:(.*?)\]/, ":]");
      setFormData(prev => ({
        ...prev,
        contentHi: prev.contentHi + `\n${emptyTemplate}\n`
      }));
    }
    
    toast.success(`${templateName} template inserted`);
  };

  const insertImage = () => {
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL or upload an image");
      return;
    }

    let imageHtml = `\n[IMAGE:${imageUrl}]\n`
    
    // Add caption in both languages
    if (imageCaption.en.trim() || imageCaption.hi.trim()) {
      imageHtml += `\n[CAPTION:${imageCaption.en}||${imageCaption.hi}]\n`
    }

    insertTextAtCursor(imageHtml, true);
    
    // Add to uploaded images
    const newImage: UploadedImage = {
      url: imageUrl,
      caption: imageCaption,
      alt: imageAlt,
      id: `image-${Date.now()}`
    };
    
    setUploadedImages(prev => [...prev, newImage]);
    
    setIsImageDialogOpen(false);
    setImageUrl("");
    setImageAlt({ en: "", hi: "" });
    setImageCaption({ en: "", hi: "" });
    
    toast.success("Image inserted successfully");
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP, GIF, SVG)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      toast.info("Uploading image to Cloudinary...");
      
      const result = await uploadToCloudinary(file);
      
      setImageUrl(result.url);
      setActiveImageTab("url");
      
      toast.success("Image uploaded successfully!");
      
      // Add to gallery automatically
      const newImage: UploadedImage = {
        url: result.url,
        caption: { en: "", hi: "" },
        alt: { en: "", hi: "" },
        id: `image-${Date.now()}`,
        publicId: result.publicId
      };
      
      setUploadedImages(prev => [...prev, newImage]);
      
    } catch (error: any) {
      console.error("Image upload failed:", error);
      
      // Provide helpful error messages
      if (error.message.includes('upload_preset')) {
        toast.error("Cloudinary configuration error. Please check your upload preset.");
      } else if (error.message.includes('cloud_name')) {
        toast.error("Cloudinary configuration error. Please check your cloud name.");
      } else {
        toast.error("Image upload failed. Please try again.");
      }
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const insertImageFromGallery = (image: UploadedImage) => {
    let imageHtml = `\n[IMAGE:${image.url}]\n`
    if (image.caption.en || image.caption.hi) {
      imageHtml += `\n[CAPTION:${image.caption.en}||${image.caption.hi}]\n`
    }

    insertTextAtCursor(imageHtml, true);
    
    setIsImageDialogOpen(false);
    
    toast.success("Image inserted from gallery");
  };

  const deleteImageFromGallery = (index: number) => {
    const updatedImages = [...uploadedImages];
    updatedImages.splice(index, 1);
    setUploadedImages(updatedImages);
    
    // Update localStorage
    localStorage.setItem('opinion_editor_images', JSON.stringify(updatedImages));
    
    toast.success("Image removed from gallery");
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("Image URL copied to clipboard");
    
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };

  const clearGallery = () => {
    setUploadedImages([]);
    localStorage.removeItem('opinion_editor_images');
    toast.success("Gallery cleared");
  };

  const renderPreview = () => {
    const previewContent = previewLanguage === "en" ? formData.content : formData.contentHi;
    let html = previewContent;
    
    // Convert [IMAGE:url] to image tag
    html = html.replace(/\[IMAGE:(.*?)\]/g, (match, url) => {
      return `<div class="my-6 ${imagePosition === 'center' ? 'text-center' : imagePosition === 'right' ? 'text-right' : ''}">
                <img src="${url.trim()}" alt="Article Image" class="${imagePosition === 'center' ? 'mx-auto' : ''} rounded-lg shadow-md" style="max-width: 600px; height: auto; max-height: 400px; object-fit: contain;">
              </div>`
    })
    
    // Convert bilingual caption [CAPTION:en||hi]
    html = html.replace(/\[CAPTION:(.*?)\]\n?/g, (match, captionText) => {
      const [enCaption, hiCaption] = captionText.split("||");
      const caption = previewLanguage === "en" ? enCaption : hiCaption;
      
      if (caption && caption.trim()) {
        return `<p class="${imagePosition === 'center' ? 'text-center' : imagePosition === 'right' ? 'text-right' : ''} text-sm text-gray-500 italic mt-2">${caption}</p>`
      }
      return "";
    });
    
    // Convert special templates with enhanced styling
    const templateStyles = {
      'LEAD PARAGRAPH': 'bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r',
      'KEY FACT': 'bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded-r',
      'QUOTE': 'bg-gray-50 border-l-4 border-gray-400 p-4 my-4 italic rounded-r',
      'IMPACT': 'bg-green-50 border-l-4 border-green-500 p-4 my-4 rounded-r',
      "WHAT'S NEXT": 'bg-purple-50 border-l-4 border-purple-500 p-4 my-4 rounded-r',
      'WARNING': 'bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r'
    }
    
    Object.keys(templateStyles).forEach(key => {
      const regex = new RegExp(`\\[${key}:(.*?)\\]`, 'g')
      html = html.replace(regex, (match, text) => {
        return `<div class="${templateStyles[key as keyof typeof templateStyles]}">
                  <p class="font-bold text-${key === 'LEAD PARAGRAPH' ? 'blue' : key === 'KEY FACT' ? 'yellow' : key === 'QUOTE' ? 'gray' : key === 'IMPACT' ? 'green' : key === 'WARNING' ? 'red' : 'purple'}-700 mb-1">${key.replace('_', ' ')}:</p>
                  <p>${text}</p>
                </div>`
      })
    })
    
    // Convert markdown to HTML
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/__(.*?)__/g, '<u class="underline">$1</u>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-4 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-5 mb-3 text-gray-800">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2 text-gray-700">$1</h3>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 list-disc mb-1">$1</li>')
      .replace(/^1\. (.*$)/gm, '<li class="ml-6 list-decimal mb-1">$1</li>')
      .replace(/> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 my-3 italic text-gray-600">$1</blockquote>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>')
      .replace(/---/g, '<hr class="my-6 border-gray-300">')
    
    return { __html: html };
  };

  const handleSave = async (status: "draft" | "pending" = "draft") => {
    try {
      setSaving(true);

      // Validate required fields
      if (!formData.title.trim()) {
        toast.error("English title is required");
        return;
      }
      if (!formData.content.trim()) {
        toast.error("English content is required");
        return;
      }
      if (!formData.topic.trim()) {
        toast.error("Topic is required");
        return;
      }

      // Update hasHindiTranslation flag
      const hasHindiTranslation = formData.contentHi.trim().length > 0;

      const token = localStorage.getItem("admin-token");
      if (!token) {
        toast.error("Authentication token not found");
        router.push("/admin/login");
        return;
      }

      // Prepare request body according to API schema
      const requestBody = {
        title: formData.title, // String
        titleHi: formData.titleHi, // String
        imageUrl: formData.featuredImageUrl || undefined,
        content: formData.content, // String
        contentHi: formData.contentHi, // String
        topic: formData.topic, // String
        tags: formData.tags,
        status: status,
        originalLanguage: formData.originalLanguage,
        hasHindiTranslation: hasHindiTranslation,
      };

      console.log("Request Body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(`/api/public/opinion/${opinionId}/edit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      toast.success(
        `Opinion ${
          status === "draft" ? "saved as draft" : "updated and submitted for approval"
        } successfully`
      );
      router.push("/admin/opinions");
    } catch (error) {
      console.error("Error updating opinion:", error);
      toast.error("Failed to update opinion");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Toolbar buttons configuration
  const formatToolbarButtons = [
    {
      id: 'bold',
      icon: <Bold className="h-4 w-4" />,
      action: () => toggleFormat('bold'),
      title: "Bold (Ctrl+B)",
      active: formatState.bold,
      shortcut: "Ctrl+B"
    },
    {
      id: 'italic',
      icon: <Italic className="h-4 w-4" />,
      action: () => toggleFormat('italic'),
      title: "Italic (Ctrl+I)",
      active: formatState.italic,
      shortcut: "Ctrl+I"
    },
    {
      id: 'underline',
      icon: <Underline className="h-4 w-4" />,
      action: () => toggleFormat('underline'),
      title: "Underline (Ctrl+U)",
      active: formatState.underline,
      shortcut: "Ctrl+U"
    },
    {
      id: 'link',
      icon: <Link2 className="h-4 w-4" />,
      action: () => {
        const textarea = getActiveTextarea();
        if (!textarea) return;

        textarea.focus();
        const url = prompt("Enter URL:");
        if (url) {
          const text = prompt("Enter link text (optional):") || url;
          insertTextAtCursor(`[${text}](${url})`);
          toast.success("Link inserted");
        }
      },
      title: "Insert Link",
      shortcut: "Ctrl+K"
    },
    {
      id: 'quote',
      icon: <Quote className="h-4 w-4" />,
      action: () => insertTextAtCursor("\n> "),
      title: "Insert Quote",
      shortcut: "Ctrl+Q"
    },
  ];

  const headingButtons = [
    {
      id: 'h1',
      icon: <Heading1 className="h-4 w-4" />,
      action: () => applyHeading('h1'),
      title: "Heading 1",
      active: formatState.heading === 'h1',
      shortcut: "Ctrl+1"
    },
    {
      id: 'h2',
      icon: <Heading2 className="h-4 w-4" />,
      action: () => applyHeading('h2'),
      title: "Heading 2",
      active: formatState.heading === 'h2',
      shortcut: "Ctrl+2"
    },
    {
      id: 'h3',
      icon: <Heading3 className="h-4 w-4" />,
      action: () => applyHeading('h3'),
      title: "Heading 3",
      active: formatState.heading === 'h3',
      shortcut: "Ctrl+3"
    },
  ];

  const listButtons = [
    {
      id: 'ul',
      icon: <List className="h-4 w-4" />,
      action: () => insertTextAtCursor("\n- "),
      title: "Bullet List",
      shortcut: "Ctrl+Shift+U"
    },
    {
      id: 'ol',
      icon: <ListOrdered className="h-4 w-4" />,
      action: () => insertTextAtCursor("\n1. "),
      title: "Numbered List",
      shortcut: "Ctrl+Shift+O"
    },
  ];

  const templateButtons = [
    {
      id: 'lead',
      label: "Lead Paragraph",
      description: "Most important information",
      action: () => insertTemplate('[LEAD PARAGRAPH: Write the most important information here]', "Lead Paragraph"),
      icon: <MessageSquare className="h-3 w-3 mr-1" />,
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      id: 'keyfact',
      label: "Key Fact",
      description: "Important fact or statistic",
      action: () => insertTemplate('[KEY FACT: Important fact or statistic]', "Key Fact"),
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200"
    },
    {
      id: 'quote-template',
      label: "Source Quote",
      description: "Exact quote from source",
      action: () => insertTemplate('[QUOTE: "Exact quote from source" - Source Name]', "Source Quote"),
      icon: <Quote className="h-3 w-3 mr-1" />,
      color: "bg-gray-100 text-gray-800 border-gray-200"
    },
    {
      id: 'impact',
      label: "Impact",
      description: "How this affects readers",
      action: () => insertTemplate('[IMPACT: How this affects readers]', "Impact"),
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
      color: "bg-green-100 text-green-800 border-green-200"
    },
    {
      id: 'next',
      label: "What's Next",
      description: "Future developments to watch",
      action: () => insertTemplate("[WHAT'S NEXT: Future developments to watch]", "What's Next"),
      icon: <Maximize2 className="h-3 w-3 mr-1" />,
      color: "bg-purple-100 text-purple-800 border-purple-200"
    },
    {
      id: 'warning',
      label: "Warning",
      description: "Important caution or disclaimer",
      action: () => insertTemplate('[WARNING: Important caution or disclaimer]', "Warning"),
      icon: <AlertTriangle className="h-3 w-3 mr-1" />,
      color: "bg-red-100 text-red-800 border-red-200"
    },
    {
      id: 'divider',
      label: "Divider",
      description: "Horizontal line",
      action: () => insertTextAtCursor("\n---\n"),
      icon: <Minus className="h-3 w-3 mr-1" />,
      color: "bg-gray-100 text-gray-800 border-gray-200"
    },
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const textarea = getActiveTextarea();
      if (!textarea || !document.activeElement || !(document.activeElement === textarea)) return;

      const isCtrl = e.ctrlKey || e.metaKey;
      
      if (isCtrl) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            toggleFormat("bold");
            break;
          case "i":
            e.preventDefault();
            toggleFormat("italic");
            break;
          case "u":
            e.preventDefault();
            toggleFormat("underline");
            break;
          case "k":
            e.preventDefault();
            formatToolbarButtons.find((b) => b.id === "link")?.action();
            break;
          case "q":
            e.preventDefault();
            formatToolbarButtons.find((b) => b.id === "quote")?.action();
            break;
          case "1":
            e.preventDefault();
            applyHeading("h1");
            break;
          case "2":
            e.preventDefault();
            applyHeading("h2");
            break;
          case "3":
            e.preventDefault();
            applyHeading("h3");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeLanguage, formData.content, formData.contentHi]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/opinions")}
                className="transition-smooth"
                disabled={saving}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Edit Opinion Article
                </h1>
                <p className="text-muted-foreground mt-1">
                  Editing: {formData.title || "Untitled Article"}
                </p>
                {opinion && (
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <Badge variant="outline" className="text-xs">
                      Created: {new Date(opinion.createdAt).toLocaleDateString()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ID: {opinion._id.substring(0, 8)}...
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Toggle
                pressed={showPreview}
                onPressedChange={() => setShowPreview(!showPreview)}
                variant="outline"
                size="sm"
                className="h-8"
              >
                {showPreview ? (
                  <Type className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {showPreview ? 'Edit' : 'Preview'}
              </Toggle>
              <Button
                variant="outline"
                onClick={() => handleSave("draft")}
                className="transition-smooth"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                {saving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                onClick={() => handleSave("pending")}
                className="bg-primary hover:bg-primary/90 transition-smooth"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4 mr-1" />
                )}
                {saving ? "Updating..." : "Update & Submit"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Article Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Language Tabs */}
                  <Tabs value={activeLanguage} onValueChange={(v: any) => setActiveLanguage(v)}>
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="en" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        English
                      </TabsTrigger>
                      <TabsTrigger value="hi" className="flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        Hindi
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="en" className="space-y-4">
                      <div>
                        <Label htmlFor="title-en">Title (English) *</Label>
                        <Input
                          id="title-en"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          placeholder="Enter article title in English..."
                          className="mt-2"
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <Label htmlFor="topic-en">Topic *</Label>
                        <Input
                          id="topic-en"
                          value={formData.topic}
                          onChange={(e) => handleInputChange("topic", e.target.value)}
                          placeholder="e.g., Environment, Technology, Politics"
                          className="mt-2"
                          disabled={saving}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="hi" className="space-y-4">
                      <div>
                        <Label htmlFor="title-hi">Title (Hindi)</Label>
                        <Input
                          id="title-hi"
                          value={formData.titleHi}
                          onChange={(e) => handleInputChange("titleHi", e.target.value)}
                          placeholder="हिंदी में शीर्षक लिखें..."
                          className="mt-2"
                          disabled={saving}
                        />
                      </div>

                      <div>
                        <Label htmlFor="topic-hi">Topic (already set above)</Label>
                        <Input
                          id="topic-hi"
                          value={formData.topic}
                          disabled
                          placeholder="Topic is set in English field"
                          className="mt-2 bg-gray-50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Note: Topic is common for both languages
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Editor Toolbar */}
                  <div className="border rounded-lg overflow-hidden">
                    {/* Main Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
                      {/* Text Formatting */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {formatToolbarButtons.map((button) => (
                          <Tooltip key={button.id}>
                            <TooltipTrigger asChild>
                              <Toggle
                                pressed={button.active || false}
                                onPressedChange={button.action}
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                aria-label={button.title}
                              >
                                {button.icon}
                              </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{button.title}</p>
                              {button.shortcut && <p className="text-xs text-muted-foreground">{button.shortcut}</p>}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>

                      <Separator orientation="vertical" className="h-6" />

                      {/* Headings */}
                      <div className="flex items-center gap-1">
                        {headingButtons.map((button) => (
                          <Tooltip key={button.id}>
                            <TooltipTrigger asChild>
                              <Toggle
                                pressed={button.active || false}
                                onPressedChange={button.action}
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                aria-label={button.title}
                              >
                                {button.icon}
                              </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{button.title}</p>
                              {button.shortcut && <p className="text-xs text-muted-foreground">{button.shortcut}</p>}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>

                      <Separator orientation="vertical" className="h-6" />

                      {/* Lists */}
                      <div className="flex items-center gap-1">
                        {listButtons.map((button) => (
                          <Tooltip key={button.id}>
                            <TooltipTrigger asChild>
                              <Toggle
                                onPressedChange={button.action}
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                aria-label={button.title}
                              >
                                {button.icon}
                              </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{button.title}</p>
                              {button.shortcut && <p className="text-xs text-muted-foreground">{button.shortcut}</p>}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>

                      <Separator orientation="vertical" className="h-6" />

                      {/* Image */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsImageDialogOpen(true)}
                            className="h-8 w-8 p-0"
                            disabled={saving}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert Image</p>
                          <p className="text-xs text-muted-foreground">Add images with bilingual captions</p>
                        </TooltipContent>
                      </Tooltip>

                      <Separator orientation="vertical" className="h-6" />

                      {/* Templates Dropdown */}
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 px-3">
                                <Type className="h-4 w-4 mr-2" />
                                Templates
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Article Templates</p>
                            <p className="text-xs text-muted-foreground">Pre-formatted blocks for writing</p>
                          </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="start" className="w-64">
                          {templateButtons.map((template) => (
                            <DropdownMenuItem
                              key={template.id}
                              onClick={() => template.action()}
                              className="cursor-pointer"
                            >
                              <div className="flex items-start gap-2 w-full">
                                <div className={`p-1 rounded ${template.color}`}>
                                  {template.icon}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{template.label}</p>
                                  <p className="text-xs text-gray-500">{template.description}</p>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Template Quick Bar */}
                    <div className="border-b p-2 bg-gray-50">
                      <div className="flex flex-wrap gap-1">
                        {templateButtons.slice(0, 5).map((template) => (
                          <Badge
                            key={template.id}
                            variant="secondary"
                            className={`cursor-pointer hover:bg-gray-200 text-xs px-2 py-1 ${template.color}`}
                            onClick={template.action}
                          >
                            {template.icon}
                            <span className="ml-1">{template.label}</span>
                          </Badge>
                        ))}
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-200 text-xs"
                          onClick={() => {
                            setIsImageDialogOpen(true);
                            setActiveImageTab("gallery");
                          }}
                        >
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Gallery ({uploadedImages.length})
                        </Badge>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="relative">
                      {showPreview ? (
                        // Preview Mode
                        <div className="min-h-[400px] max-h-[600px] overflow-y-auto p-6">
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {previewLanguage === "en" ? "English" : "Hindi"} Preview
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPreviewLanguage(previewLanguage === "en" ? "hi" : "en")}
                              >
                                {previewLanguage === "en" ? "View Hindi" : "View English"}
                              </Button>
                            </div>
                          </div>
                          <div className="prose prose-lg max-w-none">
                            <div dangerouslySetInnerHTML={renderPreview()} />
                          </div>
                        </div>
                      ) : (
                        // Edit Mode
                        <>
                          {activeLanguage === "en" ? (
                            <Textarea
                              ref={textareaRefEn}
                              value={formData.content}
                              onChange={(e) => handleInputChange("content", e.target.value)}
                              placeholder="Write your article content in English..."
                              className="min-h-[400px] w-full resize-y border-0 bg-background p-4 focus:outline-none focus:ring-0 text-base font-mono text-gray-800"
                              spellCheck="true"
                              rows={15}
                              onSelect={updateFormatState}
                              onClick={updateFormatState}
                              onKeyUp={updateFormatState}
                              onMouseUp={updateFormatState}
                              disabled={saving}
                            />
                          ) : (
                            <Textarea
                              ref={textareaRefHi}
                              value={formData.contentHi}
                              onChange={(e) => handleInputChange("contentHi", e.target.value)}
                              placeholder="हिंदी में अपनी सामग्री लिखें..."
                              className="min-h-[400px] w-full resize-y border-0 bg-background p-4 focus:outline-none focus:ring-0 text-base font-mono text-gray-800"
                              spellCheck="true"
                              rows={15}
                              onSelect={updateFormatState}
                              onClick={updateFormatState}
                              onKeyUp={updateFormatState}
                              onMouseUp={updateFormatState}
                              disabled={saving}
                            />
                          )}
                          
                          {/* Editor Tips */}
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="secondary" className="text-xs font-normal">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Select text and click buttons to format
                            </Badge>
                          </div>
                          
                          {/* Stats Bar */}
                          <div className="absolute bottom-2 right-2 flex items-center gap-4">
                            <div className="text-xs text-gray-500 bg-background/80 px-2 py-1 rounded">
                              <span className="font-medium mr-2">Stats:</span>
                              <span className="mr-3">
                                {getActiveContent().split(/\s+/).filter(word => word.length > 0).length} words
                              </span>
                              <span className="mr-3">
                                {getActiveContent().split("\n").filter(line => line.trim().length > 0).length} paragraphs
                              </span>
                              <span>
                                {uploadedImages.length} images
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publishing Options */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "draft" | "pending") =>
                        handleInputChange("status", value)
                      }
                      disabled={saving}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Draft: Save privately | Pending: Submit for admin approval
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="original-language">Original Language</Label>
                    <Select
                      value={formData.originalLanguage}
                      onValueChange={(value: 'en' | 'hi') =>
                        handleInputChange("originalLanguage", value)
                      }
                      disabled={saving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Language in which article was originally written
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="has-hindi-translation"
                      checked={formData.contentHi.trim().length > 0}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          // Clear Hindi content
                          handleInputChange('contentHi', '');
                          handleInputChange('titleHi', '');
                        }
                      }}
                      disabled={saving}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="has-hindi-translation" className="text-sm">
                      Has Hindi Translation
                    </Label>
                  </div>

                  {opinion && opinion.status !== "draft" && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Current Status:</span>
                        <Badge className={opinion.status === "approved" ? "bg-green-100 text-green-800" : 
                                          opinion.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                          "bg-red-100 text-red-800"}>
                          {opinion.status}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="featuredImageUrl">Image URL</Label>
                    <Input
                      id="featuredImageUrl"
                      value={formData.featuredImageUrl}
                      onChange={(e) =>
                        handleInputChange("featuredImageUrl", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                      className="mt-2"
                      disabled={saving}
                    />
                  </div>

                  {formData.featuredImageUrl && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <img
                        src={formData.featuredImageUrl}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full transition-smooth"
                    disabled={saving}
                    onClick={() => {
                      setIsImageDialogOpen(true);
                      setActiveImageTab("upload");
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload to Cloudinary
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Upload to Cloudinary for reliable image hosting
                  </p>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyPress={handleKeyPress}
                      disabled={saving}
                    />
                    <Button
                      onClick={addTag}
                      variant="outline"
                      size="sm"
                      disabled={saving}
                    >
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => !saving && removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  {formData.tags.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add tags to categorize your opinion
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Help */}
              <Card className="border-border bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Multilingual Writing Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-blue-700">Start with a strong headline in both languages</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-blue-700">Use "Lead Paragraph" for important info</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-blue-700">Add images with bilingual captions</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-blue-700">Preview both language versions</p>
                  </div>
                </CardContent>
              </Card>

              {/* Image Gallery Preview */}
              {uploadedImages.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Recent Images</span>
                      <Badge variant="outline">{uploadedImages.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.slice(-4).reverse().map((img, index) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.url}
                            alt="Gallery"
                            className="w-full h-20 object-cover rounded border"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-6 w-6"
                              onClick={() => copyImageUrl(img.url)}
                              title="Copy URL"
                            >
                              {copiedUrl === img.url ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-6 w-6"
                              onClick={() => {
                                handleInputChange("featuredImageUrl", img.url);
                                toast.success("Set as featured image");
                              }}
                              title="Set as Featured"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-xs"
                      onClick={() => {
                        setIsImageDialogOpen(true);
                        setActiveImageTab("gallery");
                      }}
                    >
                      View All Images
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Image Dialog */}
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Insert & Manage Images</DialogTitle>
              </DialogHeader>

              <Tabs value={activeImageTab} onValueChange={(v: any) => setActiveImageTab(v)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="gallery">
                    Gallery
                    {uploadedImages.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">
                        {uploadedImages.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                
                {/* Upload Tab */}
                <TabsContent value="upload" className="space-y-4 py-4">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <Label htmlFor="editor-image-upload" className="cursor-pointer">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Drag & drop or click to upload</p>
                          <p className="text-xs text-gray-500">
                            Supports: JPG, PNG, WebP, GIF, SVG • Max 5MB
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="mr-2 h-4 w-4" />
                            )}
                            {isUploading ? 'Uploading to Cloudinary...' : 'Choose Image'}
                          </Button>
                        </div>
                      </Label>
                      <input
                        id="editor-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Cloudinary Upload</p>
                          <p className="text-xs text-blue-600">
                            Images are uploaded to Cloudinary for reliable hosting. 
                            Make sure your Cloudinary credentials are configured in .env.local
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cloudinary Configuration Help */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Configuration Required</p>
                          <p className="text-xs text-yellow-600">
                            Add these to your .env.local file:
                            <code className="block mt-1 p-1 bg-yellow-100 rounded text-xs">
                              NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name<br/>
                              NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
                            </code>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* URL Tab */}
                <TabsContent value="url" className="space-y-4 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Enter direct image URL (must be publicly accessible)
                      </p>
                    </div>

                    {/* Image Preview */}
                    {imageUrl && (
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex flex-col items-center">
                            <img
                              src={imageUrl}
                              alt="Preview"
                              className="max-w-full h-auto rounded"
                              style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'contain' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="flex flex-col items-center justify-center h-48 w-full bg-gray-100 rounded">
                                      <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
                                      <p class="text-sm font-medium text-gray-700">Failed to load image</p>
                                      <p class="text-xs text-gray-500">Please check the URL</p>
                                    </div>
                                  `;
                                }
                              }}
                            />
                            {(imageCaption.en || imageCaption.hi) && (
                              <p className="text-xs text-gray-500 mt-2 italic text-center">
                                {activeLanguage === "en" ? imageCaption.en : imageCaption.hi}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Details - Bilingual */}
                    <div className="grid gap-4">
                      <Tabs defaultValue="en" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="en">English Caption</TabsTrigger>
                          <TabsTrigger value="hi">Hindi Caption</TabsTrigger>
                        </TabsList>
                        <TabsContent value="en" className="space-y-2">
                          <Label htmlFor="image-caption-en">Caption (English)</Label>
                          <Input
                            id="image-caption-en"
                            placeholder="Describe what's in the image"
                            value={imageCaption.en}
                            onChange={(e) => setImageCaption(prev => ({ ...prev, en: e.target.value }))}
                          />
                        </TabsContent>
                        <TabsContent value="hi" className="space-y-2">
                          <Label htmlFor="image-caption-hi">Caption (हिंदी)</Label>
                          <Input
                            id="image-caption-hi"
                            placeholder="छवि का वर्णन करें"
                            value={imageCaption.hi}
                            onChange={(e) => setImageCaption(prev => ({ ...prev, hi: e.target.value }))}
                          />
                        </TabsContent>
                      </Tabs>
                      
                      <div className="space-y-2">
                        <Label>Image Position</Label>
                        <Select
                          value={imagePosition}
                          onValueChange={(value: any) => setImagePosition(value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center (Recommended)</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Gallery Tab */}
                <TabsContent value="gallery" className="space-y-4 py-4">
                  {uploadedImages.length === 0 ? (
                    <div className="text-center py-8">
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-sm font-medium text-gray-700">No images uploaded yet</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload images or enter URLs to see them here
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setActiveImageTab("upload")}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Images
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">
                          Uploaded Images ({uploadedImages.length})
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearGallery}
                            className="h-8"
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Clear All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveImageTab("upload")}
                            className="h-8"
                          >
                            <Upload className="h-3 w-3 mr-2" />
                            Upload More
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {uploadedImages.map((img, index) => (
                          <div
                            key={img.id}
                            className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow group"
                          >
                            <div className="relative aspect-video bg-gray-100">
                              <img
                                src={img.url}
                                alt={img.caption.en || 'Uploaded image'}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="h-6 w-6 bg-white/90 hover:bg-white"
                                  onClick={() => window.open(img.url, '_blank')}
                                  title="Preview"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  className="h-6 w-6 bg-white/90 hover:bg-white"
                                  onClick={() => deleteImageFromGallery(index)}
                                  title="Delete"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="p-2 space-y-1">
                              <div className="flex justify-between items-center">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2"
                                  onClick={() => insertImageFromGallery(img)}
                                  title="Insert into article"
                                >
                                  <ImageIcon className="h-3 w-3 mr-1" />
                                  Insert
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => copyImageUrl(img.url)}
                                  title="Copy URL"
                                >
                                  {copiedUrl === img.url ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                              {(img.caption.en || img.caption.hi) && (
                                <p className="text-xs text-gray-600 truncate" title={img.caption.en}>
                                  {activeLanguage === "en" ? img.caption.en : img.caption.hi}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-xs text-gray-500 text-center">
                        Click "Insert" to add image to article, or "Copy" to copy URL
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsImageDialogOpen(false);
                    setImageUrl("");
                    setImageAlt({ en: "", hi: "" });
                    setImageCaption({ en: "", hi: "" });
                    setActiveImageTab("upload");
                  }}
                >
                  Cancel
                </Button>
                {activeImageTab === 'url' && (
                  <Button
                    onClick={insertImage}
                    disabled={!imageUrl.trim()}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Insert Image
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Fixed Bottom Bar for Mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave("draft")}
                className="flex-1 transition-smooth"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                {saving ? "Saving..." : "Draft"}
              </Button>
              <Button
                onClick={() => handleSave("pending")}
                className="flex-1 bg-primary hover:bg-primary/90 transition-smooth"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4 mr-1" />
                )}
                {saving ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}