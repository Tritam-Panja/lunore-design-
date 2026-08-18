import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Check } from 'lucide-react';
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
                    className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
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
                    className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
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
                    className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
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
                    className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
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
          <Reveal direction="right" className="liquid-glass-card p-8 md:p-10 rounded-3xl flex flex-col justify-between">
            <div className="space-y-8">
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-[#b89a62] mb-5">
                  Studio Location
                </h3>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#b89a62] flex-shrink-0 mt-1" strokeWidth={1} />
                  <p className="text-[#b9b5ae] leading-relaxed">
                    57 Heera Panna M.R. No.2, MHADA Layout,<br />
                    Oshiwara, Jogeshwari(W), Near Dhaba,<br />
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
                  <a href="tel:+919769708628" className="text-[#b9b5ae] hover:text-[#f1eee7] transition-colors">
                    +91 97697 08628
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-[#b89a62] flex-shrink-0" strokeWidth={1} />
                  <a
                    href="mailto:support@lunoreluxedecorstudio.com"
                    className="text-[#b9b5ae] hover:text-[#f1eee7] transition-colors break-all"
                  >
                    support@lunoreluxedecorstudio.com
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-white/10 mt-8">
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
