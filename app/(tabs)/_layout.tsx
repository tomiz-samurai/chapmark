import { Tabs } from 'expo-router';
import { Book, Chrome as Home, Timer, User, Search } from 'lucide-react-native';
import { useAppTranslation } from '../../hooks/useAppTranslation';

export default function TabLayout() {
  const { t } = useAppTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#f8f9fa',
          borderTopColor: '#6c757d',
        },
        tabBarActiveTintColor: '#212529',
        tabBarInactiveTintColor: '#495057',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.home'),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t('navigation.books'),
          tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: t('navigation.discover'),
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: t('navigation.timer'),
          tabBarIcon: ({ color, size }) => <Timer size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('navigation.profile'),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}