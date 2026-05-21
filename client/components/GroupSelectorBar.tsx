import { useState } from "react";
import { useGroup } from "@/contexts/GroupContext";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GroupCreationModal } from "./GroupCreationModal";

export function GroupSelectorBar() {
  const { groups, selectedGroupId, setSelectedGroupId, selectedGroup } =
    useGroup();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Viewing Group:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-border bg-background hover:bg-secondary"
              >
                {selectedGroup?.name || "Select Group"}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-48">
              {groups.map((group) => (
                <DropdownMenuItem
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={selectedGroupId === group.id ? "bg-accent/20" : ""}
                >
                  {group.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          className="gap-2 bg-accent hover:bg-orange-600 text-accent-foreground"
        >
          <Plus className="w-4 h-4" />
          Create New Group
        </Button>
      </div>

      <GroupCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
}
