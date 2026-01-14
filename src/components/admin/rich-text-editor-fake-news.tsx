"use client"

import { useState, useRef, useEffect } from "react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Image as ImageIcon,
  Link,
  Upload,
  Underline,
  Maximize2,
  X,
  Eye,
  Type
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

// Cloudinary upload function
const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'republic-mirror');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    console.log("Cloudinary upload response:", response);
    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = "Write your content here..." }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [imageCaption, setImageCaption] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [imagePosition, setImagePosition] = useState<"left" | "center" | "right">("center")
  const [uploadedImages, setUploadedImages] = useState<Array<{url: string, publicId: string}>>([])

  // Close preview on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewOpen) {
        setIsPreviewOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isPreviewOpen])

  // Auto-focus preview when opened
  useEffect(() => {
    if (isPreviewOpen && previewRef.current) {
      previewRef.current.focus()
    }
  }, [isPreviewOpen])

  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentContent = value || ""
    const newText = currentContent.substring(0, start) + text + currentContent.substring(end)

    onChange(newText)

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const insertImage = () => {
    if (!imageUrl.trim()) {
      toast.error("Please upload or enter an image URL")
      return
    }

    let imageHtml = ''
    
    if (imagePosition === "center") {
      imageHtml = `
<div class="image-container my-6 text-center">
  <img src="${imageUrl}" alt="${imageAlt || 'Image'}" class="mx-auto max-w-full h-auto rounded-lg shadow-md" style="max-height: 500px; object-fit: contain;" loading="lazy">
  ${imageCaption ? `<p class="text-sm text-gray-500 italic mt-2">${imageCaption}</p>` : ''}
</div>
`
    } else if (imagePosition === "left") {
      imageHtml = `
<div class="image-container my-6 float-left mr-4 mb-4" style="max-width: 300px;">
  <img src="${imageUrl}" alt="${imageAlt || 'Image'}" class="w-full h-auto rounded-lg shadow-md" loading="lazy">
  ${imageCaption ? `<p class="text-sm text-gray-500 italic mt-2">${imageCaption}</p>` : ''}
</div>
`
    } else if (imagePosition === "right") {
      imageHtml = `
<div class="image-container my-6 float-right ml-4 mb-4" style="max-width: 300px;">
  <img src="${imageUrl}" alt="${imageAlt || 'Image'}" class="w-full h-auto rounded-lg shadow-md" loading="lazy">
  ${imageCaption ? `<p class="text-sm text-gray-500 italic mt-2">${imageCaption}</p>` : ''}
</div>
`
    }

    insertTextAtCursor(imageHtml + '\n\n')
    toast.success("Image inserted successfully")
    setIsImageDialogOpen(false)
    setImageUrl("")
    setImageAlt("")
    setImageCaption("")
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Please upload an image under 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file (JPEG, PNG, GIF, etc.)")
      return
    }

    try {
      setIsUploading(true)
      
      // Show temporary preview
      const tempUrl = URL.createObjectURL(file)
      setImageUrl(tempUrl)
      
      // Upload to Cloudinary
      const { url, publicId } = await uploadToCloudinary(file)
      
      // Update with Cloudinary URL
      setImageUrl(url)
      
      // Store uploaded image info
      setUploadedImages(prev => [...prev, { url, publicId }])
      
      toast.success("Image uploaded to Cloudinary successfully!")
      
    } catch (error) {
      console.error("Image upload failed:", error)
      toast.error("Failed to upload image to Cloudinary")
      setImageUrl("")
    } finally {
      setIsUploading(false)
      if (event.target) {
        event.target.value = ""
      }
    }
  }

  const toolbarButtons = [
    {
      icon: <Bold className="h-4 w-4" />,
      action: () => insertTextAtCursor("**bold text**"),
      title: "Bold"
    },
    {
      icon: <Italic className="h-4 w-4" />,
      action: () => insertTextAtCursor("*italic text*"),
      title: "Italic"
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      action: () => insertTextAtCursor("# Heading 1\n"),
      title: "Heading 1"
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      action: () => insertTextAtCursor("## Heading 2\n"),
      title: "Heading 2"
    },
    {
      icon: <List className="h-4 w-4" />,
      action: () => insertTextAtCursor("- List item\n"),
      title: "Bullet List"
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      action: () => insertTextAtCursor("1. Numbered item\n"),
      title: "Numbered List"
    },
    {
      icon: <Quote className="h-4 w-4" />,
      action: () => insertTextAtCursor("> Blockquote\n"),
      title: "Quote"
    },
    {
      icon: <Link className="h-4 w-4" />,
      action: () => {
        const url = prompt("Enter URL:")
        const text = prompt("Enter link text:", url)
        if (url && text) {
          insertTextAtCursor(`[${text}](${url})`)
        }
      },
      title: "Insert Link"
    },
  ]

  // Helper function to safely count words
  const getWordCount = (text: string): number => {
    if (!text || typeof text !== 'string') return 0
    return text.split(/\s+/).filter(word => word.length > 0).length
  }

  // Convert markdown to HTML for preview
  const convertToHtml = (markdown: string): string => {
    if (!markdown) return ""
    
    let html = markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-6 text-gray-900 dark:text-white">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-7 mb-5 text-gray-800 dark:text-gray-200">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mt-6 mb-4 text-gray-700 dark:text-gray-300">$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-medium mt-5 mb-3 text-gray-700 dark:text-gray-300">$1</h4>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Underline (HTML tags)
      .replace(/<u>(.*?)<\/u>/g, '<u class="underline">$1</u>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Images (both markdown and HTML)
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="my-6"><img src="$2" alt="$1" class="max-w-full h-auto rounded-lg mx-auto shadow-lg" loading="lazy"></div>')
      // Lists
      .replace(/^[-*] (.*$)/gm, '<li class="ml-6 list-disc mb-2">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-6 list-decimal mb-2">$1</li>')
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic my-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r">$1</blockquote>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="my-4">')
      .replace(/\n/g, '<br>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="my-8 border-gray-300 dark:border-gray-700">')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-6"><code class="text-sm">$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
    
    // Process image containers (HTML images inserted by the editor)
    html = html.replace(/<div class="image-container([\s\S]*?)<\/div>/g, (match) => {
      return match.replace(/class="image-container/, 'class="image-container my-8')
    })
    
    // Wrap in paragraph if not already wrapped
    if (!html.trim().startsWith('<') || html.trim().startsWith('#')) {
      html = '<p class="my-4">' + html + '</p>'
    }
    
    return html
  }

  // Clear all uploaded images (for cleanup)
  const clearUploadedImages = () => {
    // Clean up object URLs
    uploadedImages.forEach(img => {
      if (img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url)
      }
    })
    setUploadedImages([])
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.title}
            className="h-8 w-8 p-0"
          >
            {button.icon}
          </Button>
        ))}
        
        <Separator orientation="vertical" className="h-6" />
        
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Insert Image"
              className="h-8 w-8 p-0"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Upload Image to Cloudinary</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('editor-image-upload')?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {isUploading ? "Uploading..." : "Upload to Cloudinary"}
                  </Button>
                  <input
                    id="editor-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <span className="text-sm text-muted-foreground">
                    Max 5MB • JPEG, PNG, GIF
                  </span>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image-url">Or enter image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              {/* Image Preview */}
              {imageUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border rounded-lg p-2">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-32 mx-auto rounded"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {imageUrl.startsWith('blob:') ? 'Temporary Preview' : 'Cloudinary Image'}
                    </p>
                  </div>
                </div>
              )}

              {/* Image Details */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-alt">Alt Text (required)</Label>
                  <Input
                    id="image-alt"
                    placeholder="Description for screen readers"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-caption">Caption (optional)</Label>
                  <Input
                    id="image-caption"
                    placeholder="Image caption"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={imagePosition === "left" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImagePosition("left")}
                      className="flex-1"
                    >
                      Left
                    </Button>
                    <Button
                      type="button"
                      variant={imagePosition === "center" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImagePosition("center")}
                      className="flex-1"
                    >
                      Center
                    </Button>
                    <Button
                      type="button"
                      variant={imagePosition === "right" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImagePosition("right")}
                      className="flex-1"
                    >
                      Right
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsImageDialogOpen(false)
                  setImageUrl("")
                  setImageAlt("")
                  setImageCaption("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={insertImage}
                disabled={!imageUrl.trim() || !imageAlt.trim()}
              >
                Insert Image
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Separator orientation="vertical" className="h-6" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const textarea = textareaRef.current
            if (textarea) {
              const start = textarea.selectionStart
              const end = textarea.selectionEnd
              const currentContent = value || ""
              const selectedText = currentContent.substring(start, end)
              
              if (selectedText) {
                const newText = currentContent.substring(0, start) + 
                  `<u>${selectedText}</u>` + 
                  currentContent.substring(end)
                onChange(newText)
              } else {
                insertTextAtCursor("<u>underlined text</u>")
              }
            }
          }}
          title="Underline"
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[300px] w-full resize-y border-0 bg-background p-4 focus:outline-none focus:ring-0 font-mono text-sm"
          spellCheck="true"
        />
        
        {/* Word Count */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-2 py-1 rounded">
          {getWordCount(value || "")} words
        </div>
      </div>

      {/* Preview Toggle */}
      <div className="border-t p-2 flex justify-between items-center bg-muted/30">
        <div className="text-xs text-muted-foreground">
          Use **bold**, *italic*, # headings, - lists, or HTML tags
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPreviewOpen(true)}
          className="text-xs flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600"
        >
          <Eye className="h-3 w-3" />
          Preview
        </Button>
      </div>

      {/* Full Screen Preview Modal */}
      {isPreviewOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          ref={previewRef}
          tabIndex={-1}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
            <div className="flex items-center gap-3">
              <Type className="h-6 w-6 text-blue-400" />
              <div>
                <h2 className="text-xl font-bold text-white">
                  Full Screen Preview
                </h2>
                <p className="text-sm text-gray-400">
                  Word Count: {getWordCount(value || "")} • Press ESC to close
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-400">
                Scroll ↓ to view content
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(false)}
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Close Preview
              </Button>
            </div>
          </div>

          {/* Preview Content Container */}
          <div className="flex-1 overflow-hidden">
            {/* Scrollable Content Area */}
            <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
              {/* Content Wrapper with proper spacing */}
              <div className="min-h-full bg-white dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-6 py-12">
                  {/* Preview Content */}
                  <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: convertToHtml(value || "")
                      }}
                      className="space-y-6"
                    />
                    
                    {!value && (
                      <div className="text-center py-24">
                        <div className="inline-block p-8 rounded-2xl bg-gray-100 dark:bg-gray-800">
                          <Type className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                            No Content to Preview
                          </h3>
                          <p className="text-gray-500 dark:text-gray-500">
                            Start typing in the editor to see your content here
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-800 bg-gray-900 flex justify-between items-center text-sm">
            <div className="text-gray-400">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Preview Active
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <button 
                onClick={() => previewRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white transition-colors"
              >
                ↑ Scroll to Top
              </button>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
              >
                Close (ESC)
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="fixed bottom-24 right-6">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-300">
              Scroll ↓
            </div>
          </div>
        </div>
      )}

      {/* Cleanup on unmount */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4b5563 #1f2937;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 5px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 5px;
          border: 2px solid #1f2937;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #1f2937;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Prose styles for preview */
        .prose {
          color: #374151;
        }
        
        .prose.dark\:prose-invert {
          color: #d1d5db;
        }
        
        .prose :where(h1):not(:where([class~="not-prose"] *)) {
          font-size: 2.25em;
          margin-top: 0;
          margin-bottom: 0.8888889em;
          line-height: 1.1111111;
          font-weight: 800;
        }
        
        .prose :where(h2):not(:where([class~="not-prose"] *)) {
          font-size: 1.5em;
          margin-top: 2em;
          margin-bottom: 1em;
          line-height: 1.3333333;
          font-weight: 700;
        }
        
        .prose :where(p):not(:where([class~="not-prose"] *)) {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
          line-height: 1.75;
        }
        
        .prose :where(ul):not(:where([class~="not-prose"] *)) {
          margin-top: 1.25em;
          margin-bottom: 1.25em;
          padding-left: 1.625em;
        }
        
        .prose :where(li):not(:where([class~="not-prose"] *)) {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        
        .prose :where(img):not(:where([class~="not-prose"] *)) {
          margin-top: 2em;
          margin-bottom: 2em;
        }
        
        .prose :where(blockquote):not(:where([class~="not-prose"] *)) {
          margin-top: 1.6em;
          margin-bottom: 1.6em;
          padding-left: 1em;
        }
        
        .image-container img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .image-container.text-center img {
          margin-left: auto;
          margin-right: auto;
        }
        
        .image-container.float-left {
          float: left;
          margin-right: 1rem;
          margin-bottom: 1rem;
        }
        
        .image-container.float-right {
          float: right;
          margin-left: 1rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  )
}