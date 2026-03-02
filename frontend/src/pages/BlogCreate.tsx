import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Info } from 'lucide-react';

export default function BlogCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <main className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-8 gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate({ to: '/blog' })}
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Blog
        </Button>

        <Card className="border border-border/20">
          <CardHeader>
            <CardTitle className="font-serif font-thin text-3xl">Neuer Beitrag</CardTitle>
            <CardDescription>Erstellen Sie einen neuen Blog-Beitrag.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 border-border/20">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Die Blog-Erstellung ist derzeit nicht verfügbar, da das System auf NFTs umgestellt wurde.
              </AlertDescription>
            </Alert>
            <div className="space-y-5 opacity-50 pointer-events-none">
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titel des Beitrags"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Inhalt</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Inhalt des Beitrags..."
                  rows={10}
                  disabled
                />
              </div>
              <div className="flex justify-end">
                <Button disabled>Veröffentlichen</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
