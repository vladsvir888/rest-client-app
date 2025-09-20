'use client';

import { RestClientProvider } from '@/components/RestClientProvider/RestClientProvider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd';
import React from 'react';

const theme = {
  token: {
    colorPrimary: '#1890ff',
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={theme}>
        <RestClientProvider>{children}</RestClientProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
