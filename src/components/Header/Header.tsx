'use client';

import React, { useState } from 'react';
import { Layout, Grid, Typography } from 'antd';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;
const { Title } = Typography;

export const Header: React.FC = () => {
  const [current, setCurrent] = useState('home');
  const screens = useBreakpoint();

  const handleMenuClick = (e: any) => {
    setCurrent(e.key);
  };

  const isMobile = !screens.md;

  return (
    <AntHeader
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        height: '64px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title
          level={3}
          style={{
            margin: 0,
            marginRight: '20px',
            color: '#1890ff',
          }}
        >
          Мой Сайт
        </Title>
      </div>

      {!isMobile ? (
        <DesktopMenu current={current} onClick={handleMenuClick} />
      ) : (
        <MobileMenu current={current} onClick={handleMenuClick} />
      )}
    </AntHeader>
  );
};
