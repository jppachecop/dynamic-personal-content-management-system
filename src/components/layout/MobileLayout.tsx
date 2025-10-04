import React from 'react';
import { MobileNavigation } from './MobileNavigation';
import { NotesList } from '../notes/NotesList';
import { NoteEditor } from '../notes/NoteEditor';
import { useApp } from '@/contexts/AppContext';

export const MobileLayout: React.FC = () => {
    const { state } = useApp();
    const { selectedNote } = state;

    return (
        <div className="h-screen flex flex-col bg-background">
            <MobileNavigation />

            <div className="flex-1 overflow-hidden">
                {selectedNote ? (
                    <div className="h-full">
                        <NoteEditor />
                    </div>
                ) : (
                    <div className="h-full">
                        <NotesList />
                    </div>
                )}
            </div>
        </div>
    );
};