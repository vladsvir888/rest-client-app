'use client';

import { Layout, Typography, Space } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import cls from './Footer.module.css';

const { Footer: AntFooter } = Layout;
const { Text, Link: AntLink } = Typography;

const authors = [
  {
    name: 'Vladislav Svirydovich',
    link: 'https://github.com/vladsvir888',
  },
  {
    name: 'Uladzimir Hancharou',
    link: 'https://github.com/totoogg',
  },
  {
    name: 'Ivan Antonov',
    link: 'https://github.com/ivan1antonov',
  },
];

export const Footer: FC = () => {
  return (
    <AntFooter>
      <div className={cls.footer}>
        {authors.map((el) => (
          <AntLink
            key={el.name}
            className={cls.author}
            href={el.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubOutlined />
            {el.name}
          </AntLink>
        ))}

        <Link href={'https://rs.school/courses/reactjs'} target="_blank" rel="noopener noreferrer">
          <Space size="small">
            <Image src="rss.svg" alt="RS School Logo" width={24} height={24} />
            <Text>RS School React Course</Text>
          </Space>
        </Link>
      </div>
    </AntFooter>
  );
};
