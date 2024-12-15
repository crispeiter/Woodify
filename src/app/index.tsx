import { Stack } from 'expo-router';
import OrderBoard from '../components/OrderBoard';

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Woodify' }} />
      <OrderBoard />
    </>
  );
}
