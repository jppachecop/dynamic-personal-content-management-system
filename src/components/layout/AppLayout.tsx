import React from 'react';
import { AppSidebar } from './AppSidebar';
import { NotesList } from '../notes/NotesList';
import { NoteEditor } from '../notes/NoteEditor';
import { WelcomeScreen } from '../ui/WelcomeScreen';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export const AppLayout: React.FC = () => {
  const { state } = useApp();
  const { sidebarOpen, selectedNote, currentUser } = state;

  if (!currentUser) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex h-screen bg-gradient-bg overflow-hidden">
      {/* Sidebar */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-80" : "w-16"
      )}>
        <AppSidebar />
      </div>

      {/* Notes List */}
      <div className={cn(
        "transition-all duration-300 ease-in-out border-r border-border bg-card",
        selectedNote ? "w-80" : "flex-1"
      )}>
        <NotesList />
      </div>

      {/* Note Editor */}
      {selectedNote && (
        <div className="flex-1 bg-background">
          <NoteEditor />
        </div>
      )}
    </div>
  );
};