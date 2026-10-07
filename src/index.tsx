import { render } from 'solid-js/web';
import { Bio } from './components/Bio';
import './styles/main.scss';

const root = document.getElementById('root');
if (root) {
  render(() => <Bio />, root);
}
