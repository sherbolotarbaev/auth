'use client';

import clsx from 'clsx';

import { UseFormRegisterReturn } from 'react-hook-form';
import styles from './styles.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  load?: boolean;
  error?: string;
  register?: UseFormRegisterReturn<any>;
}

export default function Input({
  label,
  name,
  load,
  error,
  register,
  ...props
}: Readonly<InputProps>) {
  const className = clsx(
    'input-reset',
    styles.input,
    props.disabled && styles.disabled,
    props.type === 'password' && styles.password,
    error && !load && styles.error,
    load && styles.load,
  );

  return (
    <div className={styles.wrapper}>
      {!load && error ? (
        <span className={styles.error}>{error}</span>
      ) : (
        label && (
          <label htmlFor={name} className={styles.label}>
            {label}
          </label>
        )
      )}

      <input
        className={className}
        disabled={load}
        {...(register ? register : { name })}
        {...props}
      />
    </div>
  );
}
