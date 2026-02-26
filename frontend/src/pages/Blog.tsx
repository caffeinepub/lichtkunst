import { useNavigate } from '@tanstack/react-router';
import { useGetAllBlogPosts } from '../hooks/useGetAllBlogPosts';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PenSquare, Calendar } from 'lucide-react';
import { lightHealthBlogPosts } from '../data/lightHealthBlogPosts';
import { mergeStaticAndBackendPosts, formatGermanDate } from '../utils/blogHelpers';

export default function Blog() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: backendPosts, isLoading, error } = useGetAllBlogPosts();

  const allPosts = mergeStaticAndBackendPosts(lightHealthBlogPosts, backendPosts);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="mb-3 font-serif text-4xl font-bold md:text-5xl">Blog</h1>
          <p className="text-muted-foreground">Gesundheitstipps und Neuigkeiten rund um Lichtkunst</p>
        </div>
        {identity && isAdmin && (
          <Button onClick={() => navigate({ to: '/blog/neu' })}>
            <PenSquare className="mr-2 h-4 w-4" />
            Neuer Beitrag
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-destructive">Blog-Beiträge konnten nicht geladen werden. Bitte versuchen Sie es später erneut.</p>
        </div>
      )}

      {!isLoading && allPosts.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Noch keine Blog-Beiträge vorhanden. Schauen Sie bald wieder vorbei!</p>
        </div>
      )}

      {!isLoading && allPosts.length > 0 && (
        <div className="space-y-8">
          {allPosts.map((post) => (
            <Card
              key={post.id}
              className="cursor-pointer border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg"
              onClick={() => navigate({ to: '/blog/$id', params: { id: post.id } })}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="mb-2 font-serif text-2xl">{post.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Veröffentlicht am {formatGermanDate(post.publicationDate)}
                    </CardDescription>
                  </div>
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage.getDirectURL()}
                      alt={post.title}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">
                  {post.content.substring(0, 200)}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
