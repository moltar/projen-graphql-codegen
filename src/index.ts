import assert from 'assert';
import path from 'path';
import type { Types } from '@graphql-codegen/plugin-helpers';
import { typescript, YamlFile, SampleFile, TextFile } from 'projen';
import { PLUGINS } from './plugins';

const SAMPLE_DIR = path.join(__dirname, 'sample');
const DEFAULT_SCHEMA_FILENAME = 'schema.graphql';
const GRAPHQL_CODEGEN_CLI = 'graphql-codegen';

type ValueOf<T> = T[keyof T]
type Generators = Record<string, Types.ConfiguredOutput>
type Schema = Types.Schema
type Config = Types.Config

export interface ProjenGraphQLCodegenProjectOptions extends typescript.TypeScriptProjectOptions {
  /**
   * A URL to your GraphQL endpoint, a local path to .graphql file, a glob pattern to your GraphQL
   * schema files, or a JavaScript file that exports the schema to generate code from.
   * This can also be an array that specifies multiple schemas to generate code from.
   * You can read more about the supported formats [here](https://www.graphql-code-generator.com/docs/config-reference/schema-field#available-formats).
   *
   * If this is not specified, a sample file `schema.graphql` will be created for you and used as a
   * default.
   *
   * @default schema.graphql
   *
   * @see https://www.graphql-code-generator.com/docs/config-reference/codegen-config
   */
  readonly schema?: Schema;

  /**
   * A map where the key represents an output path for the generated code, and the value represents
   * a set of relevant options for that specific file.
   *
   * @see https://www.graphql-code-generator.com/docs/config-reference/codegen-config
   */
  readonly generators?: Generators;

  /**
   * Which specific config to extend.
   *
   * @default schema-recommended
   */
  readonly eslintGraphQLConfig?: 'schema-recommended' | 'schema-all' | 'operations-recommended' | 'operations-all';
}

export class ProjenGraphQLCodegenProject extends typescript.TypeScriptProject {
  private readonly generators: Generators = {};

  constructor(private readonly options: ProjenGraphQLCodegenProjectOptions) {
    super(options);

    this.addDevDeps('graphql', '@graphql-codegen/cli');

    this.generators = {
      ...options.generators,
    };

    new YamlFile(this, 'codegen.yml', {
      obj: this.config,
    });

    const schema = this.schema;
    this.compileTask.prependExec(GRAPHQL_CODEGEN_CLI);
    this.watchTask.prependExec(`${GRAPHQL_CODEGEN_CLI} --watch ${schema}`);

    const eslintGraphQLConfig = options.eslintGraphQLConfig || 'schema-recommended';
    this.addDevDeps('@graphql-eslint/eslint-plugin');
    this.eslint?.addOverride({
      files: ['*.graphql'],
      // @ts-ignore
      extends: `plugin:@graphql-eslint/${eslintGraphQLConfig}`,
    });
  }

  /**
   * Add a code generator configuration.
   *
   * @see https://www.graphql-code-generator.com/docs/config-reference/codegen-config
   */
  public addGenerator(outputPath: string, generatorConfig: ValueOf<Generators>): void {
    this.generators[outputPath] = generatorConfig;
  }

  // https://www.graphql-code-generator.com/docs/config-reference/codegen-config
  private get config(): Config {
    return {
      schema: this.schema,
      generates: this.generators,
    };
  }

  private get schema(): Schema {
    const { schema } = this.options;

    // No schema was supplied, we'll default to creating a sample file
    if (!schema) {
      new SampleFile(this, DEFAULT_SCHEMA_FILENAME, {
        sourcePath: path.join(SAMPLE_DIR, 'schema.graphql'),
      });

      return DEFAULT_SCHEMA_FILENAME;
    }

    return schema;
  }

  preSynthesize(): void {
    const outputPaths = Object.keys(this.generators);

    assert.ok(outputPaths.length > 0, 'You need to provide at least one generator.');

    // stops generated code from linting
    for (const outputPath of outputPaths) {
      this.eslint?.addIgnorePattern(outputPath);
    }

    // output index file for exporting everything generated
    const tsOutputPaths = outputPaths
      // in case where user specified to generate into `src/index.ts` directly
      .filter((p) => p !== 'src/index.ts')
      // find all TypeScript files
      .filter((p) => p.endsWith('.ts'))
      .map((p) => p.replace(/\.ts$/, ''))
      .map((p) => p.replace(/^\.\/src\//, ''));

    if (tsOutputPaths.length > 0) {
      new TextFile(this, 'src/index.ts', {
        lines: tsOutputPaths.map((p) => `export * from './${p}'`),
      });
    }

    // finds all NPM packages for all generators and adds them as a developer dependency
    this.addDevDeps(
      ...Object.values(this.generators)
        .flatMap(({ plugins }) => plugins)
        // get named plugins only
        .filter((plugin): plugin is string => typeof plugin === 'string')
        // is named plugin on the official list of plugins?
        .map((namedPlugin) => PLUGINS.find((p) => p.identifier === namedPlugin))
        // eliminate not found plugin entries
        .filter((pluginPackage) => !!pluginPackage)
        // get official package NPM name
        .map((pluginPackage) => {
          assert(pluginPackage);
          return pluginPackage.npmPackage;
        }),
    );
  }
}