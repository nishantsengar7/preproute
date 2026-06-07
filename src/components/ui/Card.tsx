import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Title: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
  Description: React.FC<React.HTMLAttributes<HTMLParagraphElement>>;
  Content: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Footer: React.FC<React.HTMLAttributes<HTMLDivElement>>;
} = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md/5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 border-b border-neutral-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3
      className={`text-lg font-semibold leading-none tracking-tight text-neutral-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p
      className={`text-xs text-neutral-500 font-medium ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex items-center p-6 pt-0 border-t border-neutral-100 mt-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
