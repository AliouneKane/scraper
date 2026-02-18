'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome, Mail } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const supabase = createClient();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            },
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Un lien de connexion a été envoyé à votre adresse email.' });
        }
        setLoading(false);
    };

    const handleProviderLogin = async (provider: 'google') => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) setMessage({ type: 'error', text: error.message });
        setLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Bienvenue sur Pulse.AI</DialogTitle>
                    <DialogDescription className="text-center">
                        Connectez-vous pour enregistrer vos articles et les retrouver partout.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <Button
                        variant="outline"
                        onClick={() => handleProviderLogin('google')}
                        disabled={loading}
                        className="w-full gap-2 py-6 text-base font-medium"
                    >
                        <Chrome className="h-5 w-5" />
                        Continuer avec Google
                    </Button>

                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Ou avec votre email</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="grid gap-3">
                        <div className="grid gap-1">
                            <Label htmlFor="email" className="sr-only">Email</Label>
                            <Input
                                id="email"
                                placeholder="nom@exemple.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={loading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="py-6"
                            />
                        </div>
                        <Button disabled={loading} className="py-6 text-base font-medium">
                            {loading ? "Connexion en cours..." : "Recevoir un lien magique"}
                            <Mail className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    {message && (
                        <div className={`p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                            {message.text}
                        </div>
                    )}
                </div>

                <p className="text-center text-xs text-muted-foreground px-8">
                    En continuant, vous acceptez nos Conditions d&apos;utilisation et notre Politique de confidentialité.
                </p>
            </DialogContent>
        </Dialog>
    );
}
