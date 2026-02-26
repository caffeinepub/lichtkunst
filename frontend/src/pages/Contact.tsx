import { useState } from 'react';
import { useSubmitContactForm } from '../hooks/useSubmitContactForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const { mutate: submitForm, isPending, isSuccess, isError, error } = useSubmitContactForm();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Client-side validation
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setValidationError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    submitForm(
      { name, email, subject, message },
      {
        onSuccess: () => {
          // Clear form on success
          setName('');
          setEmail('');
          setSubject('');
          setMessage('');
        },
      }
    );
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-serif text-3xl">Kontakt</CardTitle>
          <CardDescription>
            Haben Sie Fragen zu unseren Lichtkunstwerken oder NFTs? Schreiben Sie uns eine Nachricht.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess && (
            <Alert className="mb-6 border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                Vielen Dank für Ihre Nachricht! Wir werden uns baldmöglichst bei Ihnen melden.
              </AlertDescription>
            </Alert>
          )}

          {(isError || validationError) && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertDescription className="text-destructive">
                {validationError || (error as Error)?.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ihr Name"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre.email@beispiel.de"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Betreff</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Worum geht es?"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Nachricht</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ihre Nachricht an uns..."
                rows={6}
                disabled={isPending}
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Nachricht senden
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
