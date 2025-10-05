import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { useScreenSize } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Note } from "@/types";
import {
  Star,
  Tag,
  Save,
  Trash2,
  Plus,
  X,
  Calendar,
  Folder,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDeleteNote, useUpdateNote } from "@/hooks/useNotesAPI";
import { toast } from "@/hooks/use-toast";

export const NoteEditor: React.FC = () => {
  const { selectedNote, selectNote, categories } = useApp();
  const { isMobile } = useScreenSize();
  const [editedNote, setEditedNote] = useState<Note | null>(null);
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const deleteNote = useDeleteNote();
  const updateNote = useUpdateNote();

  useEffect(() => {
    if (selectedNote) {
      setEditedNote({ ...selectedNote });
    } else {
      setEditedNote(null);
    }
  }, [selectedNote]);

  const handleSave = useCallback(async () => {
    if (!editedNote) return;

    try {
      await updateNote.mutateAsync({
        id: editedNote.id,
        data: {
          title: editedNote.title,
          content: editedNote.content,
          tags: editedNote.tags,
          categoryId: editedNote.categoryId,
          isFavorite: editedNote.isFavorite,
        },
      });

      toast({
        title: "Nota atualizada",
        description: "Nota salva com sucesso.",
      });
    } catch (error) {
      console.error("Failed to update note:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar nota.",
        variant: "destructive",
      });
    }
  }, [editedNote, updateNote]);

  const handleDelete = async () => {
    if (!editedNote) return;

    if (window.confirm("Tem certeza que deseja excluir esta nota?")) {
      try {
        await deleteNote.mutateAsync(editedNote.id);
        selectNote(null);

        toast({
          title: "Nota excluída",
          description: "Nota removida com sucesso.",
        });
      } catch (error) {
        console.error("Failed to delete note:", error);
        toast({
          title: "Erro",
          description: "Falha ao excluir nota.",
          variant: "destructive",
        });
      }

      selectNote(null);
    }
  };

  const handleFieldChange = (
    field: keyof Note,
    value: string | boolean | string[]
  ) => {
    if (!editedNote) return;

    setEditedNote({
      ...editedNote,
      [field]: value,
    });
  };

  const handleAddTag = () => {
    if (!editedNote || !newTag.trim()) return;

    const tag = newTag.trim();
    if (!editedNote.tags.includes(tag)) {
      handleFieldChange("tags", [...editedNote.tags, tag]);
    }

    setNewTag("");
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editedNote) return;
    handleFieldChange(
      "tags",
      editedNote.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const toggleFavorite = () => {
    if (!editedNote) return;
    handleFieldChange("isFavorite", !editedNote.isFavorite);
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
    const category = categories.find((cat) => cat.name === categoryName);
    return category?.color || "#3B82F6";
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div
        className={cn(
          "border-b border-border bg-card",
          isMobile ? "p-3" : "p-4"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="w-1 h-6 rounded-full flex-shrink-0"
              style={{
                backgroundColor: getCategoryColor(
                  categories.find((cat) => cat.id === editedNote.categoryId)
                    ?.name || ""
                ),
              }}
            />
            <div className="text-sm text-muted-foreground truncate">
              {categories.find((cat) => cat.id === editedNote.categoryId)
                ?.name || "Sem categoria"}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className={cn(
                "transition-colors",
                editedNote.isFavorite
                  ? "text-warning hover:text-warning/80"
                  : "text-muted-foreground hover:text-warning",
                isMobile && "h-8 w-8"
              )}
              aria-label={
                editedNote.isFavorite
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"
              }
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  editedNote.isFavorite && "fill-current"
                )}
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={cn(
                "text-accent hover:text-accent/80",
                isMobile && "h-8 w-8"
              )}
              aria-label="Salvar nota"
            >
              <Save className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className={cn(
                "text-destructive hover:text-destructive/80",
                isMobile && "h-8 w-8"
              )}
              aria-label="Excluir nota"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center mb-4",
            isMobile ? "flex-col gap-3" : "gap-4"
          )}
        >
          <div className={cn("flex items-center gap-2", isMobile && "w-full")}>
            <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select
              defaultValue={editedNote.category?.id}
              value={editedNote.categoryId}
              onValueChange={(value) => handleFieldChange("categoryId", value)}
            >
              <SelectTrigger className={cn(isMobile ? "w-full" : "w-40")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
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

          <div
            className={cn(
              "flex items-center gap-2 text-muted-foreground",
              isMobile ? "w-full justify-start text-xs" : "text-sm"
            )}
          >
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>
              Atualizada{" "}
              {formatDistanceToNow(new Date(editedNote.updatedAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </div>
        </div>

        <Input
          value={editedNote.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          placeholder="Título da nota..."
          className={cn(
            "font-bold border-none p-0 h-auto bg-transparent focus:ring-0 focus:border-none shadow-none",
            isMobile ? "text-lg" : "text-xl"
          )}
        />
      </div>

      <div
        className={cn(
          "border-b border-border bg-card",
          isMobile ? "p-3" : "p-4"
        )}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />

          {editedNote.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn("flex items-center gap-1", isMobile && "text-xs")}
            >
              {tag}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "p-0 hover:bg-destructive hover:text-destructive-foreground",
                  isMobile ? "h-3 w-3" : "h-3 w-3"
                )}
                onClick={() => handleRemoveTag(tag)}
                aria-label={`Remover tag ${tag}`}
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
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  } else if (e.key === "Escape") {
                    setNewTag("");
                    setIsAddingTag(false);
                  }
                }}
                placeholder="Nova tag..."
                className={cn("h-6 text-xs", isMobile ? "w-20" : "w-24")}
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className={cn("p-0", isMobile ? "h-4 w-4" : "h-5 w-5")}
                onClick={handleAddTag}
                aria-label="Adicionar tag"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className={cn("px-2 text-xs", isMobile ? "h-5" : "h-6")}
              onClick={() => setIsAddingTag(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Tag
            </Button>
          )}
        </div>
      </div>

      <div className={cn("flex-1", isMobile ? "p-3" : "p-4")}>
        <Textarea
          value={editedNote.content}
          onChange={(e) => handleFieldChange("content", e.target.value)}
          placeholder="Comece a escrever sua nota aqui..."
          className={cn(
            "h-full resize-none border-none p-0 bg-transparent focus:ring-0 shadow-none",
            isMobile ? "text-sm" : "text-base"
          )}
        />
      </div>
    </div>
  );
};
