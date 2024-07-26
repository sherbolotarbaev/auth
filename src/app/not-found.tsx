import clsx from 'clsx';
import type { Metadata } from 'next';

import Button from './components/button';

import styles from './styles/not-found.module.scss';

export const metadata: Metadata = {
  title: '404',
};

export default function NotFound() {
  return (
    <>
      <div className={clsx('wrapper', styles.wrapper)}>
        <div className={clsx('container', styles.container)}>
          <h2 className={clsx('title', styles.title)}>
            {"Oh no! This page doesn't exist."}
          </h2>

          <p className={clsx('desc', styles.desc)}>
            If you expected to see something here, let me know
            (arbaevsherbolot@gmail.com).
          </p>
        </div>

        <Button width={110} redirect="/">
          Head back
        </Button>
      </div>
    </>
  );
}
