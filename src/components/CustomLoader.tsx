import React from 'react';
import { CloudLightning, Loader2, Settings, RefreshCw } from 'lucide-react';

type LoaderVariant = 'default' | 'settings' | 'refresh' | 'simple';
type LoaderSize = 'small' | 'medium' | 'large';
type LoaderColor = 'blue' | 'purple' | 'green';

interface CustomLoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  showText?: boolean;
  loadingText?: string;
  subText?: string;
  color?: LoaderColor;
  showProgress?: boolean;
  className?: string;
}

type SizeConfig = {
  container: string;
  spinner: string;
  border: string;
  text: string;
}

type ColorConfig = {
  gradient: string;
  border: string;
  text: string;
  accent: string;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({
  variant = 'default',
  size = 'medium',
  showText = true,
  loadingText = 'Cargando...',
  subText = 'Por favor espere',
  color = 'blue',
  showProgress = true,
  className = '',
}) => {
  // Mapeo de tamaños
  const sizeMap: Record<LoaderSize, SizeConfig> = {
    small: {
      container: 'min-h-[200px]',
      spinner: 'w-16 h-16',
      border: 'border-4',
      text: 'text-lg',
    },
    medium: {
      container: 'min-h-[300px]',
      spinner: 'w-24 h-24',
      border: 'border-6',
      text: 'text-xl',
    },
    large: {
      container: 'min-h-[400px]',
      spinner: 'w-32 h-32',
      border: 'border-8',
      text: 'text-2xl',
    },
  };

  // Mapeo de colores
  const colorMap: Record<LoaderColor, ColorConfig> = {
    blue: {
      gradient: 'from-blue-50 to-white',
      border: 'border-blue-200 border-t-blue-500',
      text: 'from-blue-500 to-blue-700',
      accent: 'bg-blue-500',
    },
    purple: {
      gradient: 'from-purple-50 to-white',
      border: 'border-purple-200 border-t-purple-500',
      text: 'from-purple-500 to-purple-700',
      accent: 'bg-purple-500',
    },
    green: {
      gradient: 'from-green-50 to-white',
      border: 'border-green-200 border-t-green-500',
      text: 'from-green-500 to-green-700',
      accent: 'bg-green-500',
    },
  };

  // Mapeo de variantes con diferentes iconos
  const variantMap: Record<LoaderVariant, React.ElementType> = {
    default: CloudLightning,
    settings: Settings,
    refresh: RefreshCw,
    simple: Loader2,
  };

  const Icon = variantMap[variant];
  const selectedSize = sizeMap[size];
  const selectedColor = colorMap[color];

  return (
    <div className={`flex flex-col items-center justify-center ${selectedSize.container} p-8 bg-gradient-to-b ${selectedColor.gradient} rounded-2xl shadow-lg ${className}`}>
      {/* Contenedor del spinner */}
      <div className="relative">
        {/* Efecto de resplandor */}
        <div className={`absolute inset-0 ${selectedColor.accent} blur-3xl opacity-20 animate-pulse`} />
        
        {/* Spinner principal */}
        <div className="relative">
          <div className={`${selectedSize.spinner} ${selectedSize.border} ${selectedColor.border} rounded-full animate-spin`} />
          {/* Anillo exterior */}
          <div className={`absolute top-0 left-0 ${selectedSize.spinner} ${selectedSize.border} border-opacity-30 border-t-transparent rounded-full opacity-30 animate-ping`} />
          {/* Ícono central */}
          <Icon 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${selectedColor.accent}`} 
            size={parseInt(selectedSize.spinner.split('-')[1]) / 2}
          />
        </div>
      </div>

      {/* Texto de carga */}
      {showText && (
        <div className="mt-8 space-y-2 text-center">
          <p className={`${selectedSize.text} font-bold bg-gradient-to-r ${selectedColor.text} bg-clip-text text-transparent`}>
            {loadingText}
          </p>
          <p className="text-gray-500 animate-pulse">{subText}</p>
        </div>
      )}

      {/* Barra de progreso */}
      {showProgress && (
        <div className="mt-8 w-80">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${selectedColor.text} rounded-full animate-[loading_1.5s_ease-in-out_infinite] shadow-lg`} />
          </div>
          <div className="flex justify-between mt-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${selectedColor.accent} animate-bounce`}
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomLoader;