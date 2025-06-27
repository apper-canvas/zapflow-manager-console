import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'bg-gradient-to-r from-error to-red-500 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]',
    ghost: 'text-primary hover:bg-gray-50 font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const baseClasses = `inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <ApperIcon name={icon} className="w-4 h-4" />
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <ApperIcon name={icon} className="w-4 h-4" />
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;