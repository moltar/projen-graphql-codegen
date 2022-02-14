import { ProjenGraphQLCodegenProject } from '../src';
import { createProjectAndSynth } from './util';

const DEFAULT_GENERATOR = {
  './src/types.ts': {
    plugins: ['typescript'],
    config: {
      avoidOptionals: true,
    },
  },
};

describe(ProjenGraphQLCodegenProject.name, () => {
  it('should install required base deps', () => {
    expect.assertions(2);

    const synth = createProjectAndSynth({ generators: DEFAULT_GENERATOR });

    expect(synth['package.json'].devDependencies).toHaveProperty('graphql');
    expect(synth['package.json'].devDependencies).toHaveProperty('@graphql-codegen/cli');
  });

  it('should add tasks', () => {
    expect.assertions(2);

    const synth = createProjectAndSynth({ generators: DEFAULT_GENERATOR });

    expect(synth['.projen/tasks.json'].tasks.compile).toMatchSnapshot();
    expect(synth['.projen/tasks.json'].tasks.watch).toMatchSnapshot();
  });

  it('should add ESLint config', () => {
    expect.assertions(1);

    const synth = createProjectAndSynth({
      generators: DEFAULT_GENERATOR,
      eslintGraphQLConfig: 'schema-all',
    });

    expect(synth['.eslintrc.json'].overrides).toMatchSnapshot();
  });

  it('should create a generator config', () => {
    expect.assertions(1);

    const synth = createProjectAndSynth({ generators: DEFAULT_GENERATOR });

    expect(synth['codegen.yml']).toMatchSnapshot();
  });

  it('should generate an index.ts file', () => {
    expect.assertions(1);

    const synth = createProjectAndSynth({ generators: DEFAULT_GENERATOR });

    expect(synth['src/index.ts']).toMatchSnapshot();
  });

  it('should add a known plugin as a dev dep automatically', () => {
    expect.assertions(1);

    const synth = createProjectAndSynth({ generators: DEFAULT_GENERATOR });

    expect(synth['package.json'].devDependencies).toHaveProperty('@graphql-codegen/typescript');
  });
});