import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useDeleteUser } from "@/hooks/useUsersAPI";
import { toast } from "@/hooks/use-toast";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteAccountDialogProps {
    trigger?: React.ReactNode;
}

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
    trigger,
}) => {
    const { user, logout } = useAuth();
    const deleteUserMutation = useDeleteUser();
    const [confirmationText, setConfirmationText] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const confirmationPhrase = "DELETAR MINHA CONTA";
    const isConfirmationValid = confirmationText === confirmationPhrase;

    const handleDeleteAccount = async () => {
        if (!user || !isConfirmationValid) return;

        try {
            await deleteUserMutation.mutateAsync(user.id);

            toast({
                title: "Conta deletada",
                description: "Sua conta foi deletada permanentemente.",
            });

            logout();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({
                title: "Erro",
                description: "Não foi possível deletar a conta. Tente novamente.",
                variant: "destructive",
            });
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setConfirmationText("");
        }
    };

    if (!user) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                {trigger || (
                    <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Deletar Conta
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Deletar Conta Permanentemente
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                        <p className="text-sm">
                            Esta ação é <strong>irreversível</strong> e resultará na{" "}
                            <strong>perda permanente</strong> de:
                        </p>
                        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                            <li>Todas as suas notas e conteúdos</li>
                            <li>Todas as suas categorias personalizadas</li>
                            <li>Todos os seus dados pessoais</li>
                            <li>Histórico de atividades</li>
                        </ul>
                        <p className="text-sm font-medium text-destructive">
                            Esta ação não pode ser desfeita!
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="confirmation" className="text-sm font-medium">
                            Para confirmar, digite:{" "}
                            <span className="font-mono text-destructive">
                                {confirmationPhrase}
                            </span>
                        </Label>
                        <Input
                            id="confirmation"
                            type="text"
                            placeholder="Digite a frase de confirmação"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            className={confirmationText && !isConfirmationValid
                                ? "border-destructive focus:border-destructive"
                                : ""
                            }
                        />
                        {confirmationText && !isConfirmationValid && (
                            <p className="text-xs text-destructive">
                                A frase de confirmação não confere.
                            </p>
                        )}
                    </div>

                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <p className="text-xs text-destructive">
                            <strong>Atenção:</strong> Após confirmar, sua conta será deletada
                            imediatamente e você será desconectado do sistema.
                        </p>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmationText("")}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={!isConfirmationValid || deleteUserMutation.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleteUserMutation.isPending ? (
                            "Deletando..."
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Deletar Conta
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteAccountDialog;