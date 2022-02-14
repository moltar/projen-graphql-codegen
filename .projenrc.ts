import { typescript } from 'projen';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  authorName: 'Roman Filippov',
  authorEmail: 'rf@romanfilippov.com',
  repository: 'https://github.com/moltar/projen-graphql-codegen.git',
  name: 'projen-graphql-codegen',
  projenrcTs: true,
  peerDeps: ['projen'],
  deps: ['@graphql-codegen/plugin-helpers', 'graphql'],
  depsUpgrade: false,
});

project.synth();