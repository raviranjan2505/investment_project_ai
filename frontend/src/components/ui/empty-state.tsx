import type { ReactElement } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps): ReactElement {
  return (
    <Card className="glass-panel text-center">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mx-auto max-w-xl text-base leading-7 text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}
