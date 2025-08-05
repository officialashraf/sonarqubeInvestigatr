import { useEffect, useRef, useState } from 'react';
import throttle from 'lodash.throttle';

const useInfiniteScroll = ({
  currentPage,
  totalPages,
  loading,
  onPageChange,
  threshold = 10,
  throttleMs = 500
}) => {
  const containerRef = useRef(null);
  const scrollDirectionRef = useRef(null);
  const canFetchRef = useRef(true); // ✅ used to prevent duplicate fetches


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleInfiniteScroll = throttle(() => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      if (!canFetchRef.current || loading) return;

      // Check if scrolled to bottom
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        if (!loading && currentPage < totalPages) {
          scrollDirectionRef.current = 'down';
          onPageChange(currentPage + 1);
        }
      }
      // Check if scrolled to top
      else if (scrollTop <= threshold) {
        if (!loading && currentPage > 1) {
          scrollDirectionRef.current = 'up';
          onPageChange(currentPage - 1);
        }
      }
    }, throttleMs);

    container.addEventListener("scroll", handleInfiniteScroll);
    return () => container.removeEventListener("scroll", handleInfiniteScroll);
  }, [loading, currentPage, totalPages, onPageChange, threshold, throttleMs]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (scrollDirectionRef.current === 'up') {
      const newScrollTop = currentPage === 1
        ? container.scrollHeight * 0
        : container.scrollHeight / 2 - container.clientHeight / 2;
      container.scrollTo({
        top: newScrollTop,
        behavior: 'smooth',
      });
    } else if (scrollDirectionRef.current === 'down') {
      const newScrollTop = currentPage === totalPages
        ? container.scrollHeight
        : container.scrollHeight / 2 - container.clientHeight / 2;
      container.scrollTo({
        top: newScrollTop,
        behavior: 'smooth',
      });
    }
  }, [currentPage, totalPages]);

  return { containerRef, scrollDirectionRef };
};

export default useInfiniteScroll;
