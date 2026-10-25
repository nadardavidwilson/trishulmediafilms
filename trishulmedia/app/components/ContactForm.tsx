'use client';

import { useState, type FormEvent } from 'react';

const fieldClassName =
  'mt-2 w-full rounded-xl border border-[#e8ddd5] bg-white/80 px-4 py-3 text-sm text-[#29221e] outline-none transition placeholder:text-[#a69a91] focus:border-[#b1552b] focus:ring-4 focus:ring-[#b1552b]/10';

const labelClassName = 'text-xs font-semibold uppercase tracking-[0.14em] text-[#65574f]';

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'We couldn’t send your enquiry. Please try again.');
      setSent(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'We couldn’t send your enquiry. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact-form" className="overflow-hidden rounded-[2rem] border border-[#eadfd7] bg-[#fffdfb] shadow-[0_24px_70px_rgba(67,43,29,0.08)]">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative flex flex-col justify-between overflow-hidden bg-[#30251f] p-7 text-white sm:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e2a27e]">Let’s make it yours</p>
            <h3 className="mt-5 max-w-sm font-[var(--font-display)] text-3xl leading-tight text-white sm:text-4xl">
              Tell us a little about your story.
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
              Share a few details and we’ll help you plan a shoot that feels personal, relaxed, and unmistakably you.
            </p>
          </div>
          <div className="relative mt-10 border-t border-white/15 pt-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">Prefer email?</p>
            <a className="mt-2 inline-block text-sm text-white transition hover:text-[#e2a27e]" href="mailto:Trishulmediafilms@gmail.com">
              Trishulmediafilms@gmail.com
            </a>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          {sent ? (
            <div className="flex min-h-80 flex-col justify-center" role="status">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5e9e1] text-xl text-[#a44925]" aria-hidden="true">✓</span>
              <h4 className="mt-5 font-[var(--font-display)] text-2xl text-[#29221e]">Your enquiry is ready</h4>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#75685f]">
                Your enquiry was sent successfully. We’ll be in touch soon.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b1552b]">Shoot enquiry</p>
                <h4 className="mt-2 font-[var(--font-display)] text-2xl text-[#29221e]">Start with the essentials</h4>
                <p className="mt-2 text-sm text-[#75685f]">Fields marked <span className="text-[#b1552b]">*</span> are required.</p>
              </div>

              <form onSubmit={submit} className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                <label className={labelClassName}>
                  Couple’s names <span className="text-[#b1552b]">*</span>
                  <input className={fieldClassName} name="coupleName" placeholder="e.g. Aanya & Rohan" autoComplete="name" required />
                </label>
                <label className={labelClassName}>
                  Your email <span className="text-[#b1552b]">*</span>
                  <input className={fieldClassName} name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
                </label>
                <label className={labelClassName}>
                  Target date or tentative month <span className="text-[#b1552b]">*</span>
                  <input className={fieldClassName} name="shootDate" placeholder="e.g. February 2027" required />
                </label>
                <label className={labelClassName}>
                  Preferred shoot location <span className="text-[#b1552b]">*</span>
                  <select className={fieldClassName} name="location" defaultValue="" required>
                    <option value="" disabled>Select a location type</option>
                    <option value="Local">Local</option>
                    <option value="Destination">Destination</option>
                    <option value="Not decided yet">Not decided yet</option>
                  </select>
                </label>
                <label className={labelClassName}>
                  Estimated budget <span className="text-[#b1552b]">*</span>
                  <select className={fieldClassName} name="budget" defaultValue="" required>
                    <option value="" disabled>Select a budget range</option>
                    <option value="Under ₹25,000">Under ₹25,000</option>
                    <option value="₹25,000–₹50,000">₹25,000–₹50,000</option>
                    <option value="₹50,000+">₹50,000+</option>
                    <option value="Still exploring">Still exploring</option>
                  </select>
                </label>
                <label className={labelClassName}>
                  How did you find us? <span className="text-[#b1552b]">*</span>
                  <select className={fieldClassName} name="referral" defaultValue="" required>
                    <option value="" disabled>Select an option</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google search">Google search</option>
                    <option value="Referral">Referral</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className={`${labelClassName} sm:col-span-2`}>
                  Anything else you’d like us to know?
                  <textarea className={fieldClassName} name="message" placeholder="Your ideas, preferred location, or questions…" rows={3} />
                </label>
                {error ? <p className="text-sm text-red-700 sm:col-span-2" role="alert">{error}</p> : null}
                <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
                  <button type="submit" disabled={sending} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#b1552b] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(177,85,43,0.2)] transition hover:-translate-y-0.5 hover:bg-[#964522] focus:outline-none focus:ring-4 focus:ring-[#b1552b]/20 disabled:cursor-wait disabled:opacity-70">
                    {sending ? 'Sending…' : 'Send shoot enquiry'} <span aria-hidden="true">{sending ? '…' : '↗'}</span>
                  </button>
                  <p className="text-xs leading-5 text-[#8a7d74]">Your enquiry will be sent directly to our inbox.</p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
