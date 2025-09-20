'use client';

import cls from './Loader.module.css';

export const Loader = () => {
  return (
    <div className={cls.wrapper}>
      <span className={cls.loader}></span>
    </div>
  );
};

Loader.displayName = 'Loader';
