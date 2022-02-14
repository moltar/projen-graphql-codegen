# 📦 `projen-graphql-codegen`

> Projen project type for [GraphQL Code Generator](https://github.com/dotansimha/graphql-code-generator).

## Usage

```ts
const projen = new ProjenGraphQLCodegenProject({
  // ... required projen options

  // projen-graphql-codegen options
  schema: 'my-schema.graphql',
  eslintGraphQLConfig: 'schema-recommended',
  generators: {
    './src/types.ts': {
      plugins: ['typescript'],
      config: {
        avoidOptionals: true,
      },
    },
  },
});

// add more generators later
projen.addGenerator('./src/foo.ts', {
  plugins: ['typescript'],
})

// finally synth the project
projen.synth()
```

Then:

```sh
## build (codegen) your schema
projen build

## build & watch
projen watch
```
