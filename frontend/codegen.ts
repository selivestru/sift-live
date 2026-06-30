// import { type CodegenConfig } from '@graphql-codegen/cli'

// const config: CodegenConfig = {
//   schema: '../backend/src/schema.gql',
//   documents: ['src/**/*.{ts,tsx}'],
//   ignoreNoDocuments: true,
//   generates: {
//     './src/shared/api/graphql/__generated__/': {
//       preset: 'client',
//       config: {
//         defaultScalarType: 'unknown',
//         nonOptionalTypename: true,
//         skipTypeNameForRoot: true,
//         avoidOptionals: {
//           field: true,
//           inputValue: false,
//         },
//         emitLegacyCommonJSImports: false,
//         useTypeImports: true,
//       },
//     },
//   },
// }

// export default config

import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../backend/src/schema.gql',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/shared/api/graphql/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      config: {
        useTypeImports: true,
        nonOptionalTypename: true,
        skipTypename: false,
        dedupeFragments: true,
        avoidOptionals: {
          field: true,
          inputValue: false,
        },
        scalars: {
          DateTime: 'string',
          JSON: 'unknown',
        },
      },
    },
  },
}

export default config
