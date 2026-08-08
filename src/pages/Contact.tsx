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
      <section className="px-6 pt-32 pb-16 md:pt-44 md:pb-20 text-center max-w-4xl mx-auto">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">
            Contact Us
          </p>
          <h1 className="text-4xl md:text-6xl font-light text-shimmer">Connect</h1>
          <p className="mt-6 text-sm tracking-[0.3em] uppercase text-[#a3a3a3]">
            Inquiries &amp; Consultations
          </p>
          <div className="mt-8 w-16 h-px bg-[#c2a67e] mx-auto" />
        </Reveal>
      </section>

      <section className="py-12 md:py-16 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
{/* Form */}
          <Reveal direction="left">
            {status === 'success' ? (
              <div className="p-8 border border-[#c2a67e] bg-[#c2a67e]/5 text-center">
                <Check className="w-10 h-10 text-[#c2a67e] mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="text-2xl font-light mb-3">Inquiry Received</h3>
                <p className="text-[#a3a3a3] leading-relaxed">
                  Thank you for reaching out to LUNORE. Our studio representative will
                  contact you shortly to discuss your vision.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-xs tracking-[0.3em] uppercase text-[#c2a67e] hover:underline"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-[#a3a3a3] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-transparent border-b border-[rgba(255,255,255,0.15)] py-3 text-[#f2f2f2] focus:border-[#c2a67e] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-[#a3a3a3] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent border-b border-[rgba(255,255,255,0.15)] py-3 text-[#f2f2f2] focus:border-[#c2a67e] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-[#a3a3a3] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-transparent border-b border-[rgba(255,255,255,0.15)] py-3 text-[#f2f2f2] focus:border-[#c2a67e] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase text-[#a3a3a3] mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-transparent border-b border-[rgba(255,255,255,0.15)] py-3 text-[#f2f2f2] focus:border-[#c2a67e] focus:outline-none transition-colors resize-none"
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
                  className="inline-flex items-center gap-2 px-8 py-4 border border-[#c2a67e] text-xs tracking-[0.3em] uppercase text-[#c2a67e] hover:bg-[#c2a67e] hover:text-[#1f2122] transition-all disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
                  {status !== 'sending' && <Send className="w-4 h-4" />}
                </button>
              </form>
            )}
          </Reveal>

          {/* Studio info */}
          <Reveal direction="right">
            <div className="space-y-8">
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-[#c2a67e] mb-5">
                Studio
              </h3>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#c2a67e] flex-shrink-0 mt-1" strokeWidth={1} />
                <p className="text-[#a3a3a3] leading-relaxed">
                  57 Heera Panna M.R. No.2, MHADA Layout,<br />
                  Oshiwara, Jogeshwari(W), Near Dhaba,<br />
                  Mumbai 400058
                </p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Phone className="w-5 h-5 text-[#c2a67e] flex-shrink-0" strokeWidth={1} />
                <a href="tel:+919769708628" className="text-[#a3a3a3] hover:text-[#f2f2f2] transition-colors">
                  +91 97697 08628
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-[#c2a67e] flex-shrink-0" strokeWidth={1} />
                <a
                  href="mailto:support@lunoreluxedecorstudio.com"
                  className="text-[#a3a3a3] hover:text-[#f2f2f2] transition-colors break-all"
                >
support@lunoreluxedecorstudio.com
                </a>
              </div>
            </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
