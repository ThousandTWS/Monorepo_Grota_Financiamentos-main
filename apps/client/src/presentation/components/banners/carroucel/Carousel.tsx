"use client";
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog";
import { useCarousel } from "@/src/presentation/components/banners/carroucel/hooks/useCarousel";
import { useDialog, CarouselItemType } from "@/src/presentation/components/banners/carroucel/hooks/useDialog";
import { carouselItems } from "@/src/presentation/components/banners/carroucel/data/carouselData";
import Image from "next/image";

interface NavigationButtonsProps {
  currentIndex: number;
  maxIndex: number;
  handlePrev: () => void;
  handleNext: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentIndex,
  maxIndex,
  handlePrev,
  handleNext,
}) => (
  <div className="mt-6 pl-2 flex justify-start gap-4">
    <button
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none h-12 w-12 rounded-full disabled:opacity-50 bg-primary text-primary-foreground shadow-md hover:shadow-primary/30 hover:scale-105 active:scale-95"
      disabled={currentIndex === 0}
      onClick={handlePrev}
      aria-label="Previous slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-arrow-left h-4 w-4"
      >
        <path d="m12 19-7-7 7-7"></path>
        <path d="M19 12H5"></path>
      </svg>
      <span className="sr-only">Previous slide</span>
    </button>

    <button
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none h-12 w-12 rounded-full disabled:opacity-50 bg-primary text-primary-foreground shadow-md hover:shadow-primary/30 hover:scale-105 active:scale-95"
      disabled={currentIndex >= maxIndex}
      onClick={handleNext}
      aria-label="Next slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-arrow-right h-4 w-4"
      >
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
      </svg>
      <span className="sr-only">Next slide</span>
    </button>
  </div>
);

interface CarouselItemProps {
  item: CarouselItemType;
  onPlusClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    item: CarouselItemType
  ) => void;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ item, onPlusClick }) => (
  <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full">
    <div className="relative overflow-hidden h-64">
      <Image
        alt={item.title}
        loading="lazy"
        width="900"
        height="600"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        src={item.imageSrc}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className="absolute top-4 left-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#1B4B7C] rounded-full uppercase tracking-wide">
          {item.category}
        </span>
      </div>
    </div>

    <div className="flex flex-col justify-between p-6 flex-grow">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {item.description.substring(0, 120)}...
        </p>
      </div>

      <button
        onClick={(e) => onPlusClick(e, item)}
        className="w-full bg-[#1B4B7C] hover:bg-[#174470] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <span>Lorem Ipsum</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
);

interface DetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: CarouselItemType | null;
}

const DetailDialog: React.FC<DetailDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedItem,
}) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogTitle></DialogTitle>
    <DialogContent className="sm:max-w-[900px] bg-white p-0 overflow-hidden rounded-2xl shadow-2xl">
      {selectedItem && (
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 h-80 md:h-auto overflow-hidden">
            <Image
              src={selectedItem.imageSrc}
              alt={selectedItem.title}
              className="w-full h-full object-cover"
              fill
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          <div className="p-8 w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full uppercase tracking-wide mb-4">
                {selectedItem.category}
              </span>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{selectedItem.title}</h3>
              <p className="text-gray-600 leading-relaxed text-base mb-6">
                {selectedItem.description}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Lorem ipsum dolor
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Sit amet consectetur
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Adipiscing elit sed
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                Lorem Ipsum
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Dolor Sit
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default function Carousel01() {
  const itemsRef = useRef<HTMLDivElement>(null);
  const carousel = useCarousel(carouselItems.length);
  const dialog = useDialog();

  return (
    <section className="pb-20 pt-20 md:pb-32 md:pt-32 container mx-auto">
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full uppercase tracking-wide mb-4">
          Lorem Ipsum
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Lorem Ipsum Dolor
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="mx-auto flex max-w-container flex-col items-start">
        <div
          className="relative w-full overflow-hidden"
          role="region"
          aria-roledescription="carousel"
          ref={carousel.sliderRef}
        >
          <div className="relative">
            <div
              ref={itemsRef}
              className="flex transition-all duration-700 ease-out"
              style={{ transform: carousel.getTransformValue() }}
            >
              {carouselItems.map((item, index) => (
                <div
                  key={index}
                  role="group"
                  aria-roledescription="slide"
                  className="min-w-0 shrink-0 grow-0 px-2"
                  style={{
                    width: `${carousel.itemWidth}%`,
                  }}
                >
                  <CarouselItem item={item} onPlusClick={dialog.handlePlusClick} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <NavigationButtons
          currentIndex={carousel.currentIndex}
          maxIndex={carousel.maxIndex}
          handlePrev={carousel.handlePrev}
          handleNext={carousel.handleNext}
        />
      </div>
      <DetailDialog
        isOpen={dialog.isDialogOpen}
        onOpenChange={dialog.setIsDialogOpen}
        selectedItem={dialog.selectedItem}
      />
    </section>
  );
}
