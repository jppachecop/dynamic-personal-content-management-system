import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';

const Index = () => {
  const { state } = useApp();
  
  if (state.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-bg">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return <AppLayout />;
};

export default Index;
