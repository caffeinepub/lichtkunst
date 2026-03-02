import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Send, CheckCircle, Info } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-thin text-foreground mb-4">Kontakt</h1>
          <p className="text-muted-foreground text-lg">
            Haben Sie Fragen oder möchten Sie ein Kunstwerk erwerben? Schreiben Sie mir.
          </p>
        </div>

        {submitted ? (
          <Card className="border border-border/20">
            <CardContent className="pt-8 pb-8 text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-thin mb-2">Vielen Dank!</h2>
              <p className="text-muted-foreground">
                Ihre Nachricht wurde empfangen. Ich melde mich so bald wie möglich bei Ihnen.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
              >
                Neue Nachricht
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-border/20">
            <CardHeader>
              <CardTitle className="font-serif font-thin text-2xl">Nachricht senden</CardTitle>
              <CardDescription>
                Füllen Sie das Formular aus und ich werde mich bei Ihnen melden.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 border-border/20">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Das Kontaktformular ist derzeit im Aufbau. Ihre Nachricht wird lokal gespeichert.
                </AlertDescription>
              </Alert>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ihr Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ihre@email.de"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Betreff *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Worum geht es?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Nachricht *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Ihre Nachricht..."
                    rows={6}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!formData.name || !formData.email || !formData.subject || !formData.message}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Absenden
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
