import { Badge } from "@/components/ui/badge";

interface TodoStatsProps {
  activeCount: number;
  completedCount: number;
}

export function TodoStats({ activeCount, completedCount }: TodoStatsProps) {
  return (
    <div className="text-muted-foreground flex gap-2 text-sm">
      <Badge variant="secondary">{activeCount} remaining</Badge>
      {completedCount > 0 && <Badge variant="outline">{completedCount} done</Badge>}
    </div>
  );
}
