import { Search } from './Search';
import { SelectClient } from './SelectClient';
import cls from './UrlLine.module.css';

export const UrlLine = () => {
  const url = encodeURIComponent('фыв');
  const url1 = decodeURIComponent('фыв');
  //const url2 = atob('фыв');
  //const url3 = btoa('фыв');

  return (
    <div>
      <SelectClient />
      <Search />
    </div>
  );
};
