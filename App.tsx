import 'react-native-gesture-handler';
// i18n設定をインポート
import './config/i18n';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './lib/store';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Loading } from './components/common/Loading';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

// メインコンポーネントのインポート
import { ExpoRoot } from 'expo-router';

// 通知の初期設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// バンドラーの環境に応じたエントリーポイントの指定
export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  // 通知の権限リクエスト
  useEffect(() => {
    (async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('通知の権限が得られませんでした');
        return;
      }
    })();
  }, []);

  if (!fontsLoaded) {
    return <Loading />;
  }

  // expoサーバーで提供されるルートの指定
  const ctx = require.context('./app');

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <ExpoRoot context={ctx} />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
} 