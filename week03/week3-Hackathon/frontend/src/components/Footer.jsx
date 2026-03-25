import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brandPrimary py-16 px-10 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-brandDark">
        <div>
          <h4 className="font-semibold mb-4 uppercase tracking-wider">Collections</h4>
          <ul className="space-y-2 opacity-70">
            <li><Link to="/collections?category=Black Tea" className="hover:opacity-100 transition-opacity">Black teas</Link></li>
            <li><Link to="/collections?category=Green Tea" className="hover:opacity-100 transition-opacity">Green teas</Link></li>
            <li><Link to="/collections?category=White Tea" className="hover:opacity-100 transition-opacity">White teas</Link></li>
            <li><Link to="/collections?category=Herbal Tea" className="hover:opacity-100 transition-opacity">Herbal teas</Link></li>
            <li><Link to="/collections?category=Matcha" className="hover:opacity-100 transition-opacity">Matcha</Link></li>
            <li><Link to="/collections?category=Chai" className="hover:opacity-100 transition-opacity">Chai</Link></li>
            <li><Link to="/collections?category=Oolong" className="hover:opacity-100 transition-opacity">Oolong</Link></li>
            <li><Link to="/collections?category=Rooibos" className="hover:opacity-100 transition-opacity">Rooibos</Link></li>
            <li><Link to="/collections?category=Teaware" className="hover:opacity-100 transition-opacity">Teaware</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 uppercase tracking-wider">Learn</h4>
          <ul className="space-y-2 opacity-70">
            <li><Link to="/about" className="hover:opacity-100 transition-opacity">About us</Link></li>
            <li><Link to="/about-our-teas" className="hover:opacity-100 transition-opacity">About our teas</Link></li>
            <li><Link to="/academy" className="hover:opacity-100 transition-opacity">Tea academy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 uppercase tracking-wider">Customer Service</h4>
          <ul className="space-y-2 opacity-70">
            <li><Link to="/ordering" className="hover:opacity-100 transition-opacity">Ordering and payment</Link></li>
            <li><Link to="/delivery" className="hover:opacity-100 transition-opacity">Delivery</Link></li>
            <li><Link to="/privacy" className="hover:opacity-100 transition-opacity">Privacy and policy</Link></li>
            <li><Link to="/terms" className="hover:opacity-100 transition-opacity">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-3 opacity-70">
             <li className="flex gap-2">
                 <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>3 Falahi, Falahi St, Pasdaran Ave, Shiraz, Fars Province, Iran</span>
             </li>
             <li className="flex gap-2 items-center">
                 <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <a href="mailto:email.amoopur@gmail.com">Email: amoopur@gmail.com</a>
             </li>
             <li className="flex gap-2 items-center">
                 <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <a href="tel:+989173038406">Tel: +98 9173038406</a>
             </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
