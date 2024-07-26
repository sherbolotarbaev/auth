'use client';

import { siteConfig } from '~/config/site';

import Image from 'next/image';

import logo from 'public/images/logo.png';

export const Logo = () => {
  return (
    <div
      className="logo_wrapper"
      style={{
        width: '2.5rem',
        height: '2.5rem',
      }}
    >
      <Image
        className="logo"
        src={logo}
        alt={siteConfig.name}
        loading="lazy"
        layout="fill"
      />
    </div>
  );
};
export default Logo;
