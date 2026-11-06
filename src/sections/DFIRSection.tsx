import React, { useState } from 'react';
import { HardDrive, Cpu, Smartphone, Cloud, FileSearch, Shield, Lock, Terminal } from 'lucide-react';

export const DFIRSection: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState<number>(0);

  const domains = [
    {
      id: '01',
      title: 'Disk & Filesystem Forensics',
      icon: <HardDrive size={20} className="text-[#00ff88]" />,
      short: 'FTK Imager · Autopsy · $MFT',
      summary: 'Bit-by-bit bitstream imaging, deleted partition reconstruction, and deep filesystem artifact parsing.',
      tools: ['FTK Imager', 'Autopsy', 'X-Ways', 'Eric Zimmerman Tools (MFTECmd, PECmd)', 'KAPE'],
      artifacts: [
        '$MFT (Master File Table) record parsing for 0x10 and 0x30 timestamp timestomping detection',
        'Windows Prefetch (.pf) analysis to prove program execution and execution count',
        'ShimCache (AppCompatCache) and Amcache.hve examination for execution evidence',
        'Volume Shadow Copy (VSS) differential triage to recover historical file states'
      ],
      methodology: 'NIST SP 800-86 compliant acquisition → E01 / RAW cryptographic hashing → write-blocked analysis.'
    },
    {
      id: '02',
      title: 'Memory & Volatile Triage',
      icon: <Cpu size={20} className="text-[#38bdf8]" />,
      short: 'Volatility 3 · MemProcFS · Live Triage',
      summary: 'Volatile RAM acquisition, process injection detection, unlinked DLL extraction, and rootkit discovery.',
      tools: ['Volatility 3 Framework', 'MemProcFS', 'WinPmem / LiME', 'DumpIt', 'Process Hacker'],
      artifacts: [
        'VAD (Virtual Address Descriptor) tree inspection for PAGE_EXECUTE_READWRITE memory anomalies',
        'malfind plugin execution to detect reflective DLL injection and shellcode stubs',
        'Network socket table reconstruction (`netscan`) linking PIDs to active C2 connections',
        'Kernel object hooking detection (SSDT, IDT, and IRP major function modifications)'
      ],
      methodology: 'Zero-touch live acquisition → RAM image verification → Volatility symbol table binding.'
    },
    {
      id: '03',
      title: 'Mobile Forensics & Extraction',
      icon: <Smartphone size={20} className="text-amber-400" />,
      short: 'ADB · SQLite Forensics · Logical Dumps',
      summary: 'Physical and logical extraction of mobile devices, database decoders, and geolocation artifact correlation.',
      tools: ['Android Debug Bridge (ADB)', 'Autopsy Mobile Parser', 'DB Browser for SQLite', 'ALEAPP', 'iLEAPP'],
      artifacts: [
        'SQLite Write-Ahead Log (WAL) carving to restore deleted SMS and instant messenger chats',
        'FusedLocationProvider cache tables correlated with camera EXIF GPS tags',
        'Application sandbox extraction and APK reverse engineering for malicious logic',
        'Wi-Fi probe request logs to establish physical vicinity timeline at incident origin'
      ],
      methodology: 'Faraday isolation → device passkey bypass / logical extraction → forensic reporting.'
    },
    {
      id: '04',
      title: 'Cloud & SaaS Investigation',
      icon: <Cloud size={20} className="text-purple-400" />,
      short: 'Azure Log Analytics · KQL · Cloud Sync',
      summary: 'Multi-cloud audit log correlation, SaaS sync cache analysis, and identity token abuse hunting.',
      tools: ['Azure Monitor & KQL', 'Microsoft Defender for Cloud', 'AWS CloudTrail', 'Google Workspace Audit', 'CrowdStrike Falcon Cloud'],
      artifacts: [
        'Azure SigninLogs conditional access evaluation and impossible travel velocity analysis',
        'Cloud storage synchronization cache forensics (Google Drive, iCloud, Dropbox, OneDrive)',
        'OAuth application grant permissions and illicit consent grant attack tracking',
        'Privileged Identity Management (PIM) role activation timeline verification'
      ],
      methodology: 'API-driven audit harvesting → multi-source timestamp normalisation → cloud threat matrix mapping.'
    }
  ];

  const current = domains[activeDomain];

  return (
    <section id="dfir" className="py-20 bg-[#040705] text-zinc-100 border-b border-[#1c1c1c] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 font-mono text-xs text-[#00ff88] mb-3">
              <FileSearch size={13} />
              <span>DIGITAL FORENSICS & INCIDENT RESPONSE CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans uppercase">
              DFIR LABORATORY
            </h2>
            <p className="text-sm font-mono text-zinc-400 mt-2 max-w-2xl">
              Specialized methodologies honed through Master of Science research at National Forensic Sciences University (NFSU) and enterprise banking casework.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
            <Shield size={14} className="text-[#00ff88]" />
            <span>CHAIN OF CUSTODY ASSURED</span>
          </div>
        </div>

        {/* Domain Navigation Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {domains.map((dom, idx) => {
            const isActive = activeDomain === idx;
            return (
              <button
                key={dom.id}
                onClick={() => setActiveDomain(idx)}
                className={`p-4 rounded-xl border text-left font-mono transition-all flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[#00ff88]/15 border-[#00ff88] text-white shadow-[0_0_20px_rgba(0,255,136,0.15)]'
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    {dom.icon}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold">DOMAIN {dom.id}</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold font-sans text-white leading-tight">{dom.title}</h3>
                  <p className="text-[10px] text-zinc-400 mt-1 font-mono">{dom.short}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Domain Laboratory Breakdown */}
        <div className="bg-[#080d0b] border border-[#00ff88]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,255,136,0.06)] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Column 1: Overview & Methodology */}
            <div className="space-y-5">
              <div>
                <div className="font-mono text-[10px] text-[#00ff88] uppercase tracking-wider font-bold">
                  DOMAIN {current.id} // FORENSIC SCOPE
                </div>
                <h3 className="text-2xl font-bold text-white mt-1 font-sans">
                  {current.title}
                </h3>
                <p className="text-xs text-zinc-300 font-sans mt-3 leading-relaxed">
                  {current.summary}
                </p>
              </div>

              <div className="p-4 bg-zinc-950/90 border border-zinc-800 rounded-xl space-y-2 font-mono text-xs">
                <div className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Lock size={12} className="text-[#00ff88]" /> Evidentiary Standard:
                </div>
                <p className="text-zinc-300 text-[11px] font-sans leading-relaxed">
                  {current.methodology}
                </p>
              </div>

              <div>
                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                  Specialized Tooling Suite:
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {current.tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2 & 3: Forensic Artifacts & Inspection Engine */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1c2a23] font-mono text-xs">
                <span className="text-[#00ff88] font-bold tracking-wider flex items-center gap-2">
                  <Terminal size={14} /> FORENSIC ARTIFACTS & EVIDENCE ANCHORS
                </span>
                <span className="text-zinc-500 text-[10px]">4 VERIFIED ANCHORS</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {current.artifacts.map((art, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#040806] border border-[#14231b] hover:border-[#00ff88]/40 rounded-xl transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[#00ff88] text-[11px] font-bold">
                      <span>ARTIFACT 0{idx + 1}</span>
                      <span className="text-zinc-500 font-normal text-[10px]">SHA-256 ATTESTED</span>
                    </div>
                    <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                      {art}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
export default DFIRSection;
