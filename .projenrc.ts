import { typescript } from 'projen';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  authorName: 'Roman Filippov',
  authorEmail: 'rf@romanfilippov.com',
  repository: 'https://github.com/moltar/projen-graphql-codegen.git',
  name: 'projen-graphql-codegen',
  projenrcTs: true,
  peerDeps: ['projen'],
  deps: [
    '@graphql-codegen/plugin-helpers',
    // lowers and pins the version to mitigate
    // https://github.com/dotansimha/graphql-code-generator/issues/7519
    'graphql@16.2.0',
  ],
  depsUpgrade: false,
  releaseToNpm: true,
});

project.synth();