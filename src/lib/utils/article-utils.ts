/**
 * Generate a SEO-friendly slug from a title
 * @param title - The title to convert to slug
 * @param suffix - Optional suffix to add (e.g., article ID)
 * @returns Generated slug string
 */
export const generateSlug = (title: string, suffix?: string): string => {
  if (!title || typeof title !== 'string') {
    throw new Error('Title is required to generate slug');
  }

  // Step 1: Convert to lowercase
  let slug = title.toLowerCase();

  // Step 2: Remove special characters but keep Hindi/Devanagari characters
  // Allow English letters, Hindi letters (Devanagari), numbers, and spaces
  slug = slug.replace(/[^\u0900-\u097F\u0980-\u09FFa-zA-Z0-9\s\-]/g, '');

  // Step 3: Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-');

  // Step 4: Remove consecutive hyphens
  slug = slug.replace(/--+/g, '-');

  // Step 5: Trim hyphens from start and end
  slug = slug.replace(/^-+|-+$/g, '');

  // Step 6: Limit length (max 100 characters for SEO)
  if (slug.length > 100) {
    slug = slug.substring(0, 100);
    
    // Ensure we don't end with a hyphen
    const lastChar = slug.charAt(slug.length - 1);
    if (lastChar === '-') {
      slug = slug.substring(0, slug.length - 1);
    }
  }

  // Step 7: If slug is empty after cleaning, generate random slug
  if (!slug) {
    const randomString = Math.random().toString(36).substring(2, 10);
    slug = `article-${randomString}`;
  }

  // Step 8: Add suffix if provided
  if (suffix) {
    slug = `${slug}-${suffix}`;
  }

  return slug;
};

/**
 * Generate unique slug with timestamp for articles
 * @param title - Article title
 * @returns Unique slug with timestamp
 */
export const generateUniqueArticleSlug = (title: string): string => {
  const baseSlug = generateSlug(title);
  
  // Add timestamp (last 6 digits) for uniqueness
  const timestamp = Date.now().toString().slice(-6);
  
  return `${baseSlug}-${timestamp}`;
};

/**
 * Generate slug for Hindi content
 * @param hindiText - Hindi text to convert to slug
 * @returns Hindi slug (transliterated to English)
 */
export const generateHindiSlug = (hindiText: string): string => {
  if (!hindiText || typeof hindiText !== 'string') {
    throw new Error('Hindi text is required');
  }

  // For Hindi text, we can transliterate to English for better URL compatibility
  const transliterated = transliterateHindiToEnglish(hindiText);
  
  return generateSlug(transliterated);
};

/**
 * Simple Hindi to English transliteration for slugs
 * @param hindiText - Hindi text
 * @returns Transliterated English text
 */
const transliterateHindiToEnglish = (hindiText: string): string => {
  // Basic transliteration mapping for common Hindi characters
  const transliterationMap: Record<string, string> = {
    // Vowels
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am', 'अः': 'ah',
    
    // Consonants
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
    'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    
    // Matras (vowel signs)
    'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'm', 'ः': 'h',
    
    // Special characters
    '्': '', // Virama (halant) - removes inherent vowel
    '़': '', // Nukta
    ' ': ' ', // Space
  };

  let transliterated = '';
  
  for (let i = 0; i < hindiText.length; i++) {
    const char = hindiText[i];
    
    if (transliterationMap[char]) {
      transliterated += transliterationMap[char];
    } else if (char.match(/[a-zA-Z0-9]/)) {
      transliterated += char;
    } else {
      // Skip other characters
      continue;
    }
  }

  return transliterated.trim();
};

/**
 * Check if a slug is already taken in the database
 * @param slug - Slug to check
 * @param excludeId - Article ID to exclude (for updates)
 * @returns Promise<boolean> - true if slug exists
 */
export const checkSlugExists = async (slug: string, excludeId?: string): Promise<boolean> => {
  try {
    const { getArticleModel } = await import('@/lib/models/Articles');
    const Article = getArticleModel();
    
    const query: any = { slug };
    
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existing = await Article.findOne(query);
    return !!existing;
  } catch (error) {
    console.error('Error checking slug existence:', error);
    return false;
  }
};

/**
 * Generate a unique slug that doesn't exist in database
 * @param title - Article title
 * @param existingId - Existing article ID (for updates)
 * @returns Promise<string> - Unique slug
 */
export const generateUniqueSlug = async (title: string, existingId?: string): Promise<string> => {
  let baseSlug = generateUniqueArticleSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  // Check if slug exists and generate a new one if it does
  while (await checkSlugExists(slug, existingId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
    
    // Prevent infinite loop
    if (counter > 10) {
      // Add random string as fallback
      const randomString = Math.random().toString(36).substring(2, 8);
      slug = `${baseSlug}-${randomString}`;
      break;
    }
  }
  
  return slug;
};

/**
 * Format slug for display (capitalize words)
 * @param slug - URL slug
 * @returns Formatted display text
 */
export const formatSlugForDisplay = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Validate if a slug is valid
 * @param slug - Slug to validate
 * @returns Validation result
 */
export const validateSlug = (slug: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!slug || slug.trim().length === 0) {
    errors.push('Slug cannot be empty');
  }
  
  if (slug.length < 3) {
    errors.push('Slug must be at least 3 characters long');
  }
  
  if (slug.length > 150) {
    errors.push('Slug cannot exceed 150 characters');
  }
  
  // Check for valid characters
  const validSlugRegex = /^[a-z0-9\-]+$/;
  if (!validSlugRegex.test(slug)) {
    errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
  }
  
  // Check for consecutive hyphens
  if (slug.includes('--')) {
    errors.push('Slug cannot contain consecutive hyphens');
  }
  
  // Check for leading/trailing hyphens
  if (slug.startsWith('-') || slug.endsWith('-')) {
    errors.push('Slug cannot start or end with a hyphen');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};