// Animated Chart Component - Performance Optimized
import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

export default function AnimatedChart() {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <BarChart3 className="h-16 w-16 text-blue-600 animate-pulse" />
          <TrendingUp className="h-8 w-8 text-green-500 absolute -top-2 -right-2 animate-bounce" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Real-Time Analytics
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Dynamic campaign performance visualization
        </p>
      </div>
      
      {/* Simulated Chart */}
      <div className="mt-6 h-32 bg-white dark:bg-gray-800/50 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-around p-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-sm animate-pulse"
              style={{ 
                width: '12px',
                height: `${Math.random() * 80 + 20}px`,
                animationDelay: `${index * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}