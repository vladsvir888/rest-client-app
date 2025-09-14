import React from 'react';
import { Menu, Button } from 'antd';
import { navigationItems } from './NavigationItems';

interface DesktopMenuProps {
  current: string;
  onClick: (e: any) => void;
}

export const DesktopMenu: React.FC<DesktopMenuProps> = ({ current, onClick }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
      <Menu
        mode="horizontal"
        selectedKeys={[current]}
        items={navigationItems}
        onClick={onClick}
        style={{
          border: 'none',
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}
      />
      <div style={{ marginLeft: 'auto' }}>
        <Button type="primary" style={{ marginRight: '10px' }}>
          Войти
        </Button>
        <Button>Регистрация</Button>
      </div>
    </div>
  );
};
