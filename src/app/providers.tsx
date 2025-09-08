'use client';

import { RestClientProvider } from '@/components/RestClientProvider/RestClientProvider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider>
        <RestClientProvider>{children}</RestClientProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
