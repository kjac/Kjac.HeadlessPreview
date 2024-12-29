export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Kjac Back Office Preview Entrypoint",
    alias: "Kjac.BackOfficePreview.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint"),
  }
];
