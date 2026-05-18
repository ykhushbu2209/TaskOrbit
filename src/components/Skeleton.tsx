import React from 'react';
import { cn } from '../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  key?: React.Key;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-white/5 rounded-2xl", className)} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-12 w-40 rounded-2xl" />
      </div>

      <div className="grid grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => (
              <Skeleton key={i} className="h-32" />
          ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
          <Skeleton className="col-span-2 h-[550px] rounded-3xl" />
          <div className="space-y-6">
              <Skeleton className="h-[260px] rounded-3xl" />
              <Skeleton className="h-[260px] rounded-3xl" />
          </div>
      </div>
    </div>
  );
}
