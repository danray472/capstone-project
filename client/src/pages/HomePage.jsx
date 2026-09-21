import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/home.jpg';
import image1 from '../assets/image1.jpg';
import electricianImage from '../assets/electrician.jpg';
import electrician2Image from '../assets/electrician2.jpg';
import cleanerImage from '../assets/cleaner.jpg';
import chefImage from '../assets/chef.jpg';
import gardenerImage from '../assets/gardener.jpg';
import gardener2Image from '../assets/gardener2.jpg';
import mamafuaImage from '../assets/mamafua.jpg';
import carpenterImage from '../assets/capenter.jpg';
import mechanicImage from '../assets/mechanic.jpg';
import mechanic2Image from '../assets/mechanic2.jpg';
import painterImage from '../assets/painter.jpg';
import plumberImage from '../assets/plumber.jpg';
import welderImage from '../assets/Welder.jpg';
import hairdresserImage from '../assets/hairdresser.jpg';
import mjengoImage from '../assets/mjengo.jpg';
import moversImage from '../assets/movers.jpg';
import fumigationImage from '../assets/General Fumigation.jpg';
import manImage from '../assets/man.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🔍',
      title: 'Find Trusted Workers',
      description: 'Browse verified professionals with ratings and reviews to find the perfect match for your needs.',
      image: electrician2Image
    },
    {
      icon: '⚡',
      title: 'Quick & Easy',
      description: 'Post a job request in minutes and get responses from available workers in your area.',
      image: mamafuaImage
    },
    {
      icon: '💰',
      title: 'Fair Pricing',
      description: 'Transparent pricing with no hidden fees. Negotiate directly with workers for the best rates.',
      image: carpenterImage
    },
    {
      icon: '🛡️',
      title: 'Secure Payments',
      description: 'Safe and secure payment processing. Pay only when the job is completed to your satisfaction.',
      image: image1
    }
  ];

  const steps = [
    {
      step: '1',
      title: 'Post Your Job',
      description: 'Describe what you need and when you need it done. Be specific for better matches.',
      image: manImage
    },
    {
      step: '2',
      title: 'Get Matched',
      description: 'Receive requests from interested workers. Review their profiles and ratings.',
      image: mechanicImage
    },
    {
      step: '3',
      title: 'Hire & Complete',
      description: 'Choose your worker, track progress, and pay securely when satisfied.',
      image: mjengoImage
    }
  ];

  const categories = [
    { name: 'Mama Fua / Laundry', icon: '🧺', count: '150+', image: mamafuaImage },
    { name: 'House Cleaning', icon: '🧹', count: '200+', image: cleanerImage },
    { name: 'Mechanics', icon: '🚗', count: '70+', image: mechanicImage },
    { name: 'Plumbers', icon: '🔧', count: '80+', image: plumberImage },
    { name: 'Electricians', icon: '⚡', count: '90+', image: electricianImage },
    { name: 'Carpenters', icon: '🪚', count: '60+', image: carpenterImage },
    { name: 'Private Chefs', icon: '👨‍🍳', count: '45+', image: chefImage },
    { name: 'Gardeners', icon: '🌿', count: '50+', image: gardener2Image },
    { name: 'Painters', icon: '🎨', count: '35+', image: painterImage },
    { name: 'Welders', icon: '⚙️', count: '30+', image: welderImage },
    { name: 'Hairdressers', icon: '💇', count: '70+', image: hairdresserImage },
    { name: 'Movers', icon: '📦', count: '40+', image: moversImage },
    { name: 'Fumigation', icon: '🪲', count: '25+', image: fumigationImage },
    { name: 'Mason / Mjengo', icon: '🧱', count: '55+', image: mjengoImage },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Homeowner',
      text: 'Found an amazing plumber within minutes. The platform made it so easy to compare ratings and prices.',
      rating: 5,
      image: mechanic2Image
    },
    {
      name: 'John K.',
      role: 'Business Owner',
      text: 'I use Vibarua for all my casual labor needs. Reliable workers and great customer support.',
      rating: 5,
      image: mjengoImage
    },
    {
      name: 'Grace W.',
      role: 'Working Mom',
      text: 'Finally found trustworthy cleaners for my home. The review system gives me peace of mind.',
      rating: 5,
      image: cleanerImage
    }
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Very light darkening so the image stays rich and vibrant */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/20"></div>
          {/* Keep the pattern extremely subtle */}
          <div className="absolute inset-0 opacity-20 bg-pattern-dots-dark"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Kenya's #1 Casual Worker Marketplace
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Find Trusted{' '}
              <span className="bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                Workers
              </span>
              {' '}for Any Job
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with skilled professionals for home services, repairs, cleaning, and more. 
              Verified workers, transparent pricing, and secure payments.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => navigate('/workers')}
                className="px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-surface-light transition-all duration-200 shadow-lg shadow-white/25 hover:shadow-xl hover:shadow-white/30"
              >
                Find Workers
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold border-2 border-white/30 hover:shadow-lg transition-all duration-200"
              >
                Join as Worker
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                <div className="text-4xl font-bold text-white mb-2">5,000+</div>
                <div className="text-sm text-white/90">Verified Workers</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                <div className="text-4xl font-bold text-white mb-2">15,000+</div>
                <div className="text-sm text-white/90">Jobs Completed</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                <div className="text-4xl font-bold text-white mb-2">4.8★</div>
                <div className="text-sm text-white/90">Average Rating</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-white/90">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white bg-pattern-dots">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">Why Choose Vibarua?</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              We make it simple to find reliable workers for any task
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="relative group rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-border">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                </div>

                {/* Content */}
                <div className="relative p-8 h-full flex flex-col justify-end min-h-[280px]">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/90 leading-relaxed text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-surface-light/50 bg-pattern-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">How It Works</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-all duration-300">
                  {/* Background image */}
                  <div className="absolute inset-0">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20"></div>
                  </div>
                  {/* Content */}
                  <div className="relative p-8 flex flex-col justify-end min-h-[260px]">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg">
                      {step.step}
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-white/85 leading-relaxed text-sm">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-primary/60 z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20 bg-white bg-pattern-dots">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">Popular Categories</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Find workers for any type of job
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => navigate('/workers')}
                className="relative group rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border"
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
                </div>
                {/* Content */}
                <div className="relative p-5 flex flex-col justify-end min-h-[160px]">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-white text-sm leading-tight mb-0.5">{category.name}</h3>
                  <p className="text-xs text-white/80">{category.count} workers</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/workers')}
              className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25"
            >
              Browse All Categories
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-br from-primary/5 to-accent/5 bg-pattern-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">What Our Users Say</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Join thousands of satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="relative group rounded-2xl overflow-hidden shadow-lg border border-border">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                </div>

                {/* Content */}
                <div className="relative p-8 h-full flex flex-col justify-end min-h-[280px]">
                  <div className="flex items-center gap-1 mb-4">
                    {'★'.repeat(testimonial.rating).split('').map((star, i) => (
                      <span key={i} className="text-yellow-400 text-xl">{star}</span>
                    ))}
                  </div>
                  <p className="text-white/90 mb-6 leading-relaxed text-sm">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-white/80">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-accent"></div>
        {/* Subtle diagonal pattern overlay */}
        <div className="absolute inset-0 bg-pattern-diagonal"></div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/30">
              <span className="text-2xl">🚀</span>
              Start your journey today
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Get Started?
            </h2>

            {/* Subtitle */}
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Kenyans who trust Vibarua for their casual labor needs
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/register')}
                className="group px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-surface-light transition-all duration-300 shadow-2xl shadow-white/25 hover:shadow-white/40 hover:-translate-y-1 flex items-center gap-2"
              >
                Create Free Account
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button
                onClick={() => navigate('/workers')}
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold border-2 border-white/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                Browse Workers
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xl">✓</span>
                Free to join
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xl">✓</span>
                No hidden fees
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xl">✓</span>
                Secure payments
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  V
                </div>
                <span className="text-2xl font-bold text-text-primary">Vibarua</span>
              </div>
              <p className="text-text-secondary leading-relaxed mb-6">
                Kenya's trusted marketplace for casual workers and skilled professionals.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-surface-light rounded-lg flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all duration-200">
                  <span>𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 bg-surface-light rounded-lg flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all duration-200">
                  <span>📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-surface-light rounded-lg flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all duration-200">
                  <span>📸</span>
                </a>
              </div>
            </div>

            {/* For Clients */}
            <div>
              <h4 className="font-semibold text-text-primary mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                For Clients
              </h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-text-secondary group-hover:text-primary transition-colors">→</span>
                  Find Workers
                </a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-text-secondary group-hover:text-primary transition-colors">→</span>
                  Post a Job
                </a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-text-secondary group-hover:text-primary transition-colors">→</span>
                  How It Works
                </a></li>
              </ul>
            </div>

            {/* For Workers */}
            <div>
              <h4 className="font-semibold text-text-primary mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                For Workers
              </h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-text-secondary group-hover:text-primary transition-colors">→</span>
                  Join as Worker
                </a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-text-secondary group-hover:text-primary transition-colors">→</span>
                  Find Jobs
                </a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-text-secondary group-hover:text-primary transition-colors">→</span>
                  Worker Guidelines
                </a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-text-primary mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Support
              </h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-text-secondary group-hover:text-primary transition-colors">→</span>
                  Help Center
                </a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-text-secondary group-hover:text-primary transition-colors">→</span>
                  Contact Us
                </a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-text-secondary group-hover:text-primary transition-colors">→</span>
                  Privacy Policy
                </a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-secondary text-sm">
              &copy; {new Date().getFullYear()} Vibarua Marketplace. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-text-secondary">
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;


