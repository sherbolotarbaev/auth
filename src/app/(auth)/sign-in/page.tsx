import clsx from 'clsx';

import Banner from 'components/banner';
import LoginForm from 'components/form/login.form';
import LanguageSwitcher from 'components/language';

import styles from '../styles.module.scss';

export default function SignIn() {
  return (
    <>
      <div className={clsx('wrapper', styles.wrapper)}>
        <div className={clsx('container', styles.container)}>
          <div className={styles.content_container}>
            <Banner>
              <LoginForm />
            </Banner>

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  );
}
