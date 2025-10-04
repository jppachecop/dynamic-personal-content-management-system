import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sgcpd-notes-editor-split';
const DEFAULT_NOTES_SIZE = 35;

export const useNotesEditorSplit = () => {
    const [notesSize, setNotesSize] = useState(DEFAULT_NOTES_SIZE);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const size = parseInt(saved, 10);
                if (size >= 25 && size <= 60) {
                    setNotesSize(size);
                }
            }
        } catch (error) {
            console.warn('Failed to load notes/editor split from localStorage:', error);
        }
    }, []);

    const saveNotesSize = (size: number) => {
        try {
            setNotesSize(size);
            localStorage.setItem(STORAGE_KEY, size.toString());
        } catch (error) {
            console.warn('Failed to save notes/editor split to localStorage:', error);
        }
    };

    const getEditorSize = () => {
        return 100 - notesSize;
    };

    const resetSizes = () => {
        try {
            setNotesSize(DEFAULT_NOTES_SIZE);
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.warn('Failed to reset notes/editor split:', error);
        }
    };

    return {
        notesSize,
        editorSize: getEditorSize(),
        saveNotesSize,
        resetSizes,
    };
};