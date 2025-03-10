import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import TabNavigator from './TabNavigator';
import DrawerNavigator from './DrawerNavigator';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Chi tiết sản phẩm' }} />

    </Stack.Navigator>
  );
};

export default MainNavigator;
