import clsx from 'clsx';

import RegisterForm from 'components/form/register.form';

import styles from '../styles.module.scss';

export default function SignUp() {
  return (
    <>
      <div className={clsx('wrapper', styles.wrapper)}>
        <div className={clsx('container', styles.container)}>
          <div className={styles.content_container}>
            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  );
}
