import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import style from './style/Header.module.css';

export default function Header() {
  const t = useTranslations();

  return (
    <header className={style.header}>
      <h1 className={style.header_title}>{t('test_key')}</h1>
      <div className={style.header_lang}>
        <p className={style.header_lang_title}>{t('change_lang')}</p>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
