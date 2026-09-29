import { useState } from 'react';
import { Send, Check, AlertCircle } from 'lucide-react';
import { sendContactInquiry } from '@/lib/contactService';
import { Reveal } from '@/components/Reveal';
import { ReturnToHome } from '@/components/ReturnToHome';

export function Careers() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    portfolio: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const formattedMessage = [
      form.phone ? `Phone: ${form.phone}` : '',
      form.role ? `Position / Role: ${form.role}` : '',
      form.portfolio ? `Portfolio / Resume Link: ${form.portfolio}` : '',
      form.message ? `Notes: ${form.message}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    const result = await sendContactInquiry({
      name: form.name,
      email: form.email,
      subject: `Careers Inquiry - ${form.role || 'General Application'}`,
      message: formattedMessage || 'Career inquiry submitted.',
    });

    if (!result.success) {
      setStatus('error');
      setErrorMessage(result.message || 'Something went wrong. Please try again.');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', role: '', portfolio: '', message: '' });
    }
  };

  return (
    <div className="bg-[#0d0e0e] text-[#f1eee7] min-h-screen relative overflow-hidden flex flex-col">
      {/* Ambient Radial Glow */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#b89a62]/8 rounded-full blur-[170px] pointer-events-none" />

      {/* Return to Home */}
      <ReturnToHome />

      {/* Hero Header */}
      <section className="px-4 sm:px-6 pt-4 sm:pt-8 md:pt-10 pb-6 sm:pb-8 text-center max-w-3xl mx-auto relative z-10">
        <Reveal direction="down">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill mb-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#b89a62]">Careers</span>
          </div>
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-light text-[#f1eee7]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Get in Touch
          </h1>
          <div className="mt-5 w-16 h-px bg-gradient-to-r from-transparent via-[#b89a62] to-transparent mx-auto" />
        </Reveal>
      </section>

      {/* Form Section */}
      <section className="pb-16 sm:pb-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-xl mx-auto">
          <Reveal direction="up" className="liquid-glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
            {status === 'success' ? (
              <div className="py-10 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#b89a62]/20 border border-[#b89a62]/40 flex items-center justify-center mx-auto mb-4 text-[#b89a62]">
                  <Check className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3
                  className="text-2xl font-light mb-2 text-[#f1eee7]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Application Submitted
                </h3>
                <p className="text-xs sm:text-sm text-[#b9b5ae] font-light">
                  Thank you. We will review your profile and reach out if there is a match.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-xs tracking-[0.25em] uppercase text-[#b89a62] hover:underline cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-[#b9b5ae] mb-1.5 font-light">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-white/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-[#b9b5ae] mb-1.5 font-light">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-[#b9b5ae] mb-1.5 font-light">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 …"
                      className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-[#b9b5ae] mb-1.5 font-light">
                    Role / Position of Interest
                  </label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Interior Architect, 3D Visualizer, Project Lead"
                    className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-white/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-[#b9b5ae] mb-1.5 font-light">
                    Portfolio / Resume Link
                  </label>
                  <input
                    type="url"
                    value={form.portfolio}
                    onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                    placeholder="https://drive.google.com/… or linkedin.com/…"
                    className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-white/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-[#b9b5ae] mb-1.5 font-light">
                    Brief Note
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us briefly about your craft and background…"
                    className="w-full liquid-glass-input rounded-xl px-4 py-3 text-sm focus:outline-none resize-none placeholder:text-white/20"
                  />
                </div>

                {status === 'error' && (
                  <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage || 'Something went wrong. Please try again.'}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="liquid-glass-btn-primary w-full py-3.5 sm:py-4 text-xs tracking-[0.25em] uppercase font-semibold text-[#0d0e0e] inline-flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg cursor-pointer mt-2"
                >
                  {status === 'sending' ? 'Submitting…' : 'Submit Application'}
                  {status !== 'sending' && <Send className="w-3.5 h-3.5" />}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
