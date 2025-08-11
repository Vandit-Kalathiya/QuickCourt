import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Calendar, Users, Trophy, ArrowRight, Menu, X, Play, ChevronDown, Zap, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  const navigate = useNavigate();

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Elevate Your Game",
      subtitle: "Premium sports facilities at your fingertips",
      accent: "Experience the future of sports booking"
    },
    {
      image: "https://images.unsplash.com/photo-1544966503-7cc131dc3019?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Unlock Your Potential",
      subtitle: "World-class venues for champions",
      accent: "Where legends are made"
    },
    {
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      title: "Connect & Compete",
      subtitle: "Join the ultimate sports community",
      accent: "Your journey starts here"
    }
  ];

  const popularVenues = [
    {
      id: 1,
      name: "Elite Sports Complex",
      location: "Downtown, City Center",
      rating: 4.8,
      reviews: 234,
      sports: ["Football", "Basketball", "Tennis"],
      price: "₹500",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true
    },
    {
      id: 2,
      name: "Champions Arena",
      location: "North Zone, Sports District",
      rating: 4.9,
      reviews: 189,
      sports: ["Badminton", "Squash", "Table Tennis"],
      price: "₹400",
      image: "https://images.unsplash.com/photo-1544966503-7cc131dc3019?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      name: "Premier Club",
      location: "East Side, Business Park",
      rating: 4.7,
      reviews: 156,
      sports: ["Tennis", "Swimming", "Gym"],
      price: "₹600",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const popularSports = [
    { name: "Football", venues: 45, icon: "⚽", gradient: "from-emerald-400 to-teal-500" },
    { name: "Basketball", venues: 32, icon: "🏀", gradient: "from-orange-400 to-red-500" },
    { name: "Tennis", venues: 28, icon: "🎾", gradient: "from-yellow-400 to-orange-500" },
    { name: "Badminton", venues: 38, icon: "🏸", gradient: "from-purple-400 to-pink-500" },
    { name: "Cricket", venues: 25, icon: "🏏", gradient: "from-blue-400 to-indigo-500" },
    { name: "Swimming", venues: 15, icon: "🏊", gradient: "from-cyan-400 to-blue-500" }
  ];

  const stats = [
    { number: "500+", label: "Sports Venues", icon: Trophy, gradient: "from-yellow-400 to-orange-500" },
    { number: "10K+", label: "Happy Athletes", icon: Users, gradient: "from-blue-400 to-cyan-500" },
    { number: "25+", label: "Sports Available", icon: Zap, gradient: "from-purple-400 to-pink-500" },
    { number: "24/7", label: "Support", icon: Shield, gradient: "from-emerald-400 to-teal-500" }
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 shadow-xl shadow-gray-900/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <span className="ml-3 text-2xl font-black bg-gradient-to-r from-gray-900 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                SportArena
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Venues', 'Sports', 'Community', 'About'].map((item, index) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-gray-700 hover:text-purple-600 px-4 py-2 text-sm font-semibold transition-all duration-300 relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => navigate("/auth")} className="text-gray-700 hover:text-purple-600 px-6 py-3 text-sm font-semibold transition-colors duration-300 hover:bg-purple-50 rounded-xl">
                Sign In
              </button>
              <button onClick={() => navigate("/auth")} className="relative bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-3 rounded-2xl font-bold overflow-hidden group shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative">Get Started</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-purple-600 p-2 rounded-xl hover:bg-purple-50 transition-all duration-300"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="bg-white/95 backdrop-blur-2xl border-t border-gray-200/50 shadow-xl">
            <div className="px-6 py-6 space-y-4">
              {['Home', 'Venues', 'Sports', 'Community', 'About'].map((item, index) => (
                <a 
                  key={item}
                  href="#" 
                  className="block text-gray-700 hover:text-purple-600 py-3 px-4 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold"
                >
                  {item}
                </a>
              ))}
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <button className="block w-full text-left text-gray-700 hover:text-purple-600 py-3 px-4 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold">Sign In</button>
                <button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-4 rounded-2xl font-bold shadow-xl">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-2000 ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            >
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover"
                style={{
                  transform: `translateY(${scrollY * 0.5}px)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white/30"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center bg-white/90 backdrop-blur-xl rounded-full px-6 py-3 mb-8 border border-white/50 shadow-xl shadow-gray-900/10">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
              <span className="text-gray-700 text-sm font-semibold">{heroSlides[currentSlide].accent}</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                {heroSlides[currentSlide].title}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              {heroSlides[currentSlide].subtitle}
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-3 mb-12 max-w-4xl mx-auto border border-white/50 shadow-2xl shadow-gray-900/10">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Find your perfect sports venue..."
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium border border-gray-200 focus:bg-white transition-all duration-300"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full lg:w-64 pl-14 pr-6 py-4 bg-gray-50 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium border border-gray-200 focus:bg-white transition-all duration-300"
                  />
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group shadow-xl shadow-purple-500/25">
                  <span>Search</span>
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-500 ${
                    index === currentSlide 
                      ? 'w-12 h-3 bg-gradient-to-r from-purple-500 to-cyan-500 shadow-lg' 
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                  } rounded-full`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-gray-500" size={32} />
        </div>
      </section>

      {/* Floating Stats */}
      <section className="relative -mt-24 z-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 hover:bg-white/90 transition-all duration-500 group transform hover:-translate-y-3 shadow-xl shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="text-white" size={28} />
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Sports - Reimagined */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 via-pink-50/30 to-cyan-50/50"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-purple-100/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-purple-200/50 shadow-lg">
              <Trophy className="text-purple-600 mr-2" size={16} />
              <span className="text-purple-700 font-semibold">Popular Sports</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Choose Your <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Game</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Discover world-class facilities for every sport imaginable
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularSports.map((sport, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 hover:border-purple-200 transition-all duration-500 overflow-hidden group-hover:scale-105 group-hover:-translate-y-2 shadow-xl shadow-gray-900/5 hover:shadow-2xl hover:shadow-gray-900/10`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${sport.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-500">
                      {sport.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {sport.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">{sport.venues} venues</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Venues - Enhanced */}
      <section className="py-32 relative bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-cyan-100/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-cyan-200/50 shadow-lg">
              <Star className="text-cyan-600 mr-2" size={16} />
              <span className="text-cyan-700 font-semibold">Top Rated</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Premium <span className="bg-gradient-to-r from-cyan-600 to-purple-500 bg-clip-text text-transparent">Venues</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Experience the finest sports facilities loved by athletes worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {popularVenues.map((venue, index) => (
              <div
                key={venue.id}
                className={`group cursor-pointer ${venue.featured ? 'lg:row-span-2' : ''}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/50 hover:border-purple-200 transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-4 shadow-xl shadow-gray-900/5 hover:shadow-2xl hover:shadow-purple-500/10">
                  <div className="relative overflow-hidden">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                        venue.featured ? 'h-96' : 'h-64'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Floating Price Tag */}
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/50 shadow-lg">
                        <span className="text-gray-900 font-bold">{venue.price}</span>
                        <span className="text-gray-600 text-sm">/hour</span>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {venue.featured && (
                      <div className="absolute top-6 right-6">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-4 py-2 text-xs font-bold text-white shadow-lg">
                          FEATURED
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                        {venue.name}
                      </h3>
                      <div className="flex items-center bg-yellow-100/80 backdrop-blur-sm rounded-full px-3 py-1 border border-yellow-200/50 shadow-sm">
                        <Star size={14} className="fill-yellow-500 text-yellow-500 mr-1" />
                        <span className="text-yellow-700 text-sm font-bold">{venue.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 mb-6">
                      <MapPin size={16} className="text-cyan-500" />
                      <span className="ml-2 text-sm font-medium">{venue.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {venue.sports.map((sport, sportIndex) => (
                        <span
                          key={sportIndex}
                          className="bg-purple-100/80 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold border border-purple-200/50"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-medium">{venue.reviews} reviews</span>
                      <button className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center group shadow-lg shadow-purple-500/25">
                        Book Now
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned */}
      <section className="py-32 relative bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-cyan-50/50">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Why Athletes Choose <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">SportArena</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Clock,
                title: "Instant Booking",
                description: "Book your favorite venue in seconds with our lightning-fast platform",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Elite Community",
                description: "Connect with thousands of passionate athletes and sports enthusiasts",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Shield,
                title: "Premium Quality",
                description: "Access only verified, top-tier facilities with world-class amenities",
                gradient: "from-emerald-500 to-teal-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-24 h-24 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl shadow-gray-900/10`}>
                  <feature.icon className="text-white" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
             }}
        ></div>
        
        <div className="max-w-4xl mx-auto text-center px-6 relative">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Ready to <span className="text-yellow-300">Dominate</span>?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Join SportArena today and unlock access to premium sports facilities that will elevate your game to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-purple-600 px-12 py-4 rounded-2xl font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group shadow-xl">
              Start Your Journey
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="border-2 border-white/80 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 backdrop-blur-sm shadow-xl">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-2xl">⚡</span>
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  SportArena
                </span>
              </div>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed font-medium">
                Revolutionizing sports facility booking with cutting-edge technology and unmatched user experience.
              </p>
              <div className="flex space-x-4">
                {['f', 't', 'i', 'y'].map((social, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg"
                  >
                    <span className="text-white font-bold">{social}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                {['Home', 'Venues', 'Sports', 'About Us', 'Contact'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-white transition-colors duration-300 relative group font-medium">
                      {link}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-300"></div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-6">For Owners</h4>
              <ul className="space-y-3 text-gray-400">
                {['List Your Venue', 'Owner Dashboard', 'Pricing Plans', 'Support Center'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-white transition-colors duration-300 relative group font-medium">
                      {link}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-300"></div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0 font-medium">
              &copy; 2025 SportArena. All rights reserved. Crafted with ❤️ for athletes.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-300 font-medium">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300 font-medium">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-300 font-medium">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Homepage;