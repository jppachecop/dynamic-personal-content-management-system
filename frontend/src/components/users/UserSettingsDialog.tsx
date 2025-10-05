import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUser } from "@/hooks/useUsersAPI";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Settings, Edit, User as UserIcon } from "lucide-react";
import { User } from "@/types";
import DeleteAccountDialog from "./DeleteAccountDialog";

interface UserSettingsDialogProps {
  trigger?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export const UserSettingsDialog: React.FC<UserSettingsDialogProps> = ({
  trigger,
  onOpenChange,
}) => {
  const { user, updateUser } = useAuth();
  const updateUserMutation = useUpdateUser();
  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    try {
      // Preparar dados para envio - sempre incluir todos os campos
      const dataToUpdate: Partial<Omit<User, "id" | "createdAt" | "updatedAt">> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        avatar: formData.avatar.trim() || null, // Enviar null se vazio para remover
      };

      const updatedUser = await updateUserMutation.mutateAsync({
        id: user.id,
        data: dataToUpdate,
      });

      // Update user in auth context
      const newUserData: User = {
        ...user,
        ...updatedUser,
      };

      updateUser(newUserData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    });
    setIsEditing(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
    if (!open) {
      resetForm();
    }
  };

  if (!user) return null;

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="gap-2">
      <Settings className="h-4 w-4" />
      Configurações
    </Button>
  );

  const renderContent = () => (
    <>
      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={formData.avatar || undefined} alt={formData.name} />
            <AvatarFallback className="text-lg">
              {formData.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="avatar">URL do Avatar</Label>
                <div className="flex gap-2">
                  <Input
                    id="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatar}
                    onChange={(e) => handleInputChange("avatar", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange("avatar", "")}
                    className="px-3"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* User Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!isEditing}
              className={isEditing ? "" : "bg-muted"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              className={isEditing ? "" : "bg-muted"}
            />
          </div>
        </div>
      </div>

      <div className="flex-col space-y-2 sm:flex-row sm:space-y-0 mt-6">
        {isEditing ? (
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={resetForm}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={updateUserMutation.isPending}
              className="flex-1"
            >
              {updateUserMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        ) : (
          <div className="flex w-full gap-2">
            <DeleteAccountDialog />

            <Button
              onClick={() => setIsEditing(true)}
              variant="default"
              size="sm"
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          {trigger || defaultTrigger}
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Configurações do Usuário
            </SheetTitle>
            <SheetDescription>
              Gerencie suas informações pessoais e configurações da conta.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 overflow-y-auto flex-1">
            {renderContent()}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="mx-2 max-w-md sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Configurações do Usuário
          </DialogTitle>
          <DialogDescription>
            Gerencie suas informações pessoais e configurações da conta.
          </DialogDescription>
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingsDialog;