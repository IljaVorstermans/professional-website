'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/about',   label: 'About'   },
  { href: '/work',    label: 'Work'    },
  { href: '/picks',   label: 'My picks' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <Link href="/" className="nav-name">Ilja Vorstermans</Link>
      <div className="nav-links">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link${pathname === href ? ' nav-link--active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
