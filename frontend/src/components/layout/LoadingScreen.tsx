import React from "react";
import { Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Carregando...",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen bg-background",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Logo/Icon */}
        <div className="relative">
          <FileText className="h-12 w-12 text-primary/20" />
          <Loader2 className="h-8 w-8 animate-spin text-primary absolute top-2 left-2" />
        </div>
        
        {/* Loading message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">{message}</p>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
