'use client';

import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'shared/hooks/use-translation';

import OAuthButtons from 'components/button/oauth-buttons';
import Logo from 'components/logo';
import Link from 'next/link';

import styles from './styles.module.scss';

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  const { t } = useTranslation();

  return (
    <>
      <form className={styles.form}>
        <div className={clsx('container', styles.container)}>
          <div className={clsx('text', styles.text)}>
            <Logo />

            <h2 className={clsx('title', styles.title)}>{t('signUp_title')}</h2>

            <p className={clsx('desc', styles.desc)}>{t('signUp_description')}</p>
          </div>

          <OAuthButtons />

          <p
            className="desc"
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {t('signUp_link_description')}
            <Link
              className="link"
              href={next !== '/' ? `/sign-in?next=${next}` : '/sign-in'}
            >
              {t('signUp_link')}
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};
export default RegisterForm;
