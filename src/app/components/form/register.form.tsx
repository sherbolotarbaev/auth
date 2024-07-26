'use client';

import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

import OAuthButtons from 'components/button/oauth-buttons';
import Logo from 'components/logo';
import Link from 'next/link';

import styles from './styles.module.scss';

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  return (
    <>
      <form className={styles.form}>
        <div className={clsx('container', styles.container)}>
          <div className={clsx('text', styles.text)}>
            <Logo />

            <h2 className={clsx('title', styles.title)}>Create your account</h2>

            <p className={clsx('desc', styles.desc)}>
              Welcome! You can create an account using a <br /> Google or GitHub.
            </p>
          </div>

          <OAuthButtons />

          <p
            className="desc"
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            Already have an account?
            <Link
              className="link"
              href={next !== '/' ? `/sign-in?next=${next}` : '/sign-in'}
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};
export default RegisterForm;
