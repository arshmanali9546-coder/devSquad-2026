import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscription Check Guard (Bypass for superadmin) - Temporarily disabled for testing
    /*
    const isSubscribed = user?.subscription?.status === 'active' || user?.subscription?.status === 'trial';
    if (user?.role !== 'superadmin' && !isSubscribed) {
      navigate('/subscriptions', { replace: true });
      return;
    }
    */

    const fetchVideo = async () => {
      try {
        const { data } = await axios.get(`/videos/${id}`);
        setVideo(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, navigate, user]);

  if (loading) return (
     <div className="min-h-screen pt-24 text-center text-gray-500 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand mb-4"></div>
     </div>
  );
  
  if (!video) return <div className="min-h-screen pt-24 text-center text-xl text-light">Video not found.</div>;

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <button onClick={() => navigate(-1)} className="text-gray-light hover:text-white flex items-center gap-2 mb-6 transition-colors font-medium">
          <ArrowLeft size={20} /> Back to Browse
        </button>
        <div className="aspect-video w-full bg-dark border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative flex items-center justify-center">
          <video 
            controls 
            autoPlay 
            className="w-full h-full object-contain bg-black"
            poster={video.thumbnailUrl || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070'}
          >
            <source src={video.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"} type="video/mp4" />
            Your browser does not support HTML video.
          </video>
        </div>
        <div className="mt-8 max-w-4xl bg-dark-lighter p-8 rounded-2xl border border-gray-800">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{video.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6 font-semibold">
            <span className="bg-dark px-3 py-1 rounded border border-gray-700">{video.releaseYear}</span>
            <span className="bg-dark px-3 py-1 rounded border border-gray-700">{video.duration} min</span>
            <span className="bg-brand text-white px-3 py-1 rounded">{video.genre}</span>
          </div>
          <p className="text-gray-light leading-relaxed text-lg">{video.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
