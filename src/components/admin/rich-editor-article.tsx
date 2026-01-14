// components/admin/rich-text-editor.tsx

"use client"

import { useState, useRef } from "react"
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
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  X,
  Underline
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { uploadToCloudinary } from "@/lib/cloudinary-client"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Write your content here..." }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [imageCaption, setImageCaption] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [imagePosition, setImagePosition] = useState<"left" | "center" | "right">("center")

  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newText = content.substring(0, start) + text + content.substring(end)

    onChange(newText)

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const insertImage = () => {
    if (!imageUrl.trim()) return

    let imageHtml = ''
    
    if (imagePosition === "center") {
      imageHtml = `
<div class="image-container my-6 text-center">
  <img src="${imageUrl}" alt="${imageAlt || 'Image'}" class="mx-auto max-w-full h-auto rounded-lg shadow-md" style="max-height: 500px; object-fit: contain;">
  ${imageCaption ? `<p class="text-sm text-gray-500 italic mt-2">${imageCaption}</p>` : ''}
</div>
`
    } else if (imagePosition === "left") {
      imageHtml = `
<div class="image-container my-6 float-left mr-4 mb-4" style="max-width: 300px;">
  <img src="${imageUrl}" alt="${imageAlt || 'Image'}" class="w-full h-auto rounded-lg shadow-md">
  ${imageCaption ? `<p class="text-sm text-gray-500 italic mt-2">${imageCaption}</p>` : ''}
</div>
`
    } else if (imagePosition === "right") {
      imageHtml = `
<div class="image-container my-6 float-right ml-4 mb-4" style="max-width: 300px;">
  <img src="${imageUrl}" alt="${imageAlt || 'Image'}" class="w-full h-auto rounded-lg shadow-md">
  ${imageCaption ? `<p class="text-sm text-gray-500 italic mt-2">${imageCaption}</p>` : ''}
</div>
`}

    insertTextAtCursor(imageHtml + '\n\n')
    setIsImageDialogOpen(false)
    setImageUrl("")
    setImageAlt("")
    setImageCaption("")
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const { url } = await uploadToCloudinary(file)
      setImageUrl(url)
    } catch (error) {
      console.error("Image upload failed:", error)
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
                <Label>Upload Image</Label>
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
                    Upload
                  </Button>
                  <input
                    id="editor-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <span className="text-sm text-muted-foreground">
                    Upload to Cloudinary
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
                  </div>
                </div>
              )}

              {/* Image Details */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-alt">Alt Text</Label>
                  <Input
                    id="image-alt"
                    placeholder="Description for screen readers"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
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
                      <AlignLeft className="h-4 w-4 mr-2" />
                      Left
                    </Button>
                    <Button
                      type="button"
                      variant={imagePosition === "center" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImagePosition("center")}
                      className="flex-1"
                    >
                      <AlignCenter className="h-4 w-4 mr-2" />
                      Center
                    </Button>
                    <Button
                      type="button"
                      variant={imagePosition === "right" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImagePosition("right")}
                      className="flex-1"
                    >
                      <AlignRight className="h-4 w-4 mr-2" />
                      Right
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsImageDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={insertImage}
                disabled={!imageUrl.trim()}
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
              const selectedText = content.substring(start, end)
              
              if (selectedText) {
                const newText = content.substring(0, start) + 
                  `<u>${selectedText}</u>` + 
                  content.substring(end)
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
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[300px] w-full resize-y border-0 bg-background p-4 focus:outline-none focus:ring-0 font-mono text-sm"
          spellCheck="true"
        />
        
        {/* Word Count */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-2 py-1 rounded">
          {content.split(/\s+/).filter(word => word.length > 0).length} words
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
          onClick={() => {
            // Simple preview toggle
            const preview = document.createElement('div')
            preview.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center'
            preview.innerHTML = `
              <div class="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto w-full mx-4">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold">Content Preview</h3>
                  <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div class="prose max-w-none">
                  ${content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                          .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                          .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                          .replace(/^- (.*$)/gm, '<li>$1</li>')
                          .replace(/> (.*$)/gm, '<blockquote>$1</blockquote>')
                          .replace(/\n/g, '<br>')}
                </div>
              </div>
            `
            document.body.appendChild(preview)
          }}
          className="text-xs"
        >
          Preview
        </Button>
      </div>
    </div>
  )
}