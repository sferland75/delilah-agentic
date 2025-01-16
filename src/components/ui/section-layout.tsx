import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';

interface SectionLayoutProps {
  children: React.ReactNode;
  description?: string;
}

export function SectionLayout({ children, description }: SectionLayoutProps) {
  return (
    <Card>
      {description && (
        <CardHeader>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}