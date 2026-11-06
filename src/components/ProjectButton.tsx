interface ProjectButtonProps {
  href?: string;
  label?: string;
  onClick?: () => void;
}

export default function ProjectButton({
  href,
  label = 'View Case Study',
  onClick,
}: ProjectButtonProps) {
  const className =
    'inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#D7E2EA]/40 text-[#D7E2EA] font-medium uppercase tracking-widest px-5 py-3 text-xs sm:px-7 sm:text-sm hover:bg-[#D7E2EA] hover:text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#00FF41]/60 transition-all duration-200';

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className} aria-label={label}>
        {label}
      </button>
    );
  }

  return (
    <a href={href || '#projects'} className={className}>
      {label}
    </a>
  );
}
