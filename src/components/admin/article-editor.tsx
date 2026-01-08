"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Save, Eye, Send, X, ImageIcon, Loader2, Upload, Trash2 } from "lucide-react"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { MediaUploader } from "@/components/admin/media-uploader"
import { ArticlePreview } from "@/components/admin/article-preview"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary-client"

interface ArticleEditorProps {
  articleId?: string
}

interface Category {
  _id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
  parentCategoryName: string | null
  order: number
  isActive: boolean
  seoTitle: string
  seoDescription: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface CloudinaryImage {
  url: string
  publicId: string
  isFeaturedImage?: boolean
  isFeaturedArticleImage?: boolean
}

interface SourcePersonSocial {
  twitter: string
  facebook: string
  instagram: string
  linkedin: string
}

interface LayoutConfig {
  showAuthor: boolean
  showDate: boolean
  showCategory: boolean
  showSocialShare: boolean
  imagePosition: "top" | "left" | "right" | "center"
  textAlign: "left" | "center" | "right" | "justify"
}

interface Article {
  title: string
  titleHi: string
  subtitle: string
  subtitleHi: string
  content: string
  contentHi: string
  excerpt: string
  excerptHi: string
  categoryId: string
  featuredImage: string
  featuredArticleImage: string
  mediaUrls: string[]
  cloudinaryImages: CloudinaryImage[]
  sourcePersonName: string
  sourcePersonNameHi: string
  sourcePersonSocial: SourcePersonSocial
  layoutConfig: LayoutConfig
  status: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  tags: string[]
  isBreaking: boolean
  isFeatured: boolean
  scheduledAt: string
}

// Simple toast implementation
const useToast = () => {
  const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    const toast = document.createElement("div")
    toast.className = `fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
      variant === "destructive" ? "bg-red-100 text-red-800 border border-red-200" : "bg-green-100 text-green-800 border border-green-200"
    }`
    toast.innerHTML = `
      <div class="font-semibold">${title}</div>
      <div class="text-sm">${description}</div>
    `
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 3000)
  }

  return {
    toast: showToast
  }
}

const defaultLayoutConfig: LayoutConfig = {
  showAuthor: true,
  showDate: true,
  showCategory: true,
  showSocialShare: true,
  imagePosition: "top",
  textAlign: "left"
}

const defaultSourcePersonSocial: SourcePersonSocial = {
  twitter: "",
  facebook: "",
  instagram: "",
  linkedin: ""
}

const defaultArticle: Article = {
  title: "",
  titleHi: "",
  subtitle: "",
  subtitleHi: "",
  content: "",
  contentHi: "",
  excerpt: "",
  excerptHi: "",
  categoryId: "",
  featuredImage: "",
  featuredArticleImage: "",
  mediaUrls: [],
  cloudinaryImages: [],
  sourcePersonName: "",
  sourcePersonNameHi: "",
  sourcePersonSocial: defaultSourcePersonSocial,
  layoutConfig: defaultLayoutConfig,
  status: "draft",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
  tags: [],
  isBreaking: false,
  isFeatured: false,
  scheduledAt: ""
}

export function ArticleEditor({ articleId }: ArticleEditorProps) {
  const [activeTab, setActiveTab] = useState("editor")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [groupedCategories, setGroupedCategories] = useState<{ [key: string]: Category[] }>({})
  const [cloudinaryImages, setCloudinaryImages] = useState<CloudinaryImage[]>([])
  const { toast } = useToast()
  
  const featuredImageRef = useRef<HTMLInputElement>(null)
  const featuredArticleImageRef = useRef<HTMLInputElement>(null)
  
  const [article, setArticle] = useState<Article>(defaultArticle)

  // Group categories by parent category
  const groupCategories = (categories: Category[]) => {
    const grouped: { [key: string]: Category[] } = {}
    
    const parentCategories = categories.filter(cat => !cat.parentCategoryName)
    
    categories.forEach(category => {
      if (category.parentCategoryName) {
        if (!grouped[category.parentCategoryName]) {
          grouped[category.parentCategoryName] = []
        }
        grouped[category.parentCategoryName].push(category)
      }
    })
    
    parentCategories.forEach(parent => {
      if (!grouped[parent.name]) {
        grouped[parent.name] = []
      }
      grouped[parent.name].unshift(parent)
    })
    
    return grouped
  }

  // Fetch categories and article data if editing
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          const categoriesData = data.categories || []
          setCategories(categoriesData)
          setGroupedCategories(groupCategories(categoriesData))
        } else {
          toast("Error", "Failed to fetch categories", "destructive")
          setCategories([])
          setGroupedCategories({})
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        toast("Error", "Failed to fetch categories", "destructive")
        setCategories([])
        setGroupedCategories({})
      }
    }
    
    const fetchArticle = async () => {
      if (!articleId) return
      
      try {
        setIsLoading(true)
        const response = await fetch(`/api/news/${articleId}`)
        if (response.ok) {
          const data = await response.json()
          const articleData = data.data || data.article
          
          // Debug log
          console.log("Fetched article data:", articleData)
          console.log("mediaUrls:", articleData.mediaUrls)
          console.log("cloudinaryImages:", articleData.cloudinaryImages)
          console.log("category:", articleData.category)
          
          // Safely extract data with defaults
          const articleWithDefaults: Article = {
            title: articleData.title || "",
            titleHi: articleData.titleHi || "",
            subtitle: articleData.subtitle || "",
            subtitleHi: articleData.subtitleHi || "",
            content: articleData.content || "",
            contentHi: articleData.contentHi || "",
            excerpt: articleData.excerpt || "",
            excerptHi: articleData.excerptHi || "",
            categoryId: articleData.category?._id || articleData.category || "",
            featuredImage: articleData.featuredImage || "",
            featuredArticleImage: articleData.featuredArticleImage || "",
            mediaUrls: Array.isArray(articleData.mediaUrls) ? articleData.mediaUrls : [],
            cloudinaryImages: Array.isArray(articleData.cloudinaryImages) ? articleData.cloudinaryImages : [],
            sourcePersonName: articleData.sourcePersonName || "",
            sourcePersonNameHi: articleData.sourcePersonNameHi || "",
            sourcePersonSocial: articleData.sourcePersonSocial || defaultSourcePersonSocial,
            layoutConfig: articleData.layoutConfig || defaultLayoutConfig,
            status: articleData.status || "draft",
            seoTitle: articleData.seoTitle || "",
            seoDescription: articleData.seoDescription || "",
            seoKeywords: Array.isArray(articleData.seoKeywords) ? articleData.seoKeywords : [],
            tags: Array.isArray(articleData.tags) ? articleData.tags : [],
            isBreaking: articleData.isBreaking || false,
            isFeatured: articleData.isFeatured || false,
            scheduledAt: articleData.scheduledAt ? new Date(articleData.scheduledAt).toISOString().slice(0, 16) : ""
          }
          
          console.log("Processed article:", articleWithDefaults)
          
          setArticle(articleWithDefaults)
          setCloudinaryImages(Array.isArray(articleData.cloudinaryImages) ? articleData.cloudinaryImages : [])
        } else {
          toast("Error", "Failed to fetch article data", "destructive")
        }
      } catch (error) {
        console.error("Failed to fetch article:", error)
        toast("Error", "Failed to fetch article data", "destructive")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCategories()
    if (articleId) {
      fetchArticle()
    }
  }, [articleId])
  
  const handleCloudinaryUpload = async (file: File, type: 'featured' | 'featuredArticle' | 'general') => {
    try {
      setIsUploading(true)
      const { url, publicId } = await uploadToCloudinary(file)
      
      const imageData = {
        url,
        publicId,
        isFeaturedImage: type === 'featured',
        isFeaturedArticleImage: type === 'featuredArticle'
      }
      
      // Add to cloudinary images array
      setCloudinaryImages(prev => [...prev, imageData])
      
      // Update article state based on type
      if (type === 'featured') {
        setArticle(prev => ({ ...prev, featuredImage: url }))
      } else if (type === 'featuredArticle') {
        setArticle(prev => ({ ...prev, featuredArticleImage: url }))
      } else {
        // Add to mediaUrls for general uploads
        setArticle(prev => ({ 
          ...prev, 
          mediaUrls: [...(prev.mediaUrls || []), url],
          cloudinaryImages: [...(prev.cloudinaryImages || []), imageData]
        }))
      }
      
      toast("Success", "Image uploaded successfully")
      return url
    } catch (error) {
      console.error("Upload error:", error)
      toast("Error", "Failed to upload image", "destructive")
      throw error
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleDeleteCloudinaryImage = async (publicId: string, imageUrl: string) => {
    try {
      await deleteFromCloudinary(publicId)
      
      // Remove from cloudinary images
      setCloudinaryImages(prev => prev.filter(img => img.publicId !== publicId))
      
      // Remove from article state
      setArticle(prev => ({
        ...prev,
        cloudinaryImages: (prev.cloudinaryImages || []).filter(img => img.publicId !== publicId),
        mediaUrls: (prev.mediaUrls || []).filter(url => url !== imageUrl),
        featuredImage: prev.featuredImage === imageUrl ? "" : prev.featuredImage,
        featuredArticleImage: prev.featuredArticleImage === imageUrl ? "" : prev.featuredArticleImage
      }))
      
      toast("Success", "Image deleted successfully")
    } catch (error) {
      console.error("Delete error:", error)
      toast("Error", "Failed to delete image", "destructive")
    }
  }
  
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    await handleCloudinaryUpload(file, 'featured')
    if (featuredImageRef.current) {
      featuredImageRef.current.value = ""
    }
  }
  
  const handleFeaturedArticleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    await handleCloudinaryUpload(file, 'featuredArticle')
    if (featuredArticleImageRef.current) {
      featuredArticleImageRef.current.value = ""
    }
  }
  
  const handleSave = async () => {
    try {
      setIsLoading(true)
      
      // Prepare data for API
      const articleData = {
        title: article.title,
        titleHi: article.titleHi,
        subtitle: article.subtitle || "",
        subtitleHi: article.subtitleHi || "",
        content: article.content,
        contentHi: article.contentHi,
        excerpt: article.excerpt || "",
        excerptHi: article.excerptHi || "",
        category: article.categoryId,
        featuredImage: article.featuredImage,
        featuredArticleImage: article.isFeatured ? article.featuredArticleImage : "",
        mediaUrls: article.mediaUrls || [],
        cloudinaryImages: article.cloudinaryImages || [],
        sourcePersonName: article.sourcePersonName,
        sourcePersonNameHi: article.sourcePersonNameHi,
        sourcePersonSocial: article.sourcePersonSocial || defaultSourcePersonSocial,
        layoutConfig: article.layoutConfig || defaultLayoutConfig,
        status: "draft",
        tags: article.tags || [],
        isBreaking: article.isBreaking || false,
        isFeatured: article.isFeatured || false,
        seoTitle: article.seoTitle || "",
        seoDescription: article.seoDescription || "",
        seoKeywords: article.seoKeywords || [],
        scheduledAt: article.scheduledAt || ""
      }

      console.log("Saving article data:", articleData)

      const url = articleId ? `/api/news/${articleId}` : '/api/news'
      const method = articleId ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('admin-token') || ''}`
        },
        body: JSON.stringify(articleData)
      })

      const data = await response.json()
      console.log("Save response:", data)

      if (response.ok) {
        toast("Success", articleId ? "Article updated successfully" : "Article saved as draft")
        
        if (!articleId && data.data?.articleId) {
          window.location.href = `/admin/articles/${data.data.articleId}/edit`
        }
      } else {
        throw new Error(data.message || "Failed to save article")
      }
    } catch (error: any) {
      console.error("Error saving article:", error)
      toast("Error", error.message || "Failed to save article", "destructive")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handlePublish = async () => {
    try {
      console.log("Publishing article...", article)
      setIsLoading(true)
      
      const articleData = {
        title: article.title,
        titleHi: article.titleHi,
        subtitle: article.subtitle || "",
        subtitleHi: article.subtitleHi || "",
        content: article.content,
        contentHi: article.contentHi,
        excerpt: article.excerpt || "",
        excerptHi: article.excerptHi || "",
        category: article.categoryId,
        featuredImage: article.featuredImage,
        featuredArticleImage: article.isFeatured ? article.featuredArticleImage : "",
        mediaUrls: article.mediaUrls || [],
        cloudinaryImages: article.cloudinaryImages || [],
        sourcePersonName: article.sourcePersonName,
        sourcePersonNameHi: article.sourcePersonNameHi,
        sourcePersonSocial: article.sourcePersonSocial || defaultSourcePersonSocial,
        layoutConfig: article.layoutConfig || defaultLayoutConfig,
        status: "published",
        tags: article.tags || [],
        isBreaking: article.isBreaking || false,
        isFeatured: article.isFeatured || false,
        seoTitle: article.seoTitle || "",
        seoDescription: article.seoDescription || "",
        seoKeywords: article.seoKeywords || [],
        scheduledAt: article.scheduledAt || ""
      }

      console.log("Publishing article data:", articleData)

      const url = articleId ? `/api/news/${articleId}` : '/api/news'
      const method = articleId ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token') || localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(articleData)
      })

      console.log("Publish response:", response)

      const data = await response.json()
      console.log("Publish response data:", data)

      if (response.ok) {
        setArticle(prev => ({ ...prev, status: "published" }))
        toast("Success", "Article published successfully")
      } else {
        throw new Error(data.message || "Failed to publish article")
      }
    } catch (error: any) {
      console.error("Error publishing article:", error)
      toast("Error", error.message || "Failed to publish article", "destructive")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleMediaUpload = async (file: File) => {
    const url = await handleCloudinaryUpload(file, 'general')
    return url
  }
  
  const removeMedia = (index: number, url: string) => {
    const cloudinaryImage = cloudinaryImages.find(img => img.url === url)
    
    if (cloudinaryImage) {
      handleDeleteCloudinaryImage(cloudinaryImage.publicId, url)
    } else {
      setArticle((prev) => ({
        ...prev,
        mediaUrls: (prev.mediaUrls || []).filter((_, i) => i !== index),
      }))
    }
  }
  
  if (isLoading && articleId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading article...</span>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Article Content</CardTitle>
                  <CardDescription>Write your article content in English and Hindi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title (English)</Label>
                      <Input
                        id="title"
                        placeholder="Enter article title..."
                        value={article.title}
                        onChange={(e) => setArticle((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="titleHi">Title (Hindi)</Label>
                      <Input
                        id="titleHi"
                        placeholder="लेख का शीर्षक दर्ज करें..."
                        value={article.titleHi}
                        onChange={(e) => setArticle((prev) => ({ ...prev, titleHi: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtitle (English)</Label>
                      <Input
                        id="subtitle"
                        placeholder="Enter subtitle..."
                        value={article.subtitle}
                        onChange={(e) => setArticle((prev) => ({ ...prev, subtitle: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitleHi">Subtitle (Hindi)</Label>
                      <Input
                        id="subtitleHi"
                        placeholder="उपशीर्षक दर्ज करें..."
                        value={article.subtitleHi}
                        onChange={(e) => setArticle((prev) => ({ ...prev, subtitleHi: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Content (English)</Label>
                    <RichTextEditor
                      content={article.content}
                      onChange={(content) => setArticle((prev) => ({ ...prev, content }))}
                      placeholder="Write your article content here..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Content (Hindi)</Label>
                    <RichTextEditor
                      content={article.contentHi}
                      onChange={(content) => setArticle((prev) => ({ ...prev, contentHi: content }))}
                      placeholder="यहाँ अपना लेख लिखें..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Media Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5" />
                    <span>Media</span>
                  </CardTitle>
                  <CardDescription>Upload images and videos for your article</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('media-upload')?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Upload to Cloudinary
                      </Button>
                      <input
                        id="media-upload"
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            await handleMediaUpload(file)
                            e.target.value = ""
                          }
                        }}
                      />
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Upload images/videos to Cloudinary. They will be stored securely and optimized.
                    </div>
                  </div>

                  {(article.mediaUrls || []).length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {(article.mediaUrls || []).map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Media ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeMedia(index, url)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publish</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant={article.status === "published" ? "default" : "secondary"}>
                      {article.status}
                    </Badge>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={handleSave} 
                      variant="outline" 
                      className="w-full bg-transparent"
                      disabled={isLoading || isUploading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Draft
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("preview")} 
                      variant="outline" 
                      className="w-full"
                      disabled={isLoading || isUploading}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button 
                      onClick={handlePublish} 
                      className="w-full"
                      disabled={isLoading || isUploading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Publish
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Article Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">Featured Image</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => featuredImageRef.current?.click()}
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
                          ref={featuredImageRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFeaturedImageUpload}
                        />
                        <span className="text-sm text-muted-foreground">
                          Main article image
                        </span>
                      </div>
                      
                      {article.featuredImage && (
                        <div className="relative mt-2">
                          <img
                            src={article.featuredImage}
                            alt="Featured"
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const cloudinaryImage = cloudinaryImages.find(
                                img => img.url === article.featuredImage
                              )
                              if (cloudinaryImage) {
                                handleDeleteCloudinaryImage(
                                  cloudinaryImage.publicId, 
                                  article.featuredImage
                                )
                              } else {
                                setArticle(prev => ({ ...prev, featuredImage: "" }))
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={article.categoryId}
                      onValueChange={(value) => setArticle((prev) => ({ ...prev, categoryId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(groupedCategories).map(([parentName, categoryGroup]) => (
                          <div key={parentName}>
                            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              {parentName}
                            </div>
                            {categoryGroup.map((category) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category.parentCategoryName ? `- ${category.name}` : category.name}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt (English)</Label>
                      <Textarea
                        id="excerpt"
                        placeholder="Brief summary..."
                        rows={3}
                        value={article.excerpt}
                        onChange={(e) => setArticle((prev) => ({ ...prev, excerpt: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerptHi">Excerpt (Hindi)</Label>
                      <Textarea
                        id="excerptHi"
                        placeholder="संक्षिप्त सारांश..."
                        rows={3}
                        value={article.excerptHi}
                        onChange={(e) => setArticle((prev) => ({ ...prev, excerptHi: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Source Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sourcePerson">Source Person Name (English)</Label>
                      <Input
                        id="sourcePerson"
                        placeholder="Name of news source..."
                        value={article.sourcePersonName}
                        onChange={(e) => setArticle((prev) => ({ ...prev, sourcePersonName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sourcePersonHi">Source Person Name (Hindi)</Label>
                      <Input
                        id="sourcePersonHi"
                        placeholder="समाचार स्रोत का नाम..."
                        value={article.sourcePersonNameHi}
                        onChange={(e) => setArticle((prev) => ({ ...prev, sourcePersonNameHi: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Social Media Links</Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Twitter handle"
                        value={article.sourcePersonSocial.twitter}
                        onChange={(e) =>
                          setArticle((prev) => ({
                            ...prev,
                            sourcePersonSocial: { 
                              ...prev.sourcePersonSocial, 
                              twitter: e.target.value 
                            },
                          }))
                        }
                      />
                      <Input
                        placeholder="Facebook profile"
                        value={article.sourcePersonSocial.facebook}
                        onChange={(e) =>
                          setArticle((prev) => ({
                            ...prev,
                            sourcePersonSocial: { 
                              ...prev.sourcePersonSocial, 
                              facebook: e.target.value 
                            },
                          }))
                        }
                      />
                      <Input
                        placeholder="Instagram handle"
                        value={article.sourcePersonSocial.instagram}
                        onChange={(e) =>
                          setArticle((prev) => ({
                            ...prev,
                            sourcePersonSocial: { 
                              ...prev.sourcePersonSocial, 
                              instagram: e.target.value 
                            },
                          }))
                        }
                      />
                      <Input
                        placeholder="LinkedIn profile"
                        value={article.sourcePersonSocial.linkedin}
                        onChange={(e) =>
                          setArticle((prev) => ({
                            ...prev,
                            sourcePersonSocial: { 
                              ...prev.sourcePersonSocial, 
                              linkedin: e.target.value 
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <ArticlePreview article={article} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>Customize how your article will appear to readers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showAuthor">Show Author</Label>
                  <Switch
                    id="showAuthor"
                    checked={article.layoutConfig.showAuthor}
                    onCheckedChange={(checked) =>
                      setArticle((prev) => ({
                        ...prev,
                        layoutConfig: { 
                          ...prev.layoutConfig, 
                          showAuthor: checked 
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showDate">Show Date</Label>
                  <Switch
                    id="showDate"
                    checked={article.layoutConfig.showDate}
                    onCheckedChange={(checked) =>
                      setArticle((prev) => ({
                        ...prev,
                        layoutConfig: { 
                          ...prev.layoutConfig, 
                          showDate: checked 
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showCategory">Show Category</Label>
                  <Switch
                    id="showCategory"
                    checked={article.layoutConfig.showCategory}
                    onCheckedChange={(checked) =>
                      setArticle((prev) => ({
                        ...prev,
                        layoutConfig: { 
                          ...prev.layoutConfig, 
                          showCategory: checked 
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showSocialShare">Show Social Share</Label>
                  <Switch
                    id="showSocialShare"
                    checked={article.layoutConfig.showSocialShare}
                    onCheckedChange={(checked) =>
                      setArticle((prev) => ({
                        ...prev,
                        layoutConfig: { 
                          ...prev.layoutConfig, 
                          showSocialShare: checked 
                        },
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="isBreaking">Breaking News</Label>
                  <Switch
                    id="isBreaking"
                    checked={article.isBreaking}
                    onCheckedChange={(checked) =>
                      setArticle((prev) => ({
                        ...prev,
                        isBreaking: checked,
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured">Featured Article</Label>
                  <Switch
                    id="isFeatured"
                    checked={article.isFeatured}
                    onCheckedChange={(checked) =>
                      setArticle((prev) => ({
                        ...prev,
                        isFeatured: checked,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Featured Article Image Section - Only show when isFeatured is true */}
              {article.isFeatured && (
                <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featuredArticleImage">Featured Article Image</Label>
                    <span className="text-xs text-muted-foreground">Special image for featured articles</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => featuredArticleImageRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Upload Featured Article Image
                      </Button>
                      <input
                        ref={featuredArticleImageRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFeaturedArticleImageUpload}
                      />
                    </div>
                    
                    {article.featuredArticleImage && (
                      <div className="relative mt-2">
                        <img
                          src={article.featuredArticleImage}
                          alt="Featured Article"
                          className="w-full h-40 object-cover rounded-lg border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            const cloudinaryImage = cloudinaryImages.find(
                              img => img.url === article.featuredArticleImage
                            )
                            if (cloudinaryImage) {
                              handleDeleteCloudinaryImage(
                                cloudinaryImage.publicId, 
                                article.featuredArticleImage
                              )
                            } else {
                              setArticle(prev => ({ ...prev, featuredArticleImage: "" }))
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      This image will be used when the article is displayed as a featured article on the homepage or featured sections.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Image Position</Label>
                <Select
                  value={article.layoutConfig.imagePosition}
                  onValueChange={(value) =>
                    setArticle((prev) => ({
                      ...prev,
                      layoutConfig: { 
                        ...prev.layoutConfig, 
                        imagePosition: value as any
                      },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Text Alignment</Label>
                <Select
                  value={article.layoutConfig.textAlign}
                  onValueChange={(value) =>
                    setArticle((prev) => ({
                      ...prev,
                      layoutConfig: { 
                        ...prev.layoutConfig, 
                        textAlign: value as any
                      },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="justify">Justify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="AI, Technology, India"
                  value={(article.tags || []).join(", ")}
                  onChange={(e) =>
                    setArticle((prev) => ({
                      ...prev,
                      tags: e.target.value.split(",").map(tag => tag.trim()),
                    }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  placeholder="SEO Title for search engines"
                  value={article.seoTitle}
                  onChange={(e) => setArticle((prev) => ({ ...prev, seoTitle: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  placeholder="SEO Description for search engines"
                  rows={3}
                  value={article.seoDescription}
                  onChange={(e) => setArticle((prev) => ({ ...prev, seoDescription: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seoKeywords">SEO Keywords (comma separated)</Label>
                <Input
                  id="seoKeywords"
                  placeholder="keyword1, keyword2, keyword3"
                  value={(article.seoKeywords || []).join(", ")}
                  onChange={(e) =>
                    setArticle((prev) => ({
                      ...prev,
                      seoKeywords: e.target.value.split(",").map(keyword => keyword.trim()),
                    }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Schedule Publication (optional)</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={article.scheduledAt || ""}
                  onChange={(e) =>
                    setArticle((prev) => ({
                      ...prev,
                      scheduledAt: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}