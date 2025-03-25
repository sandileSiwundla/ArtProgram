"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { InfiniteMovingCards } from "@/components/ui/Infinite";

export default function Home() {
  const images = [
    "/1.jpeg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
  ];
  const images2 = [
    {
      imagePath:"/1.jpeg",
    },
    {
      imagePath:"/2.jpg",

    },
    {
      imagePath:"/3.jpg",
    },
    {
      imagePath:"/4.jpg",

    },
    {
      imagePath:"/5.jpg",
    },
    {
      imagePath:"/6.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0); // Keep track of the current image index

  // Auto-scroll interval time (in milliseconds)
  const intervalTime = 3000;

  // Handle the carousel logic: automatically change images
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, intervalTime);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once when the component is mounted

  return (
    <div className="bg-gray-100 !min-h-screen flex justify-center items-center">
      <main className="pl-14">
        <div className="relative">
          <InfiniteMovingCards
            items={images2}
            direction="up"
            speed="fast"
          />
        </div>
        
      </main>
    </div>
  );
}
