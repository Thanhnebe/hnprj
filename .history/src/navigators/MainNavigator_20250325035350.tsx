import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import TabNavigator from './TabNavigator';
import DrawerNavigator from './DrawerNavigator';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import CartScreen from '../screens/product/CartScreen';
import OrderHistoryScreen from '../screens/product/OrderHistoryScreen';
import OrderDetailsScreen from '../screens/product/OrderDetailsScreen';

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
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="orderHist" component={OrderHistoryScreen} />
      <Stack.Screen name="orderDetail" component={OrderDetailsScreen} />

    </Stack.Navigator>
  );
};

export default MainNavigator;
