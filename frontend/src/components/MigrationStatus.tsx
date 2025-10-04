import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock, Database, Cloud } from "lucide-react";
import { useUserOperations } from "@/hooks/useUsersAPI";
import { useCategoryOperations } from "@/hooks/useCategoriesAPI";
import { useTagOperations } from "@/hooks/useTagsAPI";
import { useNoteOperations } from "@/hooks/useNotesAPI";

/**
 * Component to show the migration status of each entity
 * Helps track which entities are using API vs IndexedDB
 */
export const MigrationStatus: React.FC = () => {
  const userOps = useUserOperations();
  const categoryOps = useCategoryOperations();
  const tagOps = useTagOperations();
  const noteOps = useNoteOperations();

  const getStatusIcon = (migrated: boolean) => {
    return migrated ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Clock className="h-4 w-4 text-yellow-500" />
    );
  };

  const getDataSourceIcon = (migrated: boolean) => {
    return migrated ? (
      <Cloud className="h-4 w-4 text-blue-500" />
    ) : (
      <Database className="h-4 w-4 text-gray-500" />
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          🚀 Migration Status
        </CardTitle>
        <CardDescription>Entity-by-entity migration progress</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 text-sm">
          {/* Users Status */}
          <div className="border rounded p-3 bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(true)}
                <span className="font-medium">Users</span>
                {getDataSourceIcon(true)}
              </div>
              <Badge
                variant="outline"
                className="bg-green-500 text-white text-xs"
              >
                API ✅
              </Badge>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Loaded:</span>
              <span>
                {userOps.isLoading ? "Loading..." : userOps.users.length}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Source:</span>
              <span>Backend API</span>
            </div>
          </div>

          {/* Categories Status */}
          <div className="border rounded p-3 bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(true)}
                <span className="font-medium">Categories</span>
                {getDataSourceIcon(true)}
              </div>
              <Badge
                variant="outline"
                className="bg-green-500 text-white text-xs"
              >
                API ✅
              </Badge>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Loaded:</span>
              <span>
                {categoryOps.isLoading ? "Loading..." : categoryOps.categories.length}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Source:</span>
              <span>Backend API</span>
            </div>
          </div>

          {/* Tags Status */}
          <div className="border rounded p-3 bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(true)}
                <span className="font-medium">Tags</span>
                {getDataSourceIcon(true)}
              </div>
              <Badge
                variant="outline"
                className="bg-green-500 text-white text-xs"
              >
                API ✅
              </Badge>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Loaded:</span>
              <span>
                {tagOps.isLoading ? "Loading..." : tagOps.tags.length}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Source:</span>
              <span>Backend API</span>
            </div>
          </div>

          {/* Notes Status */}
          <div className="border rounded p-3 bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(true)}
                <span className="font-medium">Notes</span>
                {getDataSourceIcon(true)}
              </div>
              <Badge
                variant="outline"
                className="bg-green-500 text-white text-xs"
              >
                API ✅
              </Badge>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Loaded:</span>
              <span>
                {noteOps.isLoading ? "Loading..." : noteOps.notes.length}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Source:</span>
              <span>Backend API</span>
            </div>
          </div>
        </div>

        {import.meta.env.DEV && (
          <div className="mt-4 p-2 bg-green-100 rounded text-xs border border-green-300">
            <div className="font-medium mb-1 text-green-800">🎉 Phase 4: Complete Migration!</div>
            <div className="text-green-700">✅ Users now use Backend API</div>
            <div className="text-green-700">✅ Categories now use Backend API</div>
            <div className="text-green-700">✅ Tags now use Backend API</div>
            <div className="text-green-700">✅ Notes now use Backend API</div>
            <div className="font-medium mt-1 text-green-800">🚀 Full API Migration Complete!</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MigrationStatus;
