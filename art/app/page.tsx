"use client";

import { InfiniteMovingCards } from "@/components/ui/Infinite";

export default function Home() {
  const images2 = [
    { imagePath: "/1.jpeg" },
    { imagePath: "/2.jpg" },
    { imagePath: "/3.jpg" },
    { imagePath: "/4.jpg" },
    { imagePath: "/5.jpg" },
    { imagePath: "/6.jpg" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden"> {/* Hide horizontal overflow */}
      <main className="pl-2">
        {/* Container with fixed width to force overflow */}
        <div className="w-[125%]"> {/* 6 visible + 2 partial = 125% width */}
          
          {/* Flex container that will overflow */}
          <div className="flex gap-1">
            {[...Array(8)].map((_, i) => ( // 8 carousels total
              <div 
                key={i} 
                className="relative w-[12.5%] flex-shrink-0" // Each takes 1/8th of space
              >
                <InfiniteMovingCards
                  items={images2}
                  direction="up"
                  speed="fast"
                  className="h-[100vh]"
                />
              </div>
            ))}
          </div>
          
        </div>
      </main>
    </div>
  );
}