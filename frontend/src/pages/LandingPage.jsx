import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Users, 
  Target, 
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-[#10B981]" />,
      title: "Easy Task Management",
      description: "Create, organize, and prioritize your tasks effortlessly with our intuitive interface designed for maximum productivity."
    },
    {
      icon: <Zap className="w-8 h-8 text-[#F59E0B]" />,
      title: "Smart Automation",
      description: "Automate repetitive tasks and workflows to save time and focus on what truly matters for your productivity."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-[#10B981]" />,
      title: "Progress Monitoring",
      description: "Track your accomplishments with detailed reports and visual dashboards that show your productivity trends over time."
    },
    {
      icon: <Target className="w-8 h-8 text-[#3B82F6]" />,
      title: "Priority Management",
      description: "Organize tasks by urgency and importance with color-coded priorities to ensure critical work gets done first."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      occupation: "Product Manager",
      image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=3B82F6&color=fff&size=80",
      feedback: "Maecenas viverra, lorem vel semper consectetur, nibh neque ullamcorper eros, eget molestie neque augue dictum purus. Morbi ac enim sollicitudin sem accumsan tristique a pharetra nunc. Vestibulum nec dui sed diam maximus sollicitudin nec sed dolor."
    },
    {
      name: "Michael Chen",
      occupation: "Software Developer",
      image: "https://ui-avatars.com/api/?name=Michael+Chen&background=10B981&color=fff&size=80",
      feedback: "This tool has completely transformed how I manage my daily tasks. The interface is clean, intuitive, and helps me stay focused on what matters most. Highly recommend it to anyone looking to boost their productivity!"
    },
    {
      name: "Emma Williams",
      occupation: "Marketing Director",
      image: "https://ui-avatars.com/api/?name=Emma+Williams&background=F59E0B&color=fff&size=80",
      feedback: "Task.io has been a game-changer for our team. The collaboration features make it easy to keep everyone aligned, and the automation saves us hours every week. Couldn't imagine working without it now."
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-4 bg-gradient-radial from-white via-blue-50/30 to-blue-100/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Link 
              to="/login"
              className="group inline-flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#2563EB] hover:to-[#3B82F6] text-white rounded-full text-sm font-semibold mb-6 mt-2 shadow-lg hover:shadow-2xl hover:shadow-blue-400/50 transition-all duration-500 hover:scale-105"
            >
              <span>Go to Your Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#111827] mb-6 leading-tight">
              Nora makes your work effortless
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Streamlining workflow for clarity and focused execution,<br />
              a solution trusted by professionals on iOS and Android.
            </p>
            
            

            {/* Hero Image - Phone Mockups with Floating Cards */}
            <div className="relative max-w-6xl mx-auto">
              {/* Left Floating Cards */}
              <div className="absolute left-0 top-20 space-y-4 hidden lg:block animate-float">
                {/* Set Priority Card */}
                <div className="bg-white rounded-2xl p-4 shadow-xl border border-purple-100 transform -rotate-6 hover:rotate-0 transition-transform">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-[#111827]">Set Priority</span>
                  </div>
                </div>
                
                {/* Total Download Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-purple-100 w-56">
                  <p className="text-sm text-gray-500 mb-2">Total Download</p>
                  <p className="text-3xl font-bold text-[#111827] mb-3">1 million+</p>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#3B82F6] border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-[#10B981] border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-[#F59E0B] border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-[#EF4444] border-2 border-white"></div>
                  </div>
                </div>
              </div>

              {/* Right Floating Cards */}
              <div className="absolute right-0 top-20 space-y-4 hidden lg:block animate-float-delayed">
                {/* Set Progress Card */}
                <div className="bg-white rounded-2xl p-4 shadow-xl border border-blue-100 transform rotate-6 hover:rotate-0 transition-transform">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-[#111827]">Set Progress</span>
                  </div>
                </div>
                
                {/* Projects Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-purple-100 w-56">
                  <div className="flex items-center space-x-2 text-gray-500 text-sm mb-3">
                    <Users className="w-4 h-4" />
                    <span>Members</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xl font-bold text-[#111827]">Projects</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Target className="w-4 h-4" />
                    <span>Assign Task</span>
                  </div>
                </div>
              </div>

              {/* Phone Mockups */}
              <div className="flex items-end justify-center space-x-4 px-4">
                
                
                <div className="w-1/3 transform hover:scale-105 transition-transform z-10">
                  <div className="relative bg-white rounded-[3rem] shadow-2xl border-8 border-gray-800">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-gray-800 rounded-b-3xl"></div>
                    <div className="bg-[#60A5FA] rounded-[2.5rem] aspect-[9/19] p-6">
                      <div className="flex justify-between items-center mb-4 text-white text-xs">
                        <span>9:41</span>
                        <div className="flex space-x-1">
                          <div className="w-1 h-3 bg-white rounded"></div>
                          <div className="w-1 h-3 bg-white rounded"></div>
                          <div className="w-1 h-3 bg-white rounded"></div>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 mb-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg"></div>
                          <div className="w-6 h-6 bg-gray-100 rounded-lg"></div>
                        </div>
                        <h3 className="text-lg font-bold text-[#111827] mb-2">Project Pitch<br/>Preparation</h3>
                        <div className="flex space-x-2 mb-3">
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Due Date</span>
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Priority</span>
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Status</span>
                        </div>
                        <div className="flex -space-x-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-[#3B82F6] border-2 border-white"></div>
                          <div className="w-6 h-6 rounded-full bg-[#10B981] border-2 border-white"></div>
                          <div className="w-6 h-6 rounded-full bg-[#F59E0B] border-2 border-white"></div>
                          <div className="w-6 h-6 rounded-full bg-[#60A5FA] border-2 border-white flex items-center justify-center text-xs text-white">+</div>
                        </div>
                        <p className="text-xs text-gray-500">Description</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-6">
              Powerful Features for Peak Productivity
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage tasks, collaborate with teams,<br />
              and achieve your goals efficiently in one powerful platform.
            </p>
          </div>

          {/* Features Grid with Center Icon */}
          <div className="relative">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {/* Left Features */}
              <div className="space-y-6">
                {features.slice(0, 2).map((feature, index) => (
                  <div 
                    key={index}
                    className="group bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-blue-100/50 hover:border-blue-300 cursor-pointer relative overflow-hidden"
                    style={{
                      animation: `slideInLeft 0.6s ease-out ${index * 0.2}s both`
                    }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50/50 group-hover:to-blue-100/30 transition-all duration-500 rounded-3xl"></div>
                    
                    <div className="relative flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#3B82F6] transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Features */}
              <div className="space-y-6">
                {features.slice(2, 4).map((feature, index) => (
                  <div 
                    key={index}
                    className="group bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-blue-100/50 hover:border-blue-300 cursor-pointer relative overflow-hidden"
                    style={{
                      animation: `slideInRight 0.6s ease-out ${index * 0.2}s both`
                    }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50/50 group-hover:to-blue-100/30 transition-all duration-500 rounded-3xl"></div>
                    
                    <div className="relative flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#3B82F6] transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-6">
              Loved by Professionals Worldwide
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See what our users have to say about transforming their productivity<br />
              and achieving more with Task.io
            </p>
          </div>

          {/* Testimonials Grid - 3 per row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-blue-100 hover:border-blue-300 cursor-pointer"
                style={{
                  animation: `slideInLeft 0.6s ease-out ${index * 0.2}s both`
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full mb-4 border-4 border-[#3B82F6] group-hover:border-[#2563EB] transition-colors duration-300"
                  />
                  <h3 className="text-xl font-semibold text-[#111827] mb-1 group-hover:text-[#3B82F6] transition-colors duration-300">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-500 mb-4 text-sm">
                    {testimonial.occupation}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {testimonial.feedback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl p-8 md:p-16 shadow-xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-6">
                  Ready to boost your productivity?
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Join over 1 million professionals who trust Task.io to organize their work, collaborate with teams, and achieve their goals. Start your journey to effortless productivity today.
                </p>
                
                {/* App Store Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#" 
                    className="flex items-center space-x-3 bg-[#111827] text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">GET IT ON</div>
                      <div className="text-base font-semibold">Google Play</div>
                    </div>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center space-x-3 bg-[#111827] text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5Z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-base font-semibold">App Store</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Phone Mockup */}
              <div className="flex justify-center">
                <div className="relative bg-white rounded-[2.5rem] shadow-2xl border-8 border-gray-800 max-w-xs transform hover:scale-105 transition-transform">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-3xl"></div>
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-[2rem] aspect-[9/19] p-6">
                    <div className="flex justify-between items-center mb-6 text-xs">
                      <span className="text-gray-600">9:41</span>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center text-white font-bold">T</div>
                          <div>
                            <h4 className="font-bold text-sm">Team Meeting</h4>
                            <p className="text-xs text-gray-500">Today at 2:00 PM</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Done</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center text-white font-bold">P</div>
                          <div>
                            <h4 className="font-bold text-sm">Project Review</h4>
                            <p className="text-xs text-gray-500">Tomorrow</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded">In Progress</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;