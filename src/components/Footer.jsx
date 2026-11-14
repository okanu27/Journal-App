
function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <section id="footer" className="bg-sky-950 text-white p-4">
      <footer className="max-w-7xl mx-auto px-4 py-4 flex">
        <div className="max-w-5xl 
                            mx-auto 
                            flex 
                            flex-col 
                            items-center 
                            text-center 
                            gap-3">
        <p className="text-sm">&copy; {currentYear} My Journal. All rights reserved.</p>
        <ul className="flex space-x-3">
          <li><a href="/privacy" className="hover:text-gray-300">Privacy Policy</a></li>
          <li><a href="/terms" className="hover:text-gray-300">Terms of Service</a></li>
          <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
        </ul>
        </div>
      </footer>
    </section>
  );
}

export default Footer;