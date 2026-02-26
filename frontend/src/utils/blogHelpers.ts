import { StaticBlogPost } from '../data/lightHealthBlogPosts';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export interface BackendBlogPost {
  id: string;
  title: string;
  content: string;
  publicationDate: bigint;
  featuredImage?: { getDirectURL: () => string } | null;
}

export interface UnifiedBlogPost {
  id: string;
  title: string;
  content: string;
  publicationDate: bigint;
  featuredImage?: { getDirectURL: () => string } | null;
  isStatic: boolean;
}

export function mergeStaticAndBackendPosts(
  staticPosts: StaticBlogPost[],
  backendPosts: BackendBlogPost[] | undefined
): UnifiedBlogPost[] {
  const unified: UnifiedBlogPost[] = [];

  // Add static posts
  staticPosts.forEach((post) => {
    unified.push({
      ...post,
      isStatic: true,
    });
  });

  // Add backend posts
  if (backendPosts) {
    backendPosts.forEach((post) => {
      unified.push({
        ...post,
        isStatic: false,
      });
    });
  }

  // Sort by publication date (newest first)
  unified.sort((a, b) => {
    if (a.publicationDate > b.publicationDate) return -1;
    if (a.publicationDate < b.publicationDate) return 1;
    return 0;
  });

  return unified;
}

export function findPostById(
  id: string,
  staticPosts: StaticBlogPost[],
  backendPost: BackendBlogPost | null | undefined
): UnifiedBlogPost | null {
  // Check if it's a static post
  const staticPost = staticPosts.find((post) => post.id === id);
  if (staticPost) {
    return {
      ...staticPost,
      isStatic: true,
    };
  }

  // Check if it's a backend post
  if (backendPost) {
    return {
      ...backendPost,
      isStatic: false,
    };
  }

  return null;
}

export function formatGermanDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return format(date, 'dd. MMMM yyyy', { locale: de });
}
