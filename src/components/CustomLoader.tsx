import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { CloudLightning, Loader2, Settings, RefreshCw } from 'lucide-react';

type LoaderVariant = 'default' | 'settings' | 'refresh' | 'simple';
type LoaderSize = 'small' | 'medium' | 'large';
type LoaderColor = 'blue' | 'purple' | 'green' | 'rainbow';

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
  icon: string;
}

type ColorConfig = {
  gradient: string;
  border: string;
  text: string;
  accent: string;
}

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;

  constructor(canvasWidth: number, canvasHeight: number, color: string) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = color;
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvasWidth) this.x = 0;
    else if (this.x < 0) this.x = canvasWidth;

    if (this.y > canvasHeight) this.y = 0;
    else if (this.y < 0) this.y = canvasHeight;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const CustomLoader: React.FC<CustomLoaderProps> = ({
  variant = 'default',
  size = 'medium',
  showText = true,
  loadingText = 'Cargando...',
  subText = 'Por favor espere',
  color = 'rainbow',
  showProgress = true,
  className = '',
}) => {
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const backgroundAnimation = useAnimation();

  const sizeMap: Record<LoaderSize, SizeConfig> = {
    small: {
      container: 'w-full max-w-[300px]',
      spinner: 'w-24 h-24',
      border: 'border-4',
      text: 'text-2xl',
      icon: 'w-12 h-12',
    },
    medium: {
      container: 'w-full max-w-[400px]',
      spinner: 'w-40 h-40',
      border: 'border-6',
      text: 'text-3xl',
      icon: 'w-20 h-20',
    },
    large: {
      container: 'w-full max-w-[500px]',
      spinner: 'w-56 h-56',
      border: 'border-8',
      text: 'text-4xl',
      icon: 'w-28 h-28',
    },
  };

  const colorMap: Record<LoaderColor, ColorConfig> = {
    blue: {
      gradient: 'from-blue-900 via-blue-600 to-blue-400',
      border: 'border-blue-200 border-t-blue-500',
      text: 'from-blue-300 to-blue-100',
      accent: 'bg-blue-500',
    },
    purple: {
      gradient: 'from-purple-900 via-purple-600 to-purple-400',
      border: 'border-purple-200 border-t-purple-500',
      text: 'from-purple-300 to-purple-100',
      accent: 'bg-purple-500',
    },
    green: {
      gradient: 'from-green-900 via-green-600 to-green-400',
      border: 'border-green-200 border-t-green-500',
      text: 'from-green-300 to-green-100',
      accent: 'bg-green-500',
    },
    rainbow: {
      gradient: 'from-red-500 via-yellow-500 to-blue-500',
      border: 'border-white border-t-purple-500',
      text: 'from-yellow-300 to-pink-300',
      accent: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
  };

  const variantMap: Record<LoaderVariant, React.ElementType> = {
    default: CloudLightning,
    settings: Settings,
    refresh: RefreshCw,
    simple: Loader2,
  };

  const Icon = variantMap[variant];
  const selectedSize = sizeMap[size];
  const selectedColor = colorMap[color];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => (prevProgress + 1) % 101);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < 200; i++) {
        particles.push(new Particle(canvas.width, canvas.height, selectedColor.accent));
      }
      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, i) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);

        for (let j = i; j < particlesRef.current.length; j++) {
          const otherParticle = particlesRef.current[j];
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${selectedColor.accent.slice(4, -1)}, ${1 - distance / 150})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        }

        if (isHovered) {
          const dx = particle.x - canvas.width / 2;
          const dy = particle.y - canvas.height / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 300) {
            particle.x += dx * 0.03;
            particle.y += dy * 0.03;
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, selectedColor.accent]);

  useEffect(() => {
    backgroundAnimation.start({
      background: [
        `radial-gradient(circle, ${selectedColor.accent}22 0%, transparent 70%)`,
        `radial-gradient(circle, ${selectedColor.accent}44 40%, transparent 80%)`,
        `radial-gradient(circle, ${selectedColor.accent}22 0%, transparent 70%)`,
      ],
      transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
    });
  }, [backgroundAnimation, selectedColor.accent]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-b ${selectedColor.gradient} ${className}`}
      style={{
        backdropFilter: 'blur(10px)',
        perspective: '1000px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
      <motion.div
        className="absolute inset-0"
        animate={backgroundAnimation}
      />

      <motion.div
        className="relative"
        animate={{ rotateY: isHovered ? 360 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className={`absolute inset-0 ${selectedColor.accent} blur-3xl opacity-20`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative">
          <motion.div
            className={`${selectedSize.spinner} ${selectedSize.border} ${selectedColor.border} rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              boxShadow: `0 0 50px ${selectedColor.accent}`,
              transform: 'rotateX(60deg) rotateZ(0deg)',
            }}
          />
          <motion.div
            className={`absolute top-0 left-0 ${selectedSize.spinner} ${selectedSize.border} border-opacity-30 border-t-transparent rounded-full opacity-30`}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transform: 'rotateX(60deg) rotateZ(0deg)' }}
          />
          <motion.div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${selectedSize.icon}`}
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <Icon
              className={`w-full h-full ${selectedColor.accent} drop-shadow-lg`}
              style={{
                filter: `drop-shadow(0 0 10px ${selectedColor.accent})`,
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showText && (
          <motion.div
            className="mt-12 space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              className={`${selectedSize.text} font-bold text-transparent bg-clip-text relative overflow-hidden`}
              style={{
                background: `linear-gradient(to right, ${selectedColor.accent}, ${selectedColor.text.split(' ')[1]})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
              }}
            >
              {loadingText.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    repeatDelay: 2
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
            <motion.p
              className="text-xl text-gray-300"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {subText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {showProgress && (
        <motion.div
          className="mt-12 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${selectedColor.text} rounded-full relative`}
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute top-0 right-0 bottom-0 w-12 bg-white opacity-30"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          <div className="flex justify-between mt-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-4 h-4 rounded-full ${selectedColor.accent}`}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                  boxShadow: [
                    `0 0 5px ${selectedColor.accent}`,
                    `0 0 20px ${selectedColor.accent}`,
                    `0 0 5px ${selectedColor.accent}`
                  ]
                }}
                transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CustomLoader;

