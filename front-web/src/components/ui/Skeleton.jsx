import { clsx } from 'clsx';

export default function Skeleton({ className = '', variant = 'default' }) {
  const variants = {
    default: 'h-4 w-full',
    title: 'h-8 w-3/4',
    text: 'h-4 w-full',
    circle: 'h-12 w-12 rounded-full',
    card: 'h-48 w-full',
  };
  
  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200 rounded',
        variants[variant],
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <Skeleton variant="circle" className="mb-4" />
      <Skeleton variant="title" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  );
}
