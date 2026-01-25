import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Users, Zap, Award, TrendingUp, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-[#3B82F6]" />,
      title: "Mission-Driven",
      description: "We're committed to helping individuals and teams achieve their goals through intelligent task management."
    },
    {
      icon: <Users className="w-8 h-8 text-[#10B981]" />,
      title: "User-Centric",
      description: "Every feature we build starts with understanding our users' needs and challenges."
    },
    {
      icon: <Zap className="w-8 h-8 text-[#F59E0B]" />,
      title: "Innovation",
      description: "We continuously evolve our platform with cutting-edge technology and smart automation."
    },
    {
      icon: <Shield className="w-8 h-8 text-[#8B5CF6]" />,
      title: "Trust & Security",
      description: "Your data security and privacy are our top priorities in everything we do."
    }
  ];

  const stats = [
    { number: "1M+", label: "Active Users" },
    { number: "50M+", label: "Tasks Completed" },
    { number: "150+", label: "Countries" },
    { number: "99.9%", label: "Uptime" }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=3B82F6&color=fff&size=200",
      bio: "Former product manager at leading tech companies with 10+ years of experience in productivity tools."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://ui-avatars.com/api/?name=Michael+Chen&background=10B981&color=fff&size=200",
      bio: "Tech innovator with expertise in AI and cloud architecture, passionate about building scalable solutions."
    },
    {
      name: "Emma Williams",
      role: "Head of Design",
      image: "https://ui-avatars.com/api/?name=Emma+Williams&background=F59E0B&color=fff&size=200",
      bio: "Award-winning UX designer focused on creating intuitive and delightful user experiences."
    },
    {
      name: "James Rodriguez",
      role: "VP of Engineering",
      image: "https://ui-avatars.com/api/?name=James+Rodriguez&background=EF4444&color=fff&size=200",
      bio: "Engineering leader with a track record of building high-performance teams and products."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-radial from-white via-blue-50/30 to-blue-100/50">
      <Navbar />
      
      <div className="pt-32 pb-16">
        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#111827] mb-6">
              About Nora
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make work effortless for everyone. Nora helps individuals and teams organize their tasks, collaborate seamlessly, and achieve their goals with clarity and focus.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#111827] mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Nora was born from a simple observation: people struggle to manage their tasks effectively. In 2020, our founders came together with a vision to create a task management platform that's both powerful and intuitive.
                </p>
                <p>
                  What started as a small project quickly grew into a comprehensive productivity solution trusted by over 1 million users worldwide. We've helped teams and individuals organize millions of tasks, meet countless deadlines, and achieve their goals.
                </p>
                <p>
                  Today, Nora continues to evolve, incorporating the latest technology and user feedback to provide the best task management experience possible. Our commitment remains the same: making work effortless for everyone.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827] mb-2">Founded in 2020</h3>
                    <p className="text-gray-600 text-sm">Started with a vision to revolutionize task management</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827] mb-2">Rapid Growth</h3>
                    <p className="text-gray-600 text-sm">Reached 1M+ users across 150+ countries</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827] mb-2">Global Team</h3>
                    <p className="text-gray-600 text-sm">50+ talented professionals working remotely worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 text-lg">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100 hover:border-[#3B82F6]"
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 text-lg">
              The passionate people behind Nora
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#111827] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#3B82F6] font-semibold text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl p-12 shadow-xl text-center">
            <h2 className="text-4xl font-bold text-[#111827] mb-4">
              Join Us on Our Journey
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're an individual looking to boost productivity or a team seeking better collaboration, Nora is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white rounded-xl font-semibold hover:from-[#2563EB] hover:to-[#3B82F6] transition-all shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#3B82F6] rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg border-2 border-[#3B82F6]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
