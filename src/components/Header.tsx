import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import style from './style/Header.module.css';
import AuthPanel from './auth/AuthPanel';

export default function Header() {
  const t = useTranslations();

  return (
    <header className={style.header}>
      <div className={style.header_lang}>
        <p className={style.header_lang_title}>{t('change_lang')}</p>
        <LanguageSwitcher />
        <AuthPanel />
      </div>
    </header>
  );
}
