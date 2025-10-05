import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/contexts/AppContext";
import {
  Menu,
  Plus,
  Search,
  Star,
  Folder,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateNote } from "@/hooks/useNotesAPI";

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  className,
}) => {
  const {
    selectedCategory,
    selectedNote,
    setSelectedCategory,
    selectNote,
    categories,
    notes,
  } = useApp();
  const { mutateAsync: createNote } = useCreateNote();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleNewNote = () => {
    createNote({ title: "Nova Nota" });
    setIsOpen(false);
  };

  const handleCategorySelect = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    setIsOpen(false);
  };

  const handleBackToList = () => {
    selectNote(null);
  };

  const categoryCounts = categories.map((category) => ({
    ...category,
    count: notes.filter((note) => note.category.id === category.id).length,
  }));

  const favoriteCount = notes.filter((note) => note.isFavorite).length;

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 bg-background border-b border-border",
        className
      )}
    >
      {selectedNote ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackToList}
          aria-label="Voltar para lista de notas"
          className="hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      ) : (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Abrir menu de navegação"
              className="hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-sm font-medium truncate">
                      {user.name}
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4 border-b space-y-2">
                  <Button
                    onClick={handleNewNote}
                    className="w-full justify-start bg-gradient-primary hover:shadow-primary transition-all"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Nota
                  </Button>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Categorias
                  </h3>

                  <Button
                    variant={selectedCategory === null ? "secondary" : "ghost"}
                    className="w-full justify-between"
                    onClick={() => handleCategorySelect(null)}
                  >
                    <div className="flex items-center">
                      <Search className="h-4 w-4 mr-2" />
                      Todas as Notas
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {notes.length}
                    </Badge>
                  </Button>

                  <Button
                    variant={
                      selectedCategory === "favorites" ? "secondary" : "ghost"
                    }
                    className="w-full justify-between"
                    onClick={() => handleCategorySelect("favorites")}
                  >
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Favoritas
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {favoriteCount}
                    </Badge>
                  </Button>

                  {categoryCounts.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.name
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full justify-between"
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      <div className="flex items-center">
                        <Folder
                          className="h-4 w-4 mr-2"
                          style={{ color: category.color }}
                        />
                        <span className="truncate">{category.name}</span>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold text-foreground truncate">
          {selectedNote
            ? selectedNote.title
            : selectedCategory || "Todas as Notas"}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {!selectedNote && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewNote}
            aria-label="Criar nova nota"
            className="hover:bg-accent"
          >
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
