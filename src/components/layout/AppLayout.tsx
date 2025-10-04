import React from 'react';
import { AppSidebar } from './AppSidebar';
import { MobileLayout } from './MobileLayout';
import { NotesList } from '../notes/NotesList';
import { NoteEditor } from '../notes/NoteEditor';
import { WelcomeScreen } from '../ui/WelcomeScreen';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useApp } from '@/contexts/AppContext';
import { useNotesEditorSplit } from '@/hooks/useNotesEditorSplit';
import { useScreenSize } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const AppLayout: React.FC = () => {
  const { state } = useApp();
  const { sidebarOpen, selectedNote, currentUser } = state;
  const { notesSize, editorSize, saveNotesSize } = useNotesEditorSplit();
  const { isMobile, isTablet } = useScreenSize();

  if (!currentUser) {
    return <WelcomeScreen />;
  }

  if (isMobile) {
    return <MobileLayout />;
  }

  const handleResize = (sizes: number[]) => {
    if (sizes.length === 2) {
      saveNotesSize(sizes[0]);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-bg overflow-hidden">
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isTablet && selectedNote ? "hidden" : "",
        sidebarOpen ? "w-80" : "w-16"
      )}>
        <AppSidebar />
      </div>

      {selectedNote ? (
        <div className="flex-1 relative">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full"
            onLayout={handleResize}
          >
            <ResizablePanel
              defaultSize={notesSize}
              minSize={25}
              maxSize={60}
              className="border-r border-border bg-card"
            >
              <NotesList />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel
              defaultSize={editorSize}
              minSize={40}
              className="bg-background"
            >
              <NoteEditor />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ) : (
        <div className="flex-1 bg-card border-r border-border">
          <NotesList />
        </div>
      )}
    </div>
  );
};