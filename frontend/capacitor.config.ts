import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.fitness.tracker.com',
  appName: 'fitness_tracker',
  webDir: 'dist',
  server: {
    cleartext: true,
    androidScheme: 'http',
  },
  android: {
    loggingBehavior: 'debug',
    allowMixedContent: true,
  }
};

export default config;
