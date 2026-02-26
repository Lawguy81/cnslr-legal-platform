import React from 'react';
import { Link } from 'react-router-dom';

const s = {
  page: { minHeight: '100vh', backgroundColor: '#0d1117', color: '#e6edf3', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', borderBottom: '1px solid #21262d', maxWidth: '1200px', margin: '0 auto' },
  logo: { fontSize: '1.5rem', fontWeight: 700, color: '#e6edf3', textDecoration: 'none', letterSpacing: '-0.5px' },
  logoAccent: { color: '#58a6ff' },
  navLinks: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  navLink: { color: '#8b949e', textDecoration: 'none', fontSize: '0.9rem' },
  hero: { textAlign: 'center', padding: '5rem 2rem 4rem', background: 'linear-gradient(180deg, #0d1117 0%, #161b22 50%, #0d1117 100%)' },
  pill: { display: 'inline-block', background: 'rgba(63, 185, 80, 0.15)', color: '#3fb950', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.5px', textTransform: 'uppercase' },
  h1: { fontSize: '3.5rem', fontWeight: 800, color: '#e6edf3', marginBottom: '1.25rem', lineHeight: 1.1, letterSpacing: '-1px' },
  h1Accent: { color: '#58a6ff' },
  sub: { fontSize: '1.3rem', color: '#8b949e', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.6 },
  ctaRow: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' },
  btnBig: { padding: '1rem 2.5rem', borderRadius: '10px', fontWeight: 700, fontSize: '1.15rem', backgroundColor: '#58a6ff', color: '#fff', textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' },
  btnGhost: { padding: '1rem 2rem', borderRadius: '10px', fontWeight: 600, fontSize: '1rem', backgroundColor: 'transparent', color: '#8b949e', textDecoration: 'none', border: '1px solid #30363d' },
  trust: { display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', marginTop: '1rem', marginBottom: '1rem' },
  trustItem: { textAlign: 'center' },
  trustNum: { fontSize: '1.5rem', fontWeight: 800, color: '#e6edf3', display: 'block' },
  trustLabel: { fontSize: '0.8rem', color: '#6e7681', textTransform: 'uppercase', letterSpacing: '0.5px' },
  divider: { height: '1px', background: 'linear-gradient(90deg, transparent, #30363d, transparent)', margin: '0' },
  section: { padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' },
  secTitle: { fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.75rem', color: '#e6edf3' },
  secSub: { textAlign: 'center', color: '#8b949e', marginBottom: '3rem', fontSize: '1.05rem' },
  steps: { display: 'flex', flexDirection: 'column', gap: '0' },
  step: { display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '1.5rem 0' },
  stepNum: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#161b22', border: '2px solid #30363d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', color: '#58a6ff', flexShrink: 0 },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: '1.15rem', fontWeight: 600, color: '#e6edf3', marginBottom: '0.35rem' },
  stepDesc: { color: '#8b949e', fontSize: '0.95rem', lineHeight: 1.5 },
  stepLine: { width: '2px', height: '24px', backgroundColor: '#21262d', marginLeft: '23px' },
  reasons: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  reason: { backgroundColor: '#161b22', border: '1px solid #21262d', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' },
  reasonIcon: { fontSize: '1.75rem', marginBottom: '0.5rem', display: 'block' },
  reasonTitle: { fontWeight: 600, color: '#e6edf3', fontSize: '0.95rem', marginBottom: '0.25rem' },
  reasonDesc: { color: '#6e7681', fontSize: '0.8rem' },
  faq: { maxWidth: '700px', margin: '0 auto' },
  faqItem: { borderBottom: '1px solid #21262d', padding: '1.25rem 0' },
  faqQ: { fontWeight: 600, color: '#e6edf3', fontSize: '1rem', marginBottom: '0.5rem' },
  faqA: { color: '#8b949e', fontSize: '0.9rem', lineHeight: 1.6 },
  finalCta: { textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)', borderTop: '1px solid #21262d' },
  finalH2: { fontSize: '2.25rem', fontWeight: 700, color: '#e6edf3', marginBottom: '1rem' },
  finalP: { color: '#8b949e', marginBottom: '2rem', fontSize: '1.1rem' },
  footer: { textAlign: 'center', padding: '2rem', borderTop: '1px solid #21262d', color: '#484f58', fontSize: '0.8rem' },
};

function HomePage() {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link to="/" style={s.logo}>CNSLR<span style={s.logoAccent}>.help</span></Link>
        <div style={s.navLinks}>
          <Link to="/login" style={s.navLink}>Sign In</Link>
          <Link to="/task/parking-ticket" style={{...s.btnBig, padding: '0.6rem 1.25rem', fontSize: '0.9rem'}}>Fight My Ticket</Link>
        </div>
      </nav>

      <header style={s.hero}>
        <div style={s.pill}>NYC Parking Tickets</div>
        <h1 style={s.h1}>Fight Your Parking Ticket<br /><span style={s.h1Accent}>In Under 10 Minutes</span></h1>
        <p style={s.sub}>Answer a few simple questions. We generate your appeal, file it with NYC, and track it to resolution. No lawyer needed.</p>
        <div style={s.ctaRow}>
          <Link to="/task/parking-ticket" style={s.btnBig}>Start My Appeal - Free</Link>
          <a href="#how-it-works" style={s.btnGhost}>See How It Works</a>
        </div>
        <div style={s.trust}>
          <div style={s.trustItem}><span style={s.trustNum}>10 min</span><span style={s.trustLabel}>Average time</span></div>
          <div style={s.trustItem}><span style={s.trustNum}>$0</span><span style={s.trustLabel}>Cost to you</span></div>
          <div style={s.trustItem}><span style={s.trustNum}>NYC DOF</span><span style={s.trustLabel}>Direct filing</span></div>
        </div>
      </header>

      <div style={s.divider} />

      <section id="how-it-works" style={s.section}>
        <h2 style={s.secTitle}>How It Works</h2>
        <p style={s.secSub}>Like TurboTax, but for parking tickets. Four simple steps.</p>
        <div style={s.steps}>
          <div style={s.step}>
            <div style={s.stepNum}>1</div>
            <div style={s.stepContent}>
              <div style={s.stepTitle}>Enter Your Ticket Details</div>
              <div style={s.stepDesc}>Ticket number, violation date, and license plate. Takes 30 seconds.</div>
            </div>
          </div>
          <div style={s.stepLine} />
          <div style={s.step}>
            <div style={s.stepNum}>2</div>
            <div style={s.stepContent}>
              <div style={s.stepTitle}>Pick Your Defense</div>
              <div style={s.stepDesc}>Choose why you're contesting: broken meter, missing sign, wrong plate, not the driver, or other.</div>
            </div>
          </div>
          <div style={s.stepLine} />
          <div style={s.step}>
            <div style={s.stepNum}>3</div>
            <div style={s.stepContent}>
              <div style={s.stepTitle}>We Generate Your Appeal</div>
              <div style={s.stepDesc}>Your answers become a formal appeal letter, formatted and ready for NYC Department of Finance.</div>
            </div>
          </div>
          <div style={s.stepLine} />
          <div style={s.step}>
            <div style={s.stepNum}>4</div>
            <div style={s.stepContent}>
              <div style={s.stepTitle}>Submit and Track</div>
              <div style={s.stepDesc}>We file directly with NYC DOF and give you a confirmation number. Track your status in real time.</div>
            </div>
          </div>
        </div>
      </section>

      <div style={s.divider} />

      <section style={s.section}>
        <h2 style={s.secTitle}>Common Defenses That Win</h2>
        <p style={s.secSub}>Select your situation and we handle the legal language.</p>
        <div style={s.reasons}>
          <div style={s.reason}><span style={s.reasonIcon}>🚫</span><div style={s.reasonTitle}>Not the Driver</div><div style={s.reasonDesc}>Someone else was driving your car</div></div>
          <div style={s.reason}><span style={s.reasonIcon}>🅿️</span><div style={s.reasonTitle}>Broken Meter</div><div style={s.reasonDesc}>The parking meter was malfunctioning</div></div>
          <div style={s.reason}><span style={s.reasonIcon}>🪧</span><div style={s.reasonTitle}>Missing Sign</div><div style={s.reasonDesc}>No visible sign or confusing signage</div></div>
          <div style={s.reason}><span style={s.reasonIcon}>🔢</span><div style={s.reasonTitle}>Wrong Plate</div><div style={s.reasonDesc}>Ticket has incorrect plate number</div></div>
          <div style={s.reason}><span style={s.reasonIcon}>🚨</span><div style={s.reasonTitle}>Stolen Vehicle</div><div style={s.reasonDesc}>Car was stolen at time of violation</div></div>
          <div style={s.reason}><span style={s.reasonIcon}>📝</span><div style={s.reasonTitle}>Other Defense</div><div style={s.reasonDesc}>Describe your own circumstances</div></div>
        </div>
      </section>

      <div style={s.divider} />

      <section style={s.section}>
        <h2 style={s.secTitle}>Frequently Asked</h2>
        <div style={s.faq}>
          <div style={s.faqItem}><div style={s.faqQ}>Is this really free?</div><div style={s.faqA}>Yes. CNSLR generates and submits your parking ticket appeal at no cost. We believe everyone deserves access to due process.</div></div>
          <div style={s.faqItem}><div style={s.faqQ}>How long does the appeal take?</div><div style={s.faqA}>Filing takes under 10 minutes. NYC Department of Finance typically reviews appeals within 30-45 days.</div></div>
          <div style={s.faqItem}><div style={s.faqQ}>What if my appeal is denied?</div><div style={s.faqA}>You have the right to request an in-person hearing within 10 days of a denial. We provide guidance on next steps.</div></div>
          <div style={s.faqItem}><div style={s.faqQ}>Do I need a lawyer?</div><div style={s.faqA}>No. Parking ticket appeals are designed to be handled by individuals. We structure your arguments using the same defense codes that attorneys use.</div></div>
        </div>
      </section>

      <div style={s.finalCta}>
        <h2 style={s.finalH2}>Ready to fight your ticket?</h2>
        <p style={s.finalP}>Takes less time than finding street parking.</p>
        <Link to="/task/parking-ticket" style={s.btnBig}>Start My Free Appeal</Link>
      </div>

      <footer style={s.footer}>CNSLR.help - Not a law firm. Not legal advice. A tool to help you exercise your right to dispute.</footer>
    </div>
  );
}

export default HomePage;
