import FadeIn from '../components/FadeIn';

const REPOS = [
  ['CyberNest', 'Unified security operations project', 'https://github.com/abhiiibabariya-dev/CyberNest'],
  ['threat-intelligence-blueteam', 'Blue-team threat intelligence and detection content', 'https://github.com/abhiiibabariya-dev/threat-intelligence-blueteam'],
  ['soc-automation-toolkit', 'Practical SOC automation utilities', 'https://github.com/abhiiibabariya-dev/soc-automation-toolkit'],
  ['phishing-analyzer', 'Phishing investigation automation', 'https://github.com/abhiiibabariya-dev/phishing-analyzer'],
  ['ioc-scanner', 'IOC extraction and enrichment', 'https://github.com/abhiiibabariya-dev/ioc-scanner'],
  ['sigma-rule-converter', 'Detection engineering utility', 'https://github.com/abhiiibabariya-dev/sigma-rule-converter'],
  ['crowdstrike-poc', 'CrowdStrike Falcon POC', 'https://github.com/abhiiibabariya-dev/crowdstrike-poc'],
  ['cyberjobs-dashboard', 'Cybersecurity job dashboard', 'https://github.com/abhiiibabariya-dev/cyberjobs-dashboard'],
];

export default function GitHubSection() {
  return (
    <section id="github" className="px-5 sm:px-8 md:px-10 py-20 md:py-28" style={{ backgroundColor:'#050505' }}>
      <FadeIn delay={0} y={40}>
        <p className="uppercase tracking-[0.4em] text-xs md:text-sm text-center mb-5" style={{ color:'#00FF41', opacity:.8 }}>Open Source · GitHub</p>
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-14 md:mb-20" style={{fontSize:'clamp(3rem,12vw,160px)'}}>Build History</h2>
      </FadeIn>
      <div className="max-w-6xl mx-auto border-y border-[#D7E2EA]/15">
        {REPOS.map(([name, desc, href], i) => (
          <FadeIn key={name} delay={i*.035} y={20}>
            <a href={href} target="_blank" rel="noreferrer" className="group grid md:grid-cols-[90px_1fr_auto] items-center gap-4 md:gap-8 py-6 md:py-8 border-b border-[#D7E2EA]/10 hover:bg-[#00FF41]/5 transition-colors duration-200 px-2">
              <span className="hero-heading font-black" style={{fontSize:'clamp(2rem,4vw,3.5rem)'}}>{String(i+1).padStart(2,'0')}</span>
              <div><h3 className="font-medium uppercase" style={{color:'#D7E2EA',fontSize:'clamp(1rem,2vw,1.6rem)'}}>{name}</h3><p className="font-light mt-1" style={{color:'#D7E2EA',opacity:.52}}>{desc}</p></div>
              <span className="uppercase tracking-widest text-[0.65rem]" style={{color:'#00FF41',opacity:.8}}>View ↗</span>
            </a>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
