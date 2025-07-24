// Testimonials Section - Performance Optimized
import React from 'react';
import { Star, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const testimonials = [
  {
    name: "Maria Kostadinova",
    role: "Growth Marketing Director",
    company: "TechScale Pro",
    text: "ADPD εξαλείφη την εικασία από τη marketing strategy μας. Βλέπουμε 180% καλύτερο ROAS.",
    rating: 5,
    result: "+180% ROAS"
  },
  {
    name: "Dimitris Papadopoulos", 
    role: "Performance Marketing Manager",
    company: "Digital Growth Labs",
    text: "Η attribution analysis του ADPD αποκάλυψε κρυφές πηγές revenue που δεν ξέραμε ότι υπάρχουν.",
    rating: 5,
    result: "+95% Efficiency"
  },
  {
    name: "Elena Vasilaki",
    role: "CEO & Founder",
    company: "Scale Digital Agency",
    text: "Από €50K σε €2M σε 8 μήνες. Το AI optimization του ADPD έκανε τη διαφορά.",
    rating: 5,
    result: "€50K → €2M"
  }
];

export default function TestimonialsSection() {
  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-yellow-100 text-yellow-800 px-4 py-2">
            ⭐ Client Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Proven Results από Real Clients
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Δείτε πώς agencies και brands μεγιστοποιούν το ROAS τους με το ADPD
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 border border-gray-100 dark:border-gray-700"
            >
              {/* Rating Stars */}
              <div className="flex items-center mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic text-lg leading-relaxed">
                "{testimonial.text}"
              </p>
              
              {/* Client Info & Results */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {testimonial.company}
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold px-3 py-2">
                  <Award className="h-4 w-4 mr-1" />
                  {testimonial.result}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Θέλετε να γίνετε η επόμενη success story;
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            ⚡ Start Your Success Story
          </button>
        </div>

      </div>
    </div>
  );
}