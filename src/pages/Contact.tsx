import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Check, MessageCircle, ArrowUpRight } from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '@/components/SocialIcons';
import { supabase } from '@/lib/supabase';
import { Reveal } from '@/components/Reveal';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const { error } = await supabase.from('inquiries').insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div>
      <section className="px-6 pt-36 pb-16 md:pt-48 md:pb-20 text-center max-w-4xl mx-auto">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill mb-5">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#b89a62]">Contact Studio</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-[#f1eee7]" style={{ fontFamily: 'var(--font-display)' }}>Connect With Lunore</h1>
          <p className="mt-6 text-sm tracking-[0.25em] uppercase text-[#b9b5ae]">
            Inquiries &amp; Bespoke Consultations
          </p>
          <div className="mt-8 w-16 h-px bg-[#b89a62] mx-auto" />
        </Reveal>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Form */}
          <Reveal direction="left" className="liquid-glass-card p-8 md:p-10 rounded-3xl">
            {status === 'success' ? (
              <div className="p-8 border border-[#b89a62] bg-[#b89a62]/10 rounded-2xl text-center">
                <Check className="w-10 h-10 text-[#b89a62] mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="text-2xl font-light mb-3 text-[#f1eee7]">Inquiry Received</h3>
                <p className="text-[#b9b5ae] leading-relaxed">
                  Thank you for reaching out to LUNORE. Our studio representative will
                  contact you shortly to discuss your vision.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-xs tracking-[0.3em] uppercase text-[#b89a62] hover:underline"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-[#b9b5ae] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full liquid-glass-input rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-[#b9b5ae] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full liquid-glass-input rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-[#b9b5ae] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full liquid-glass-input rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-[#b9b5ae] mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full liquid-glass-input rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none resize-none"
                  />
                </div>
                {status === 'error' && (
                  <p className="text-sm text-red-400">
                    Something went wrong. Please try again.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="liquid-glass-btn-primary w-full py-4 text-xs tracking-[0.25em] uppercase font-semibold text-[#0d0e0e] inline-flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg cursor-pointer"
                >
                  {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
                  {status !== 'sending' && <Send className="w-4 h-4" />}
                </button>
              </form>
            )}
          </Reveal>

          {/* Studio info */}
          <Reveal direction="right" className="liquid-glass-card p-8 md:p-10 rounded-3xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-5">
                  Studio Location
                </h3>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#b89a62] flex-shrink-0 mt-1" strokeWidth={1} />
                  <p className="text-[#b9b5ae] leading-relaxed text-sm">
                    103 UPPER, ANDHERI INDUSTRIAL ESTATE,<br />
                    OFF VEERA DESAI ROAD,<br />
                    Mumbai 400058
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-5">
                  Direct Inquiries
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <Phone className="w-5 h-5 text-[#b89a62] flex-shrink-0" strokeWidth={1} />
                  <a
                    href="tel:+919769708628"
                    className="text-[#cfcac0] hover:text-[#f3e5ab] transition-colors inline-flex items-center gap-2 group cursor-pointer text-sm"
                  >
                    <span>+91 97697 08628</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#b89a62]" />
                  </a>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <Mail className="w-5 h-5 text-[#b89a62] flex-shrink-0" strokeWidth={1} />
                  <a
                    href="mailto:support@lunoreluxedecorstudio.com"
                    className="text-[#cfcac0] hover:text-[#f3e5ab] transition-colors break-all inline-flex items-center gap-2 group cursor-pointer text-sm"
                  >
                    <span>support@lunoreluxedecorstudio.com</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#b89a62]" />
                  </a>
                </div>

                {/* Social Channels: Instagram & LinkedIn */}
                <div className="pt-2 pb-4 border-t border-white/[0.08] flex flex-wrap items-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#E1306C]/20 via-[#FD1D1D]/10 to-[#C13584]/20 hover:from-[#E1306C]/30 hover:to-[#C13584]/30 border border-[#E1306C]/40 hover:border-[#E1306C] text-xs text-[#f1eee7] hover:text-white shadow-[0_2px_14px_rgba(225,48,108,0.18)] hover:shadow-[0_4px_20px_rgba(225,48,108,0.35)] transition-all duration-300 group cursor-pointer"
                    title="Follow Lunore on Instagram"
                  >
                    <InstagramIcon className="w-4 h-4 text-[#E1306C] group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#E1306C] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#0A66C2]/20 via-[#0077B5]/10 to-[#0A66C2]/20 hover:from-[#0A66C2]/30 hover:to-[#0077B5]/30 border border-[#0A66C2]/40 hover:border-[#0A66C2] text-xs text-[#f1eee7] hover:text-white shadow-[0_2px_14px_rgba(10,102,194,0.18)] hover:shadow-[0_4px_20px_rgba(10,102,194,0.35)] transition-all duration-300 group cursor-pointer"
                    title="Connect with Lunore on LinkedIn"
                  >
                    <LinkedinIcon className="w-4 h-4 text-[#0A66C2] group-hover:scale-110 transition-transform" />
                    <span className="font-medium">LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#0A66C2] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>

                {/* Direct WhatsApp Concierge Button */}
                <div className="pt-2">
                  <a
                    href="https://wa.me/919769708628?text=Hello%20Lunore%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20your%20bespoke%20stone%20and%20interior%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/wa cursor-pointer relative overflow-hidden inline-flex items-center justify-center gap-3 w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#25D366]/20 via-[#25D366]/10 to-[#128C7E]/20 hover:from-[#25D366]/30 hover:to-[#128C7E]/30 border border-[#25D366]/40 hover:border-[#25D366] text-[#f1eee7] hover:text-white shadow-[0_4px_20px_rgba(37,211,102,0.15)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.3)] transition-all duration-300"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#25D366]/25 flex items-center justify-center text-[#25D366] group-hover/wa:scale-110 transition-transform">
                      <MessageCircle className="w-4 h-4 fill-current" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#f1eee7]">Contact via WhatsApp</span>
                      <span className="text-[10px] text-[#25D366] font-normal">Direct Concierge • Instant Response</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#25D366] ml-auto group-hover/wa:translate-x-0.5 group-hover/wa:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <p className="text-xs text-[#85817a]">
                Private consultations available by appointment in Mumbai and globally.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
