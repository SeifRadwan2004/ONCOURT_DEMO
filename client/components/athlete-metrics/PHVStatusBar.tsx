import { cn } from "@/lib/utils";

interface PHVStatusBarProps {
  status: "Pre-PHV" | "In-PHV" | "Post-PHV";
  size?: "sm" | "md" | "lg";
}

export function PHVStatusBar({ status, size = "md" }: PHVStatusBarProps) {
  const height = size === "sm" ? "h-2" : size === "md" ? "h-3" : "h-4";
  const segments = [
    { label: "Pre-PHV", color: "bg-red-500", isActive: status === "Pre-PHV" },
    { label: "In-PHV", color: "bg-amber-500", isActive: status === "In-PHV" },
    { label: "Post-PHV", color: "bg-green-500", isActive: status === "Post-PHV" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex gap-1 rounded-lg overflow-hidden">
        {segments.map((seg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex-1 transition-all",
              height,
              seg.isActive ? seg.color : cn(seg.color, "opacity-30")
            )}
          />
        ))}
      </div>
      <div className="text-xs font-medium text-muted-foreground text-center">
        {status}
      </div>
    </div>
  );
}
