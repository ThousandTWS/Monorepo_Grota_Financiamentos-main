"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  username: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Consegui financiar meu carro com rapidez e condições que não encontrei em nenhum outro lugar. Atendimento nota 10!",
    name: "Carlos Mendes",
    username: "@carluxo",
    avatar: "https://res.cloudinary.com/dx1659yxu/image/upload/v1760451996/32_rxh1p3.jpg"
  },
  {
    id: 2,
    quote: "A Grota me ajudou a realizar o sonho do meu primeiro carro. Processo simples e sem burocracia!",
    name: "Fernanda Silva",
    username: "@fernandasilva",
    avatar: "https://res.cloudinary.com/dx1659yxu/image/upload/v1760452036/44_tvy0ss.jpg"
  },
  {
    id: 3,
    quote: "Equipe muito profissional. Explicaram cada detalhe do financiamento de forma clara e transparente.",
    name: "João Pereira",
    username: "@joaop",
    avatar: "https://res.cloudinary.com/dx1659yxu/image/upload/v1760452060/18_o9texi.jpg"
  },
  {
    id: 4,
    quote: "Excelente atendimento! Consegui um ótimo financiamento para meu veículo sem complicação.",
    name: "Mariana Costa",
    username: "@maricosta",
    avatar: "https://res.cloudinary.com/dx1659yxu/image/upload/v1760452088/55_sbcqj0.jpg"
  },
  {
    id: 5,
    quote: "Muito satisfeito com a Grota! Resolveram tudo rápido e com ótimas condições de pagamento.",
    name: "Ricardo Alves",
    username: "@ricardoalves",
    avatar: "https://res.cloudinary.com/dx1659yxu/image/upload/v1760452115/27_bc3fad.jpg"
  },
];

const getVisibleCount = (width: number): number => {
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
};

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);

      const oldVisibleCount = getVisibleCount(windowWidth);
      const newVisibleCount = getVisibleCount(newWidth);

      if (oldVisibleCount !== newVisibleCount) {
        const maxIndexForNewWidth = testimonials.length - newVisibleCount;
        if (currentIndex > maxIndexForNewWidth) {
          setCurrentIndex(Math.max(0, maxIndexForNewWidth));
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth, currentIndex]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        const visibleCount = getVisibleCount(windowWidth);
        const maxIndex = testimonials.length - visibleCount;

        if (currentIndex >= maxIndex) {
          setDirection(-1);
          setCurrentIndex((prev) => prev - 1);
        } else if (currentIndex <= 0) {
          setDirection(1);
          setCurrentIndex((prev) => prev + 1);
        } else {
          setCurrentIndex((prev) => prev + direction);
        }
      }, 4000);
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex, windowWidth, direction]);

  const visibleCount = getVisibleCount(windowWidth);
  const maxIndex = testimonials.length - visibleCount;
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;

  const goNext = () => {
    if (canGoNext) {
      setDirection(1);
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
      pauseAutoPlay();
    }
  };

  const goPrev = () => {
    if (canGoPrev) {
      setDirection(-1);
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
      pauseAutoPlay();
    }
  };

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const handleDragEnd = (event: any, info: any) => {
    const { offset } = info;
    const swipeThreshold = 30;

    if (offset.x < -swipeThreshold && canGoNext) {
      goNext();
    } else if (offset.x > swipeThreshold && canGoPrev) {
      goPrev();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    pauseAutoPlay();
  };

  return (
    <div className="px-4 py-8 sm:py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-[#1B4B7C] text-white font-medium text-xs sm:text-sm uppercase tracking-wider">
            Grota Financiamentos
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#1B4B7C] mt-3 sm:mt-4 px-4">
            Comentários dos Clientes
          </h3>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#1B4B7C] to-[#1B4B7C]/70 mx-auto mt-4 sm:mt-6"></div>
        </motion.div>

        <div className="relative" ref={containerRef}>
          {/* Carrossel */}
          <div className="overflow-hidden relative px-2 sm:px-0">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
              transition={{ type: 'spring', stiffness: 70, damping: 20 }}
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className={`flex-shrink-0 w-full ${visibleCount === 3 ? 'md:w-1/3' : visibleCount === 2 ? 'md:w-1/2' : 'w-full'} p-2`}
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98, cursor: 'grabbing' }}
                  style={{ cursor: 'grab' }}
                >
                  <motion.div
                    className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full bg-white border border-gray-200 shadow-lg"
                    whileHover={{
                      boxShadow: '0 10px 15px -3px rgba(27, 75, 124, 0.1), 0 4px 6px -2 rgba(27, 75, 124, 0.05)',
                    }}
                  >
                    <div className="relative z-10 h-full flex flex-col">
                      <p className="text-sm sm:text-base text-gray-700 font-medium mb-4 sm:mb-6 leading-relaxed">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>

                      <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-200">
                        <div className="flex items-center">
                          <div className="relative flex-shrink-0">
                            <Image
                              width={48}
                              height={48}
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/api/placeholder/48/48';
                              }}
                            />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-semibold text-sm sm:text-base text-gray-900">{testimonial.name}</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">{testimonial.username}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots de navegação */}
          <div className="flex justify-center mt-6 sm:mt-8">
            {Array.from({ length: testimonials.length - visibleCount + 1 }, (_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className="relative mx-1 focus:outline-none"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <motion.div
                  className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-[#1B4B7C]' : 'bg-gray-300'}`}
                  animate={{ scale: index === currentIndex ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 1.5, repeat: index === currentIndex ? Infinity : 0, repeatDelay: 1 }}
                />
                {index === currentIndex && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#1B4B7C]/30"
                    animate={{ scale: [1, 1.8], opacity: [1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
