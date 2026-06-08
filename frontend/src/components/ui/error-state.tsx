import type { ReactElement } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorStateProps {
  title?: string;
  description: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description,
}: ErrorStateProps): ReactElement {
  return (
    <Card className="border-red-200 bg-red-50/90 text-red-950 shadow-red-950/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <Badge variant="outline" className="border-red-200 bg-white/70 text-red-700">
              Error state
            </Badge>
            <CardTitle className="mt-2 text-xl">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-red-900/80">{description}</p>
      </CardContent>
    </Card>
  );
}
