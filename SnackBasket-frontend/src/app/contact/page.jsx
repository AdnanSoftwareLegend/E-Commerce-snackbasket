'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl mb-8">
        <h1 className="text-xl font-bold text-gray-800">Contact</h1>
        <p className="text-xs text-emerald-800 font-medium">Home : Contact</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Custom Request Form */}
        <div className="md:col-span-2 bg-white border p-6 md:p-8 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Make Custom Request</h2>

          {success && (
            <div className="mb-4 p-3 bg-emerald-100 text-emerald-800 rounded-lg text-sm">
              Your message has been sent successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
              <textarea
                rows={4}
                placeholder="Type your Message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition inline-flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Get In Touch Sidebar */}
        <div className="bg-white border p-6 rounded-2xl shadow-sm h-fit space-y-6">
          <h2 className="text-lg font-bold text-gray-800">Get In Touch</h2>

          <div className="space-y-4 text-xs text-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-full text-emerald-600">
                <Phone className="w-4 h-4" />
              </div>
              <span>+00 123 456 789</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-full text-emerald-600">
                <Mail className="w-4 h-4" />
              </div>
              <span>Example@site.com</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-full text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <span>789 Inner lane, California , USA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}