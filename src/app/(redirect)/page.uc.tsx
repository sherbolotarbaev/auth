'use client';

import clsx from 'clsx';
import { useEffect } from 'react';

import { BiLoader } from 'react-icons/bi';
import styles from './styles.module.scss';

export default function RedirectClient() {
  useEffect(() => {
    const redirectTo = decodeURIComponent(
      window?.location?.href?.split('to=')?.[1] || '/',
    );

    window?.location?.assign(`https://sherbolotarbaev.co${redirectTo}`);
  }, []);

  return (
    <>
      <div className={clsx('wrapper', styles.wrapper)}>
        <p className={clsx('desc', styles.desc)}>
          <BiLoader size={20} className={styles.loader} />
          Redirection...
        </p>
      </div>
    </>
  );
}
