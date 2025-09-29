import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { Note } from '@/types';
import { 
  Star, 
  Tag, 
  Save, 
  Trash2, 
  Plus,
  X,
  Calendar,
  Folder
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const NoteEditor: React.FC = () => {
  const { 
    state, 
    updateNote, 
    deleteNote, 
    selectNote 
  } = useApp();
  
  const { selectedNote, categories } = state;
  const [editedNote, setEditedNote] = useState<Note | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Update edited note when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setEditedNote({ ...selectedNote });
      setHasChanges(false);
    } else {
      setEditedNote(null);
      setHasChanges(false);
    }
  }, [selectedNote]);

  // Auto-save when changes are detected
  const debouncedSave = useCallback(() => {
    const timeoutId = setTimeout(() => {
      if (editedNote && hasChanges) {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [editedNote, hasChanges]);

  useEffect(() => {
    if (hasChanges) {
      const cleanup = debouncedSave();
      return cleanup;
    }
  }, [hasChanges, debouncedSave]);

  const handleSave = async () => {
    if (!editedNote) return;
    
    try {
      await updateNote(editedNote);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDelete = async () => {
    if (!editedNote) return;
    
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      await deleteNote(editedNote.id);
      selectNote(null);
    }
  };

  const handleFieldChange = (field: keyof Note, value: any) => {
    if (!editedNote) return;
    
    setEditedNote({
      ...editedNote,
      [field]: value,
    });
    setHasChanges(true);
  };

  const handleAddTag = () => {
    if (!editedNote || !newTag.trim()) return;
    
    const tag = newTag.trim();
    if (!editedNote.tags.includes(tag)) {
      handleFieldChange('tags', [...editedNote.tags, tag]);
    }
    
    setNewTag('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editedNote) return;
    handleFieldChange('tags', editedNote.tags.filter(tag => tag !== tagToRemove));
  };

  const toggleFavorite = () => {
    if (!editedNote) return;
    handleFieldChange('isFavorite', !editedNote.isFavorite);
  };

  if (!editedNote) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhuma nota selecionada
          </h3>
          <p className="text-muted-foreground">
            Selecione uma nota da lista para começar a editar
          </p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#3B82F6';
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: getCategoryColor(editedNote.category) }}
            />
            <div className="text-sm text-muted-foreground">
              {editedNote.category}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className={cn(
                "transition-colors",
                editedNote.isFavorite 
                  ? "text-warning hover:text-warning/80" 
                  : "text-muted-foreground hover:text-warning"
              )}
            >
              <Star className={cn("h-4 w-4", editedNote.isFavorite && "fill-current")} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={!hasChanges}
              className="text-accent hover:text-accent/80 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Selection */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-muted-foreground" />
            <Select
              value={editedNote.category}
              onValueChange={(value) => handleFieldChange('category', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Atualizada {formatDistanceToNow(new Date(editedNote.updatedAt), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </span>
          </div>
        </div>

        {/* Title */}
        <Input
          value={editedNote.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder="Título da nota..."
          className="text-xl font-bold border-none p-0 h-auto bg-transparent focus:ring-0 focus:border-none shadow-none"
        />
      </div>

      {/* Tags */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-4 w-4 text-muted-foreground" />
          
          {editedNote.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              {tag}
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleRemoveTag(tag)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
          
          {isAddingTag ? (
            <div className="flex items-center gap-1">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  } else if (e.key === 'Escape') {
                    setNewTag('');
                    setIsAddingTag(false);
                  }
                }}
                placeholder="Nova tag..."
                className="h-6 text-xs w-24"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0"
                onClick={handleAddTag}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setIsAddingTag(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Tag
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <Textarea
          value={editedNote.content}
          onChange={(e) => handleFieldChange('content', e.target.value)}
          placeholder="Comece a escrever sua nota aqui..."
          className="h-full resize-none border-none p-0 bg-transparent focus:ring-0 shadow-none text-base"
        />
      </div>

      {/* Status Bar */}
      {hasChanges && (
        <div className="px-4 py-2 bg-muted/50 border-t text-xs text-muted-foreground">
          Salvando automaticamente...
        </div>
      )}
    </div>
  );
};