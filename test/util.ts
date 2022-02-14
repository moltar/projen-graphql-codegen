import { tmpdir } from 'os';
import path from 'path';
import { Project, Testing } from 'projen';
import { ProjenGraphQLCodegenProject, ProjenGraphQLCodegenProjectOptions } from '../src';

const createProjectName = (name?: string) => [name, Math.random().toString().replace('.', '')].join('-');

export function createProject(options: Partial<ProjenGraphQLCodegenProjectOptions> = {}) {
  const name = createProjectName(ProjenGraphQLCodegenProject.name);

  return new ProjenGraphQLCodegenProject({
    defaultReleaseBranch: 'master',
    name,
    outdir: path.join(tmpdir(), name),
    ...options,
  });
}

export function synthProjectSnapshot(project: Project) {
  return Testing.synth(project);
}

export function createProjectAndSynth(options: Partial<ProjenGraphQLCodegenProjectOptions> = {}) {
  return synthProjectSnapshot(createProject(options));
}
