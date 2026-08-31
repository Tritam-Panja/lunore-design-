import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Check, MessageCircle, ArrowUpRight, AlertCircle } from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '@/components/SocialIcons';
import { sendContactInquiry } from '@/lib/contactService';
import { Reveal } from '@/components/Reveal';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const result = await sendContactInquiry({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });

    if (!result.success) {
      setStatus('error');
      setErrorMessage(result.message || 'Something went wrong. Please try again.');
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
                  <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex items-start gap-2.5 leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage || 'Something went wrong. Please try again or reach out via WhatsApp/Phone.'}</span>
                  </div>
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
                <div className="flex items-center gap-4 mb-5">
                  <Phone className="w-5 h-5 text-[#b89a62] flex-shrink-0" strokeWidth={1} />
                  <a
                    href="tel:+919769708628"
                    className="text-[#cfcac0] hover:text-[#f3e5ab] transition-colors inline-flex items-center gap-2 group cursor-pointer text-sm"
                  >
                    <span>+91 97697 08628</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#b89a62]" />
                  </a>
                </div>

                {/* Social Channels: Filled Instagram & LinkedIn */}
                <div className="pt-2 pb-4 border-t border-white/[0.08] flex flex-wrap items-center gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#E1306C] via-[#FD1D1D] to-[#C13584] hover:brightness-110 text-xs text-white font-medium shadow-[0_3px_16px_rgba(225,48,108,0.35)] hover:shadow-[0_4px_22px_rgba(225,48,108,0.55)] transition-all duration-300 group cursor-pointer"
                    title="Follow Lunore on Instagram"
                  >
                    <InstagramIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-white tracking-wide">Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#0077B5] to-[#0A66C2] hover:brightness-110 text-xs text-white font-medium shadow-[0_3px_16px_rgba(10,102,194,0.35)] hover:shadow-[0_4px_22px_rgba(10,102,194,0.55)] transition-all duration-300 group cursor-pointer"
                    title="Connect with Lunore on LinkedIn"
                  >
                    <LinkedinIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-white tracking-wide">LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>

                {/* Direct Action Card Buttons: Email & WhatsApp */}
                <div className="space-y-3 pt-2">
                  {/* Direct Email Card Button */}
                  <a
                    href="mailto:support@lunoreluxedecorstudio.com"
                    className="group/mail cursor-pointer relative overflow-hidden inline-flex items-center justify-center gap-3.5 w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#b89a62]/20 via-[#b89a62]/10 to-[#8c7343]/20 hover:from-[#b89a62]/30 hover:to-[#8c7343]/30 border border-[#b89a62]/40 hover:border-[#b89a62] text-white shadow-[0_4px_20px_rgba(184,154,98,0.15)] hover:shadow-[0_6px_28px_rgba(184,154,98,0.3)] transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#b89a62]/25 flex items-center justify-center text-[#f3e5ab] group-hover/mail:scale-110 transition-transform flex-shrink-0">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col text-left flex-1 min-w-0">
                      <span className="text-xs sm:text-[13px] uppercase tracking-[0.2em] font-semibold text-white">Contact via Email</span>
                      <span className="text-xs sm:text-[13px] text-[#f3e5ab] font-medium tracking-normal truncate">support@lunoreluxedecorstudio.com</span>
                    </div>
                    <ArrowUpRight className="w-4.5 h-4.5 text-[#f3e5ab] ml-auto group-hover/mail:translate-x-0.5 group-hover/mail:-translate-y-0.5 transition-transform flex-shrink-0" />
                  </a>

                  {/* Direct WhatsApp Concierge Button */}
                  <a
                    href="https://wa.me/919769708628?text=Hello%20Lunore%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20your%20bespoke%20stone%20and%20interior%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/wa cursor-pointer relative overflow-hidden inline-flex items-center justify-center gap-3.5 w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#25D366]/20 via-[#25D366]/10 to-[#128C7E]/20 hover:from-[#25D366]/30 hover:to-[#128C7E]/30 border border-[#25D366]/40 hover:border-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.15)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.3)] transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#25D366]/25 flex items-center justify-center text-[#25D366] group-hover/wa:scale-110 transition-transform flex-shrink-0">
                      <MessageCircle className="w-4.5 h-4.5 fill-current" />
                    </div>
                    <div className="flex flex-col text-left flex-1 min-w-0">
                      <span className="text-xs sm:text-[13px] uppercase tracking-[0.2em] font-semibold text-white">Contact via WhatsApp</span>
                      <span className="text-xs sm:text-[12px] text-[#25D366] font-medium tracking-wide">Direct Concierge • Instant Response</span>
                    </div>
                    <ArrowUpRight className="w-4.5 h-4.5 text-[#25D366] ml-auto group-hover/wa:translate-x-0.5 group-hover/wa:-translate-y-0.5 transition-transform flex-shrink-0" />
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
