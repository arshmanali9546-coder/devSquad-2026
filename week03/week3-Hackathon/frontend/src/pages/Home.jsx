import { Link } from 'react-router-dom';

const Home = () => {
  const collections = [
    { title: 'BLACK TEA', image: './2.jpg' },
    { title: 'GREEN TEA', image: './3.jpg' },
    { title: 'WHITE TEA', image: './4.jpg' },
    { title: 'MATCHA', image: './5.jpg'},
    { title: 'HERBAL TEA', image:'./6.jpg' },
    { title: 'CHAI', image: './7.jpg' },
    { title: 'OOLONG', image: './8.jpg' },
    { title: 'ROOIBOS', image: './9.jpg' },
    { title: 'TEAWARE', image: './11.jpg' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="p-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="w-full md:w-1/2 overflow-hidden aspect-[4/3] rounded-lg border-4 border-brandHighlight relative">
          <img 
            src="./1.jpg" 
            alt="Loose leaf tea" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-4 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-brandDark leading-tight">Every day is unique, just like our tea</h1>
          <p className="text-sm opacity-80 mb-8 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Dui nihil nullam idus adipiscing odio. Neque lacus nibh cras in.
            <br className="hidden md:block"/>
            <br className="hidden md:block"/>
            Lorem ipsum dolor sit amet consectetur. Dui nihil nullam idus adipiscing odio. Neque lacus nibh cras in.
          </p>
          <Link to="/collections">
             <button className="bg-brandDark text-white px-8 py-3 text-sm tracking-wider font-semibold hover:bg-black transition-colors">BROWSE TEAS</button>
          </Link>
        </div>
      </section>

      {/* Perks Section */}
      <section className="bg-white py-10 my-10 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-10 flex flex-wrap justify-center gap-8 md:gap-16 text-[10px] md:text-xs font-semibold tracking-wider uppercase opacity-80">
          <div className="flex items-center gap-2">
             <span className="text-brandHighlight text-lg">🍵</span> 450+ KIND OF LOOSE LEAF TEA
          </div>
          <div className="flex items-center gap-2">
             <span className="text-brandHighlight text-lg">🌱</span> CERTIFICATED ORGANIC TEAS
          </div>
          <div className="flex items-center gap-2">
             <span className="text-brandHighlight text-lg">🚚</span> FREE DELIVERY
          </div>
          <div className="flex items-center gap-2">
             <span className="text-brandHighlight text-lg">🏷️</span> SAMPLE FOR ALL TEAS
          </div>
        </div>
        <div className="text-center mt-6">
           <button className="border border-gray-300 text-xs px-6 py-2 tracking-widest hover:bg-gray-50 transition-colors">LEARN MORE</button>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="max-w-7xl mx-auto px-10 py-10">
        <h2 className="text-3xl font-semibold text-center mb-12">Our Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {collections.map((item, index) => (
            <Link to={`/collections?category=${item.title.replace(' TEA', '')}`} key={index} className="group flex flex-col items-center">
              <div className="w-full aspect-square overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="mt-4 text-xs tracking-widest font-semibold text-center uppercase group-hover:text-brandHighlight transition-colors">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
