import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetBlogPost } from '../hooks/useGetBlogPost';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';
import { lightHealthBlogPosts } from '../data/lightHealthBlogPosts';
import { findPostById, formatGermanDate } from '../utils/blogHelpers';

export default function BlogPost() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/blog/$id' });
  const { data: backendPost, isLoading, error } = useGetBlogPost(id);

  const post = findPostById(id, lightHealthBlogPosts, backendPost);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if ((error && !post) || !post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <Button variant="ghost" onClick={() => navigate({ to: '/blog' })} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Blog
        </Button>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-destructive">Blog-Beitrag konnte nicht geladen werden.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <Button variant="ghost" onClick={() => navigate({ to: '/blog' })} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zurück zum Blog
      </Button>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="mb-4 font-serif text-4xl">{post.title}</CardTitle>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Veröffentlicht am {formatGermanDate(post.publicationDate)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {post.featuredImage && (
            <img
              src={post.featuredImage.getDirectURL()}
              alt={post.title}
              className="w-full rounded-lg object-cover"
            />
          )}
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">{post.content}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
