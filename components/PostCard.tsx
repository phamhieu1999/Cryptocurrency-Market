
import React from 'react';
import { Post } from '../types';
import { MessageCircle, Heart, Repeat, Share2, BadgeCheck, MoreHorizontal } from 'lucide-react';
import { formatCompactNumber } from './Formatters';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img 
            src={post.author.avatar} 
            alt={post.author.name} 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-gray-900 text-base">{post.author.name}</span>
              {post.author.isVerified && (
                <BadgeCheck size={16} className="text-blue-500 fill-blue-50" />
              )}
              <span className="text-gray-500 text-sm">{post.author.handle}</span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-500 text-sm hover:underline cursor-pointer">{post.timestamp}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="mt-1 text-gray-900 text-[15px] leading-normal whitespace-pre-wrap">
            {post.content.split(' ').map((word, index) => {
              if (word.startsWith('$') || word.startsWith('#')) {
                return <span key={index} className="text-blue-600 font-medium cursor-pointer hover:underline">{word} </span>;
              }
              return word + ' ';
            })}
          </div>

          {post.image && (
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
              <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-96" />
            </div>
          )}

          {post.coins.length > 0 && (
             <div className="flex gap-2 mt-3">
               {post.coins.map(coin => (
                 <span key={coin} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">
                   ${coin}
                 </span>
               ))}
             </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 text-gray-500 max-w-md">
            <button className="flex items-center gap-1.5 group hover:text-blue-500">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                 <MessageCircle size={18} />
              </div>
              <span className="text-sm">{formatCompactNumber(post.comments)}</span>
            </button>
            <button className="flex items-center gap-1.5 group hover:text-green-500">
              <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <Repeat size={18} />
              </div>
              <span className="text-sm">{formatCompactNumber(post.reposts)}</span>
            </button>
            <button className={`flex items-center gap-1.5 group ${post.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
              <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                <Heart size={18} className={post.isLiked ? 'fill-current' : ''} />
              </div>
              <span className="text-sm">{formatCompactNumber(post.likes)}</span>
            </button>
            <button className="flex items-center gap-1.5 group hover:text-blue-500">
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <Share2 size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
