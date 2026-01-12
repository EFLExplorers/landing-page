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

export const Navbar = () => {
  return (
    <nav className={styles.desktopNav} data-cy="navbar">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={styles.navLink}
          data-cy="nav-platforms-trigger"
        >
          Platforms <ChevronDown className={styles.dropdownIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            className={styles.dropdownContent}
            sideOffset={8}
            data-cy="nav-platforms-menu"
          >
            <DropdownMenuItem
              className={styles.dropdownItem}
              data-cy="nav-platforms-teacher-item"
            >
              <Link
                href="/platforms/teacher"
                className={styles.dropdownLink}
                data-cy="nav-platforms-teacher-link"
              >
                Teacher
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={styles.dropdownItem}
              data-cy="nav-platforms-student-item"
            >
              <Link
                href="/platforms/student"
                className={styles.dropdownLink}
                data-cy="nav-platforms-student-link"
              >
                Student
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      <Link
        href="/pricing"
        className={styles.navLink}
        data-cy="nav-pricing-link"
      >
        Pricing
      </Link>
      <Link href="/about" className={styles.navLink} data-cy="nav-about-link">
        About
      </Link>
      <Link
        href="/contact"
        className={styles.navLink}
        data-cy="nav-contact-link"
      >
        Contact
      </Link>
    </nav>
  );
};

export { Navbar as default };
