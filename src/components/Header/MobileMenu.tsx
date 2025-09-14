import { FC, useState } from 'react';
import { Drawer, Button, Menu, Space, Grid, MenuProps } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import cls from './Header.module.css';
import { CustomLink } from '../CustomLink/CustomLink';
import LogOutButton from '../auth/LogOutButton';

const { useBreakpoint } = Grid;

interface MobileMenuProps {
  current: string;
  onClick: MenuProps['onClick'];
  user: boolean;
}

export const MobileMenu: FC<MobileMenuProps> = ({ current, onClick, user }) => {
  const [open, setOpen] = useState(false);
  const screens = useBreakpoint();
  const t = useTranslations();

  const navigationItems = [
    {
      key: 'history',
      label: <CustomLink href="/history">{t('history')}</CustomLink>,
    },
    {
      key: 'rest-client',
      label: <CustomLink href="/rest-client">{t('restful')}</CustomLink>,
    },
    {
      key: 'variables',
      label: <CustomLink href="/variables">{t('variables')}</CustomLink>,
    },
  ];

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Space className={cls.mobile}>
        {user && <Button icon={<MenuOutlined />} onClick={showDrawer} size="small" />}
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <CustomLink href="/sign-in">
              <Button type="primary" style={{ marginRight: '10px' }}>
                {t('sign_in')}
              </Button>
            </CustomLink>
            <CustomLink href="/sign-up">
              <Button>{t('sign_up')}</Button>
            </CustomLink>
          </>
        )}
      </Space>

      {user && (
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
              onClick?.(e);
              onClose();
            }}
          />
        </Drawer>
      )}
    </>
  );
};
