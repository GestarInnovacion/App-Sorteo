import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MinimalistLoaderProps {
    text?: string;
    color?: string;
    blur?: number;
}

const MinimalistLoader: React.FC<MinimalistLoaderProps> = ({
    text = 'Cargando',
    color = '#3b82f6',
    blur = 10,
}) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots.length >= 3 ? '' : prevDots + '.'));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{
                backdropFilter: `blur(${blur}px)`,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
        >
            <div className="text-center">
                <motion.div
                    className="mb-8"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <svg
                        width="50"
                        height="50"
                        viewBox="0 0 50 50"
                        style={{ margin: 'auto' }}
                    >
                        <motion.circle
                            cx="25"
                            cy="25"
                            r="20"
                            stroke={color}
                            strokeWidth="4"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </svg>
                </motion.div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={dots}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2
                            className="text-2xl font-light"
                            style={{ color: color }}
                        >
                            {text}{dots}
                        </h2>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MinimalistLoader;

