import Link from "next/link";
import { User } from "lucide-react";

export default function Navbar() {
  const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Community", href: "/community" },
    { name: "Members", href: "/members" },
    { name: "Join Team", href: "/join" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo (Left) */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src="/images/events/logo/PHOTO-2026-03-15-01-22-36.jpg" 
                alt="E-Cell Logo" 
                className="w-8 h-8 rounded-full border border-white/10 group-hover:scale-110 transition-transform duration-300 object-cover"
              />
              <span className="text-white font-bold text-xl tracking-tight group-hover:text-blue-400 transition-colors">
                E-Cell BVCOENM
              </span>
            </Link>
          </div>

          {/* Centered Links (Hidden on small screens) */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Profile (Right) */}
          <div className="flex items-center">
            <button className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white/80 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
