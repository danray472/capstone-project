import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🔍',
      title: 'Find Trusted Workers',
      description: 'Browse verified professionals with ratings and reviews to find the perfect match for your needs.',
      image: image1
    },
    {
      icon: '⚡',
      title: 'Quick & Easy',
      description: 'Post a job request in minutes and get responses from available workers in your area.',
      image: image2
    },
    {
      icon: '💰',
      title: 'Fair Pricing',
      description: 'Transparent pricing with no hidden fees. Negotiate directly with workers for the best rates.',
      image: image3
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
      description: 'Describe what you need and when you need it done. Be specific for better matches.'
    },
    {
      step: '2',
      title: 'Get Matched',
      description: 'Receive requests from interested workers. Review their profiles and ratings.'
    },
    {
      step: '3',
      title: 'Hire & Complete',
      description: 'Choose your worker, track progress, and pay securely when satisfied.'
    }
  ];

  const categories = [
    { name: 'Mama Fua / Laundry', icon: '🧺', count: '150+' },
    { name: 'House Cleaning', icon: '🧹', count: '200+' },
    { name: 'Plumbers', icon: '🔧', count: '80+' },
    { name: 'Electricians', icon: '⚡', count: '90+' },
    { name: 'Carpenters', icon: '🪚', count: '60+' },
    { name: 'Private Chefs', icon: '👨‍🍳', count: '45+' }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Homeowner',
      text: 'Found an amazing plumber within minutes. The platform made it so easy to compare ratings and prices.',
      rating: 5
    },
    {
      name: 'John K.',
      role: 'Business Owner',
      text: 'I use Vibarua for all my casual labor needs. Reliable workers and great customer support.',
      rating: 5
    },
    {
      name: 'Grace W.',
      role: 'Working Mom',
      text: 'Finally found trustworthy cleaners for my home. The review system gives me peace of mind.',
      rating: 5
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-accent/80"></div>
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
                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold border-2 border-white/30 hover:bg-white/30 transition-all duration-200"
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
      <div className="py-20 bg-white">
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
      <div className="py-20 bg-surface-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">How It Works</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-semibold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-primary/30">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">Popular Categories</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Find workers for any type of job
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => navigate('/workers')}
                className="bg-surface-light rounded-2xl p-6 text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border"
              >
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-text-primary mb-1">{category.name}</h3>
                <p className="text-sm text-text-secondary">{category.count} workers</p>
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
      <div className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
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
                    src={index === 0 ? image1 : index === 1 ? image2 : image3}
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
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:-translate-y-1"
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
              &copy; 2024 Vibarua Marketplace. All rights reserved.
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


