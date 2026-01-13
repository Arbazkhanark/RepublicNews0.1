"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Image as ImageIcon,
  Link,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  X,
  Underline,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Minus,
  Maximize2,
  Eye,
  Code,
  Palette,
  ExternalLink,
  Trash2,
  Download,
  Copy,
  FileText,
  Check,
  AlertTriangle,
  Globe,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface MultilingualRichTextEditorProps {
  content: { en: string; hi: string };
  onChange: (content: { en: string; hi: string }) => void;
  placeholder?: { en: string; hi: string };
  activeLanguage: "en" | "hi";
  syncTemplates?: boolean;
  onLanguageChange?: (language: "en" | "hi") => void;
}

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  heading: "h1" | "h2" | "h3" | "normal" | null;
  alignment: "left" | "center" | "right" | "justify" | null;
}

interface UploadedImage {
  url: string;
  caption: { en: string; hi: string };
  alt: { en: string; hi: string };
  id: string;
}

export function MultilingualRichTextEditor({
  content,
  onChange,
  placeholder = { en: "Write your content here...", hi: "अपनी सामग्री यहाँ लिखें..." },
  activeLanguage,
  syncTemplates = true,
  onLanguageChange,
}: MultilingualRichTextEditorProps) {
  const textareaRefEn = useRef<HTMLTextAreaElement>(null);
  const textareaRefHi = useRef<HTMLTextAreaElement>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState({ en: "", hi: "" });
  const [imageCaption, setImageCaption] = useState({ en: "", hi: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [imagePosition, setImagePosition] = useState<"left" | "center" | "right">("center");
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    heading: null,
    alignment: null,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [activeImageTab, setActiveImageTab] = useState<"upload" | "url" | "gallery">("upload");
  const [previewLanguage, setPreviewLanguage] = useState<"en" | "hi">("en");
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to get active textarea
  const getActiveTextarea = () => {
    return activeLanguage === "en" ? textareaRefEn.current : textareaRefHi.current;
  };

  // Helper function to get active content
  const getActiveContent = () => {
    return activeLanguage === "en" ? content.en : content.hi;
  };

  const handleContentChange = (value: string) => {
    onChange({
      ...content,
      [activeLanguage]: value,
    });
  };

  // Function to update text selection state
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

  const insertTextAtCursor = (text: string) => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    textarea.focus();
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = getActiveContent();
    
    const newText = currentContent.substring(0, start) + text + currentContent.substring(end);

    handleContentChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
      updateFormatState();
    }, 10);
  };

  const toggleFormat = (format: "bold" | "italic" | "underline") => {
    const textarea = getActiveTextarea();
    if (!textarea) {
      console.error("No textarea found for active language:", activeLanguage);
      return;
    }

    textarea.focus();
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = getActiveContent();
    
    console.log("Toggle format:", format, "Selection:", { start, end });
    
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

      handleContentChange(newText);
      
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

  const applyHeading = (level: "h1" | "h2" | "h3") => {
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
    
    handleContentChange(newText);
    
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
    
    handleContentChange(newText);
    
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
    
    // If sync is enabled, insert in other language too
    if (syncTemplates && activeLanguage === "en") {
      // Insert empty template in Hindi
      const emptyTemplate = template.replace(/:(.*?)\]/, ":]");
      onChange({
        ...content,
        hi: content.hi + `\n${emptyTemplate}\n`,
      });
    }
    
    toast.success(`${templateName} template inserted`);
  };

  const insertImage = () => {
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL or upload an image");
      return;
    }

    const textarea = getActiveTextarea();
    if (!textarea) return;

    textarea.focus();
    
    let imageHtml = `\n[IMAGE:${imageUrl}]\n`;
    
    // Add caption in both languages
    if (imageCaption.en.trim() || imageCaption.hi.trim()) {
      imageHtml += `\n[CAPTION:${imageCaption.en}||${imageCaption.hi}]\n`;
    }

    insertTextAtCursor(imageHtml);
    
    // Add to uploaded images
    const newImage: UploadedImage = {
      url: imageUrl,
      caption: imageCaption,
      alt: imageAlt,
      id: `image-${Date.now()}`,
    };

    setUploadedImages((prev) => [...prev, newImage]);

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
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP, GIF)");
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
      
      // Mock upload - replace with actual Cloudinary upload
      const mockUpload = async (file: File) => {
        return new Promise<{ url: string }>((resolve) => {
          setTimeout(() => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({ url: e.target?.result as string });
            };
            reader.readAsDataURL(file);
          }, 1000);
        });
      };
      
      const { url } = await mockUpload(file);
      setImageUrl(url);
      setActiveImageTab("url");
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const deleteImage = (index: number) => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    textarea.focus();
    
    const lines = getActiveContent().split("\n");
    let deletedCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("[IMAGE:")) {
        if (deletedCount === index) {
          // Remove image line
          lines.splice(i, 1);
          // Remove caption line if exists
          if (i < lines.length && lines[i].startsWith("[CAPTION:")) {
            lines.splice(i, 1);
          }
          break;
        }
        deletedCount++;
      }
    }
    
    handleContentChange(lines.join("\n"));
    
    // Remove from uploaded images
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    
    toast.success("Image deleted successfully");
    setIsDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  const deleteLastImage = () => {
    if (uploadedImages.length === 0) {
      toast.error("No images to delete");
      return;
    }
    
    deleteImage(uploadedImages.length - 1);
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied to clipboard");
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Image download started");
  };

  const previewImage = (url: string) => {
    window.open(url, "_blank");
  };

  const formatToolbarButtons = [
    {
      id: "bold",
      icon: <Bold className="h-4 w-4" />,
      action: () => toggleFormat("bold"),
      title: "Bold (Ctrl+B)",
      active: formatState.bold,
      shortcut: "Ctrl+B",
    },
    {
      id: "italic",
      icon: <Italic className="h-4 w-4" />,
      action: () => toggleFormat("italic"),
      title: "Italic (Ctrl+I)",
      active: formatState.italic,
      shortcut: "Ctrl+I",
    },
    {
      id: "underline",
      icon: <Underline className="h-4 w-4" />,
      action: () => toggleFormat("underline"),
      title: "Underline (Ctrl+U)",
      active: formatState.underline,
      shortcut: "Ctrl+U",
    },
    {
      id: "link",
      icon: <Link className="h-4 w-4" />,
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
      shortcut: "Ctrl+K",
    },
    {
      id: "quote",
      icon: <Quote className="h-4 w-4" />,
      action: () => insertTextAtCursor("\n> "),
      title: "Insert Quote",
      shortcut: "Ctrl+Q",
    },
    {
      id: "h1",
      icon: <Heading1 className="h-4 w-4" />,
      action: () => applyHeading("h1"),
      title: "Heading 1",
      active: formatState.heading === "h1",
      shortcut: "Ctrl+1",
    },
    {
      id: "h2",
      icon: <Heading2 className="h-4 w-4" />,
      action: () => applyHeading("h2"),
      title: "Heading 2",
      active: formatState.heading === "h2",
      shortcut: "Ctrl+2",
    },
    {
      id: "h3",
      icon: <Heading3 className="h-4 w-4" />,
      action: () => applyHeading("h3"),
      title: "Heading 3",
      active: formatState.heading === "h3",
      shortcut: "Ctrl+3",
    },
    {
      id: "ul",
      icon: <List className="h-4 w-4" />,
      action: () => insertTextAtCursor("\n- "),
      title: "Bullet List",
      shortcut: "Ctrl+Shift+U",
    },
    {
      id: "ol",
      icon: <ListOrdered className="h-4 w-4" />,
      action: () => insertTextAtCursor("\n1. "),
      title: "Numbered List",
      shortcut: "Ctrl+Shift+O",
    },
  ];

  const templateButtons = [
    {
      id: "lead",
      label: "Lead Paragraph",
      description: "Most important information",
      action: () =>
        insertTemplate(
          "[LEAD PARAGRAPH: Write the most important information here]",
          "Lead Paragraph"
        ),
      icon: <MessageSquare className="h-3 w-3 mr-1" />,
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      id: "keyfact",
      label: "Key Fact",
      description: "Important fact or statistic",
      action: () => insertTemplate("[KEY FACT: Important fact or statistic]", "Key Fact"),
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      id: "quote-template",
      label: "Source Quote",
      description: "Exact quote from source",
      action: () =>
        insertTemplate('[QUOTE: "Exact quote from source" - Source Name]', "Source Quote"),
      icon: <Quote className="h-3 w-3 mr-1" />,
      color: "bg-gray-100 text-gray-800 border-gray-200",
    },
    {
      id: "impact",
      label: "Impact",
      description: "How this affects readers",
      action: () => insertTemplate("[IMPACT: How this affects readers]", "Impact"),
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      id: "next",
      label: "What's Next",
      description: "Future developments to watch",
      action: () => insertTemplate("[WHAT'S NEXT: Future developments to watch]", "What's Next"),
      icon: <Maximize2 className="h-3 w-3 mr-1" />,
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      id: "warning",
      label: "Warning",
      description: "Important caution or disclaimer",
      action: () => insertTemplate("[WARNING: Important caution or disclaimer]", "Warning"),
      icon: <AlertTriangle className="h-3 w-3 mr-1" />,
      color: "bg-red-100 text-red-800 border-red-200",
    },
    {
      id: "divider",
      label: "Divider",
      description: "Horizontal line",
      action: () => insertTextAtCursor("\n---\n"),
      icon: <Minus className="h-3 w-3 mr-1" />,
      color: "bg-gray-100 text-gray-800 border-gray-200",
    },
  ];

  const renderPreview = () => {
    const previewContent = previewLanguage === "en" ? content.en : content.hi;
    let html = previewContent;

    // Convert [IMAGE:url] to image tag
    html = html.replace(/\[IMAGE:(.*?)\]/g, (match, url) => {
      return `<div class="my-6 ${
        imagePosition === "center" ? "text-center" : imagePosition === "right" ? "text-right" : ""
      }">
                <img src="${url.trim()}" alt="Article Image" class="${
        imagePosition === "center" ? "mx-auto" : ""
      } rounded-lg shadow-md" style="max-width: 600px; height: auto; max-height: 400px; object-fit: contain;">
              </div>`;
    });

    // Convert bilingual caption [CAPTION:en||hi]
    html = html.replace(/\[CAPTION:(.*?)\]\n?/g, (match, captionText) => {
      const [enCaption, hiCaption] = captionText.split("||");
      const caption = previewLanguage === "en" ? enCaption : hiCaption;
      
      if (caption && caption.trim()) {
        return `<p class="${
          imagePosition === "center" ? "text-center" : imagePosition === "right" ? "text-right" : ""
        } text-sm text-gray-500 italic mt-2">${caption}</p>`;
      }
      return "";
    });

    // Convert templates
    const templateStyles = {
      "LEAD PARAGRAPH": "bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r",
      "KEY FACT": "bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded-r",
      QUOTE: "bg-gray-50 border-l-4 border-gray-400 p-4 my-4 italic rounded-r",
      IMPACT: "bg-green-50 border-l-4 border-green-500 p-4 my-4 rounded-r",
      "WHAT'S NEXT": "bg-purple-50 border-l-4 border-purple-500 p-4 my-4 rounded-r",
      WARNING: "bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r",
    };

    Object.keys(templateStyles).forEach((key) => {
      const regex = new RegExp(`\\[${key}:(.*?)\\]`, "g");
      html = html.replace(regex, (match, text) => {
        return `<div class="${templateStyles[key as keyof typeof templateStyles]}">
                  <p class="font-bold text-${
                    key === "LEAD PARAGRAPH"
                      ? "blue"
                      : key === "KEY FACT"
                      ? "yellow"
                      : key === "QUOTE"
                      ? "gray"
                      : key === "IMPACT"
                      ? "green"
                      : key === "WARNING"
                      ? "red"
                      : "purple"
                  }-700 mb-1">${key.replace("_", " ")}:</p>
                  <p>${text}</p>
                </div>`;
      });
    });

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
      .replace(
        /> (.*$)/gm,
        '<blockquote class="border-l-4 border-gray-300 pl-4 my-3 italic text-gray-600">$1</blockquote>'
      )
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      .replace(/\n/g, "<br>")
      .replace(/---/g, '<hr class="my-6 border-gray-300">');

    return { __html: html };
  };

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
  }, [activeLanguage, content]);

  // Handle text selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      updateFormatState();
    };

    const textareaEn = textareaRefEn.current;
    const textareaHi = textareaRefHi.current;

    if (textareaEn) {
      textareaEn.addEventListener("select", handleSelectionChange);
      textareaEn.addEventListener("click", handleSelectionChange);
      textareaEn.addEventListener("keyup", handleSelectionChange);
      textareaEn.addEventListener("mouseup", handleSelectionChange);
    }

    if (textareaHi) {
      textareaHi.addEventListener("select", handleSelectionChange);
      textareaHi.addEventListener("click", handleSelectionChange);
      textareaHi.addEventListener("keyup", handleSelectionChange);
      textareaHi.addEventListener("mouseup", handleSelectionChange);
    }

    return () => {
      if (textareaEn) {
        textareaEn.removeEventListener("select", handleSelectionChange);
        textareaEn.removeEventListener("click", handleSelectionChange);
        textareaEn.removeEventListener("keyup", handleSelectionChange);
        textareaEn.removeEventListener("mouseup", handleSelectionChange);
      }
      if (textareaHi) {
        textareaHi.removeEventListener("select", handleSelectionChange);
        textareaHi.removeEventListener("click", handleSelectionChange);
        textareaHi.removeEventListener("keyup", handleSelectionChange);
        textareaHi.removeEventListener("mouseup", handleSelectionChange);
      }
    };
  }, [activeLanguage]);

  // Initialize when component mounts
  useEffect(() => {
    if (!isInitialized) {
      const textarea = getActiveTextarea();
      if (textarea) {
        textarea.focus();
        setIsInitialized(true);
      }
    }
  }, [activeLanguage, isInitialized]);

  // Extract uploaded images from content
  useEffect(() => {
    const images: UploadedImage[] = [];
    const lines = getActiveContent().split("\n");
    
    lines.forEach((line, index) => {
      if (line.startsWith("[IMAGE:")) {
        const url = line.replace("[IMAGE:", "").replace("]", "").trim();
        let enCaption = "";
        let hiCaption = "";
        
        // Check next line for bilingual caption
        if (index + 1 < lines.length && lines[index + 1].startsWith("[CAPTION:")) {
          const captionText = lines[index + 1].replace("[CAPTION:", "").replace("]", "").trim();
          const [en, hi] = captionText.split("||");
          enCaption = en || "";
          hiCaption = hi || "";
        }
        
        images.push({
          url,
          caption: { en: enCaption, hi: hiCaption },
          alt: { en: "", hi: "" },
          id: `image-${index}-${Date.now()}`,
        });
      }
    });
    
    setUploadedImages(images);
  }, [activeLanguage, content]);

  return (
    <TooltipProvider>
      <div className="border rounded-lg overflow-hidden bg-background">
        {/* Language Tabs */}
        <div className="border-b">
          <Tabs value={activeLanguage} onValueChange={(v: any) => {
            onLanguageChange?.(v);
            // Focus the textarea when language changes
            setTimeout(() => {
              const textarea = v === "en" ? textareaRefEn.current : textareaRefHi.current;
              if (textarea) {
                textarea.focus();
                updateFormatState();
              }
            }, 10);
          }}>
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
          </Tabs>
        </div>

        {/* Main Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
          <div className="flex items-center gap-1 flex-wrap">
            {formatToolbarButtons.map((button) => (
              <Tooltip key={button.id}>
                <TooltipTrigger asChild>
                  <Toggle
                    pressed={button.active || false}
                    onPressedChange={(pressed) => {
                      button.action();
                    }}
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
          
          {/* Image Button */}
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => {
                    const textarea = getActiveTextarea();
                    if (textarea) textarea.focus();
                  }}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Image
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Insert Image</p>
                <p className="text-xs text-muted-foreground">Click to insert or manage images</p>
              </TooltipContent>
            </Tooltip>
            
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Insert & Manage Images</DialogTitle>
              </DialogHeader>
              
              <Tabs value={activeImageTab} onValueChange={(v: any) => setActiveImageTab(v)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upload">Upload New</TabsTrigger>
                  <TabsTrigger value="url">Enter URL</TabsTrigger>
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
                            Supports JPG, PNG, WebP, GIF • Max 5MB
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
                            Choose Image
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
                          <p className="text-sm font-medium text-blue-800">Recommended Image Size</p>
                          <p className="text-xs text-blue-600">
                            For optimal display: 1200×630 pixels (Facebook/Twitter) or 600×400 pixels (Article)
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
                              style={{ maxWidth: "300px", maxHeight: "200px", objectFit: "contain" }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
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
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">
                          Uploaded Images ({uploadedImages.length})
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={deleteLastImage}
                          className="h-8"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete Last
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {uploadedImages.map((img, index) => (
                          <div
                            key={img.id}
                            className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                          >
                            <div className="relative aspect-video bg-gray-100">
                              <img
                                src={img.url}
                                alt={img.caption.en || "Uploaded image"}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-1 right-1 flex gap-1">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="h-6 w-6 bg-white/90 hover:bg-white"
                                  onClick={() => previewImage(img.url)}
                                  title="Preview"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  className="h-6 w-6 bg-white/90 hover:bg-white"
                                  onClick={() => {
                                    setImageToDelete(img.url);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  title="Delete"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="p-2 space-y-1">
                              {(img.caption.en || img.caption.hi) && (
                                <p className="text-xs text-gray-600 truncate" title={img.caption.en}>
                                  {activeLanguage === "en" ? img.caption.en : img.caption.hi}
                                </p>
                              )}
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => copyImageUrl(img.url)}
                                  title="Copy URL"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => downloadImage(img.url, `image-${index + 1}.jpg`)}
                                  title="Download"
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Click on any image to insert it at cursor position
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
                {activeImageTab === "url" && (
                  <Button onClick={insertImage} disabled={!imageUrl.trim()}>
                    <Check className="h-4 w-4 mr-2" />
                    Insert Image
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Separator orientation="vertical" className="h-6" />

          {/* Templates Dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
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

          <Separator orientation="vertical" className="h-6" />

          {/* Preview Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={showPreview}
                onPressedChange={() => {
                  setShowPreview(!showPreview);
                  if (!showPreview) {
                    // When switching to preview, focus might be lost
                    setTimeout(() => {
                      const textarea = getActiveTextarea();
                      if (textarea && !showPreview) {
                        textarea.focus();
                      }
                    }, 10);
                  }
                }}
                variant="outline"
                size="sm"
                className="h-8 px-3"
              >
                {showPreview ? (
                  <FileText className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {showPreview ? "Edit" : "Preview"}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showPreview ? "Switch to edit mode" : "Preview final article"}</p>
              <p className="text-xs text-muted-foreground">
                {showPreview ? "Make changes to content" : "See how it will look to readers"}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Template Quick Bar */}
        <div className="border-b p-2 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">Quick Templates:</span>
            <div className="flex flex-wrap gap-1">
              {templateButtons.slice(0, 5).map((template) => (
                <Badge
                  key={template.id}
                  variant="secondary"
                  className={`cursor-pointer hover:bg-gray-200 text-xs px-2 py-1 ${template.color}`}
                  onClick={() => {
                    const textarea = getActiveTextarea();
                    if (textarea) textarea.focus();
                    template.action();
                  }}
                >
                  {template.icon}
                  <span className="ml-1">{template.label}</span>
                </Badge>
              ))}
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-200 text-xs"
                onClick={() => {
                  const textarea = getActiveTextarea();
                  if (textarea) textarea.focus();
                  setIsImageDialogOpen(true);
                  setActiveImageTab("gallery");
                }}
              >
                <ImageIcon className="h-3 w-3 mr-1" />
                Gallery ({uploadedImages.length})
              </Badge>
            </div>
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
                  value={content.en}
                  onChange={(e) => {
                    onChange({ ...content, en: e.target.value });
                    setTimeout(updateFormatState, 10);
                  }}
                  placeholder={placeholder.en}
                  className="min-h-[400px] w-full resize-y border-0 bg-background p-4 focus:outline-none focus:ring-0 text-base font-mono text-gray-800"
                  spellCheck="true"
                  rows={15}
                  onSelect={updateFormatState}
                  onClick={updateFormatState}
                  onKeyUp={updateFormatState}
                  onMouseUp={updateFormatState}
                  onFocus={() => {
                    // Ensure the editor is focused and ready for formatting
                    setTimeout(updateFormatState, 10);
                  }}
                />
              ) : (
                <Textarea
                  ref={textareaRefHi}
                  value={content.hi}
                  onChange={(e) => {
                    onChange({ ...content, hi: e.target.value });
                    setTimeout(updateFormatState, 10);
                  }}
                  placeholder={placeholder.hi}
                  className="min-h-[400px] w-full resize-y border-0 bg-background p-4 focus:outline-none focus:ring-0 text-base font-mono text-gray-800"
                  spellCheck="true"
                  rows={15}
                  onSelect={updateFormatState}
                  onClick={updateFormatState}
                  onKeyUp={updateFormatState}
                  onMouseUp={updateFormatState}
                  onFocus={() => {
                    // Ensure the editor is focused and ready for formatting
                    setTimeout(updateFormatState, 10);
                  }}
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
                    {/* {getActiveContent().split(/\s+/).filter(word => word.length > 0).length} words */}
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

        {/* Bottom Bar */}
        <div className="border-t p-2 flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-2 text-xs">
            <Palette className="h-3 w-3 text-gray-500" />
            <span className="text-gray-600">Easy formatting for {activeLanguage === "en" ? "English" : "Hindi"} content</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const textarea = getActiveTextarea();
                if (textarea) textarea.focus();
                removeHeading();
              }}
              disabled={!formatState.heading}
              className="h-7 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Remove Heading
            </Button>
            
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="h-5">
                Images: {uploadedImages.length}
              </Badge>
              {uploadedImages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const textarea = getActiveTextarea();
                    if (textarea) textarea.focus();
                    deleteLastImage();
                  }}
                  className="h-7 text-xs"
                  title="Delete last uploaded image"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete Last
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            {imageToDelete && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <img
                  src={imageToDelete}
                  alt="To delete"
                  className="max-h-32 mx-auto rounded"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setImageToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                const textarea = getActiveTextarea();
                if (textarea) textarea.focus();
                if (imageToDelete) {
                  const index = uploadedImages.findIndex(img => img.url === imageToDelete);
                  if (index !== -1) {
                    deleteImage(index);
                  }
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Help Section */}
      <div className="mt-4 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-800">Multilingual Writing Tips:</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Start with a strong headline in both languages</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Use "Lead Paragraph" for important info</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Add images with bilingual captions</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Use templates for quotes & key facts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Keep paragraphs short and concise</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Preview both language versions</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              <strong>Keyboard Shortcuts:</strong> Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline)
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => {
                setShowPreview(!showPreview);
                if (!showPreview) {
                  const textarea = getActiveTextarea();
                  if (textarea) textarea.focus();
                }
              }}
            >
              {showPreview ? "Switch to Edit" : "Preview Article"}
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}