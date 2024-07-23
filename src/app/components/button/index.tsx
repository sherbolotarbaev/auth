'use client';

import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { BiLoader } from 'react-icons/bi';
import styles from './styles.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: number;
  load?: boolean;
  redirect?: string;
  open?: string;
  theme?: Theme;
  small?: boolean;
  pulseAnimation?: boolean;
}

type Theme = 'blue';

export default function Button({
  children,
  width,
  load = false,
  redirect,
  open,
  theme,
  small = false,
  pulseAnimation = false,
  ...props
}: Readonly<ButtonProps>) {
  const router = useRouter();

  const className = clsx(
    'btn-reset',
    styles.button,
    load && styles.load,
    props.disabled && styles.disabled,
    theme && styles[theme],
    small && styles.small,
    pulseAnimation && styles.pulse_animation,
  );

  const style: React.CSSProperties = {
    ...props.style,
    ...(width && { maxWidth: `${width}px` }),
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (redirect) {
      router.push(redirect);
    } else if (open) {
      window.open(open, '_blank');
    }
    props.onClick && props.onClick(event);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      style={style}
      className={className}
      disabled={load || props.disabled}
    >
      {load ? <BiLoader size={19} className={styles.loader} /> : children}
    </button>
  );
}
