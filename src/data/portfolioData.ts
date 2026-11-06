export interface ProjectCaseStudy {
  id: string;
  slug: string;
  caseNumber: string;
  category: string;
  title: string;
  tagline: string;
  badge: string;
  classification: 'LAB PROJECT' | 'RESEARCH PROJECT' | 'POC';
  status: 'CLOSED' | 'OPERATIONAL' | 'VALIDATED' | 'DOCUMENTED';
  duration: string;
  role: string;
  verdict: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFORMATIONAL';
  mitreTechniques: string[];
  tags: string[];
  overview: string;
  problem: string[];
  architectureDiagram?: string;
  phases: {
    num: string;
    title: string;
    points: string[];
    kqlQuery?: string;
  }[];
  iocs?: {
    type: string;
    value: string;
    status: string;
  }[];
  outcomes: {
    k: string;
    v: string;
  }[];
  learnings: string[];
  repoUrl?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  category: 'SIEM & Cloud' | 'DFIR & Forensics' | 'Security Essentials' | 'Standards & Governance';
  skills: string[];
  verificationUrl?: string;
  badgeColor: string;
}

export interface ExperienceItem {
  period: string;
  status: 'CURRENT' | 'PREVIOUS';
  role: string;
  company: string;
  location: string;
  department: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface SkillCategory {
  title: string;
  code: string;
  skills: { name: string; level: number; tag?: string }[];
}

export const PROFILE = {
  name: "Abhishek Babariya",
  handle: "ABHI_SEC",
  role: "Cybersecurity Analyst & DFIR Specialist",
  currentRole: "Deputy Manager 2 · DFIR & Risk Analyst",
  currentOrg: "ICICI Bank",
  location: "Surat / Mumbai, India",
  email: "abhibabariya007@gmail.com",
  phone: "+91 7096293699",
  linkedin: "https://www.linkedin.com/in/babariya-abhishek-0085691b4/",
  github: "https://github.com/abhiiibabariya-dev",
  resumeUrl: "/portfolio/resume/resume.pdf",
  status: "DFIR · INCIDENT RESPONSE · SECURITY OPERATIONS",
  stats: [
    { value: "100+", label: "Daily Alerts Triaged", sub: "CrowdStrike & Sysmon" },
    { value: "80%", label: "Triage Time Reduced", sub: "SOAR & Wazuh Lab" },
    { value: "9.00", label: "M.Sc. CGPA", sub: "NFSU Digital Forensics" },
    { value: "100%", label: "MITRE ATT&CK Mapped", sub: "Production Rules" },
  ]
};

export const CASE_STUDIES: ProjectCaseStudy[] = [
  {
    id: "01",
    slug: "apt-investigation",
    caseNumber: "CASE-001",
    category: "Cloud Forensics & Threat Intel",
    classification: "RESEARCH PROJECT",
    status: "DOCUMENTED",
    title: "Threat-Intel Alert Investigation Exercise",
    tagline: "A research exercise that evaluates a suspicious cloud-network alert through endpoint telemetry, KQL correlation, and threat-intelligence enrichment.",
    badge: "RESEARCH CASE STUDY",
    duration: "72-Hour Exercise",
    role: "Forensic Investigation Researcher",
    verdict: "Documented Investigation Outcome",
    severity: "CRITICAL",
    mitreTechniques: ["T1071.001 (Web Protocols)", "T1573 (Encrypted Channel)", "T1059.001 (PowerShell)", "T1041 (Exfiltration)"],
    tags: ["Azure Defender for Cloud", "Azure Log Analytics", "KQL", "SentinelOne", "MDE", "Threat Intel"],
    overview:
      "A research investigation exercise modeled the review of a suspicious outbound cloud connection. The documented methodology correlates endpoint telemetry, KQL queries, network evidence, and threat-intelligence enrichment to demonstrate a structured, defensible approach to alert validation.",
    problem: [
      "High-severity alert: outbound TLS connection to IP historically associated with Lazarus-cluster infrastructure.",
      "No corroborating EDR detection at initial triage — required deep multi-source correlation across cloud logs and endpoint memory.",
      "Regulated enterprise production workload — every investigative step required legal-grade chain-of-custody documentation."
    ],
    phases: [
      {
        num: "01",
        title: "Scoping, Containment & Preservation",
        points: [
          "Isolated the affected VM at the Azure NSG level while preserving live memory and volatile process states.",
          "Captured OS disk snapshots and harvested volatile artifacts (netstat, running tasklist, prefetch, event logs).",
          "Established forensic chain-of-custody log and generated cryptographic SHA-256 hashes for all captured images."
        ]
      },
      {
        num: "02",
        title: "Endpoint Forensics (MDE & SentinelOne)",
        points: [
          "Reconstructed process execution lineage in MDE Advanced Hunting around the outbound TLS connection timestamp.",
          "Traced parent-child process tree: found parent was a cryptographically signed enterprise telemetry daemon.",
          "Cross-verified SentinelOne DeepVisibility telemetry for identical PID, network socket, and file handle tuples."
        ],
        kqlQuery: `DeviceNetworkEvents
| where TimeGenerated >= datetime(2025-03-01) and TimeGenerated <= datetime(2025-03-03)
| where RemoteIP == "175.45.176.0/24" or ActionType == "ConnectionSuccess"
| project TimeGenerated, DeviceName, InitiatingProcessFileName, InitiatingProcessCommandLine, RemoteIP, RemotePort, RemoteUrl
| sort by TimeGenerated desc`
      },
      {
        num: "03",
        title: "Cloud Log Analytics — ~900K Events Analyzed via KQL",
        points: [
          "Queried SecurityEvent, DeviceNetworkEvents, and Azure SigninLogs over a comprehensive 14-day observation window.",
          "Correlated Windows Event IDs 4624 (Logon), 4672 (Admin Rights), and 4688 (Process Creation) with NSG flow logs.",
          "Executed time-delta variance analysis to detect regular beaconing jitter windows or C2 heartbeat loops."
        ],
        kqlQuery: `SecurityEvent
| where TimeGenerated > ago(14d)
| where EventID in (4624, 4672, 4688)
| summarize EventCount=count(), DistinctUsers=dcount(TargetAccount) by bin(TimeGenerated, 1h), Activity
| render timechart`
      },
      {
        num: "04",
        title: "Threat Intelligence & Infrastructure Enrichment",
        points: [
          "Pivoted on destination IP across VirusTotal, AbuseIPDB, Shodan, and internal threat intelligence platforms.",
          "Analyzed passive DNS historical records and WHOIS allocations: proved IP was reassigned to a legitimate multi-tenant CDN edge.",
          "Mapped all telemetry against MITRE ATT&CK T1071.001 to rigorously evaluate the state-sponsored adversary hypothesis."
        ]
      },
      {
        num: "05",
        title: "Defensible Verdict & Tiered Remediation Roadmap",
        points: [
          "Proved traffic was legitimate telemetry routed through recycled cloud edge nodes — no lateral movement, no unauthorized execution.",
          "Formally closed incident as True Positive (alert triggered on valid rule logic) / No Compromise (no breach).",
          "Delivered enterprise remediation: tuned Azure alert sensitivity, deployed proactive KQL hunting queries, and tightened NSG egress controls."
        ]
      }
    ],
    iocs: [
      { type: "IP Address", value: "175.45.176.23", status: "Reassigned CDN / Monitored" },
      { type: "Process", value: "EnterpriseTelemetryService.exe", status: "Verified Signed Binary" },
      { type: "SHA-256", value: "8f4a21b3e9047c5d...e2a9", status: "Match Known Good" }
    ],
    outcomes: [
      { k: "72h", v: "Time to Defensible Verdict" },
      { k: "~17K", v: "Defender Events Triaged" },
      { k: "~900K", v: "Events Queried via KQL" },
      { k: "0", v: "Adversary Dwell Time" }
    ],
    learnings: [
      "Reputation indicators are initial pointers, not conclusive evidence — shared cloud CDN edges frequently inherit legacy threat flags.",
      "Pre-authored KQL beacon-jitter detection templates reduce investigation triage time from 8 hours to under 30 minutes.",
      "A structured 5-phase forensic methodology provides airtight evidence defense for executive stakeholders and regulatory auditors."
    ],
    repoUrl: "https://github.com/abhiiibabariya-dev"
  },
  {
    id: "02",
    slug: "soc-automation",
    caseNumber: "CASE-002",
    category: "SIEM · SOAR · Automation",
    classification: "LAB PROJECT",
    status: "OPERATIONAL",
    title: "SOC Automation Lab — Wazuh + TheHive + Shuffle",
    tagline: "Lab-built SOC automation pipeline using playbook-driven enrichment and orchestration to evaluate triage workflow improvements.",
    badge: "LAB AUTOMATION PIPELINE",
    duration: "6 Weeks",
    role: "SOC Automation Engineer",
    verdict: "Lab Environment Operational",
    severity: "HIGH",
    mitreTechniques: ["T1059 (Command Execution)", "T1078 (Valid Accounts)", "T1110 (Brute Force)", "T1053 (Scheduled Task)"],
    tags: ["Wazuh", "TheHive", "Cortex", "Shuffle SOAR", "VirusTotal API", "AbuseIPDB", "MITRE ATT&CK"],
    overview:
      "Designed and deployed an integrated lab SOC environment: Wazuh for log ingestion and detection-rule evaluation, TheHive for case management, and Shuffle for workflow orchestration. The lab demonstrates automated enrichment, prioritized case creation, and human-reviewed containment playbooks.",
    problem: [
      "SOC analysts spent over 70% of shifts performing repetitive manual enrichment (IP lookups, hash checks, geo-resolution).",
      "Siloed tools created disjointed context and prolonged mean-time-to-respond (MTTR) during concurrent active alerts.",
      "Lack of standardized incident response templates led to inconsistent documentation during alert handoffs."
    ],
    phases: [
      {
        num: "01",
        title: "SIEM & Ingestion Architecture",
        points: [
          "Deployed Wazuh manager, clustered indexers, and dashboards on hardened Linux infrastructure.",
          "Configured multi-OS agent ingestion across Windows endpoints, Linux servers, Sysmon feeds, and Suricata NIDS via rsyslog.",
          "Implemented index lifecycle management (ILM) with hot, warm, and cold tiers aligned with compliance retention policies."
        ]
      },
      {
        num: "02",
        title: "Detection Engineering & Rule Authoring",
        points: [
          "Authored 12+ custom Wazuh detection rules targeting PowerShell obfuscation, WMI execution, and scheduled-task persistence.",
          "Mapped every detection rule to specific MITRE ATT&CK techniques for heat-map coverage analytics.",
          "Tuned alert thresholds and applied whitelisting logic to suppress baseline administrative noise."
        ]
      },
      {
        num: "03",
        title: "TheHive & Cortex Case Orchestration",
        points: [
          "Integrated Wazuh webhook pipelines to automatically spawn formatted cases in TheHive for severity >= 7 alerts.",
          "Connected Cortex automated analyzers (VirusTotal, AbuseIPDB, Shodan) to enrich observables synchronously upon ingestion.",
          "Created incident templates mapped directly to the NIST / PICERL incident response lifecycle."
        ]
      },
      {
        num: "04",
        title: "Shuffle SOAR Automated Playbooks",
        points: [
          "Developed end-to-end automated playbooks for phishing triage, brute-force mitigation, and malware host containment.",
          "Configured Slack bot webhooks to broadcast high-priority alerts with one-click analyst approval triggers.",
          "Embedded interactive human-in-the-loop validation checkpoints before executing high-impact host isolation."
        ]
      },
      {
        num: "05",
        title: "Adversary Simulation & Metrics Validation",
        points: [
          "Executed Atomic Red Team test scenarios (T1059.001, T1110.001, T1053.005) to benchmark detection and response latency.",
          "Measured mean-time-to-triage (MTTT) before and after deployment, verifying an 80% reduction in analyst triage time.",
          "Published technical documentation, analyst standard operating procedures, and playbook runbooks."
        ]
      }
    ],
    outcomes: [
      { k: "80%", v: "Manual Triage Time Reduced" },
      { k: "12", v: "Custom Detection Rules Authored" },
      { k: "4", v: "Automated SOAR Playbooks" },
      { k: "100%", v: "Rules Mapped to ATT&CK" }
    ],
    learnings: [
      "Enrichment on ingestion (not on-demand) is the single highest leverage point for SOC operational velocity.",
      "Modular SOAR building blocks allow subsequent playbooks to be developed 3x faster by reusing tested connectors.",
      "Human-in-the-loop gates in automated containment prevent accidental production outages from false positives."
    ],
    repoUrl: "https://github.com/abhiiibabariya-dev/soc-automation-toolkit"
  },
  {
    id: "03",
    slug: "detection-engineering",
    caseNumber: "CASE-003",
    category: "Detection Engineering",
    classification: "LAB PROJECT",
    status: "VALIDATED",
    title: "CyberGuard — Behavioral Threat Detection System",
    tagline: "Detection logic for simulated PowerShell obfuscation, WMI abuse, and LSASS credential-access behavior.",
    badge: "LAB-VALIDATED DETECTIONS",
    duration: "4 Weeks",
    role: "Detection Engineer",
    verdict: "Validated Against Lab Scenarios",
    severity: "HIGH",
    mitreTechniques: ["T1059.001 (PowerShell)", "T1047 (WMI)", "T1003.001 (LSASS Memory)", "T1027 (Obfuscation)"],
    tags: ["Detection Rules", "Behavioral Analytics", "YARA", "VirusTotal", "ANY.RUN", "Sysmon", "PowerShell"],
    overview:
      "Engineered an advanced detection library specifically targeting Living-off-the-Land Binaries and Scripts (LOLBAS) that bypass traditional antivirus. Detections combine regex over command-line telemetry with parent-child process behavioral chains to detect encoded PowerShell, WMI persistence, scheduled-task abuse, and unauthorized LSASS memory dumps.",
    problem: [
      "Modern adversaries execute malware in-memory using signed system binaries (certutil, powershell, wmic), leaving static signatures blind.",
      "High false-positive noise in standard out-of-the-box SIEM rules degrades analyst confidence.",
      "Lack of deterministic test validation caused silent rule degradation as system baselines evolved."
    ],
    phases: [
      {
        num: "01",
        title: "Telemetry Requirement Modeling",
        points: [
          "Selected 8 critical ATT&CK sub-techniques with high real-world dwell time and low native signature coverage.",
          "Identified prerequisite log telemetry: Sysmon Event ID 1 (Process Create), 7 (Image Load), 10 (ProcessAccess), and Windows Event ID 4688.",
          "Standardized telemetry schema across endpoints for consistent rule syntax."
        ]
      },
      {
        num: "02",
        title: "Signature & Behavioral Logic Development",
        points: [
          "Created regex detection signatures for obfuscated PowerShell: base64 chunks, `-EncodedCommand`, XOR char manipulation, and IEX wrappers.",
          "Engineered behavioral detection for WMI anomalies: `wmic.exe` and `WmiPrvSE.exe` spawning cmd/powershell or remote network connections.",
          "Built high-fidelity detections for LSASS process memory handles requested by unsigned binaries (Sysmon Event ID 10)."
        ]
      },
      {
        num: "03",
        title: "Contextual Enrichment & Dynamic Sandbox Integration",
        points: [
          "Configured automatic file-hash pivoting against VirusTotal API and sample submission to ANY.RUN interactive sandbox.",
          "Appended process execution ancestor lineage directly to alert payloads to eliminate analyst query pivots.",
          "Attached static ATT&CK tactic/technique metadata and remediation guidance to every rule."
        ]
      },
      {
        num: "04",
        title: "Adversary Emulation & False-Positive Tuning",
        points: [
          "Tested rules against simulated attacks using Atomic Red Team, PowerShell Empire, and custom obfuscation harnesses.",
          "Tuned detections against a 7-day clean enterprise baseline dataset, achieving < 2% false-positive rate.",
          "Established automated regression testing pipelines: every rule is validated by a repeatable execution script."
        ]
      }
    ],
    outcomes: [
      { k: "8", v: "ATT&CK Sub-Techniques Covered" },
      { k: "0", v: "Missed Emulation Detections" },
      { k: "< 2%", v: "Baseline False-Positive Rate" },
      { k: "100%", v: "Rules with Validation Scripts" }
    ],
    learnings: [
      "Multi-dimensional behavioral correlation (Parent + Child + Arguments + User Context) dramatically outperforms single-field regex.",
      "A detection rule without a repeatable validation test is technical debt waiting to fail silently.",
      "Embedding full parent process lineage inside alert notifications eliminates up to 80% of analyst pivot overhead."
    ],
    repoUrl: "https://github.com/abhiiibabariya-dev/CyberNest"
  },
  {
    id: "04",
    slug: "mobile-cloud-forensics",
    caseNumber: "CASE-004",
    category: "Digital Forensics · DFIR",
    classification: "RESEARCH PROJECT",
    status: "DOCUMENTED",
    title: "Mobile & Cloud Forensic Evidence Reconstruction",
    tagline: "Research project exploring mobile acquisition, cloud-sync reconstruction, and SHA-256 evidence-integrity documentation.",
    badge: "FORENSIC RESEARCH PROJECT",
    duration: "3 Weeks",
    role: "Forensic Researcher",
    verdict: "Documented Evidence Workflow",
    severity: "MEDIUM",
    mitreTechniques: ["T1005 (Data from Local System)", "T1530 (Data from Cloud Storage)", "T1070 (Indicator Removal)"],
    tags: ["Autopsy", "FTK Imager", "ADB", "Google Drive", "iCloud", "Dropbox", "OneDrive", "SQLite Forensics"],
    overview:
      "Conducted a comprehensive multi-source digital forensics investigation combining physical and logical mobile acquisition with cloud storage synchronization analysis across Google Drive, iCloud, Dropbox, and OneDrive. Delivered a courtroom-ready forensic investigation report including bit-level disk image verification, recovered unallocated space artifacts, and unbroken chain-of-custody documentation.",
    problem: [
      "Cross-platform evidence: critical artifact fragments were dispersed across physical device storage and 4 distinct cloud sync caches.",
      "Deleted data: suspect performed deliberate deletion of communication records and location histories prior to device seizure.",
      "Legal evidentiary standard: rigorous chain-of-custody logging and cryptographic verification required for court admissibility."
    ],
    phases: [
      {
        num: "01",
        title: "Forensic Acquisition & Cryptographic Hashing",
        points: [
          "Secured suspect mobile device in RF-shielded Faraday enclosure to prevent remote wipe commands.",
          "Performed physical bit-by-bit bitstream acquisition and logical extraction utilizing FTK Imager and ADB tools.",
          "Calculated and logged SHA-256 cryptographic hashes before acquisition, post-transfer, and during examination."
        ]
      },
      {
        num: "02",
        title: "Device Artifact Parsing & Deleted Data Recovery",
        points: [
          "Parsed device SQLite databases in Autopsy to recover deleted SMS, MMS, WhatsApp message fragments, and call logs.",
          "Carved unallocated flash storage blocks and SQLite freelists to restore deleted photographs and PDF documents.",
          "Correlated GPS location cache tables with image EXIF timestamps to construct an interactive geographic movement timeline."
        ]
      },
      {
        num: "03",
        title: "Multi-Provider Cloud Synchronization Analysis",
        points: [
          "Analyzed sync client databases and local cache folders for Google Drive, iCloud, Dropbox, and OneDrive.",
          "Cross-referenced cloud metadata revision timestamps with local filesystem MFT markers to establish file origins.",
          "Identified unauthorized data exfiltration staging directories and recovered previously shared cloud links."
        ]
      },
      {
        num: "04",
        title: "Legal-Grade Reporting & Evidentiary Packaging",
        points: [
          "Compiled a formal forensic report containing executive summary, technical methodology, artifact catalogs, and conclusions.",
          "Maintained an unbroken chain-of-custody log recording evidence custody, environmental storage, and examiner access.",
          "Created a reproducibility appendix documenting software versions, hardware parameters, and exact command parameters."
        ]
      }
    ],
    outcomes: [
      { k: "100%", v: "Chain of Custody Preserved" },
      { k: "4", v: "Cloud Storage Systems Mapped" },
      { k: "SHA-256", v: "Cryptographic Verification at All Stages" },
      { k: "Court-Ready", v: "Admissibility Standard Achieved" }
    ],
    learnings: [
      "Triple cryptographic hashing (at acquisition, transfer, and analysis) is mandatory for defensible courtroom evidence.",
      "Cloud sync metadata markers provide indispensable timeline anchors when local filesystem timestamps have been manipulated.",
      "SQLite database WAL (Write-Ahead Log) files frequently retain deleted data long after database compaction."
    ],
    repoUrl: "https://github.com/abhiiibabariya-dev"
  }
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: "CERT-01",
    name: "Cybersecurity Essentials",
    issuer: "Cisco Networking Academy",
    issueDate: "2024",
    credentialId: "CSCO-ESS-98214",
    category: "Security Essentials",
    skills: ["Network Security", "Threat Vectors", "Security Controls", "Cryptography Basics", "Defense-in-Depth"],
    badgeColor: "#00ff88"
  },
  {
    id: "CERT-02",
    name: "ISO/IEC 27001 Information Security Associate",
    issuer: "SkillFront",
    issueDate: "2024",
    credentialId: "SF-ISO27001-44912",
    category: "Standards & Governance",
    skills: ["ISMS Implementation", "Risk Assessment", "Security Controls", "Compliance Auditing", "ISO/IEC 27001"],
    badgeColor: "#38bdf8"
  },
  {
    id: "CERT-03",
    name: "Ethical Hacking Essentials (EHE)",
    issuer: "EC-Council CodeRed",
    issueDate: "2024",
    credentialId: "ECC-EHE-81042",
    category: "DFIR & Forensics",
    skills: ["Vulnerability Assessment", "Penetration Testing Basics", "Port Scanning", "Network Sniffing", "Exploit Analysis"],
    badgeColor: "#f59e0b"
  },
  {
    id: "CERT-04",
    name: "Digital Forensics Essentials (DFE)",
    issuer: "EC-Council CodeRed",
    issueDate: "2024",
    credentialId: "ECC-DFE-81043",
    category: "DFIR & Forensics",
    skills: ["Evidence Acquisition", "Chain of Custody", "Disk Imaging", "Artifact Extraction", "Forensic Reporting"],
    badgeColor: "#ec4899"
  },
  {
    id: "CERT-05",
    name: "Certified Cyber Security Analyst (C3SA)",
    issuer: "CyberWarFare Labs",
    issueDate: "2024",
    credentialId: "CWL-C3SA-1092",
    category: "SIEM & Cloud",
    skills: ["SOC Operations", "Threat Hunting", "Log Analysis", "MITRE ATT&CK", "Incident Triage"],
    badgeColor: "#a855f7"
  },
  {
    id: "CERT-06",
    name: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    issueDate: "2023",
    credentialId: "CSCO-INTRO-77123",
    category: "Security Essentials",
    skills: ["Cyber Threats", "Confidentiality & Integrity", "Privacy Protection", "Organizational Defense"],
    badgeColor: "#10b981"
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    period: "2025 – Present",
    status: "CURRENT",
    role: "Deputy Manager 2",
    company: "ICICI Bank",
    location: "Mumbai / Surat, India",
    department: "Information Security Group · DFIR & Risk",
    summary: "Leading digital forensics investigations, incident response protocols, and security risk analysis across enterprise banking infrastructure.",
    highlights: [
      "Drive digital forensics examinations and evidence acquisition across enterprise banking servers and endpoints.",
      "Conduct in-depth root-cause analysis (RCA) on high-severity security incidents, establishing timeline and attack vectors.",
      "Evaluate emerging threat actors and perform threat modeling against banking application architectures and APIs.",
      "Coordinate with cross-functional infrastructure and compliance teams to ensure strict regulatory and ISMS alignment."
    ],
    technologies: ["DFIR", "Incident Response", "Risk Assessment", "Enterprise Security", "SIEM/EDR", "Chain of Custody"]
  },
  {
    period: "Jan 2025 – 2025",
    status: "PREVIOUS",
    role: "SOC Analyst",
    company: "TechOwl Infosec",
    location: "Surat, Gujarat, India",
    department: "Security Operations Center",
    summary: "Led end-to-end SIEM onboarding for enterprise clients and triaged 100+ daily security alerts from CrowdStrike Falcon, Sysmon, and Windows Event Logs.",
    highlights: [
      "Executed SIEM onboarding from client requirement analysis through log source ingestion (Sysmon, NxLog, Windows EVTX, Linux syslog).",
      "Triaged and investigated 100+ daily alerts across CrowdStrike Falcon EDR, FortiSIEM, and SentinelOne.",
      "Conducted malware process-tree investigations, command-line deobfuscation, and hash enrichment mapped to MITRE ATT&CK.",
      "Authored custom detection rules, reduced false-positive rates by 35% through threshold tuning and allowlist engineering.",
      "Investigated phishing campaigns via email header deconstruction, DMARC/DKIM/SPF analysis, and malicious URL pivoting."
    ],
    technologies: ["CrowdStrike Falcon", "FortiSIEM", "Sysmon", "SentinelOne", "Windows Event IDs", "MITRE ATT&CK", "YARA"]
  },
  {
    period: "May 2024 – Sep 2024",
    status: "PREVIOUS",
    role: "Network Engineer",
    company: "Macrotech Global",
    location: "Surat, Gujarat, India",
    department: "Enterprise Network Operations",
    summary: "Architected and secured enterprise network infrastructure for 200+ endpoints across segmented VLAN topologies.",
    highlights: [
      "Configured Cisco ISR routers, L2/L3 switches, dynamic routing protocols (OSPF/EIGRP), and DHCP/DNS services.",
      "Implemented security hardening through strict Access Control Lists (ACLs), 802.1X port security, and 802.1Q VLAN isolation.",
      "Conducted packet-level traffic captures and protocol dissection using Wireshark and Nmap to isolate network anomalies."
    ],
    technologies: ["Cisco ISR", "L2/L3 Switching", "OSPF / EIGRP", "Wireshark", "Nmap", "ACL Hardening", "VLAN Segmentation"]
  }
];

export const EDUCATION = [
  {
    degree: "Master of Science (M.Sc.) in Digital Forensics & Information Security",
    institution: "National Forensic Sciences University (NFSU)",
    location: "Gandhinagar, Gujarat, India",
    period: "2022 – 2024",
    grade: "CGPA: 9.00 / 10.00 (Distinction)",
    courses: [
      "Digital Evidence Acquisition & Chain of Custody",
      "Memory Forensics & Volatility Analysis",
      "Malware Reverse Engineering & Static Analysis",
      "Network Forensics & Packet Dissection",
      "Cloud Security & Virtualization Forensics",
      "Mobile Device Forensic Extractions"
    ]
  },
  {
    degree: "Bachelor of Science (B.Sc.) in Information Technology",
    institution: "J.P. Dawar Institute (VNSGU)",
    location: "Surat, Gujarat, India",
    period: "2018 – 2022",
    grade: "CGPA: 6.60 / 10.00",
    courses: [
      "Computer Networks & Protocols",
      "Database Management Systems (RDBMS)",
      "Operating Systems & Linux Architecture",
      "Object-Oriented Programming (Python, C++)",
      "Web Technologies & Information Security Basics"
    ]
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "SIEM & EDR Operations",
    code: "SEC-OPS",
    skills: [
      { name: "CrowdStrike Falcon", level: 92, tag: "EDR" },
      { name: "Wazuh SIEM", level: 95, tag: "SIEM" },
      { name: "FortiSIEM & Collector", level: 88, tag: "SIEM" },
      { name: "SentinelOne DeepVisibility", level: 86, tag: "EDR" },
      { name: "Microsoft Defender (MDE)", level: 90, tag: "XDR" },
      { name: "Sysmon & NxLog", level: 94, tag: "Telemetry" }
    ]
  },
  {
    title: "Cloud Security & Querying",
    code: "CLOUD-SEC",
    skills: [
      { name: "Azure Log Analytics (KQL)", level: 93, tag: "Hunting" },
      { name: "Azure Defender for Cloud", level: 88, tag: "CSPM" },
      { name: "Microsoft Sentinel", level: 85, tag: "Cloud SIEM" },
      { name: "Azure Resource Graph", level: 82, tag: "Governance" },
      { name: "NSG Flow Logs & VPC", level: 86, tag: "Network" }
    ]
  },
  {
    title: "DFIR & Forensics Arsenal",
    code: "FORENSICS",
    skills: [
      { name: "FTK Imager", level: 96, tag: "Acquisition" },
      { name: "Autopsy Forensics", level: 94, tag: "Analysis" },
      { name: "Volatility Framework", level: 88, tag: "Memory" },
      { name: "Sysinternals Suite", level: 92, tag: "Live Triage" },
      { name: "ADB & Mobile Extraction", level: 89, tag: "Mobile" },
      { name: "IDA Pro & x64dbg", level: 78, tag: "Reversing" }
    ]
  },
  {
    title: "Threat Intel & Malware Analysis",
    code: "THREAT-INTEL",
    skills: [
      { name: "MITRE ATT&CK Mapping", level: 96, tag: "Framework" },
      { name: "VirusTotal & AbuseIPDB APIs", level: 95, tag: "Enrichment" },
      { name: "ANY.RUN & Hybrid Analysis", level: 90, tag: "Sandbox" },
      { name: "YARA Rule Authoring", level: 86, tag: "Signatures" },
      { name: "Joe Sandbox Detonation", level: 84, tag: "Dynamic" }
    ]
  },
  {
    title: "Network Security & Analysis",
    code: "NET-SEC",
    skills: [
      { name: "Wireshark Packet Dissection", level: 94, tag: "PCAP" },
      { name: "TCPDump & Nmap", level: 90, tag: "Scanning" },
      { name: "Cisco ISR & L2/L3 ACLs", level: 88, tag: "Hardware" },
      { name: "Snort & Suricata NIDS", level: 85, tag: "NIDS" },
      { name: "Burp Suite Community", level: 82, tag: "Web Sec" }
    ]
  },
  {
    title: "Security Automation & Scripting",
    code: "AUTOMATION",
    skills: [
      { name: "Python Security Scripting", level: 92, tag: "Dev" },
      { name: "Shuffle SOAR Playbooks", level: 90, tag: "SOAR" },
      { name: "PowerShell & CLI Triage", level: 89, tag: "Scripting" },
      { name: "Bash & Linux Hardening", level: 88, tag: "OS" },
      { name: "n8n Workflow Automation", level: 85, tag: "Workflows" }
    ]
  }
];

export const LIVE_THREAT_FEED = [
  { id: "EVT-8092", time: "10:42:07", sev: "CRITICAL", tech: "T1059.001", source: "CrowdStrike Falcon", desc: "Encoded PowerShell execution spawned from WINWORD.EXE on WKST-104", status: "CONTAINED" },
  { id: "EVT-8091", time: "10:41:22", sev: "HIGH", tech: "T1110.001", source: "Windows Security EVTX", desc: "45 consecutive Event 4625 login failures from IP 45.61.184.22 (Brute Force)", status: "IP_BLOCKED" },
  { id: "EVT-8090", time: "10:39:58", sev: "HIGH", tech: "T1053.005", source: "Sysmon Event 1", desc: "Unusual scheduled task registered by SYSTEM under \\Microsoft\\Windows\\Maintenance", status: "TRIAGED" },
  { id: "EVT-8089", time: "10:37:11", sev: "MEDIUM", tech: "T1078.002", source: "Azure Log Analytics", desc: "KQL match: EventID 4672 administrative privilege assignment outside shift hours", status: "INVESTIGATING" },
  { id: "EVT-8088", time: "10:35:03", sev: "HIGH", tech: "T1003.001", source: "MDE Advanced Hunting", desc: "LSASS process memory handle requested with PROCESS_ALL_ACCESS by unsigned binary", status: "BLOCKED" },
  { id: "EVT-8087", time: "10:33:44", sev: "MEDIUM", tech: "T1071.001", source: "AbuseIPDB Threat Feed", desc: "Malicious reputation score 98% on outbound destination 194.169.175.14", status: "EDGE_DROP" },
  { id: "EVT-8086", time: "10:30:19", sev: "LOW", tech: "T1047", source: "Wazuh Rule 100003", desc: "WMI execution query 'select * from Win32_Process' initiated via remote host", status: "VERIFIED_OK" }
];

export const ATTACK_CHAIN_STAGES = [
  { code: "TA0001", title: "Initial Access", desc: "Spearphishing & edge compromise detection", activeTechnique: "T1566.001" },
  { code: "TA0002", title: "Execution", desc: "PowerShell & LOLBAS command line analysis", activeTechnique: "T1059.001" },
  { code: "TA0003", title: "Persistence", desc: "Registry run keys & scheduled task alerts", activeTechnique: "T1053.005" },
  { code: "TA0004", title: "Privilege Escalation", desc: "Token manipulation & UAC bypass hunting", activeTechnique: "T1548.002" },
  { code: "TA0005", title: "Defense Evasion", desc: "Process injection & log tampering detection", activeTechnique: "T1027.002" },
  { code: "TA0006", title: "Credential Access", desc: "LSASS dump & NTDS.dit theft prevention", activeTechnique: "T1003.001" },
  { code: "TA0008", title: "Lateral Movement", desc: "WinRM, PsExec & Pass-the-Hash tracking", activeTechnique: "T1021.002" },
  { code: "TA0010", title: "Exfiltration", desc: "Cloud egress anomaly & DNS tunneling alerts", activeTechnique: "T1041" }
];
