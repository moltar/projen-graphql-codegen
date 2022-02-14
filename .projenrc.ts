import { cdk, javascript } from 'projen';

const project = new cdk.JsiiProject({
  defaultReleaseBranch: 'main',
  author: 'Roman Filippov',
  authorAddress: 'rf@romanfilippov.com',
  repositoryUrl: 'https://github.com/moltar/projen-graphql-codegen.git',
  name: 'projen-graphql-codegen',
  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,
  peerDeps: ['projen'],
  deps: [
    '@graphql-codegen/plugin-helpers',
    // lowers and pins the version to mitigate
    // https://github.com/dotansimha/graphql-code-generator/issues/7519
    'graphql@15.8.0',
  ],
  bundledDeps: ['@graphql-codegen/plugin-helpers', 'graphql'],
  depsUpgrade: false,
  releaseToNpm: true,
});

project.synth();