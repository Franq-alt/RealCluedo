import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bangbang.game',
  appName: 'Bang Bang',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#7f1d1d",
      showSpinner: false
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#7f1d1d"
    }
  }
};

export default config;