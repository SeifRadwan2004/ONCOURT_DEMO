import { cn } from "@/lib/utils";

interface PHVGaugeProps {
  status: "Pre-PHV" | "In-PHV" | "Post-PHV";
  size?: "sm" | "md" | "lg";
}

export function PHVGauge({ status, size = "md" }: PHVGaugeProps) {
  const sizeClass = size === "sm" ? "w-24 h-12" : size === "md" ? "w-32 h-16" : "w-40 h-20";
  const dotSize = size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4";

  // Calculate needle rotation: Pre-PHV = -90deg, In-PHV = 0deg, Post-PHV = 90deg
  const rotation =
    status === "Pre-PHV" ? -90 : status === "In-PHV" ? 0 : 90;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Gauge container */}
      <div className={cn("relative mx-auto", sizeClass)}>
        {/* SVG Gauge Background */}
        <svg
          viewBox="0 0 120 60"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Red zone (Pre-PHV) */}
          <path
            d="M 20 50 A 30 30 0 0 1 35 20"
            fill="none"
            stroke="rgb(239, 68, 68)"
            strokeWidth="6"
            opacity="0.3"
          />

          {/* Amber zone (In-PHV) */}
          <path
            d="M 35 20 A 30 30 0 0 1 85 20"
            fill="none"
            stroke="rgb(217, 119, 6)"
            strokeWidth="6"
            opacity="0.3"
          />

          {/* Green zone (Post-PHV) */}
          <path
            d="M 85 20 A 30 30 0 0 1 100 50"
            fill="none"
            stroke="rgb(34, 197, 94)"
            strokeWidth="6"
            opacity="0.3"
          />

          {/* Active segment - brighter */}
          {status === "Pre-PHV" && (
            <path
              d="M 20 50 A 30 30 0 0 1 35 20"
              fill="none"
              stroke="rgb(239, 68, 68)"
              strokeWidth="6"
            />
          )}
          {status === "In-PHV" && (
            <path
              d="M 35 20 A 30 30 0 0 1 85 20"
              fill="none"
              stroke="rgb(217, 119, 6)"
              strokeWidth="6"
            />
          )}
          {status === "Post-PHV" && (
            <path
              d="M 85 20 A 30 30 0 0 1 100 50"
              fill="none"
              stroke="rgb(34, 197, 94)"
              strokeWidth="6"
            />
          )}

          {/* Needle center point */}
          <circle cx="60" cy="50" r="3" fill="currentColor" className="text-foreground" />
        </svg>

        {/* Needle */}
        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{
            perspective: "1000px",
          }}
        >
          <div
            className="absolute bottom-0 w-0.5 h-6 bg-foreground rounded-full origin-bottom transition-transform"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          />
        </div>
      </div>

      {/* Label */}
      <div className="text-xs font-medium text-muted-foreground text-center">
        {status === "Pre-PHV" && "Pre-PHV"}
        {status === "In-PHV" && "At PHV"}
        {status === "Post-PHV" && "Post-PHV"}
      </div>
    </div>
  );
}
