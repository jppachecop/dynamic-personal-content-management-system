import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import {
  Menu,
  Plus,
  Search,
  Star,
  Folder,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CategoryDialog from "../CategoryDialog";

export const AppSidebar: React.FC = () => {
  const { state, toggleSidebar, createNote, logoutUser, setSelectedCategory } =
    useApp();
  const { sidebarOpen, currentUser, categories, notes, selectedCategory } =
    state;
  const [categoryDialogOpen, setCategoryDialogOpen] = React.useState(false);

  if (!currentUser) return null;

  const handleNewNote = () => {
    createNote("Nova Nota");
  };

  const categoryCounts = categories.map((category) => ({
    ...category,
    count: notes.filter((note) => note.category === category.name).length,
  }));

  const favoriteCount = notes.filter((note) => note.isFavorite).length;

  return (
    <>
      <CategoryDialog
        userId={currentUser.id}
        categoryDialogOpen={categoryDialogOpen}
        setCategoryDialogOpen={setCategoryDialogOpen}
      />
      <div
        className={cn(
          "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
          sidebarOpen ? "w-80" : "w-16"
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="shrink-0 hover:bg-sidebar-accent"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {sidebarOpen && (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser.email}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-4 border-b border-sidebar-border">
          <Button
            onClick={handleNewNote}
            className={cn(
              "bg-gradient-primary hover:shadow-primary transition-all",
              sidebarOpen ? "w-full justify-start" : "w-full p-2"
            )}
          >
            <Plus className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Nova Nota</span>}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <Button
              variant={!selectedCategory ? "secondary" : "ghost"}
              className={cn(
                "justify-start transition-colors",
                sidebarOpen ? "w-full" : "w-full p-2"
              )}
              onClick={() => setSelectedCategory(null)}
            >
              <Search className="h-4 w-4" />
              {sidebarOpen && (
                <>
                  <span className="ml-2">Todas as Notas</span>
                  <Badge variant="secondary" className="ml-auto">
                    {notes.length}
                  </Badge>
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "justify-start transition-colors",
                sidebarOpen ? "w-full" : "w-full p-2"
              )}
              onClick={() => setSelectedCategory("Favoritas")}
            >
              <Star className="h-4 w-4" />
              {sidebarOpen && (
                <>
                  <span className="ml-2">Favoritas</span>
                  {favoriteCount > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {favoriteCount}
                    </Badge>
                  )}
                </>
              )}
            </Button>

            {sidebarOpen && (
              <div className="pt-4">
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Categorias
                </div>
                <div className="space-y-1 mt-2">
                  {categoryCounts.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.name
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full justify-start transition-colors"
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <Folder
                        className="h-4 w-4"
                        style={{ color: category.color }}
                      />
                      <span className="ml-2">{category.name}</span>
                      {category.count > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {category.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start transition-colors"
                    onClick={() => setCategoryDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="ml-2">Nova Categoria</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-2 border-t border-sidebar-border">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={cn(
                "justify-start text-muted-foreground hover:text-foreground transition-colors",
                sidebarOpen ? "w-full" : "w-full p-2"
              )}
            >
              <Settings className="h-4 w-4" />
              {sidebarOpen && <span className="ml-2">Configurações</span>}
            </Button>

            <Button
              variant="ghost"
              onClick={logoutUser}
              className={cn(
                "justify-start text-muted-foreground hover:text-destructive transition-colors",
                sidebarOpen ? "w-full" : "w-full p-2"
              )}
            >
              <LogOut className="h-4 w-4" />
              {sidebarOpen && <span className="ml-2">Sair</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
