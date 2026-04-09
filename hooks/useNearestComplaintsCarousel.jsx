import { useEffect, useState } from 'react';

export function useComplaintCarousel(complaints, intervalTime = 4000) {
  const [currentIndex, setCurrentIndex] = useState(0);

 useEffect(() => {
  if (!complaints?.length) {
    setCurrentIndex(0);
    return;
    }

    setCurrentIndex((prev) => {
    if (prev >= complaints.length) return 0;
    return prev;
    });
  }, [complaints]);

  useEffect(() => {
    if (!complaints || complaints.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= complaints.length - 1 ? 0 : prevIndex + 1
      );
    }, intervalTime);

    return () => clearInterval(interval);
  }, [complaints, intervalTime]);

  return {
    currentIndex,
    currentComplaint: complaints?.[currentIndex] || null,
    setCurrentIndex,
  };
}