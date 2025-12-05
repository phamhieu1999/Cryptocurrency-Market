
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPosts, fetchTrendingTopics } from '../store/communitySlice';
import { PostCard } from '../components/PostCard';
import { TrendingSidebar } from '../components/TrendingSidebar';
import { Loader2, PenSquare, Image as ImageIcon, Smile } from 'lucide-react';
import { LoginModal } from '../components/LoginModal';

export const Community = () => {
  const dispatch = useAppDispatch();
  const { posts, trendingTopics, status } = useAppSelector((state) => state.community);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  
  const loading = status === 'loading' || status === 'idle';

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTrendingTopics());
  }, [dispatch]);

  const handlePostClick = () => {
      if (!isAuthenticated) {
          setIsLoginModalOpen(true);
      }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-8 xl:col-span-8">
            
            {/* Create Post Input */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
                <div className="flex gap-3">
                    <img 
                       src={user?.avatar || "https://ui-avatars.com/api/?name=Guest&background=f1f5f9&color=64748b"} 
                       alt="User" 
                       className="w-10 h-10 rounded-full" 
                    />
                    <div className="flex-grow">
                        <div 
                           className="bg-gray-100 rounded-xl p-3 text-gray-500 cursor-text hover:bg-gray-200 transition-colors"
                           onClick={handlePostClick}
                        >
                            What's happening in crypto?
                        </div>
                        <div className="flex justify-between items-center mt-3 px-1">
                            <div className="flex gap-4 text-blue-500">
                                <button className="hover:bg-blue-50 p-2 rounded-full transition-colors"><ImageIcon size={20} /></button>
                                <button className="hover:bg-blue-50 p-2 rounded-full transition-colors"><Smile size={20} /></button>
                            </div>
                            <button 
                                onClick={handlePostClick}
                                className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 transition-colors opacity-90"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4 overflow-x-auto scrollbar-hide">
                 <button className="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-bold text-sm whitespace-nowrap">For You</button>
                 <button className="px-6 py-3 text-gray-500 hover:text-gray-900 font-medium text-sm whitespace-nowrap">Following</button>
                 <button className="px-6 py-3 text-gray-500 hover:text-gray-900 font-medium text-sm whitespace-nowrap">News</button>
                 <button className="px-6 py-3 text-gray-500 hover:text-gray-900 font-medium text-sm whitespace-nowrap">Top Articles</button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
               {loading ? (
                   <div className="flex justify-center py-12">
                       <Loader2 size={32} className="animate-spin text-blue-600" />
                   </div>
               ) : (
                   posts.map(post => (
                       <div key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                           <PostCard post={post} />
                       </div>
                   ))
               )}
            </div>

          </div>

          {/* Right Sidebar (Trending) */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-4 space-y-6">
             {/* Recommended Accounts Mock */}
             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 font-bold text-lg text-gray-900">Who to follow</div>
                <div className="p-4 space-y-4">
                     {[1, 2, 3].map(i => (
                         <div key={i} className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                 <img src={`https://ui-avatars.com/api/?name=Crypto+User+${i}&background=random`} className="w-10 h-10 rounded-full" />
                                 <div className="flex flex-col">
                                     <span className="font-bold text-sm">Crypto User {i}</span>
                                     <span className="text-xs text-gray-500">@crypto_user_{i}</span>
                                 </div>
                             </div>
                             <button className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-80">Follow</button>
                         </div>
                     ))}
                </div>
             </div>

             <TrendingSidebar topics={trendingTopics} />
          </div>

        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        initialMode="login"
      />
    </div>
  );
};
