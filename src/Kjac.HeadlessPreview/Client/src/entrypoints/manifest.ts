import {PACKAGE_ALIAS, PACKAGE_NAME} from '../constants.ts';

export const manifests: Array<UmbExtensionManifest> = [
  {
    name: `${PACKAGE_NAME} Preview Entrypoint`,
    alias: `${PACKAGE_ALIAS}.Entrypoint`,
    type: 'backofficeEntryPoint',
    js: () => import('./entrypoint'),
  }
];
