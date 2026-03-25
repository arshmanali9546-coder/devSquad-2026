const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-10 py-16">
      <div className="flex flex-col md:flex-row gap-16">
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
          <p className="text-sm opacity-70 mb-8 leading-relaxed">
            Have questions about our teas or your order? We'd love to hear from you. 
            Fill out the form and our team will get back to you as soon as possible.
          </p>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Address</h4>
              <p className="text-sm font-medium">12 Chai Market Road,D-Ground,Pakistan</p>
            </div>
            <div> 
              <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Email</h4>
              <p className="text-sm font-medium">[arshmanali955@gmail.com]</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Phone</h4>
              <p className="text-sm font-medium">+92 305 2148156</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-[#F9F9F9] p-10">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">First Name</label>
                <input type="text" className="w-full border-b border-gray-300 bg-transparent py-2 focus:outline-none focus:border-brandHighlight transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Last Name</label>
                <input type="text" className="w-full border-b border-gray-300 bg-transparent py-2 focus:outline-none focus:border-brandHighlight transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email</label>
              <input type="email" className="w-full border-b border-gray-300 bg-transparent py-2 focus:outline-none focus:border-brandHighlight transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Message</label>
              <textarea rows="4" className="w-full border-b border-gray-300 bg-transparent py-2 focus:outline-none focus:border-brandHighlight transition-colors resize-none"></textarea>
            </div>
            <button className="w-full bg-brandDark text-white font-bold text-xs uppercase tracking-widest py-4 hover:bg-black transition-colors mt-4">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
