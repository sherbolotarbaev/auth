'use client';

import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';

import OAuthButtons from 'components/button/oauth-buttons';
import Link from 'next/link';

import styles from './styles.module.scss';

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  return (
    <>
      <form className={styles.form}>
        <div className={clsx('container', styles.container)}>
          <div className={clsx('text', styles.text)}>
            <h2 className={clsx('title', styles.title)}>Welcome 👋</h2>

            <p className={clsx('desc', styles.desc)}>
              You can create an account using a Google or GitHub.
            </p>
          </div>

          <OAuthButtons />

          <p className={clsx('desc', styles.desc)}>
            When creating an account, you agree to our Terms of Service and Privacy
            Policy.
          </p>

          <Link
            className={clsx('link', styles.link)}
            href={next !== '/' ? `/sign-in?next=${next}` : '/sign-in'}
          >
            Already have an account? Log in
          </Link>
        </div>
      </form>
    </>
  );
}
