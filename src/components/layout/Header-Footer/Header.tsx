"use client";

import Logo from "./Logo";
import { Navbar, type NavbarContent } from "./Navbar";
import { AuthButtons, type AuthButtonsContent } from "../AuthButtons";
import styles from "./Header.module.css";

export interface HeaderContent {
  navbar?: NavbarContent;
  authButtons?: AuthButtonsContent;
}

export interface HeaderProps {
  content?: HeaderContent | null;
}

export const Header = ({ content }: HeaderProps) => {
  return (
    <header className={styles.header} data-cy="site-header">
      <div className={styles.container} data-cy="site-header-container">
        <Logo />
        <Navbar content={content?.navbar} />
        <AuthButtons content={content?.authButtons} />
      </div>
    </header>
  );
};

export { Header as default };
