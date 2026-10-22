import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { getTestimonials } from '../data/store';
import { Card } from './Card';
import { SkeletonLoader } from './SkeletonLoader';

export function TestimonialsCarousel(): React.ReactElement {
  const testimonialsQuery = useAsyncData(getTestimonials, []);
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = testimonialsQuery.data ?? [];

  const goToPrevious = (): void => {
    setActiveIndex((index) => (index === 0 ? testimonials.length - 1 : index - 1));
  };

  const goToNext = (): void => {
    setActiveIndex((index) => (index === testimonials.length - 1 ? 0 : index + 1));
  };

  if (testimonialsQuery.isLoading) {
    return <SkeletonLoader className="h-48 w-full" />;
  }

  if (testimonials.length === 0) {
    return <></>;
  }

  const testimonial = testimonials[activeIndex];

  return (
    <Card className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center gap-4"
        >
          <img
            src={testimonial.photoUrl}
            alt={testimonial.customerName}
            className="h-16 w-16 rounded-pill object-cover"
          />
          <div className="flex gap-0.5">
            {Array.from({ length: testimonial.rating }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-warning-dark text-warning-dark" />
            ))}
          </div>
          <p className="max-w-xl text-sm text-muted">&ldquo;{testimonial.review}&rdquo;</p>
          <div>
            <p className="font-semibold text-sm">{testimonial.customerName}</p>
            <p className="text-xs text-muted">
              {testimonial.jobTitle}, {testimonial.customerCompany}
            </p>
          </div>
          <p className="text-xs font-medium text-accent">{testimonial.businessOutcome}</p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goToPrevious}
          className="rounded-pill border border-border-default dark:border-border-dark p-2 hover:bg-canvas dark:hover:bg-night"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-xs text-muted">
          {activeIndex + 1} / {testimonials.length}
        </span>
        <button
          type="button"
          onClick={goToNext}
          className="rounded-pill border border-border-default dark:border-border-dark p-2 hover:bg-canvas dark:hover:bg-night"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
