import { cdk } from 'projen';

const project = new cdk.JsiiProject({
  author: 'Roman Filippov',
  authorAddress: 'rf@romanfilippov.com',
  defaultReleaseBranch: 'main',
  name: 'projen-graphql-codegen',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/rf/projen-graphql-codegen.git',
});

project.synth();