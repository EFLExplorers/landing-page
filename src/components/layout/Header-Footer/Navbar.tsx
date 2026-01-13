import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "../../ui/dropdown-menu";
import styles from "./Navbar.module.css";

export interface NavbarLink {
  label: string;
  href: string;
}

export interface NavbarDropdown {
  label: string;
  items: NavbarLink[];
}

export interface NavbarContent {
  dropdown: NavbarDropdown;
  links: NavbarLink[];
}

export interface NavbarProps {
  content?: NavbarContent | null;
}

export const Navbar = ({ content }: NavbarProps) => {
  if (!content) return null;
  const dropdown = content.dropdown;
  const links = content.links || [];

  return (
    <nav className={styles.desktopNav} data-cy="navbar">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={styles.navLink}
          data-cy="nav-platforms-trigger"
        >
          {dropdown.label} <ChevronDown className={styles.dropdownIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            className={styles.dropdownContent}
            sideOffset={8}
            data-cy="nav-platforms-menu"
          >
            {(dropdown.items || []).map((item) => (
              <DropdownMenuItem
                key={item.href}
                className={styles.dropdownItem}
                data-cy={`nav-dropdown-item-${item.label.toLowerCase()}`}
              >
                <Link
                  href={item.href}
                  className={styles.dropdownLink}
                  data-cy={`nav-dropdown-link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={styles.navLink}
          data-cy={`nav-link-${link.label.toLowerCase()}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export { Navbar as default };
