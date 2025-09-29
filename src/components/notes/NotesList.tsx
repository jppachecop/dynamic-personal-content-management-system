import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { Note } from '@/types';
import { 
  Search, 
  Plus, 
  Star, 
  MoreVertical,
  Calendar,
  Tag,
  FileText
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const NotesList: React.FC = () => {
  const { 
    state, 
    createNote, 
    selectNote, 
    setSearchQuery,
    deleteNote 
  } = useApp();
  
  const { 
    notes, 
    selectedNote, 
    searchQuery, 
    selectedCategory, 
    selectedTags,
    categories 
  } = state;

  const filteredNotes = useMemo(() => {
    let filtered = [...notes];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note => 
        selectedTags.some(tag => note.tags.includes(tag))
      );
    }

    // Sort by updated date (most recent first)
    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return filtered;
  }, [notes, searchQuery, selectedCategory, selectedTags]);

  const handleNewNote = () => {
    createNote('Nova Nota');
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#3B82F6';
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {selectedCategory || 'Todas as Notas'}
          </h2>
          <Button 
            size="sm"
            onClick={handleNewNote}
            className="bg-gradient-primary hover:shadow-primary transition-all"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar notas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 transition-all focus:shadow-primary"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? 'Nenhuma nota encontrada' : 'Nenhuma nota ainda'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Tente alterar os termos de busca.' 
                : 'Crie sua primeira nota para começar!'
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={handleNewNote}
                className="bg-gradient-primary hover:shadow-primary transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Nota
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <Card 
                key={note.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md border-l-4",
                  selectedNote?.id === note.id 
                    ? "bg-primary/5 border-primary shadow-primary/20" 
                    : "hover:bg-muted/50"
                )}
                style={{ 
                  borderLeftColor: getCategoryColor(note.category) 
                }}
                onClick={() => selectNote(note)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground line-clamp-1 flex-1">
                      {note.title || 'Sem título'}
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
                      {note.isFavorite && (
                        <Star className="h-4 w-4 text-warning fill-current" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Add context menu
                        }}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {note.content && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {truncateContent(note.content)}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(note.updatedAt), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    </div>
                    
                    {note.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span>{note.tags.length}</span>
                      </div>
                    )}
                  </div>
                  
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs px-2 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};