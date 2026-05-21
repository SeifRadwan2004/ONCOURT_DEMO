import { cn } from "@/lib/utils";

interface AgeBadgesProps {
  chronologicalAge: number;
  biologicalAge: number;
}

export function AgeBadges({
  chronologicalAge,
  biologicalAge,
}: AgeBadgesProps) {
  const delta = biologicalAge - chronologicalAge;
  const deltaBg = delta > 0 ? "bg-green-500/20" : delta < 0 ? "bg-red-500/20" : "bg-gray-500/20";
  const deltaText = delta > 0 ? "text-green-400" : delta < 0 ? "text-red-400" : "text-gray-400";

  return (
    <div className="flex items-center gap-2">
      {/* Chronological Age */}
      <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium">
        {chronologicalAge.toFixed(1)} yrs
      </div>

      {/* Biological Age */}
      <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
        {biologicalAge.toFixed(1)} yrs
      </div>

      {/* Delta */}
      <div className={cn("px-2 py-1 rounded-full text-sm font-medium", deltaBg, deltaText)}>
        {delta >= 0 ? "+" : ""}{delta.toFixed(1)}
      </div>
    </div>
  );
}
