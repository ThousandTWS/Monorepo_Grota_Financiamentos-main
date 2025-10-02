'use client';

import { animate, motion, useMotionValue } from 'motion/react';
import React, { CSSProperties, useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';


import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



type InfiniteSliderProps = {
    children: React.ReactNode;
    gap?: number;
    speed?: number;
    speedOnHover?: number;
    direction?: 'horizontal' | 'vertical';
    reverse?: boolean;
    className?: string;
};

function InfiniteSlider({
    children,
    gap = 16,
    speed = 100,
    speedOnHover,
    direction = 'horizontal',
    reverse = false,
    className,
}: InfiniteSliderProps) {
    const [currentSpeed, setCurrentSpeed] = useState(speed);
    const [ref, { width, height }] = useMeasure();
    const translation = useMotionValue(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [key, setKey] = useState(0);

    useEffect(() => {
        let controls;
        const size = direction === 'horizontal' ? width : height;
        if (size === 0) return;

        const contentSize = size + gap;
        const from = reverse ? -contentSize / 2 : 0;
        const to = reverse ? 0 : -contentSize / 2;

        const distanceToTravel = Math.abs(to - from);
        const duration = distanceToTravel / currentSpeed;

        if (isTransitioning) {
            const remainingDistance = Math.abs(translation.get() - to);
            const transitionDuration = remainingDistance / currentSpeed;
            controls = animate(translation, [translation.get(), to], {
                ease: 'linear',
                duration: transitionDuration,
                onComplete: () => {
                    setIsTransitioning(false);
                    setKey((prevKey) => prevKey + 1);
                },
            });
        } else {
            controls = animate(translation, [from, to], {
                ease: 'linear',
                duration: duration,
                repeat: Infinity,
                repeatType: 'loop',
                repeatDelay: 0,
                onRepeat: () => {
                    translation.set(from);
                },
            });
        }

        return () => controls?.stop();
    }, [key, translation, currentSpeed, width, height, gap, isTransitioning, direction, reverse]);

    const hoverProps = speedOnHover
        ? {
              onHoverStart: () => {
                  setIsTransitioning(true);
                  setCurrentSpeed(speedOnHover);
              },
              onHoverEnd: () => {
                  setIsTransitioning(true);
                  setCurrentSpeed(speed);
              },
          }
        : {};

    return (
        <div className={cn('overflow-hidden', className)}>
            <motion.div
                className="flex w-max"
                style={{
                    ...(direction === 'horizontal' ? { x: translation } : { y: translation }),
                    gap: `${gap}px`,
                    flexDirection: direction === 'horizontal' ? 'row' : 'column',
                }}
                ref={ref}
                {...hoverProps}>
                {children}
                {children}
            </motion.div>
        </div>
    );
}


export type BlurredInfiniteSliderProps = InfiniteSliderProps & {
    fadeWidth?: number;
    containerClassName?: string;
};

export function BlurredInfiniteSlider({
    children,
    fadeWidth = 80,
    containerClassName,
    ...sliderProps
}: BlurredInfiniteSliderProps) {

    const maskStyle: CSSProperties = {
        maskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
        WebkitMaskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
    };

    return (
        <div
            className={cn('relative w-full', containerClassName)}
            style={maskStyle}
        >
            <InfiniteSlider {...sliderProps}>{children}</InfiniteSlider>
        </div>
    );
}


const LOGOS = [
    { src: "https://html.tailus.io/blocks/customers/openai.svg", alt: "OpenAI Logo", height: 24 },
    { src: "https://html.tailus.io/blocks/customers/nvidia.svg", alt: "Nvidia Logo", height: 20 },
    { src: "https://html.tailus.io/blocks/customers/column.svg", alt: "Column Logo", height: 16 },
    { src: "https://html.tailus.io/blocks/customers/github.svg", alt: "GitHub Logo", height: 16 },
    { src: "https://html.tailus.io/blocks/customers/nike.svg", alt: "Nike Logo", height: 20 },
    { src: "https://html.tailus.io/blocks/customers/lemonsqueezy.svg", alt: "Lemon Squeezy Logo", height: 20 },
    { src: "https://html.tailus.io/blocks/customers/laravel.svg", alt: "Laravel Logo", height: 16 },
    { src: "https://html.tailus.io/blocks/customers/lilly.svg", alt: "Lilly Logo", height: 28 },
];

export default function LogoCloudDemoPage() {
    return (
        <main className=" w-full flex items-center justify-center text-black dark:text-white">
            <section className=" overflow-hidden py-16 w-full">
                <div className="m-auto max-w-7xl px-6">
                    {/* Эта структура отвечает за адаптивную верстку */}
                    <div className="flex flex-col items-center md:flex-row">
                        {/* На экранах 'md' и шире этот блок будет слева с линией */}
                        <div className="flex-shrink-0 text-center md:text-right md:max-w-44 md:border-r md:border-gray-200 dark:md:border-gray-800 md:pr-6">
                            <p className="text-md text-black dark:text-gray-800">
                                Bancos Parceiros
                            </p>
                        </div>
                        {/* На маленьких экранах этот блок будет под текстом */}
                        <div className="w-full py-6 md:w-auto md:flex-1">
                            <BlurredInfiniteSlider
                                speedOnHover={20}
                                speed={40}
                                gap={112}
                                fadeWidth={80} // Ширина затухания по краям
                            >
                                {LOGOS.map((logo) => (
                                    <div key={logo.src} className="flex">
                                        <img
                                            className="mx-auto w-fit dark:invert"
                                            src={logo.src}
                                            alt={logo.alt}
                                            style={{ height: `${logo.height}px` }}
                                            width="auto"
                                        />
                                    </div>
                                ))}
                            </BlurredInfiniteSlider>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}