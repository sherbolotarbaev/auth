'use client';

import styles from './styles.module.scss';

interface BannerProps {
  children: React.ReactNode;
}

export default function Banner({ children }: Readonly<BannerProps>) {
  return (
    <div className={styles.banner}>
      {children} <div className={styles.animated_element}></div>
    </div>
  );
}
