import { Link } from 'react-router-dom';
import homeImage from '../assets/home.jpg';
import mechanicImage from '../assets/mechanic.jpg';
import cleanerImage from '../assets/cleaner.jpg';
import plumberImage from '../assets/plumber.jpg';
import carpenterImage from '../assets/capenter.jpg';

const AboutPage = () => {
  const highlights = [
    {
      title: 'Reliable Help Nearby',
      description: 'Clients can find workers for everyday jobs without relying only on word of mouth or personal referrals.',
      icon: '📍'
    },
    {
      title: 'More Visibility for Workers',
      description: 'Casual workers can present their skills, experience, and availability in one place where clients can discover them.',
      icon: '🤝'
    },
    {
      title: 'Trust Through Reviews',
      description: 'Ratings and feedback help clients choose dependable professionals and help workers build a stronger reputation.',
      icon: '⭐'
    }
  ];

  const pillars = [
    {
      title: 'For Workers',
      text: 'Workers can create a profile that showcases their trade, experience, and location so clients can quickly understand what they offer and whether they are a good fit.',
      image: mechanicImage
    },
    {
      title: 'For Clients',
      text: 'Clients can browse available workers, compare skills and availability, and submit requests for services they need without going through informal chains of contact.',
      image: cleanerImage
    }
  ];

  const features = [
    'Professional worker profiles with skills and experience',
    'Easier job requests and clear service matching',
    'Ratings and reviews that build confidence',
    'Local discovery based on location and availability',
    'Simple job coordination from request to completion',
    'A practical marketplace for everyday services'
  ];

  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={homeImage} alt="Vibarua Marketplace" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071827]/90 via-[#071827]/70 to-[#0f172a]/60"></div>
          <div className="absolute inset-0 bg-pattern-dots-dark opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
              Everyday Services • Trusted Connections
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              About <span className="text-sky-300">Vibarua Marketplace</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-200 leading-relaxed">
              Vibarua Marketplace is a digital platform designed to make it easier for people to find reliable casual workers for everyday services and for workers to reach the people who need their skills.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="nav-primary-button rounded-xl">
                Join the Platform
              </Link>
              <Link to="/workers" className="nav-ghost-button rounded-xl">
                Explore Workers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100 text-2xl shadow-inner shadow-sky-200">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#071827] py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Why this matters</p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold">A practical way to connect service needs with trusted workers.</h2>
            <p className="mt-5 text-slate-200 leading-relaxed">
              In many communities, services such as cleaning, plumbing, electrical repairs, painting, appliance repair and other manual or skilled work are often found through word of mouth, personal contacts or informal recommendations. This can make it difficult for clients to quickly find someone with the right skills.
            </p>
            <p className="mt-4 text-slate-200 leading-relaxed">
              Vibarua Marketplace brings that process into a clearer, more organized system where workers can present their skills and clients can discover people suited to the job they need done.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="text-4xl font-black text-sky-300">5,000+</div>
              <p className="mt-2 text-slate-200">Verified workers ready to work</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="text-4xl font-black text-sky-300">15,000+</div>
              <p className="mt-2 text-slate-200">Jobs completed with community trust</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:col-span-2">
              <div className="text-4xl font-black text-sky-300">24/7</div>
              <p className="mt-2 text-slate-200">Access to helpers, service requests, and hiring coordination</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">How it works</p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">Simple, practical and built around everyday needs.</h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <div className="h-64 overflow-hidden">
                <img src={pillar.image} alt={pillar.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900">{pillar.title}</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">{pillar.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">What people can do</p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">A platform that helps people get work done with less friction.</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sm text-sky-700">✓</span>
                    <p className="text-slate-700">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#0f172a] via-[#132b43] to-[#1e3a5f] p-6 text-white shadow-[0_28px_70px_rgba(15,23,42,0.22)]">
              <div className="absolute inset-0 bg-pattern-dots-dark opacity-20"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_55%)]"></div>
              <div className="relative">
                <img src={plumberImage} alt="Plumber service" className="h-64 w-full rounded-2xl object-cover border border-white/10" />
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Platform feel</p>
                    <p className="mt-2 text-xl font-semibold text-white">Simple, modern and trustworthy</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-lg">✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-[32px] bg-gradient-to-r from-sky-50 via-white to-cyan-50 p-8 sm:p-12 border border-sky-100 shadow-[0_20px_60px_rgba(14,116,144,0.08)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">The goal</p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">To connect people who need work done with people who can do the work.</h2>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
              <p className="text-lg leading-relaxed">
                Vibarua Marketplace is about creating a more organized, practical, and trustworthy way for communities to access everyday services and for workers to find opportunities more consistently.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
