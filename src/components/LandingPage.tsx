import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Camera, Leaf, ShieldCheck, Volume2, X } from 'lucide-react';
import type { User } from '../types/phyto2';
import farmerPhoto from '../assets/images/farmer-taking-photo.png';

interface LandingPageProps {
  onLaunchDashboard: (initialView?: string) => void;
  onAuthSuccess: (user: User) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard, onAuthSuccess }) => {
  const [signInOpen, setSignInOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitAuth = async (event: FormEvent) => {
    event.preventDefault();
    if (!signInOpen || submitting) return;
    setSubmitting(true);
    setAuthError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'farmer' }),
      });
      const result = await response.json();
      if (!response.ok || !result.user) throw new Error(result.error || 'Please try again.');
      onAuthSuccess(result.user as User);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not continue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <main className="min-h-screen bg-[#f4f8f1] text-[#1d3023]">
    <header className="border-b border-[#d8e5d5] bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf4e5] text-[#397a36]"><Leaf size={22} /></span>
          <div>
            <p className="text-base font-extrabold leading-tight">PhytoTrace</p>
            <p className="hidden text-xs text-[#617363] sm:block">Simple help for healthier crops</p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
        <button onClick={() => { setSignInOpen(true); setAuthError(''); }} className="rounded-xl px-2 py-2.5 text-xs font-bold text-[#315b35] hover:bg-[#f4f8f1] sm:px-3 sm:text-sm">
          Sign in
        </button>
        <button onClick={() => onLaunchDashboard('scanner')} className="farmer-primary-button whitespace-nowrap rounded-xl bg-[#397a36] px-3 py-2.5 text-xs font-bold text-white hover:bg-[#2c642f] sm:px-4 sm:text-sm">
          Check a leaf
        </button>
        </div>
      </div>
    </header>

    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf4e5] px-3 py-1.5 text-xs font-semibold text-[#315b35]">
          <span className="h-2 w-2 rounded-full bg-[#55a747]" /> Made for farmers
        </span>
        <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Spot leaf problems early.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#506454]">
          Take a clear photo of a crop leaf. Get simple guidance on what to check next, in words you can understand.
        </p>
        <button onClick={() => onLaunchDashboard('scanner')} className="farmer-primary-button mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#397a36] px-6 py-3.5 text-base font-bold text-white shadow-md hover:bg-[#2c642f]">
          <Camera size={19} /> Check a leaf <ArrowRight size={18} />
        </button>
        <p className="mt-3 text-sm text-[#617363]">Take a photo or choose one from your phone. To keep track of your records, kindly <button type="button" onClick={() => { setSignInOpen(true); setAuthError(''); }} className="font-bold text-[#397a36] underline underline-offset-2">sign in</button>.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#d8e5d5] bg-white p-2 shadow-lg shadow-[#315b35]/10">
        <img
          src={farmerPhoto}
          alt="Farmer using a phone to photograph a tomato plant leaf"
          className="aspect-[4/3] w-full rounded-2xl object-cover object-left"
        />
        <div className="flex items-center justify-center gap-4 px-3 py-3" aria-label="Point your phone at a leaf, take a photo, and get crop guidance">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf4e5] text-[#397a36]"><Camera size={22} /></span>
          <ArrowRight size={20} className="text-[#718174]" />
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf4e5] text-[#397a36]"><Leaf size={22} /></span>
          <ArrowRight size={20} className="text-[#718174]" />
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf4e5] text-[#397a36]"><ShieldCheck size={22} /></span>
        </div>
      </div>
    </section>

    <section className="border-y border-[#d8e5d5] bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-bold">Three simple steps</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            { icon: Camera, title: 'Take a photo', description: 'Choose a clear photo of one affected leaf.' },
            { icon: ShieldCheck, title: 'Check the signs', description: 'See possible damage and what is still uncertain.' },
            { icon: Volume2, title: 'Hear what to do', description: 'Read or listen to practical next steps.' },
          ].map(({ icon: Icon, title, description }, index) => (
            <article key={title} className="rounded-2xl border border-[#d8e5d5] bg-[#f8fbf6] p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf4e5] text-[#397a36]"><Icon size={20} /></span>
                <span className="text-xs font-bold uppercase tracking-wide text-[#718174]">Step {index + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[#506454]">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#d9dfb6] bg-[#fffbea] p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h2 className="font-bold text-[#453c1b]">Not sure about a spray?</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#615a3e]">This tool gives suggestions, not a final diagnosis. Check with your local agriculture officer before using a pesticide.</p>
        </div>
        <button onClick={() => onLaunchDashboard('scanner')} className="shrink-0 rounded-xl border border-[#b5c8ac] bg-white px-4 py-2.5 text-sm font-bold text-[#315b35] hover:bg-[#f4f8f1]">
          Check a leaf
        </button>
      </div>
    </section>

    <footer className="py-6 text-center text-xs text-[#718174]">
      PhytoTrace · Simple crop guidance for the field
    </footer>
    {signInOpen && (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#16251b]/55 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSignInOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="auth-title" className="w-full max-w-md rounded-3xl border border-[#d8e5d5] bg-white p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#397a36]">Farmer account</p>
              <h2 id="auth-title" className="mt-1 text-2xl font-extrabold">Sign in to PhytoTrace</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#617363]">Sign in when you want to keep track of your crop records.</p>
            </div>
            <button type="button" onClick={() => setSignInOpen(false)} aria-label="Close" className="rounded-lg p-2 text-[#617363] hover:bg-[#f4f8f1]"><X size={20} /></button>
          </div>
          <form onSubmit={submitAuth} className="mt-6 space-y-4">
            <div>
              <label htmlFor="farmer-email" className="mb-1.5 block text-sm font-semibold">Email address</label>
              <input id="farmer-email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-[#ccdcca] bg-[#fbfdf9] px-3.5 py-3 text-base text-[#1d3023] placeholder:text-[#718174] focus:border-[#397a36] focus:outline-none focus:ring-2 focus:ring-[#397a36]/20" />
            </div>
            <p className="rounded-xl bg-[#f4f8f1] p-3 text-xs leading-relaxed text-[#617363]">This preview stores account details only while the demo server is running. Don’t enter a password or sensitive information.</p>
            {authError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{authError}</p>}
            <button type="submit" disabled={submitting} className="farmer-primary-button w-full rounded-xl bg-[#397a36] px-4 py-3 text-base font-bold text-white hover:bg-[#2c642f] disabled:opacity-60">
              {submitting ? 'Please wait…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-4 text-xs text-[#718174]">You can still check a leaf without signing in.</p>
        </section>
      </div>
    )}
  </main>
  );
};
