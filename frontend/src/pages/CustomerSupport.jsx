import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, HelpCircle, Book, MessageSquare, Mail, Phone, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CustomerSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I create a new task?",
      answer: "To create a new task, click the 'Create' button in your dashboard. Fill in the task details including title, description, priority level, and due date. Click 'Add Task' to save it to your board."
    },
    {
      question: "Can I collaborate with team members?",
      answer: "Yes! Nora supports team collaboration. You can invite team members to your workspace, assign tasks to them, and track progress together in real-time."
    },
    {
      question: "How do I change my task status?",
      answer: "You can change task status by dragging and dropping tasks between columns (Scheduled, In Progress, Done) on desktop, or by using the 3-dot menu on mobile to select 'Move' and choose the new status."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption to protect your data both in transit and at rest. Your tasks and personal information are stored securely and are never shared with third parties."
    },
    {
      question: "Can I access Nora offline?",
      answer: "The mobile apps support offline mode for viewing and editing your tasks. Changes will sync automatically when you reconnect to the internet."
    },
    {
      question: "How do I delete my account?",
      answer: "To delete your account, go to Settings > Account > Delete Account. Please note that this action is permanent and will delete all your tasks and data."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions."
    },
    {
      question: "Can I export my tasks?",
      answer: "Yes, you can export your tasks in CSV, JSON, or PDF format from the Settings menu. This feature is available for all paid plans."
    }
  ];

  const supportOptions = [
    {
      icon: <Book className="w-8 h-8 text-[#3B82F6]" />,
      title: "Documentation",
      description: "Browse our comprehensive guides and tutorials",
      action: "Read Docs"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-[#10B981]" />,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      action: "Start Chat"
    },
    {
      icon: <Mail className="w-8 h-8 text-[#F59E0B]" />,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      action: "Send Email"
    },
    {
      icon: <Phone className="w-8 h-8 text-[#EF4444]" />,
      title: "Phone Support",
      description: "Talk to our support team directly",
      action: "Call Us"
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-white via-blue-50/30 to-blue-100/50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#2563EB] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
            How can we help you?
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Get the support you need to make the most of Nora
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#3B82F6] focus:outline-none shadow-lg text-gray-700"
            />
          </div>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {supportOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-blue-100 hover:border-[#3B82F6]"
            >
              <div className="mb-4">{option.icon}</div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">
                {option.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {option.description}
              </p>
              <button className="text-[#3B82F6] font-semibold text-sm hover:text-[#2563EB] transition-colors">
                {option.action} →
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-16">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-[#3B82F6]" />
            <h2 className="text-3xl font-bold text-[#111827]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#3B82F6] transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors"
                >
                  <span className="font-semibold text-[#111827]">
                    {faq.question}
                  </span>
                  <span className={`text-[#3B82F6] text-2xl transform transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-3xl shadow-lg p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Still need help?</h2>
          <p className="text-blue-50 mb-8 text-lg">
            Our support team is available 24/7 to assist you
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-blue-50">support@nora-app.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-blue-50">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Hours</h3>
                <p className="text-blue-50">24/7 Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerSupport;
