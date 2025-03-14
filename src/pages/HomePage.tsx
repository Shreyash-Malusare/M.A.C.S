// import React from 'react';
import { Hero } from '../components/home/Hero';
import { FeaturedCategories } from '../components/home/FeaturedCategories';
import { SpecialOffer } from '../components/home/SpecialOffer';
// import { TrendingSection } from '../components/home/TrendingSection';
// import { Newsletter } from '../components/home/Newsletter';

export function HomePage() {
  return (
    <div className="">
      <Hero />
      <FeaturedCategories />
      <SpecialOffer />
    </div>
  );
}