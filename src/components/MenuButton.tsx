import React from 'react';

interface MenuButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'cyan' | 'magenta';
  disabled?: boolean;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  children,
  onClick,
  variant = 'cyan',
  disabled = false,
}) => {
  const buttonClass = variant === 'cyan' ? 'neon-btn-cyan' : 'neon-btn-magenta';

  return (
    <button
      className={`
        ${buttonClass}
        ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
