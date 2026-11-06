import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { Cpu, Search, Activity } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCategories = SKILL_CATEGORIES.filter((cat) => {
    if (selectedCategory !== 'ALL' && cat.title !== selectedCategory) {
      return false;
    }
    return true;
  }).map((cat) => {
    const matchingSkills = cat.skills.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.tag && s.tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return { ...cat, skills: matchingSkills };
  }).filter((cat) => cat.skills.length > 0);

  return (
    <section id="skills" className="py-20 bg-[#050806] text-zinc-100 border-b border-[#1c1c1c] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 font-mono text-xs text-[#00ff88] mb-3">
              <Cpu size={13} />
              <span>DEFENSIVE CAPABILITIES & DETECTION ENGINEERING ARSENAL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans uppercase">
              TECHNICAL ARSENAL
            </h2>
            <p className="text-sm font-mono text-zinc-400 mt-2 max-w-2xl">
              Battle-tested tools and frameworks across SIEM operations, endpoint detection & response, cloud telemetry, digital forensics, and security automation.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
            <Activity size={14} className="text-[#00ff88]" />
            <span>
              {SKILL_CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0)} TOTAL CAPABILITIES
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto font-mono text-xs">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ALL DOMAINS
            </button>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.code}
                onClick={() => setSelectedCategory(cat.title)}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.title
                    ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 font-mono text-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools & skills..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-zinc-600 outline-none focus:border-[#00ff88]"
            />
          </div>
        </div>

        {/* Arsenal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.code}
              className="bg-[#080d0b] border border-[#1f2e26] hover:border-[#00ff88]/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#00ff88]/5 rounded-bl-full pointer-events-none" />

              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#1c2a23] font-mono text-xs">
                  <span className="text-[#00ff88] font-bold tracking-wider">{cat.title}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-500 border border-zinc-800 text-[10px]">
                    {cat.code}
                  </span>
                </div>

                {/* Skill List with Telemetry Bars */}
                <div className="mt-5 space-y-4 font-mono">
                  {cat.skills.map((skill, sidx) => (
                    <div key={sidx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
                          <span className="text-[#00ff88] text-[10px]">▹</span>
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-2">
                          {skill.tag && (
                            <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-[#38bdf8] text-[9px] border border-zinc-800">
                              {skill.tag}
                            </span>
                          )}
                          <span className="text-zinc-500 text-[10px] font-bold">{skill.level}%</span>
                        </div>
                      </div>

                      {/* Bar Gauge */}
                      <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/80">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-600 via-[#00ff88] to-emerald-400 rounded-full transition-all duration-700 group-hover:brightness-110"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Meta */}
              <div className="mt-6 pt-3 border-t border-[#1c2a23] flex items-center justify-between font-mono text-[10px] text-zinc-500">
                <span>OPERATIONAL READINESS</span>
                <span className="text-[#00ff88] font-bold">OPTIMAL</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
export default SkillsSection;
