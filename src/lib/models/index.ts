// models/index.ts
// Export all models from a single file
// export { User, type IUser } from './User';
// export { Category, type ICategory } from './Category';
// export { Article, type IArticle } from '../models/Articles';
// export { NewsletterSubscriber, type INewsletterSubscriber } from './NewsletterSubscriber';
// export { NewsletterCampaign, type INewsletterCampaign } from './NewsletterCampaigns';
// export { Opinion, type IOpinion } from './Opinion';
// export { ContactMessage, type IContactMessage } from './Conact';

// // Optional: Export utility functions
// export { connectToDatabase } from '../mongodb';


export { getUserModel, type IUser } from './User';
export { getCategoryModel, type ICategory } from './Category';
export { getArticleModel, type IArticle } from './Articles';
export { getNewsletterSubscriberModel, type INewsletterSubscriber } from './NewsletterSubscriber';
export { getNewsletterCampaignModel, type INewsletterCampaign } from './NewsletterCampaigns';
export { getOpinionModel, type IOpinion } from './Opinion';
export { getContactMessageModel , type IContactMessage } from './Conact';
export { connectToDatabase } from '../mongodb';  // Ye runtime function hai, iske liye type nahi diya gaya
