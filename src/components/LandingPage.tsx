import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  HelpCircle,
  FileText,
  Activity,
  MapPin,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Scan,
  Compass,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: (initialView?: string) => void;
  geminiConnected: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  geminiConnected,
}) => {
  return (
    <div className="min-h-screen bg-[#071C16] text-[#F8FAFC] selection:bg-[#A3E635]/30 selection:text-[#A3E635]">
      {/* Sticky Minimal Navigation */}
      <nav className="sticky top-0 z-50 bg-[#071C16]/90 backdrop-blur-md border-b border-[#244637]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#A3E635]/15 border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635] font-black text-base shadow-[0_0_12px_rgba(163,230,53,0.3)]">
              Φ
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              PhytoTrace <span className="text-[#A3E635]">2.0</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#A7B8AE]">
            <a href="#hero" className="hover:text-white transition-colors">Home</a>
            <a href="#problem" className="hover:text-white transition-colors">Problem</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#technology" className="hover:text-white transition-colors">Technology</a>
            <a href="#impact" className="hover:text-white transition-colors">Impact</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onLaunchDashboard('overview')}
              className="text-xs font-semibold text-[#A7B8AE] hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onLaunchDashboard('scanner')}
              className="btn-neon px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <span>Analyze a Leaf</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A3E635]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#103D2B]/80 border border-[#244637] text-xs font-medium text-[#BBF7D0]">
                <span className="w-2 h-2 rounded-full bg-[#A3E635] shadow-[0_0_8px_#A3E635] animate-pulse" />
                <span>CHIP TO CROP 2026 · Problem Statement 04</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Intelligence in <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A3E635] via-[#34D399] to-emerald-200">
                  Every Leaf.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#A7B8AE] max-w-xl leading-relaxed">
                AI-powered leaf intelligence that helps identify mining damage, reveal pest evidence, and monitor crop health — one leaf at a time.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => onLaunchDashboard('scanner')}
                  className="btn-neon px-6 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Scan className="w-4 h-4" />
                  <span>Analyze a Leaf</span>
                </button>
                <a
                  href="#technology"
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold text-[#F8FAFC] bg-[#103D2B] hover:bg-[#164A35] border border-[#244637] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Explore Technology</span>
                  <ChevronRight className="w-4 h-4 text-[#A3E635]" />
                </a>
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-[#73877B]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
                  <span>Smartphone-first PWA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
                  <span>Multi-pest localization</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
                  <span>Calibrated uncertainty</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Realistic Leaf with Neon Green Scanning & Boundaries */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#244637] bg-[#0B251C] shadow-2xl p-2.5">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black">
                  <img
                    src="/src/assets/images/tomato_leaf_mixed_mines_1793734448287.jpg"
                    alt="Tomato Leaf Specimen Inspection"
                    className="w-full h-full object-cover"
                  />

                  {/* Animated Neon Green Scanning Line */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#A3E635] to-transparent shadow-[0_0_15px_#A3E635] pointer-events-none animate-scanline" />

                  {/* Simulated AI Detection Bounding Polygons */}
                  <div className="absolute top-[48%] left-[48%] w-[38%] h-[34%] border-2 border-[#A3E635] rounded-xl bg-[#A3E635]/15 pointer-events-none shadow-[0_0_12px_rgba(163,230,53,0.3)]">
                    <span className="absolute -top-2.5 left-2 bg-[#A3E635] text-[#071C16] text-[10px] font-black px-1.5 rounded">
                      REGION A · Tuta (94%)
                    </span>
                  </div>

                  <div className="absolute top-[14%] left-[22%] w-[42%] h-[26%] border-2 border-[#38BDF8] rounded-xl bg-[#38BDF8]/15 pointer-events-none shadow-[0_0_12px_rgba(56,189,248,0.3)]">
                    <span className="absolute -top-2.5 left-2 bg-[#38BDF8] text-[#071C16] text-[10px] font-black px-1.5 rounded">
                      REGION B · Liriomyza (92%)
                    </span>
                  </div>

                  <div className="absolute top-[42%] left-[16%] w-[30%] h-[34%] border-2 border-dashed border-[#FBBF24] rounded-xl bg-[#FBBF24]/10 pointer-events-none">
                    <span className="absolute -top-2.5 left-2 bg-[#FBBF24] text-[#071C16] text-[10px] font-black px-1.5 rounded">
                      REGION C · Uncertain
                    </span>
                  </div>
                </div>

                {/* Floating AI Status Card (Hero Feature) */}
                <div className="mt-3 bg-[#103D2B]/90 backdrop-blur-md border border-[#244637] rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#A3E635]/20 flex items-center justify-center text-[#A3E635]">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase font-bold text-[#A3E635] tracking-wider">
                        PHYTO AI
                      </div>
                      <div className="text-xs font-semibold text-white">Leaf analysis system</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30">
                    {geminiConnected ? 'READY FOR INSPECTION' : 'CALIBRATED ENGINE'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section: Two Pests. Similar Symptoms. One Critical Challenge. */}
      <section id="problem" className="py-20 bg-[#0B251C]/60 border-y border-[#244637]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3E635] block mb-2">
              THE DIAGNOSTIC CHALLENGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Two Pests. Similar Symptoms. One Critical Challenge.
            </h2>
            <p className="text-sm text-[#A7B8AE] mt-3 leading-relaxed">
              *Tuta absoluta* and *Liriomyza spp.* are destructive leaf-mining pests of tomato crops. Their visible damage overlaps, making mixed infestations deceptive for conventional single-label classifiers.
            </p>
          </div>

          {/* Side-by-Side Visual Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Tuta Card */}
            <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black mb-4 relative">
                  <img
                    src="/src/assets/images/tomato_leaf_tuta_blotch_1793734447498.jpg"
                    alt="Tuta absoluta blotch-like galleries"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-[#071C16]/85 px-2 py-0.5 rounded text-[10px] font-mono text-[#A3E635] border border-[#244637]">
                    Verified Macro Specimen
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Tuta-type mine</h3>
                <span className="text-xs font-semibold text-[#A3E635] block mb-2">
                  Irregular, blotch-like galleries (Tuta absoluta)
                </span>
                <p className="text-xs text-[#A7B8AE] leading-relaxed">
                  Consumes parenchymal tissue between upper and lower epidermal layers, creating transparent necrotic blotches with clustered dark frass pellets. Larvae also attack stems and green fruits.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#244637] text-[11px] text-[#BBF7D0] font-mono">
                Pheromone: Qlure-TUA Delta Monitoring Trap
              </div>
            </div>

            {/* Liriomyza Card */}
            <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black mb-4 relative">
                  <img
                    src="/src/assets/images/tomato_leaf_liriomyza_trail_1793734447042.jpg"
                    alt="Liriomyza serpentine narrow galleries"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-[#071C16]/85 px-2 py-0.5 rounded text-[10px] font-mono text-[#38BDF8] border border-[#244637]">
                    Verified Macro Specimen
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Liriomyza-type mine</h3>
                <span className="text-xs font-semibold text-[#38BDF8] block mb-2">
                  Narrow, winding serpentine galleries (Liriomyza spp.)
                </span>
                <p className="text-xs text-[#A7B8AE] leading-relaxed">
                  Continuous white-to-yellow winding tunnels that meander across secondary leaf veins. Lateral frass deposits without blotch necrosis. Confined strictly to foliage.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#244637] text-[11px] text-[#BBF7D0] font-mono">
                Monitoring: Yellow Sticky Canopy Sheets
              </div>
            </div>
          </div>

          {/* Sequential Diagnostic Problem Flow (Page 2 of Proposal) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="bg-[#071C16] border border-[#244637] p-3 rounded-xl">
              <span className="text-[#A3E635] font-bold block mb-1">01</span>
              <span className="text-[#F8FAFC] font-semibold">Overlapping Symptoms</span>
            </div>
            <div className="bg-[#071C16] border border-[#244637] p-3 rounded-xl">
              <span className="text-rose-400 font-bold block mb-1">02</span>
              <span className="text-[#F8FAFC] font-semibold">Single-Label Prediction</span>
            </div>
            <div className="bg-[#071C16] border border-[#244637] p-3 rounded-xl">
              <span className="text-amber-400 font-bold block mb-1">03</span>
              <span className="text-[#F8FAFC] font-semibold">Hidden Mixed Infestation</span>
            </div>
            <div className="bg-[#071C16] border border-[#244637] p-3 rounded-xl">
              <span className="text-rose-400 font-bold block mb-1">04</span>
              <span className="text-[#F8FAFC] font-semibold">Unclear Evidence Trail</span>
            </div>
            <div className="bg-[#071C16] border border-[#244637] p-3 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-rose-400 font-bold block mb-1">05</span>
              <span className="text-[#F8FAFC] font-semibold">Harder Scouting Decisions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section: From a Simple Photograph to Actionable Evidence */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3E635] block mb-2">
              7-GATE PIPELINE WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From a Simple Photograph to Actionable Evidence.
            </h2>
            <p className="text-sm text-[#A7B8AE] mt-3">
              How PhytoTrace 2.0 converts a smartphone leaf photograph into auditable agronomic intelligence.
            </p>
          </div>

          {/* Animated 7-Step Horizontal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-10">
            {[
              { step: '01', title: 'Capture', desc: 'Smartphone photo in field or greenhouse' },
              { step: '02', title: 'Quality Check', desc: 'Pre-check flags blur, glare and distance' },
              { step: '03', title: 'Detect Damage', desc: 'Segment leaf lamina & identify mining damage' },
              { step: '04', title: 'Localize Regions', desc: 'Outline suspected mines with boundaries' },
              { step: '05', title: 'Analyze Evidence', desc: 'Morphology classification per region' },
              { step: '06', title: 'Flag Uncertainty', desc: 'Calibrated abstention & mixed flag' },
              { step: '07', title: 'Save & Report', desc: 'Damage Fingerprint linked to plant & field' },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-[#103D2B] border border-[#244637] rounded-xl p-4 flex flex-col justify-between hover:border-[#A3E635]/50 transition-colors group"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#A3E635] block mb-1 group-hover:scale-105 transition-transform">
                    {s.step}
                  </span>
                  <h4 className="text-xs font-bold text-white mb-1">{s.title}</h4>
                  <p className="text-[11px] text-[#A7B8AE] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#164A35] border border-[#244637] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A3E635]/20 flex items-center justify-center text-[#A3E635] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Experience the Diagnostic Pipeline in Action</h4>
                <p className="text-xs text-[#A7B8AE]">Test with live camera or certified greenhouse validation samples.</p>
              </div>
            </div>
            <button
              onClick={() => onLaunchDashboard('scanner')}
              className="btn-neon px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-md cursor-pointer"
            >
              Launch Leaf Scanner
            </button>
          </div>
        </div>
      </section>

      {/* Technology Section: Six Layers of Agricultural Intelligence */}
      <section id="technology" className="py-20 bg-[#0B251C]/60 border-y border-[#244637]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3E635] block mb-2">
              CORE INNOVATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Six Layers of Agricultural Intelligence.
            </h2>
            <p className="text-sm text-[#A7B8AE] mt-3">
              Moving beyond opaque classification to granular, auditable evidence at plant and greenhouse scale.
            </p>
          </div>

          {/* 6 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                num: '1',
                title: 'Regional Evidence',
                subtitle: 'Multi-label evidence for each damage region',
                desc: 'Instead of forcing a single label per leaf, PhytoTrace recognizes independent co-occurring pests on the same lamina.',
                icon: Layers,
              },
              {
                num: '2',
                title: 'Explainable Localization',
                subtitle: 'Overlays and region boundaries',
                desc: 'Overlays show where evidence sits on the leaf surface, not opaque hidden neural weights, providing transparent visual justification.',
                icon: Eye,
              },
              {
                num: '3',
                title: 'Uncertainty Awareness',
                subtitle: 'Calibrated confidence and abstention',
                desc: 'Avoids forced guesses. If cues are ambiguous, the AI safely abstains and prompts the farmer for a macro close-up or expert review.',
                icon: HelpCircle,
              },
              {
                num: '4',
                title: 'Damage Fingerprint',
                subtitle: 'Structured inspection records',
                desc: 'Every inspection produces an immutable digital record with SHA-256 hash, plant UUID, surface damage %, and GPS coordinates.',
                icon: FileText,
              },
              {
                num: '5',
                title: 'Longitudinal Monitoring',
                subtitle: 'Repeat inspections; visible-damage trend',
                desc: 'Tracks damage expansion kinetics over Day 1, Day 4, Day 8, and Day 12 to verify if biological controls have halted larval feeding.',
                icon: Activity,
              },
              {
                num: '6',
                title: 'Farm-Level Intelligence',
                subtitle: 'Plant grid; unsampled plants are unknown',
                desc: 'Maintains scientific rigor across 80-plant greenhouse blocks: unsampled plants remain strictly marked as unknown, never falsely presumed healthy.',
                icon: MapPin,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.num}
                  className="bg-[#103D2B] border border-[#244637] rounded-2xl p-6 flex flex-col justify-between hover:border-[#A3E635]/60 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-[#A3E635]">LAYER 0{card.num}</span>
                      <Icon className="w-4 h-4 text-[#A7B8AE] group-hover:text-[#A3E635] transition-colors" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{card.title}</h3>
                    <span className="text-xs text-[#BBF7D0] font-medium block mb-2">{card.subtitle}</span>
                    <p className="text-xs text-[#A7B8AE] leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section: Designed for Farmers. Built for Agricultural Intelligence. */}
      <section id="impact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A3E635] block mb-2">
              REAL-WORLD IMPACT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed for Farmers. Built for Agricultural Intelligence.
            </h2>
            <p className="text-xs text-[#73877B] mt-2 italic">
              Impact statements represent intended technical benefits, not proven field outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-5">
              <h4 className="text-sm font-bold text-white mb-1.5">Smartphone Access</h4>
              <p className="text-xs text-[#A7B8AE]">Runs in standard browser on Android, iOS, tablets, and laptops without expensive proprietary imaging rigs.</p>
            </div>
            <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-5">
              <h4 className="text-sm font-bold text-white mb-1.5">Repeatable Scouting</h4>
              <p className="text-xs text-[#A7B8AE]">Standardized scouting protocol on the same plant cohort across seasonal production cycles.</p>
            </div>
            <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-5">
              <h4 className="text-sm font-bold text-white mb-1.5">Evidence for Experts</h4>
              <p className="text-xs text-[#A7B8AE]">Documented regional overlays and frass biomarkers facilitate remote verification by ICAR-IIHR entomologists.</p>
            </div>
            <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-5">
              <h4 className="text-sm font-bold text-white mb-1.5">Potential Affordability</h4>
              <p className="text-xs text-[#A7B8AE]">Built around everyday smartphones farmers already own, reducing entry barriers for smallholder growers.</p>
            </div>
            <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-5">
              <h4 className="text-sm font-bold text-white mb-1.5">Field to Multi-Farm</h4>
              <p className="text-xs text-[#A7B8AE]">Structured hierarchies from plant identifier to greenhouse block, field, and regional cooperative scale.</p>
            </div>
            <div className="bg-[#103D2B] border border-[#244637] rounded-2xl p-5">
              <h4 className="text-sm font-bold text-white mb-1.5">Potential Sustainability</h4>
              <p className="text-xs text-[#A7B8AE]">Aimed at minimizing unnecessary broad-spectrum chemical sprays through targeted bio-rational IPM interventions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B251C] border-t border-[#244637] py-12 text-xs text-[#A7B8AE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#A3E635]/15 border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635] font-black text-sm">
              Φ
            </div>
            <div>
              <span className="font-bold text-white text-sm block">PhytoTrace 2.0</span>
              <span className="text-[#A3E635] font-mono text-[11px]">Intelligence in Every Leaf.</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#A7B8AE]">
            <a href="#hero" className="hover:text-white transition-colors">About</a>
            <a href="#technology" className="hover:text-white transition-colors">Technology</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Documentation</a>
            <button onClick={() => onLaunchDashboard('overview')} className="hover:text-[#A3E635] transition-colors">
              Farmer Dashboard
            </button>
          </div>

          <div className="text-center md:text-right">
            <span className="block text-white font-medium">Built for smarter agricultural monitoring.</span>
            <span className="text-[11px] text-[#73877B]">CHIP TO CROP 2026 · Presidency University · Binary Bengaluru</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
