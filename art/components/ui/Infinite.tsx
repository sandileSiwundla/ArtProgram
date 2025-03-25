"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import "@/styles/carousel.css";

export const InfiniteMovingCards = ({
  items,
  direction = "up",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    imagePath: string;
  }[];
  direction?: "up" | "down";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const animationSpeed = useRef(1);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  useEffect(() => {
    const duplicatedItems = [...items, ...items];
    updateAnimationSpeed();
    getDirection();

    const handleWheel = (e: WheelEvent) => {
      if (!enlargedImage) { // Only allow wheel control when no image is enlarged
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        animationSpeed.current = Math.max(0.2, Math.min(animationSpeed.current + delta, 3));
        updateAnimationSpeed();
      }
    };

    const container = containerRef.current;
    container?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container?.removeEventListener('wheel', handleWheel);
    };
  }, [items, enlargedImage]);

  const updateAnimationSpeed = () => {
    if (!containerRef.current) return;
    
    let baseDuration;
    switch (speed) {
      case "fast": baseDuration = 20; break;
      case "normal": baseDuration = 40; break;
      case "slow": baseDuration = 80; break;
      default: baseDuration = 80;
    }
    
    containerRef.current.style.setProperty(
      '--animation-duration', 
      `${baseDuration / animationSpeed.current}s`
    );
  };

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        '--animation-direction',
        direction === "up" ? "forwards" : "reverse"
      );
    }
  };

  const handleImageClick = (imagePath: string) => {
    setEnlargedImage(imagePath);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "scroller-container relative z-20 w-full h-screen overflow-hidden",
          className,
          enlargedImage && "blur-sm" 
        )}
      >
        <ul
          ref={scrollerRef}
          className={cn(
            "scroller min-h-full w-full flex flex-col gap-4",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}
        >
          {[...items, ...items].map((item, idx) => (
            <li className="flex-shrink-0 flex" key={idx}>
              <button 
                onClick={() => handleImageClick(item.imagePath)}
                className="hover:scale-105 transition-transform duration-200"
              >
                <Image
                  src={item.imagePath}
                  alt={`Image ${idx}`}
                  width={180}
                  height={300}
                  priority
                  className="my-2"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 z-50 flex bg-white bg-opacity-0">
          <div className="relative max-w-4xl max-h-[90vh] ">
            <Image
              src={enlargedImage}
              alt="Enlarged view"
              width={1200}
              height={1800}
              className="object-contain max-h-[90vh]"
            />
            <button
              onClick={closeEnlargedImage}
              className="absolute top-4 right-4 bg-white rounded-full p-2 text-black hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};