import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { useCreateBlogPost } from '../hooks/useCreateBlogPost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, PenSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogCreate() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();
  const { mutate: createPost, isPending } = useCreateBlogPost();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Redirect if not authenticated or not admin
  if (!identity && !isCheckingAdmin) {
    navigate({ to: '/blog' });
    return null;
  }

  if (!isCheckingAdmin && !isAdmin) {
    navigate({ to: '/blog' });
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Bitte füllen Sie Titel und Inhalt aus');
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);

          createPost(
            { title, content, featuredImage: uint8Array },
            {
              onSuccess: () => {
                toast.success('Blog-Beitrag erfolgreich erstellt!');
                navigate({ to: '/blog' });
              },
              onError: (error) => {
                toast.error(`Fehler beim Erstellen: ${error.message}`);
              },
            }
          );
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      createPost(
        { title, content, featuredImage: null },
        {
          onSuccess: () => {
            toast.success('Blog-Beitrag erfolgreich erstellt!');
            navigate({ to: '/blog' });
          },
          onError: (error) => {
            toast.error(`Fehler beim Erstellen: ${error.message}`);
          },
        }
      );
    }
  };

  if (isCheckingAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Button variant="ghost" onClick={() => navigate({ to: '/blog' })} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zurück zum Blog
      </Button>

      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Neuer Blog-Beitrag</CardTitle>
          <CardDescription>
            Erstellen Sie einen neuen Beitrag für Ihren Blog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titel des Beitrags"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Inhalt</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Schreiben Sie Ihren Beitrag..."
                rows={12}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Titelbild (optional)</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isPending}
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Ausgewählt: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <Button type="submit" disabled={isPending || !title || !content} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird erstellt...
                </>
              ) : (
                <>
                  <PenSquare className="mr-2 h-4 w-4" />
                  Beitrag veröffentlichen
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
