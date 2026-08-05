import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary:   'bg-primary text-on-primary shadow-[0_4px_12px_rgba(163,61,37,0.3)] hover:scale-105 active:scale-95',
  secondary: 'bg-secondary text-on-secondary shadow-[0_4px_12px_rgba(91,60,221,0.3)] hover:scale-105 active:scale-95',
  ghost:     'bg-transparent border-2 border-outline-variant text-on-surface hover:bg-surface-container-high',
  danger:    'bg-error text-on-error hover:scale-105 active:scale-95',
  tertiary:  'bg-tertiary text-on-tertiary hover:scale-105 active:scale-95',
};

const sizes = {
  sm: 'px-4 py-2 text-label-bold text-sm rounded-full',
  md: 'px-6 py-3 text-label-bold rounded-full',
  lg: 'px-8 py-4 text-label-bold text-base rounded-full',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon,
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        font-body font-bold inline-flex items-center justify-center gap-2
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
