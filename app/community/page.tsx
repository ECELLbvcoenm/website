import Link from "next/link";
import { ExternalLink, Instagram, Linkedin, Users, LayoutGrid } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function CommunityPage() {
  const communityCards = [
    {
      title: "Member Directory",
      description: "Browse the profiles, roles, and socials of our core council, departments, and members.",
      icon: <Users className="w-6 h-6" style={{ color: "var(--text-accent)" }} />,
      link: "/members",
      linkText: "View Members",
      isExternal: false,
    },
    {
      title: "Instagram",
      description: "Follow us for event announcements, behind-the-scenes, and daily ecosystem updates.",
      icon: <Instagram className="w-6 h-6 text-pink-500" />,
      link: "https://instagram.com/ecellbvcoenm",
      linkText: "Follow @ecellbvcoenm",
      isExternal: true,
    },
    {
      title: "LinkedIn",
      description: "Connect with our professional network of students, alumni, and industry partners.",
      icon: <Linkedin className="w-6 h-6 text-blue-600" />,
      link: "https://linkedin.com/company/ecell-bvcoenm",
      linkText: "Connect with us",
      isExternal: true,
    },
    {
      title: "Projects & Ventures",
      description: "Explore the startups and technical projects being built by members of our ecosystem.",
      icon: <LayoutGrid className="w-6 h-6 text-purple-400" />,
      link: "/projects",
      linkText: "View Matrix",
      isExternal: false,
    },
  ];

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* Hero Section */}
      <section className="pt-28 pb-16 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p
            className="font-mono text-xs uppercase tracking-[0.24em] mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            The Hub
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02]">
            E-Cell
            <br />
            <span className="animated-gradient-text">Community.</span>
          </h1>
          <p className="mt-8 text-lg md:text-2xl max-w-3xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Connect with builders, join our networks, and explore the people that make our ecosystem thrive.
          </p>
        </ScrollReveal>
      </section>

      {/* Community Links Grid */}
      <section className="py-20 min-h-[50vh]">
        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communityCards.map((card) => {
              const Content = (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl" style={{ background: "var(--bg-card)" }}>
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold">{card.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed mb-8 flex-1" style={{ color: "var(--text-secondary)" }}>
                    {card.description}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-sm font-semibold group-hover:text-[var(--text-accent)] transition-colors" style={{ color: "var(--text-primary)" }}>
                    {card.linkText} 
                    {card.isExternal ? <ExternalLink className="w-4 h-4" /> : <span className="transform group-hover:translate-x-1 transition-transform">→</span>}
                  </div>
                </>
              );

              return card.isExternal ? (
                <a
                  key={card.title}
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl glass p-8 border hover:border-[var(--text-accent)] transition-all glow-border"
                  style={{ borderColor: "var(--border-primary)" }}
                >
                  {Content}
                </a>
              ) : (
                <Link
                  key={card.title}
                  href={card.link}
                  className="group flex flex-col rounded-2xl glass p-8 border hover:border-[var(--text-accent)] transition-all glow-border"
                  style={{ borderColor: "var(--border-primary)" }}
                >
                  {Content}
                </Link>
              );
            })}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
