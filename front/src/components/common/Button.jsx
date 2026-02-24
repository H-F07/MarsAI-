/**
 * Composant Button réutilisable
 * @param {Object} props - Props du composant
 * @param {string} props.children - Contenu du button
 * @param {string} props.variant - Style: 'primary' | 'secondary' | 'danger'
 * @param {string} props.size - Taille: 'sm' | 'md' | 'lg'
 * @param {boolean} props.isLoading - Désactive le button pendant le chargement
 * @param {string} props.className - Classes additionnelles Tailwind
 */
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  disabled = false,
  className = '',
  ...props 
}) {
  const variantClasses = {
    primary: 'bg-sky-400 hover:bg-sky-500 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={`
        btn
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {isLoading ? '...' : children}
    </button>
  );
}
