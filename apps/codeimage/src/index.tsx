import {render} from 'solid-js/web';

import App from './App';
import {staticConfiguration} from './core/configuration';
import {I18nProvider} from '@codeimage/locale';
import {locale} from './i18n';
import {StaticConfigurationProvider} from '@codeimage/config';
import './assets/styles/app.scss';
import {devTools} from '@ngneat/elf-devtools';

if (import.meta.env.DEV) {
  devTools();
}

render(Bootstrap, document.getElementById('root') as HTMLElement);

export function Bootstrap() {
  return (
    <StaticConfigurationProvider config={staticConfiguration}>
      <I18nProvider dict={locale}>
        <App />
      </I18nProvider>
    </StaticConfigurationProvider>
  );
}
