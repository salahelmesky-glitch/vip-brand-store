import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Rocket } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
    const [phase, setPhase] = useState('rocket'); // 'rocket' -> 'logo' -> 'done'

    useEffect(() => {
        // Rocket flies up for 2 seconds
        const rocketTimer = setTimeout(() => {
            setPhase('logo');
        }, 2000);

        // Logo shows for 1.5 seconds, then complete
        const completeTimer = setTimeout(() => {
            setPhase('done');
            onComplete();
        }, 4000);

        return () => {
            clearTimeout(rocketTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
        >
            {/* Animated Stars Background */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            {/* Rocket Phase */}
            <AnimatePresence>
                {phase === 'rocket' && (
                    <motion.div
                        initial={{ y: 300, opacity: 0 }}
                        animate={{ y: -500, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2, ease: 'easeIn' }}
                        className="absolute flex flex-col items-center"
                    >
                        {/* Rocket */}
                        <motion.div
                            animate={{ rotate: [0, -2, 2, 0] }}
                            transition={{ duration: 0.3, repeat: Infinity }}
                            className="text-6xl"
                        >
                            🚀
                        </motion.div>

                        {/* Flame Trail */}
                        <motion.div
                            animate={{ scaleY: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 0.15, repeat: Infinity }}
                            className="w-8 h-24 bg-gradient-to-b from-orange-500 via-yellow-400 to-transparent rounded-full blur-sm"
                        />

                        {/* Smoke Particles */}
                        <div className="flex gap-2 mt-2">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, 50, 100],
                                        opacity: [0.5, 0.3, 0],
                                        scale: [1, 1.5, 2]
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.1
                                    }}
                                    className="w-4 h-4 bg-gray-500/50 rounded-full blur-sm"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logo Phase */}
            <AnimatePresence>
                {phase === 'logo' && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="flex flex-col items-center"
                    >
                        {/* Crown Logo */}
                        <motion.div
                            animate={{
                                rotateY: [0, 360],
                                boxShadow: [
                                    '0 0 20px rgba(201, 169, 97, 0.3)',
                                    '0 0 60px rgba(201, 169, 97, 0.8)',
                                    '0 0 20px rgba(201, 169, 97, 0.3)'
                                ]
                            }}
                            transition={{
                                rotateY: { duration: 2, repeat: Infinity, ease: 'linear' },
                                boxShadow: { duration: 1, repeat: Infinity }
                            }}
                            className="w-28 h-28 bg-gradient-to-br from-[#C9A961] to-[#800020] rounded-3xl flex items-center justify-center mb-8"
                        >
                            <Crown size={56} className="text-white" />
                        </motion.div>

                        {/* VIP Text */}
                        <motion.h1
                            initial={{ letterSpacing: '0em' }}
                            animate={{ letterSpacing: '0.6em' }}
                            transition={{ duration: 0.5 }}
                            className="text-7xl font-black mb-4"
                        >
                            <span className="text-[#C9A961]">V</span>
                            <span className="text-white">I</span>
                            <span className="text-[#800020]">P</span>
                        </motion.h1>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-400 text-lg tracking-widest"
                        >
                            LUXURY FASHION
                        </motion.p>

                        {/* Loading Bar */}
                        <motion.div
                            className="mt-8 w-48 h-1 bg-gray-800 rounded-full overflow-hidden"
                        >
                            <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-gradient-to-r from-[#C9A961] to-[#800020]"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
