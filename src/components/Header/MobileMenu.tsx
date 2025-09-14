import React, { useState } from 'react';
import { Drawer, Button, Menu, Space, Grid } from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { navigationItems } from './NavigationItems';

const { useBreakpoint } = Grid;

interface MobileMenuProps {
  current: string;
  onClick: (e: any) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ current, onClick }) => {
  const [open, setOpen] = useState(false);
  const screens = useBreakpoint();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Space>
        <Button type="primary" icon={<UserOutlined />} size="small">
          Войти
        </Button>
        <Button icon={<MenuOutlined />} onClick={showDrawer} size="small" />
      </Space>

      <Drawer
        title="Меню"
        placement="right"
        onClose={onClose}
        open={open}
        width={screens.xs ? '80%' : '300px'}
      >
        <Menu
          mode="vertical"
          selectedKeys={[current]}
          items={navigationItems}
          onClick={(e) => {
            onClick(e);
            onClose();
          }}
        />
      </Drawer>
    </>
  );
};
