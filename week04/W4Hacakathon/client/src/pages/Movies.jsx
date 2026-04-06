import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowRight as ArrowRightSmall, Plus, ThumbsUp, Volume2, Play, Clock, Eye, Star, Calendar } from 'lucide-react';
import axios from '../api/axios';

/* ═══════════════════════════════════════════════
   HERO BANNER DATA
   ═══════════════════════════════════════════════ */
const heroBanners = [
  {
    title: 'Avengers : Endgame',
    description: "With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos's actions and undo the chaos to the universe, no matter what consequences may be in store, and no matter who they face... Avenge the fallen.",
    image: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
  },
  {
    title: 'Stranger Things',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    image: './st/stranger-things.jpg',
  },
  {
    title: 'Money Heist',
    description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.',
    image: 'https://image.tmdb.org/t/p/original/MoEKaPFHABtA1xKoOteirGaHl1.jpg',
  },
];

/* ═══════════════════════════════════════════════
   MOVIES DATA (5 sections)
   ═══════════════════════════════════════════════ */
const movieCategories = [
  { name: 'Action', image: '/our genres/1.png' },
  { name: 'Adventure', image: '/our genres/2.png' },
  { name: 'Comedy', image: '/our genres/3.png' },
  { name: 'Drama', image: '/our genres/4.png' },
  { name: 'Horror', image: '/our genres/5.png' },
];

const movieTop10 = [
  { name: 'Action', image: '/Top 10 in genres/1.png' },
  { name: 'Adventure', image: '/Top 10 in genres/2.png' },
  { name: 'Comedy', image: '/Top 10 in genres/3.png' },
  { name: 'Drama', image: '/Top 10 in genres/4.png' },
{ name: 'Horror', image: '/Top 10 in genres/5.png' },
];

const movieTrending = [
  { title: 'Morbius', image: '/Trending now/1.png', duration: '1h 50min', views: '2K' },
  { title: 'Bholaa Shankar', image: '/Trending now/2.png', duration: '1h 57min', views: '1.9K' },
  { title: 'Purai Ee Mangal Shaaj', image: '/Trending now/3.png', duration: '2h 10min', views: '1.8K' },
  { title: 'Pathan', image: '/Trending now/4.png', duration: '2h 26min', views: '3K' },
  { title: 'Ant-Man', image: '/Trending now/5.png', duration: '2h 05min', views: '5K' },
];

const movieNewReleases = [
  { title: 'Adipurush', image: '/NEW releases/1.png', released: 'Released at 14 April 2023' },
  { title: 'Sin City', image: '/NEW releases/2.png', released: 'Released at 22 April 2023' },
  { title: 'Tomorrow War', image: '/NEW releases/3.png', released: 'Released at 13 April 2023' },
  { title: 'Misfire', image: '/NEW releases/4.png', released: 'Released at 19 April 2023' },

];

const movieMustWatch = [
  { title: 'Kantara', image: '/Must-Watch movies/1.png', duration: '2h 51min', rating: 4.5, views: '20K' },
  { title: 'Pushpa 2', image: '/Must-Watch movies/2.png', duration: '1h 50min', rating: 4.0, views: '23K' },
  { title: 'Blade Runner 2049', image: '/Must-Watch movies/3.png', duration: '1h 42min', rating: 4.2, views: '23K' },
  { title: 'Adipurush', image: '/Must-Watch movies/4.png', duration: '2h 10min', rating: 3.8, views: '20K' },
  { title: 'Mirzapur', image: '/Must-Watch movies/5.png', duration: '3h 10min', rating: 3.8, views: '20K' },
];


/* ═══════════════════════════════════════════════
   SHOWS DATA (5 sections)
   ═══════════════════════════════════════════════ */
const showCategories = [
  { name: 'Action', image: '/images/1d.png' },
  { name: 'Adventure', image: '/images/2d.png' },
  { name: 'Comedy', image: '/images/3d.png' },
  { name: 'Drama', image: '/images/4d.png' },
  { name: 'Horror', image: '/images/5d.png' },
];

const showTop10 = [
  { name: 'Action', image: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
  { name: 'Adventure', image: 'https://image.tmdb.org/t/p/w500/gKG5QGz5Ngf8fgWpBsWtlg5L2SF.jpg' },
  { name: 'Comedy', image: './public/new releases/1.png' },
  { name: 'Drama', image: './public/new releases/3.png' },
  { name: 'Horror', image: './public/new releases/4.png' },
 
  
];

const showTrending = [
  { title: 'Stranger Things', image: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', duration: '8h 35min', views: '6 Season' },
  { title: 'Money Heist', image: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg', duration: '12h 23min', views: '5 Season' },
  { title: 'Lucifer', image: 'https://image.tmdb.org/t/p/w500/ekZobS8isE6mA53RAiGDG93hBxL.jpg', duration: '14h 55min', views: '6 Season' },
  { title: 'The Gray Man', image: './public/Trending now/4.png', duration: '1h 44min', views: '1 Season' },
  { title: 'The Gray Girl', image: './public/Trending now/5.png', duration: '2h 44min', views: '1 Season' },
];

const showNewReleases = [
  { title: 'Hightown', image: './public/Trending now/1.png', duration: '12h 33min', views: '4 Season' },
  { title: 'Mirzapur', image: './public/Trending now/2.png', duration: '7h 40min', views: '2 Season' },
  { title: 'Breathe Into Shadows', image: './public/Trending now/5.png', duration: '8h 31min', views: '4 Season' },
  { title: 'Peaky Blinders', image: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg', duration: '12h 31min', views: '1 Season' },
  { title: 'Breaking Bad', image: './public/Trending now/3.png', duration: '32h 20min', views: '1 Season' },
];

const showMustWatch = [
  
  { title: 'Money Heist Part 3', image: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg', duration: '12h 23min', rating: 4.8, views: '26K' },
  { title: 'Mai', image: './public/Must-Watch movies/2.png', duration: '1h 30min', rating: 3.9, views: '' },
  { title: 'Stranger Things', image: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', duration: '8h 20min', rating: 4.7, views: '45K' },
  { title: 'Stranger Things', image: './public/Must-Watch movies/5.png', duration: '8h 20min', rating: 4.7, views: '45K' },
  { title: 'Stranger Things', image: './public/Must-Watch movies/1.png', duration: '8h 20min', rating: 4.7, views: '45K' },
];


/* ═══════════════════════════════════════════════
   SECTION HEADER with arrow nav
   ═══════════════════════════════════════════════ */
const SectionHeader = ({ title, sliderRef }) => {
  const slideLeft = () => sliderRef?.current?.scrollBy({ left: -340, behavior: 'smooth' });
  const slideRight = () => sliderRef?.current?.scrollBy({ left: 340, behavior: 'smooth' });

  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl md:text-2xl font-bold text-light">{title}</h3>
      <div className="flex gap-3 bg-dark-lighter p-2 rounded-xl border border-gray-800">
        <button onClick={slideLeft} className="p-2 bg-dark hover:bg-gray-800 rounded-lg transition-colors border border-gray-800">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-1 mx-1">
          <div className="w-4 h-1 bg-brand rounded-full"></div>
          <div className="w-2 h-1 bg-gray-700 rounded-full"></div>
          <div className="w-2 h-1 bg-gray-700 rounded-full"></div>
          <div className="w-2 h-1 bg-gray-700 rounded-full"></div>
        </div>
        <button onClick={slideRight} className="p-2 bg-dark hover:bg-gray-800 rounded-lg transition-colors border border-gray-800">
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════
   RENDER STARS
   ═══════════════════════════════════════════════ */
const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return (
    <div className="flex items-center gap-0.5">
      {Array(full).fill(0).map((_, i) => <Star key={`f${i}`} size={12} className="text-brand fill-brand" />)}
      {half === 1 && <Star size={12} className="text-brand fill-brand opacity-50" />}
      {Array(5 - full - half).fill(0).map((_, i) => <Star key={`e${i}`} size={12} className="text-gray-600" />)}
    </div>
  );
};


/* ═══════════════════════════════════════════════
   REUSABLE SECTION COMPONENTS
   ═══════════════════════════════════════════════ */

// Genre cards with 4-image grid
const GenreSection = ({ title, data, sliderRef }) => (
  <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-t border-gray-800">
    <SectionHeader title={title} sliderRef={sliderRef} />
    <div
      ref={sliderRef}
      className="flex gap-5 overflow-x-auto snap-x hide-scroll pb-2"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {data.map((cat, idx) => (
        <div key={idx} className="bg-dark-lighter p-5 rounded-2xl border border-gray-800 group hover:border-gray-600 transition-all cursor-pointer min-w-[220px] flex-shrink-0 snap-start">
          <div className="w-full bg-gray-800 rounded-lg overflow-hidden mb-4">
            <img src={cat.image} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={cat.name} />
          </div>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-light group-hover:text-brand transition-colors">{cat.name}</span>
            <ArrowRightSmall size={18} className="text-gray-light group-hover:text-brand transition-colors" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

// Top 10 genre cards with badge
const Top10Section = ({ title, data, sliderRef }) => (
  <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-t border-gray-800">
    <SectionHeader title={title} sliderRef={sliderRef} />
    <div
      ref={sliderRef}
      className="flex gap-5 overflow-x-auto snap-x hide-scroll pb-2"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {data.map((genre, idx) => (
        <div key={idx} className="bg-dark-lighter p-5 rounded-2xl border border-gray-800 group hover:border-gray-600 transition-all cursor-pointer min-w-[220px] flex-shrink-0 snap-start">
          <div className="w-full h-[160px] bg-gray-800 rounded-lg overflow-hidden mb-4 relative">
            <img src={genre.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={genre.name} />
            <div className="absolute bottom-2 left-2 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded">
              Top 10 in
            </div>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-light group-hover:text-brand transition-colors">{genre.name}</span>
            <ArrowRightSmall size={18} className="text-gray-light group-hover:text-brand transition-colors" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

// Trending cards with duration + views
const TrendingSection = ({ title, data, sliderRef }) => (
  <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-t border-gray-800">
    <SectionHeader title={title} sliderRef={sliderRef} />
    <div
      ref={sliderRef}
      className="flex gap-5 overflow-x-auto snap-x hide-scroll pb-2"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {data.map((item, idx) => (
        <div key={idx} className="bg-dark-lighter p-4 rounded-2xl border border-gray-800 group hover:border-gray-600 transition-all cursor-pointer min-w-[240px] flex-shrink-0 snap-start">
          <div className="w-full h-[280px] bg-gray-800 rounded-xl overflow-hidden mb-4 relative">
            <img src={item.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt={item.title} />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-light bg-dark px-3 py-2 rounded-lg border border-gray-800">
            <span className="flex items-center gap-1"><Clock size={12} /> {item.duration}</span>
            <span className="flex items-center gap-1"><Eye size={12} /> {item.views}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// New Releases cards — movie version has release date, show version has duration + season
const NewReleasesSection = ({ title, data, sliderRef, isShows = false, apiVideos = [], onVideoClick }) => (
  <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-t border-gray-800">
    <SectionHeader title={title} sliderRef={sliderRef} />
    <div
      ref={sliderRef}
      className="flex gap-5 overflow-x-auto snap-x hide-scroll pb-2"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowAnchor: 'none' }}
    >
      {/* Render API-fetched videos first */}
      {apiVideos.map((vid) => (
        <div
          key={vid._id}
          onClick={() => onVideoClick && onVideoClick(vid._id)}
          className="bg-dark-lighter p-4 rounded-2xl border border-gray-800 group hover:border-gray-600 transition-all cursor-pointer w-[240px] flex-shrink-0 snap-start flex flex-col"
        >
          <div className="w-full h-[280px] bg-gray-800 rounded-xl overflow-hidden mb-4 relative">
            <img
              src={vid.thumbnailUrl}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              alt={vid.title}
            />
            {/* Title overlay inside the image box to match static height exactly */}
            <div className="absolute bottom-0 left-0 right-0 p-3 pt-10 bg-gradient-to-t from-black/90 to-transparent">
              <h4 className="text-white text-sm font-bold truncate">{vid.title}</h4>
            </div>
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
              <div className="w-14 h-14 bg-brand rounded-full flex items-center justify-center shadow-lg shadow-brand/40">
                <Play size={24} fill="white" className="text-white ml-1" />
              </div>
            </div>
            {/* NEW badge */}
            <div className="absolute top-3 left-3 bg-brand text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
              New
            </div>
          </div>
          
          <div className="mt-auto flex items-center justify-center text-xs text-gray-light bg-dark px-3 py-2 rounded-lg border border-gray-800">
            <Calendar size={12} className="mr-1" /> Released {vid.releaseYear}
          </div>
        </div>
      ))}
      
      {/* Then render static data */}
      {data.map((item, idx) => (
        <div key={idx} className="bg-dark-lighter p-4 rounded-2xl border border-gray-800 group hover:border-gray-600 transition-all cursor-pointer w-[240px] flex-shrink-0 snap-start flex flex-col">
          <div className="w-full h-[280px] bg-gray-800 rounded-xl overflow-hidden mb-4 relative">
            <img src={item.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt={item.title} />
          </div>
          {isShows ? (
            <div className="mt-auto flex items-center justify-between text-xs text-gray-light bg-dark px-3 py-2 rounded-lg border border-gray-800">
              <span className="flex items-center gap-1"><Clock size={12} /> {item.duration}</span>
              <span className="flex items-center gap-1"><Eye size={12} /> {item.views}</span>
            </div>
          ) : (
            <div className="mt-auto flex items-center justify-center text-xs text-gray-light bg-dark px-3 py-2 rounded-lg border border-gray-800">
              <Calendar size={12} className="mr-1" /> {item.released}
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
);

// Must Watch cards with duration, stars, views
const MustWatchSection = ({ title, data, sliderRef }) => (
  <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-t border-gray-800">
    <SectionHeader title={title} sliderRef={sliderRef} />
    <div
      ref={sliderRef}
      className="flex gap-5 overflow-x-auto snap-x hide-scroll pb-2"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {data.map((item, idx) => (
        <div key={idx} className="bg-dark-lighter p-4 rounded-2xl border border-gray-800 group hover:border-gray-600 transition-all cursor-pointer min-w-[240px] flex-shrink-0 snap-start">
          <div className="w-full h-[280px] bg-gray-800 rounded-xl overflow-hidden mb-4 relative">
            <img src={item.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt={item.title} />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-light bg-dark px-3 py-2 rounded-lg border border-gray-800">
            <span className="flex items-center gap-1"><Clock size={12} /> {item.duration}</span>
            {renderStars(item.rating)}
            {item.views && <span className="flex items-center gap-1"><Eye size={12} /> {item.views}</span>}
          </div>
        </div>
      ))}
    </div>
  </section>
);


/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */
const Movies = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [apiVideos, setApiVideos] = useState([]);
  const navigate = useNavigate();

  // Refs for MOVIE sections (5)
  const mCatRef = useRef(null);
  const mTopRef = useRef(null);
  const mTrendRef = useRef(null);
  const mNewRef = useRef(null);
  const mMustRef = useRef(null);

  // Refs for SHOW sections (5)
  const sCatRef = useRef(null);
  const sTopRef = useRef(null);
  const sTrendRef = useRef(null);
  const sNewRef = useRef(null);
  const sMustRef = useRef(null);

  // Fetch uploaded videos from backend API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await axios.get('/videos');
        // Sort newest first on the frontend to guarantee ordering instantly 
        // even if fetching from an older deployed backend version
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setApiVideos(sortedData);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };
    fetchVideos();
  }, []);

  // Auto-slide hero banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleVideoClick = (id) => {
    navigate(`/player/${id}`);
  };

  const banner = heroBanners[currentBanner];

  return (
    <div className="bg-dark min-h-screen text-light w-full">
      {/* Hide scrollbar globally for sliders */}
      <style>{`.hide-scroll::-webkit-scrollbar{display:none;}`}</style>

      {/* ═══════════════════════════════════
          HERO BANNER
          ═══════════════════════════════════ */}
      <section className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden">
        {heroBanners.map((b, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentBanner ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
          </div>
        ))}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/40 via-transparent to-[#141414]/40 z-10"></div>

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-end pb-16 px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{banner.title}</h1>
          <p className="text-[#999] text-sm md:text-base max-w-[800px] leading-relaxed mb-8">
            {banner.description}
          </p>
          <div className="flex items-center gap-3 mb-6">
            <button className="bg-brand hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
              <Play size={18} fill="white" /> Play Now
            </button>
            <button className="p-3 bg-dark/80 hover:bg-gray-800 rounded-lg border border-gray-700 transition-colors"><Plus size={20} /></button>
            <button className="p-3 bg-dark/80 hover:bg-gray-800 rounded-lg border border-gray-700 transition-colors"><ThumbsUp size={20} /></button>
            <button className="p-3 bg-dark/80 hover:bg-gray-800 rounded-lg border border-gray-700 transition-colors"><Volume2 size={20} /></button>
          </div>
          <div className="flex items-center gap-1.5">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentBanner ? 'w-5 bg-brand' : 'w-2 bg-gray-600 hover:bg-gray-500'}`}
              />
            ))}
          </div>
        </div>

        {/* Left / Right arrows */}
        <button
          onClick={() => setCurrentBanner(prev => (prev - 1 + heroBanners.length) % heroBanners.length)}
          className="absolute left-4 md:left-8 bottom-8 z-30 p-3 bg-dark/60 hover:bg-dark/90 rounded-lg border border-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentBanner(prev => (prev + 1) % heroBanners.length)}
          className="absolute right-4 md:right-8 bottom-8 z-30 p-3 bg-dark/60 hover:bg-dark/90 rounded-lg border border-gray-700 transition-colors"
        >
          <ArrowRight size={20} />
        </button>
      </section>


      {/* ╔═══════════════════════════════════════╗
          ║    MOVIES — 5 SECTIONS                ║
          ╚═══════════════════════════════════════╝ */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-2">
        <span className="bg-brand text-white text-sm font-bold px-4 py-1.5 rounded">Movies</span>
      </div>

      <GenreSection title="Our Genres" data={movieCategories} sliderRef={mCatRef} />
      <Top10Section title="Popular Top 10 in Genres" data={movieTop10} sliderRef={mTopRef} />
      <TrendingSection title="Trending Now" data={movieTrending} sliderRef={mTrendRef} />
      <NewReleasesSection title="New Releases" data={movieNewReleases} sliderRef={mNewRef} apiVideos={apiVideos} onVideoClick={handleVideoClick} />
      <MustWatchSection title="Must - Watch Movies" data={movieMustWatch} sliderRef={mMustRef} />


      {/* ╔═══════════════════════════════════════╗
          ║    SHOWS — 5 SECTIONS                 ║
          ╚═══════════════════════════════════════╝ */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 mb-2">
        <span className="bg-brand text-white text-sm font-bold px-4 py-1.5 rounded">Shows</span>
      </div>

      <GenreSection title="Our Genres" data={showCategories} sliderRef={sCatRef} />
      <Top10Section title="Popular Top 10 in Genres" data={showTop10} sliderRef={sTopRef} />
      <TrendingSection title="Trending Now" data={showTrending} sliderRef={sTrendRef} />
      <NewReleasesSection title="New Releases" data={showNewReleases} sliderRef={sNewRef} isShows={true} />
      <MustWatchSection title="Must - Watch Shows" data={showMustWatch} sliderRef={sMustRef} />

      {/* Bottom spacing */}
      <div className="pb-16"></div>
    </div>
  );
};

export default Movies;
