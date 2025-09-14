'use client';

import { FC, useEffect, useState } from 'react';
import { Layout, Grid, Typography, MenuProps } from 'antd';
import { DesktopMenu } from './DesktopMenu';
import { MobileMenu } from './MobileMenu';
import cls from './Header.module.css';
import { AntCloudOutlined } from '@ant-design/icons';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { CustomLink } from '../CustomLink/CustomLink';
import { usePathname } from '@/i18n/navigation';

interface HeaderProps {
  user: boolean;
}

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;
const { Title } = Typography;

export const Header: FC<HeaderProps> = ({ user }) => {
  const [current, setCurrent] = useState('');
  const screens = useBreakpoint();
  const [isSticky, setIsSticky] = useState(false);

  const path = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const parsePath = path.split('/');
    setCurrent(parsePath[1]);
  }, [path]);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  const isMobile = !screens.md;

  return (
    <AntHeader
      style={{
        paddingLeft: 10,
        paddingRight: 10,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: isSticky ? '64px' : '74px',
        background: isSticky ? '#03213d' : '',
      }}
    >
      <div className={cls.header}>
        <Title
          level={3}
          style={{
            color: '#1890ff',
            alignItems: 'center',
            margin: 0,
          }}
        >
          <CustomLink href="/">
            <AntCloudOutlined />
          </CustomLink>
        </Title>

        {!isMobile ? (
          <DesktopMenu user={user} current={current} onClick={handleMenuClick} />
        ) : (
          <MobileMenu user={user} current={current} onClick={handleMenuClick} />
        )}

        <LanguageSwitcher />
      </div>
    </AntHeader>
  );
};
