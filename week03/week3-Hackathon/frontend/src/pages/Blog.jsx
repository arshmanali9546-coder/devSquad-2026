import { Link } from 'react-router-dom';

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "The Art of Brewing the Perfect Cup",
      excerpt: "Discover the secrets to unlocking the full flavor profile of your favorite loose leaf teas.",
      image: "./3.jpg",
      date: "October 12, 2023"
    },
    {
      id: 2,
      title: "Why Organic Tea Matters",
      excerpt: "Understanding the impact of organic farming on tea quality and environmental sustainability.",
      image: "./9.jpg",
      date: "September 28, 2023"
    },
    {
      id: 3,
      title: "Steeping 101: Temperature and Time",
      excerpt: "A comprehensive guide to steeping different types of tea for the best results.",
      image: "./6.jpg",
      date: "August 15, 2023"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-10 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">Our Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {posts.map(post => (
          <div key={post.id} className="group cursor-pointer">
            <div className="aspect-[4/3] overflow-hidden mb-6">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">{post.date}</div>
            <h2 className="text-xl font-bold mb-4 group-hover:text-brandHighlight transition-colors">{post.title}</h2>
            <p className="text-sm opacity-70 mb-4 line-clamp-2">{post.excerpt}</p>
            <button className="text-xs font-bold uppercase tracking-wider border-b-2 border-brandDark pb-1 group-hover:border-brandHighlight transition-colors">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
