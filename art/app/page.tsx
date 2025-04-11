"use client";

import { InfiniteMovingCards } from "@/components/ui/Infinite";
import { useEffect, useState } from "react";

const ALL_DIRECTORIES = Array.from({ length: 15 }, (_, i) => `art${i + 1}`);

export default function Home() {
  const [carousels, setCarousels] = useState<{imagePath: string; imageNumber: number}[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCarousels, setVisibleCarousels] = useState(8); // Initially show 4 carousels

  // Create image paths for a directory
  const createVerifiedImagePaths = (dir: string) => {
    const images = [];
    for (let i = 1; i <= 50; i++) {
      const imagePath = `/art/${dir}/${i}.jpg`;
      const thumbnailPath = imagePath; // For now, thumbnail is the same as image
      images.push({ imagePath, imageNumber: i, thumbnailPath });
    }
    return images;
  };

  // Initialize carousels
  useEffect(() => {
    const initializeCarousels = async () => {
      const numCarousels = 8;
      const newCarousels: {imagePath: string; imageNumber: number}[][] = [];
      const shuffledDirs = [...ALL_DIRECTORIES].sort(() => 0.5 - Math.random());

      for (let i = 0; i < numCarousels; i++) {
        const dir = shuffledDirs[i % shuffledDirs.length];
        const images = await createVerifiedImagePaths(dir);
        if (images.length > 0) {
          newCarousels.push(images);
          console.log(`Carousel ${i} using ${images.length} images from ${dir}`);
        }
      }

      setCarousels(newCarousels);
      setIsLoading(false);
    };

    initializeCarousels();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled near the bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        // Load more carousels
        setVisibleCarousels((prevVisibleCarousels) =>
          Math.min(prevVisibleCarousels + 4, carousels.length)
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [carousels]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <main className="pl-2">
        <div className="w-[125%]">
          <div className="flex gap-2">
            {carousels
              .slice(0, visibleCarousels) // Only render visible carousels
              .map((carouselImages, i) => (
                <div key={i} className="relative w-[12.5%] flex-shrink-0">
                  <InfiniteMovingCards
                    items={carouselImages}
                    direction="up"
                    speed="slow"
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
