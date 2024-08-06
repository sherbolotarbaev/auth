import clsx from 'clsx';

import LoginForm from 'components/form/login.form';

import styles from '../styles.module.scss';

export default function SignIn() {
  return (
    <>
      <div className={clsx('wrapper', styles.wrapper)}>
        <div className={clsx('container', styles.container)}>
          <div className={styles.content_container}>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
