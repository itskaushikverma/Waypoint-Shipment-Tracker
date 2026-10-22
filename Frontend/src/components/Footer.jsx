import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  RiGithubFill,
  RiGlobalLine,
  RiInstagramLine,
  RiLinkedinFill,
  RiMailLine,
  RiTwitterXFill,
} from '@remixicon/react';

export default function Footer() {
  const [links, setLinks] = useState(null);

  useEffect(() => {
    axios.get('https://pget.vercel.app/').then(({ data }) => setLinks(data));
  }, []);

  if (!links) return null;

  const items = [
    { href: links.portfolio, label: 'Portfolio', icon: RiGlobalLine },
    { href: links.github, label: 'GitHub', icon: RiGithubFill },
    { href: links.linkedin, label: 'LinkedIn', icon: RiLinkedinFill },
    { href: links.twitter, label: 'X', icon: RiTwitterXFill },
    { href: links.instagram, label: 'Instagram', icon: RiInstagramLine },
    { href: links.email ? `mailto:${links.email}` : '', label: 'Email', icon: RiMailLine },
  ].filter((item) => item.href);

  return (
    <footer className="text-muted-foreground relative z-10 border-t py-2 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-1">
        <p className="text-sm">
          Made by{' '}
          <a
            href={links.portfolio}
            target="_blank"
            rel="noreferrer"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Kaushik Verma
          </a>
        </p>
        <div className="flex items-center gap-1">
          {items.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
              aria-label={label}
              className="hover:text-foreground rounded-md p-1.5 transition-colors"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
