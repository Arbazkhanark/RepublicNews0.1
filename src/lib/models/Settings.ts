import type { ObjectId } from "mongodb"

export interface SiteSettings {
  _id?: ObjectId
  siteName: string
  tagline: string
  description: string
  logo?: string
  favicon?: string
  primaryColor: string
  secondaryColor: string
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    linkedin?: string
  }
  contactInfo: {
    email: string
    phone?: string
    address?: string
  }
  seoSettings: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    ogImage?: string
  }
  adsenseSettings: {
    publisherId?: string
    isEnabled: boolean
    adSlots: {
      header?: string
      sidebar?: string
      inArticle?: string
      footer?: string
    }
  }
  analyticsSettings: {
    googleAnalyticsId?: string
    facebookPixelId?: string
  }
  updatedAt: Date
}
