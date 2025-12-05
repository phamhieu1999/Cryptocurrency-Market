
import React from 'react';
import { Topic } from '../types';
import { formatCompactNumber } from './Formatters';
import { TrendingUp } from 'lucide-react';

interface TrendingSidebarProps {
  topics: Topic[];
}

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ topics }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-600" />
        <h3 className="font-bold text-gray-900 text-lg">Trending Topics</h3>
      </div>
      <div>
        {topics.map((topic, index) => (
          <div key={topic.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
            <div className="flex items-center justify-between mb-0.5">
               <span className="text-xs text-gray-500 font-medium">Trending in Crypto</span>
               {/* <span className="text-gray-400 text-xs">...</span> */}
            </div>
            <div className="font-bold text-gray-900 mb-0.5">#{topic.name}</div>
            <div className="text-xs text-gray-500">{formatCompactNumber(topic.postsCount)} posts</div>
          </div>
        ))}
      </div>
      <div className="p-4">
        <button className="text-blue-600 text-sm font-medium hover:underline">Show more</button>
      </div>
    </div>
  );
};
