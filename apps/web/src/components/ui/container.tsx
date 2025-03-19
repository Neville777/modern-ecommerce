import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fullWidth?: boolean; // Add this prop to toggle full width
}

export function Container({
  children,
  className,
  fullWidth = false, // Default to false to maintain existing behavior
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full', // Always centered and full width
        // Only apply max-width and padding if not fullWidth
        !fullWidth && 'max-w-[1500px] px-6 lg:px-8 sm:px-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
