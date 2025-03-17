interface Config {
  host: string;
  port: number;
  app: {
    keys: string[];
  };
}

export default ({ env }: { env: (key: string, defaultValue?: any) => any }): Config => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337), // Use the PORT environment variable, default to 1337 if unset
  app: {
    keys: env.array('APP_KEYS'),
  },
});
