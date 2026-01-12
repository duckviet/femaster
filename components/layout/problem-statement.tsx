import { Challenge } from "@/lib/challenges";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProblemStatementProps {
  challenge: Challenge;
}

export function ProblemStatement({ challenge }: ProblemStatementProps) {
  return (
    <Card className="p-5 mb-6">
      <h2 className="text-xl font-semibold mb-3">{challenge.title}</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Problem Statement
          </h3>
          <p className="text-sm">{challenge.statement}</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Constraints & Edge Cases
          </h3>
          <ul className="space-y-1">
            {challenge.constraints.map((constraint, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                {constraint}
              </li>
            ))}
          </ul>
        </div>

        {challenge.complexity && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Complexity
              </h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {challenge.complexity}
              </code>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
