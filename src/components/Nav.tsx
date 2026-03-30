'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  // { href: '/about',   label: 'About'   }, // commented out - restore when ready
  // { href: '/work',    label: 'Work'    },  // commented out - restore when ready
  // { href: '/choices', label: 'My choices' }, // commented out - needs content before publishing
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <div className="nav-wrapper">
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
    </div>
  );
}
