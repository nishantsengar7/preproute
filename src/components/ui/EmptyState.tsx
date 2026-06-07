import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ClipboardList } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = ClipboardList,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-300 rounded-xl bg-white/40 backdrop-blur-[2px] ${className}`}>
      {/* Icon Area */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4">
        <Icon className="h-6 w-6" />
      </div>

      {/* Text Area */}
      <h3 className="text-base font-semibold text-neutral-900 mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 max-w-sm mb-6 leading-relaxed font-medium">{description}</p>

      {/* Call to Action */}
      {actionText && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
