import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Button from './Button';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backTo?: string;
  action?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  };
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  showBackButton = false,
  backTo,
  action,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-5 border-b border-neutral-200/80 mb-6 ${className}`}>
      <div className="flex items-start gap-3">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="mt-1 rounded-lg p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-750 border border-neutral-200 transition-all focus:outline-none"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs font-medium text-neutral-500 max-w-2xl leading-normal">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && (
        <div className="flex items-center self-start md:self-auto">
          <Button
            variant={action.variant || 'primary'}
            onClick={action.onClick}
            leftIcon={action.icon}
            size="sm"
          >
            {action.text}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
