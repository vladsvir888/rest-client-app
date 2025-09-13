import { useTranslations } from 'next-intl';

export default function VariableTitle() {
  const t = useTranslations();
  return <h1>{t('variables_page_title')}</h1>;
}
