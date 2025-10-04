import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { BookOpen, User, Mail, LogIn, UserPlus } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { createUser, loginUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email.trim()) return;

    setIsLoading(true);
    try {
      await loginUser(loginForm.email.trim());
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name.trim() || !registerForm.email.trim()) return;

    setIsLoading(true);
    try {
      await createUser({
        name: registerForm.name.trim(),
        email: registerForm.email.trim(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-primary">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            SGCPD
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sistema de Gerenciamento de Conteúdo Pessoal Dinâmico
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">Bem-vindo</CardTitle>
            <CardDescription className="text-center">
              Entre em sua conta ou crie uma nova para começar
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Cadastrar
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      className="transition-all focus:shadow-primary"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:shadow-primary transition-all"
                    disabled={isLoading || !loginForm.email.trim()}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nome
                    </Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      required
                      className="transition-all focus:shadow-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                      className="transition-all focus:shadow-primary"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-accent hover:shadow-lg transition-all"
                    disabled={isLoading || !registerForm.name.trim() || !registerForm.email.trim()}
                  >
                    {isLoading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>✨ Organize suas notas • 🏷️ Sistema de tags • 🔍 Busca avançada</p>
        </div>
      </div>
    </div>
  );
};