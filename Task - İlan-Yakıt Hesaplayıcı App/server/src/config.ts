export const serverConfig = {
  port: 3001,
  clientOrigin: 'http://localhost:3000',
} as const;

export function isFixtureDataEnabled(environment: NodeJS.ProcessEnv = process.env): boolean {
  return environment.NODE_ENV !== 'production' && environment.DATA_SOURCE_MODE === 'fixture';
}
