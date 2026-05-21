import { useState, useMemo } from "react";
import { useGroup } from "@/contexts/GroupContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockAthletes } from "@/data/mockData";
import { X, Check } from "lucide-react";

interface GroupCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GroupCreationModal({ isOpen, onClose }: GroupCreationModalProps) {
  const { createGroup } = useGroup();
  const [groupName, setGroupName] = useState("");
  const [selectedAthletes, setSelectedAthletes] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAthletes = useMemo(() => {
    return mockAthletes.filter((athlete) =>
      athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const allVisible = filteredAthletes.every((a) => selectedAthletes.has(a.id));
  const someVisible = filteredAthletes.some((a) => selectedAthletes.has(a.id));

  const handleSelectAll = () => {
    if (allVisible) {
      // Deselect all visible
      const newSelection = new Set(selectedAthletes);
      filteredAthletes.forEach((a) => newSelection.delete(a.id));
      setSelectedAthletes(newSelection);
    } else {
      // Select all visible
      const newSelection = new Set(selectedAthletes);
      filteredAthletes.forEach((a) => newSelection.add(a.id));
      setSelectedAthletes(newSelection);
    }
  };

  const handleToggleAthlete = (athleteId: string) => {
    const newSelection = new Set(selectedAthletes);
    if (newSelection.has(athleteId)) {
      newSelection.delete(athleteId);
    } else {
      newSelection.add(athleteId);
    }
    setSelectedAthletes(newSelection);
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedAthletes.size > 0) {
      createGroup(groupName, Array.from(selectedAthletes));
      setGroupName("");
      setSelectedAthletes(new Set());
      setSearchQuery("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Create New Group</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-6">
          {/* Group Name Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Group Name *
            </label>
            <Input
              placeholder="e.g., U14s Zayed"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-card border-border"
            />
          </div>

          {/* Search Athletes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Athletes *
            </label>
            <Input
              placeholder="Search athletes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border-border mb-4"
            />

            {/* Select All Toggle */}
            <div
              className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80"
              onClick={handleSelectAll}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  allVisible || someVisible
                    ? "bg-accent border-accent"
                    : "border-border"
                }`}
              >
                {(allVisible || someVisible) && (
                  <Check className="w-4 h-4 text-accent-foreground" />
                )}
              </div>
              <span className="text-sm font-medium text-foreground">
                Select All {filteredAthletes.length > 0 && `(${filteredAthletes.length})`}
              </span>
            </div>

            {/* Athletes List */}
            <div className="mt-4 border border-border rounded-lg overflow-y-auto max-h-64">
              {filteredAthletes.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No athletes found
                </div>
              ) : (
                filteredAthletes.map((athlete) => (
                  <div
                    key={athlete.id}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 cursor-pointer hover:bg-secondary/50 transition-colors ${
                      selectedAthletes.has(athlete.id) ? "bg-secondary/30" : ""
                    }`}
                    onClick={() => handleToggleAthlete(athlete.id)}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedAthletes.has(athlete.id)
                          ? "bg-accent border-accent"
                          : "border-border"
                      }`}
                    >
                      {selectedAthletes.has(athlete.id) && (
                        <Check className="w-4 h-4 text-accent-foreground" />
                      )}
                    </div>

                    {/* Avatar & Info */}
                    <img
                      src={athlete.photo}
                      alt={athlete.name}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {athlete.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {athlete.chronologicalAge.toFixed(1)} yrs
                      </p>
                    </div>

                    {/* PHV Badge */}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                        athlete.phvStatus === "Pre-PHV"
                          ? "bg-red-500/20 text-red-400"
                          : athlete.phvStatus === "In-PHV"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {athlete.phvStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border hover:bg-secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedAthletes.size === 0}
            className="bg-accent hover:bg-orange-600 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Group
          </Button>
        </div>
      </div>
    </div>
  );
}
