import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useCreateCategory } from "@/hooks/useCategoriesAPI";
import { toast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

interface CategoryDialogProps {
  categoryDialogOpen: boolean;
  setCategoryDialogOpen: (open: boolean) => void;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  categoryDialogOpen,
  setCategoryDialogOpen,
}) => {
  const { state } = useApp();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [isLoading, setIsLoading] = useState(false);

  const createCategory = useCreateCategory();

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && categoryDialogOpen && !isLoading) {
        setCategoryDialogOpen(false);
      }
    };

    if (categoryDialogOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Focus the name input when modal opens
      setTimeout(() => {
        const nameInput = document.getElementById("name");
        nameInput?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [categoryDialogOpen, setCategoryDialogOpen, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createCategory.mutateAsync({
        name: name.trim(),
        color,
        userId: state.currentUser?.id,
      });

      toast({
        title: "Categoria criada",
        description: `Categoria "${name}" criada com sucesso!`,
      });

      setName("");
      setColor("#3B82F6");
      setCategoryDialogOpen(false);
    } catch (error) {
      console.error("Failed to create category:", error);
      toast({
        title: "Erro",
        description: "Falha ao criar categoria",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedColors = [
    "#3B82F6", // Blue
    "#8B5CF6", // Purple
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#06B6D4", // Cyan
    "#84CC16", // Lime
    "#F97316", // Orange
  ];

  if (!categoryDialogOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => setCategoryDialogOpen(false)}
      >
        {/* Modal Content */}
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Criar Nova Categoria
            </h2>
            <button
              onClick={() => setCategoryDialogOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome da categoria"
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Cor da Categoria</Label>
              <div className="flex gap-2 flex-wrap">
                {predefinedColors.map((colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      color === colorOption
                        ? "border-gray-800 dark:border-white"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    style={{ backgroundColor: colorOption }}
                    onClick={() => setColor(colorOption)}
                    disabled={isLoading}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10"
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCategoryDialogOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Categoria"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CategoryDialog;
