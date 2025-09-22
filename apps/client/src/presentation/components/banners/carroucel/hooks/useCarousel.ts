import { useState, useEffect, useRef } from "react"

export const useCarousel = (itemsLength: number) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)
  const [itemWidth, setItemWidth] = useState(100)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const calculateVisibleSlides = () => {
      if (!sliderRef.current) return
      let slides = 1
      if (window.innerWidth >= 1280) slides = 2.8
      else if (window.innerWidth >= 1024) slides = 1.8
      else if (window.innerWidth >= 640) slides = 1.2
      else slides = 1.2
      
      const width = 100 / slides
      setItemWidth(width)
      setMaxIndex(itemsLength - Math.floor(slides) + (slides % 1 > 0 ? 0 : 1))
    }
    
    calculateVisibleSlides()
    window.addEventListener("resize", calculateVisibleSlides)
    return () => window.removeEventListener("resize", calculateVisibleSlides)
  }, [itemsLength])

  const handleNext = () => {
    if (currentIndex < maxIndex) setCurrentIndex(prev => prev + 1)
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1)
  }

  const getTransformValue = () => `translate3d(-${currentIndex * itemWidth}%, 0px, 0px)`

  return {
    currentIndex,
    maxIndex,
    itemWidth,
    sliderRef,
    handleNext,
    handlePrev,
    getTransformValue
  }
}