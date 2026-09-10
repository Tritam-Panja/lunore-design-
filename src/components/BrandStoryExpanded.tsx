import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft } from 'lucide-react';

interface BrandStoryExpandedProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function BrandStoryExpanded({ onClose, showCloseButton = false }: BrandStoryExpandedProps) {
  return (
    <article className="relative w-full text-white pt-10 sm:pt-16 pb-24 sm:pb-36">
      {/* Centered Editorial Document Container */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 space-y-12 sm:space-y-16">

        {/* DOCUMENT HEADER */}
        <header className="space-y-4">
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#b89a62] font-semibold">
            LUNORE LUXE DECOR STUDIO
          </p>
          <h1 
            className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Our Brand Story
          </h1>
        </header>

        {/* DIVIDER */}
        <hr className="border-0 h-px bg-gradient-to-r from-[#b89a62]/60 via-[#b89a62]/30 to-transparent" />

        {/* SECTION: CURATING SPACES. CREATING STATEMENTS. */}
        <section className="space-y-6">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-light text-[#f5ebd2]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Curating Spaces. Creating Statements.
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
            In a world of mass production and fleeting trends, true luxury is rare. It is thoughtful. It is personal. It is a space that doesn't just look beautiful — it speaks to who you are.
          </p>

          <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
            Lunore exists for those who understand this. We don't design interiors. We curate experiences. We don't supply materials. We source stories. We don't create sculptures. We commission art that transforms a room into a reflection of your vision.
          </p>
        </section>

        {/* DIVIDER */}
        <hr className="border-0 h-px bg-white/10" />

        {/* SECTION: HOW IT BEGAN */}
        <section className="space-y-6">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-light text-[#f5ebd2]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            How It Began
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
            Every great design studio starts with a founder who sees differently. Ours began with Dinkesh — a designer who believed that luxury interiors should never feel like showrooms. They should feel like home, amplified. Like the space was always meant to be exactly this.
          </p>

          <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
            For years, Dinkesh worked on high-end residential and hospitality projects across India, sourcing premium materials, collaborating with artisans, and learning that the most coveted interiors share one thing in common: <span className="text-[#e6cb97] font-normal">they are intentional</span>. Every surface, every finish, every sculpture tells a story. Nothing is there by accident.
          </p>

          <blockquote className="pl-6 border-l-2 border-[#b89a62] py-2 my-6">
            <p 
              className="text-lg sm:text-xl md:text-2xl text-[#f5ebd2] italic font-light leading-relaxed"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              "That obsession with intention — with curation over decoration — became Lunore."
            </p>
          </blockquote>
        </section>

        {/* DIVIDER */}
        <hr className="border-0 h-px bg-white/10" />

        {/* SECTION: WHAT WE DO */}
        <section className="space-y-10">
          <div className="space-y-4">
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl font-light text-[#f5ebd2]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What We Do
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
              Lunore operates across three interconnected worlds, each one feeding the other:
            </p>
          </div>

          {/* 1. Luxury Interior Design */}
          <div className="space-y-4 pl-0 sm:pl-4">
            <h3 
              className="text-xl sm:text-2xl md:text-3xl font-light text-[#e6cb97]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              1. Luxury Interior Design
            </h3>

            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
              We deliver turnkey interior projects for discerning clients — homes, villas, commercial spaces, hospitality venues — where every material, colour, light and object is chosen with precision.
            </p>

            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
              From your first consultation to the final styling, we handle concept, design, procurement, execution and handover. We work with architects and builders. We source from our own network of premium suppliers. We oversee every detail on-site. The result is a fully realised space that reflects your taste, your lifestyle, and your investment in beauty.
            </p>

            <p className="text-base sm:text-lg md:text-xl text-[#f5ebd2] italic font-light">
              Our interiors don't date. They endure.
            </p>
          </div>

          {/* 2. Premium Materials & Stone Supply */}
          <div className="space-y-4 pl-0 sm:pl-4">
            <h3 
              className="text-xl sm:text-2xl md:text-3xl font-light text-[#e6cb97]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              2. Premium Materials & Stone Supply
            </h3>

            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
              Luxury interiors demand premium materials. We've built deep relationships with quarries, mills and suppliers across India — for marble, granite, exotic stone and architectural finishes.
            </p>

            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
              We don't just supply slabs. We curate selections. We negotiate on your behalf. We quality-inspect every piece. We manage logistics to your site. We understand that the right marble isn't just beautiful — it's the foundation of a space that will be admired for decades.
            </p>

            <p className="text-base sm:text-lg md:text-xl text-[#f5ebd2] italic font-light">
              Whether you're an architect, builder or designer specifying for a project, you get direct access to curated materials, fair pricing, and a team that speaks your language.
            </p>
          </div>

          {/* 3. Stone Sculptures & Art */}
          <div className="space-y-4 pl-0 sm:pl-4">
            <h3 
              className="text-xl sm:text-2xl md:text-3xl font-light text-[#e6cb97]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              3. Stone Sculptures & Art
            </h3>

            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
              A room without art is a room without a soul. We commission and curate bespoke stone sculptures and fine art — pieces that become focal points, conversation starters, and investments that hold or grow in value over time.
            </p>

            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
              From contemporary sculptors to established artists, we connect collectors with work that moves them. Every piece is considered, authenticated, and positioned to transform a space.
            </p>
          </div>
        </section>

        {/* DIVIDER */}
        <hr className="border-0 h-px bg-white/10" />

        {/* SECTION: OUR PHILOSOPHY */}
        <section className="space-y-6">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-light text-[#f5ebd2]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Our Philosophy
          </h2>

          <h3 
            className="text-xl sm:text-2xl md:text-3xl font-light italic text-[#e6cb97]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            A space tells a story. Make sure it's yours.
          </h3>

          <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
            In 20 years, you won't remember the cost of your interiors. You'll remember how they made you feel. You'll remember the conversations that happened in that room. You'll remember the sculpture that stopped visitors in their tracks.
          </p>

          <p className="text-lg sm:text-xl md:text-2xl text-[#f5ebd2] font-normal leading-relaxed">
            That's what Lunore builds. Not interiors. Legacies.
          </p>

          <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
            We work with clients who understand that luxury is about choice — choosing materials that age beautifully, choosing designs that reflect who you are, choosing art that moves you.
          </p>

          <p className="text-base sm:text-lg md:text-xl text-[#e6cb97] italic font-light">
            It takes longer than mass production. It costs more than off-the-shelf. And it's worth every rupee.
          </p>
        </section>

        {/* DIVIDER */}
        <hr className="border-0 h-px bg-white/10" />

        {/* SECTION: LET'S CURATE YOUR SPACE */}
        <section className="space-y-6 pt-4">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-light text-[#f5ebd2]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Let's Curate Your Space
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
            Whether you're building a luxury home, a high-end hotel, a flagship retail space, or you're a collector looking for your next sculpture, Lunore is here to help.
          </p>

          <p className="text-base sm:text-lg md:text-xl text-[#e6cb97] font-medium">
            Get in touch. Let's create something that lasts.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/contact"
              className="liquid-glass-btn-primary px-8 py-3.5 text-xs tracking-[0.25em] uppercase text-[#0d0e0e] font-semibold inline-flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4 text-[#0d0e0e]" />
            </Link>

            <Link
              to="/"
              className="liquid-glass-btn-secondary px-8 py-3.5 text-xs tracking-[0.25em] uppercase text-white hover:text-[#b89a62] inline-flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <ChevronLeft className="w-4 h-4 text-[#b89a62]" />
              <span>Return to Home</span>
            </Link>
          </div>
        </section>

      </div>
    </article>
  );
}
