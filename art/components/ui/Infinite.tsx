"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import "@/styles/carousel.css";

interface CardItem {
  imagePath: string;
  imageNumber: number;
}

export const InfiniteMovingCards = ({
  items,
  direction = "up",
  speed = "fast",
  pauseOnHover = true,
  className,
  quality = 50,
}: {
  items: CardItem[];
  direction?: "up" | "down";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  quality?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const animationSpeed = useRef(1);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [displayItems, setDisplayItems] = useState(items);


  useEffect(() => {
    // Automatically remove the loading modal after 5 seconds
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 7000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  useEffect(() => {
    updateAnimationSpeed();
    getDirection();

    const handleWheel = (e: WheelEvent) => {
      if (!enlargedImage) {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        animationSpeed.current = Math.max(0.2, Math.min(animationSpeed.current + delta, 3));
        updateAnimationSpeed();
      }
    };

    const container = containerRef.current;
    container?.addEventListener('wheel', handleWheel, { passive: false });

    let animationFrameId: number;

    const animateScroll = () => {
      if (isScrolling && scrollerRef.current) {
        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
          if (scrollerRef.current) {
            const currentScroll = scrollerRef.current.scrollTop;
            const scrollAmount = direction === "up" ? 1 : -1;
            scrollerRef.current.scrollTop = currentScroll + scrollAmount * animationSpeed.current;
          }
        });
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => {
      container?.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enlargedImage, isScrolling, direction]);

  const updateAnimationSpeed = () => {
    if (!containerRef.current) return;
    
    let baseDuration;
    switch (speed) {
      case "fast": baseDuration = 180; break;
      case "normal": baseDuration = 100; break;
      case "slow": baseDuration = 100; break;
      default: baseDuration = 100;
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

  useEffect(() => {
    // Check if we've reached the end of the current set
    const lastVisibleItem = getLastVisibleItem();
    if (lastVisibleItem?.imageNumber === 50) {
      // Find the first image (1.jpg) from the same directory
      const currentDir = lastVisibleItem.imagePath.split('/').slice(0, -1).join('/');
      const firstImage = items.find(item => 
        item.imagePath.includes(currentDir) && 
        item.imageNumber === 1
      );
      
      if (firstImage) {
        // Append the first image to create seamless looping
        setDisplayItems(prev => [...prev, firstImage]);
      }
    }
  }, [items]);

  const getLastVisibleItem = () => {
    if (!scrollerRef.current) return null;
    const { scrollTop, clientHeight } = scrollerRef.current;
    // Estimate which item is at the bottom of the visible area
    const approxIndex = Math.floor((scrollTop + clientHeight) / 400); // 400 is approx image height
    return displayItems[Math.min(approxIndex, displayItems.length - 1)];
  };

  return (
    <>
      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-opacity-70 transition-opacity duration-300 backdrop-filter: blur(10px)">
          <div className="bg-[#F5EFE6] p-8 rounded-lg max-w-md mx-4 text-center animate-fade-in backdrop-blur-lg bg-opacity-70">
          <h2 className="text-2xl text-[black] mb-4">Welcome to the HumanHand Gallery</h2>
          <p className="mb-6 text-black">Loading stunning visuals for you...please standby</p>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          "scroller-container relative z-20 w-full h-screen overflow-hidden bg-blue",
          className
        )}
        onMouseEnter={() => pauseOnHover && setIsScrolling(false)}
        onMouseLeave={() => pauseOnHover && setIsScrolling(true)}
      >
        <ul
          ref={scrollerRef}
          className={cn(
            "scroller min-h-full w-full flex flex-col gap-2",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}
        >
          {items.map((item, idx) => (
            <li className="flex-shrink-0 flex" key={`${item.imagePath}-${idx}`}>
              <button 
                onClick={() => handleImageClick(item.imagePath)}
                className="hover:scale-105 transition-transform duration-200 rounded-md"
              >
                <Image
                  src={item.imagePath}
                  alt={`Image ${idx}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }}
                  priority={idx < 5}
                  loading={idx > 10 ? "lazy" : "eager"}
                  quality={quality}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-blur bg-opacity-0"
          onClick={closeEnlargedImage}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Image
              src={enlargedImage}
              alt="Enlarged view"
              width={1200}
              height={1800}
              className="object-contain max-h-[90vh] max-w-[90vw]"
              priority
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
}
