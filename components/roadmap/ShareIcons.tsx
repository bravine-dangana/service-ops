import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const LINKS = [
  { href: 'https://www.facebook.com/cellulant', label: 'Facebook', Icon: Facebook },
  { href: 'https://www.instagram.com/cellulant', label: 'Instagram', Icon: Instagram },
  { href: 'https://www.twitter.com/cellulant', label: 'X (Twitter)', Icon: Twitter },
  { href: 'https://www.linkedin.com/company/cellulant', label: 'LinkedIn', Icon: Linkedin },
];

export function ShareIcons() {
  return (
    <div className="hidden flex-col gap-3 lg:flex">
      {LINKS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-cellulant-blue hover:text-cellulant-blue"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
