import React, { createContext, useContext, useState, ReactNode } from "react";
import { Group, mockGroups, mockAthletes } from "@/data/mockData";

interface GroupContextType {
  groups: Group[];
  selectedGroupId: string;
  setSelectedGroupId: (id: string) => void;
  createGroup: (name: string, athleteIds: string[]) => void;
  selectedGroup: Group | null;
  getGroupAthletes: (groupId: string) => typeof mockAthletes;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [selectedGroupId, setSelectedGroupId] = useState(mockGroups[0].id);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || null;

  const createGroup = (name: string, athleteIds: string[]) => {
    const newGroup: Group = {
      id: `g${Date.now()}`,
      name,
      athleteIds,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setGroups([...groups, newGroup]);
    setSelectedGroupId(newGroup.id);
  };

  const getGroupAthletes = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return [];
    return mockAthletes.filter((a) => group.athleteIds.includes(a.id));
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        selectedGroupId,
        setSelectedGroupId,
        createGroup,
        selectedGroup,
        getGroupAthletes,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroup must be used within GroupProvider");
  }
  return context;
}
