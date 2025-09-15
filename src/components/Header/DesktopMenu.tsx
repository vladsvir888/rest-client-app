import { Menu, Button, MenuProps } from 'antd';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { CustomLink } from '../CustomLink/CustomLink';
import LogOutButton from '../auth/LogOutButton';

interface DesktopMenuProps {
  current: string;
  onClick: MenuProps['onClick'];
  user: boolean;
}

export const DesktopMenu: FC<DesktopMenuProps> = ({ current, onClick, user }) => {
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

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
      {user && (
        <Menu
          theme="dark"
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
      )}

      <div style={{ marginLeft: 'auto' }}>
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
      </div>
    </div>
  );
};
