'use client';

import { usePathname } from 'next/navigation';
import Nav from 'react-bootstrap/Nav';

export default function Navbar({ links }) {
  const pathname = usePathname();

  return (
    <Nav variant={"tabs"} activeKey={pathname}>
      {links.map((link) => (
        <Nav.Item key={link.path}>
          <Nav.Link href={link.path}>{link.label}</Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}
