import React, { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { useScreenSize } from "@/hooks/use-mobile";
import { Search, Plus, Star, Calendar, Tag, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCreateNote } from "@/hooks/useNotesAPI";

export const NotesList: React.FC = () => {
  const {
    selectedNote,
    searchQuery,
    selectedCategory,
    selectNote,
    setSearchQuery,
    categories,
    notes,
  } = useApp();
  const { mutateAsync: createNote } = useCreateNote();
  const { isMobile } = useScreenSize();

  const filteredNotes = useMemo(() => {
    let filtered = [...notes];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content?.toLowerCase().includes(query) ||
          note.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) {
      if (selectedCategory === "Favoritas") {
        filtered = filtered.filter((note) => note.isFavorite);
      } else {
        filtered = filtered.filter(
          (note) => note.category?.name === selectedCategory
        );
      }
    }

    filtered.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return filtered;
  }, [notes, searchQuery, selectedCategory]);

  const handleNewNote = useCallback(() => {
    createNote({ title: "Nova Nota" });
  }, [createNote]);

  const getCategoryColor = useCallback(
    (categoryName: string) => {
      const category = categories.find((cat) => cat.name === categoryName);
      return category?.color || "#3B82F6";
    },
    [categories]
  );

  const truncateContent = useCallback(
    (content: string | null, maxLength: number = 100) => {
      if (!content) return "";
      if (content.length <= maxLength) return content;
      return content.substring(0, maxLength) + "...";
    },
    []
  );

  return (
    <div className="h-full flex flex-col bg-card">
      {!isMobile && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {selectedCategory || "Todas as Notas"}
            </h2>
            <Button
              size="sm"
              onClick={handleNewNote}
              className="bg-gradient-primary hover:shadow-primary transition-all"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

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
      )}

      {isMobile && (
        <div className="p-4 border-b border-border">
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
      )}

      <div className={cn("flex-1 overflow-y-auto", isMobile ? "p-2" : "p-2")}>
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? "Nenhuma nota encontrada" : "Nenhuma nota ainda"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Tente alterar os termos de busca."
                : "Crie sua primeira nota para começar!"}
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
                  "cursor-pointer transition-all hover:shadow-md border-l-4 group",
                  selectedNote?.id === note.id
                    ? "bg-primary/5 border-primary shadow-primary/20"
                    : "hover:bg-muted/50",
                  isMobile && "active:scale-[0.98]"
                )}
                style={{
                  borderLeftColor: getCategoryColor(note.category?.name || ""),
                }}
                onClick={() => selectNote(note)}
                role="button"
                tabIndex={0}
                aria-label={`Abrir nota: ${note.title || "Sem título"}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectNote(note);
                  }
                }}
              >
                <CardContent className={cn(isMobile ? "p-3" : "p-4")}>
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className={cn(
                        "font-medium text-foreground line-clamp-1 flex-1",
                        isMobile ? "text-base" : "text-sm"
                      )}
                    >
                      {note.title || "Sem título"}
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
                      {note.isFavorite && (
                        <Star className="h-4 w-4 text-warning fill-current" />
                      )}
                    </div>
                  </div>

                  {note.content && (
                    <p
                      className={cn(
                        "text-muted-foreground line-clamp-2 mb-3",
                        isMobile ? "text-sm" : "text-xs"
                      )}
                    >
                      {truncateContent(note.content)}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(note.updatedAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>

                      {note.category && (
                        <div className="flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: note.category.color }}
                          />
                          <span className="text-xs">{note.category.name}</span>
                        </div>
                      )}
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
