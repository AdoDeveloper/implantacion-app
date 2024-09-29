// jest.config.js
/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: 'node',
    testMatch: ['**/src/tests/**/*.test.js'], // Ensure this matches your test files
    reporters: [
      'default',
      [
        'jest-junit',
        {
          outputDirectory: 'reports',
          outputName: 'junit-report.xml',
        },
      ],
      ['github-actions', { silent: false }],
    ],
  };

module.exports = config;
