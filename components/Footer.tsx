import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Left section: Large Logo */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="/images/events/logo/PHOTO-2026-03-15-01-22-36.jpg" 
                  alt="E-Cell Logo" 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-white/10 object-cover"
                />
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">E-CELL.</h2>
              </div>
              <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
                Empowering the next generation of founders, builders, and visionaries at Bharati Vidyapeeth College of Engineering, Navi Mumbai.
              </p>
            </div>
            

          </div>

          {/* Right section: Links Columns */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
            
            {/* Column 1 */}
            <div className="space-y-6">
              <h4 className="text-zinc-500 font-mono text-sm tracking-widest uppercase">01 / Navigate</h4>
              <ul className="space-y-4">
                <li><Link href="/" className="text-zinc-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="text-zinc-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/events" className="text-zinc-300 hover:text-white transition-colors">Events</Link></li>
                <li><Link href="/join" className="text-zinc-300 hover:text-white transition-colors">Join Team</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <h4 className="text-zinc-500 font-mono text-sm tracking-widest uppercase">02 / Ecosystem</h4>
              <ul className="space-y-4">
                <li><Link href="/community" className="text-zinc-300 hover:text-white transition-colors">Community</Link></li>
                <li><Link href="/founders" className="text-zinc-300 hover:text-white transition-colors">Founders</Link></li>
                <li><Link href="/projects" className="text-zinc-300 hover:text-white transition-colors">Projects</Link></li>
                <li><Link href="/resources" className="text-zinc-300 hover:text-white transition-colors">Resources</Link></li>
                <li><Link href="/sponsors" className="text-zinc-300 hover:text-white transition-colors">Sponsors</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
              <h4 className="text-zinc-500 font-mono text-sm tracking-widest uppercase">03 / Socials</h4>
              <ul className="space-y-4">
                <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white transition-colors">Instagram</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white transition-colors">Twitter // X</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
