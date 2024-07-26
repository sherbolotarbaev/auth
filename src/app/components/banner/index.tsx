'use client';

import styles from './styles.module.scss';

interface BannerProps {
  children: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({ children }) => {
  return <div className={styles.banner}>{children}</div>;
};
export default Banner;
