import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../../apis/axiosClient';
import { appColors } from '../../constants/appColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import axios from 'axios';

type RootStackParamList = {
  ProductDetail: { productId: string };
  Cart: undefined;
  HomeScreen: undefined; // Added HomeScreen to the type definition
};

type ProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

type Props = {
  navigation: ProductDetailScreenNavigationProp;
  route: ProductDetailScreenRouteProp;
};

const { width, height } = Dimensions.get('window');

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<any[]>([]);
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>('');
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const response = await axiosClient.get(`/products/similar/${productId}`);
        setSimilarProducts(response);
        console.log('Sản phẩm tương tự:', response);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm tương tự:', error);
      }
    };

    fetchSimilarProducts();
  }, [productId]);
  const user_email = useSelector((state: any) => state.authReducer.authData.email);
  const user_id = useSelector((state: any) => state.authReducer.authData.id);
  const applyPromoCode = async () => {
    try {
      const response = await axiosClient.post('/discount/apply', {
        code: promoCode,
        userId: user_id,
        productId: productId,
      });
      console.log('Kết quả áp dụng mã khuyến mãi:', response);
      if (response.success) {
        setDiscount(response.discountPercentage);
        Alert.alert('Thành công', `Mã khuyến mãi ${promoCode} đã được áp dụng!`);
      } else {
        Alert.alert('Lỗi', 'Mã khuyến mãi không hợp lệ hoặc đã hết hạn!');
      }
    }
    catch (error) {
      console.error('Lỗi khi áp dụng mã khuyến mãi:', error);
      Alert.alert('Lỗi', 'Không thể áp dụng mã khuyến mãi. Vui lòng thử lại sau.');
    }
  };
  const placeOrder = async () => {
    try {
      const discountedPrice = product.price * quantity * (1 - discount / 100); // Tính giá sau khi giảm

      const orderData = {
        userId: user_id,
        totalAmount: discountedPrice,
        items: [
          {
            productId: product._id,
            quantity: quantity,
          },
        ],
        paymentMethod: 'COD',
      };

      console.log('Dữ liệu gửi lên:', orderData);

      const response = await axios.post('http://10.0.2.2:3001/order/cod', orderData);

      console.log('Phản hồi từ API:', response);

      if (response.status === 201) {
        Alert.alert('Thành công', 'Đơn hàng đã được đặt thành công!', [
          { text: 'OK', onPress: () => navigation.navigate('HomeScreen') },
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể đặt hàng. Vui lòng thử lại sau.');
      }
    } catch (error: any) {
      console.error('Lỗi khi đặt hàng:', error.response?.data || error.message);
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại sau.');
    }
  };
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosClient.get(`/products/${productId}`);
        setProduct(response);
      } catch (error) {
        console.error('Lỗi tải chi tiết sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axiosClient.get(`/comments/${productId}`);
        console.log('Comments:', response);

        setComments(response);
      } catch (error) {
        console.error('Lỗi tải bình luận:', error);
      }
    };

    fetchProductDetails();
    fetchComments();
  }, [productId]);

  const addComment = async () => {
    if (!commentContent.trim()) {
      Alert.alert('Lỗi', 'Nội dung bình luận không được để trống');
      return;
    }

    try {
      const response = await axiosClient.post(`/comments/${productId}`, {
        userName: user_email,
        content: commentContent,
      });
      console.log('Bình luận mới:', response);
      setComments([response, ...comments]);
      setCommentContent('');
      setShowCommentInput(false);
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={appColors.danger} style={styles.loader} />;
  }

  if (!product) {
    return <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>;
  }
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} VNĐ</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />

      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))} // Giảm số lượng, không nhỏ hơn 1
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity((prev) => prev + 1)} // Tăng số lượng
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.promoCodeContainer}>
        <TextInput
          style={styles.promoCodeInput}
          placeholder="Nhập mã khuyến mãi"
          value={promoCode}
          onChangeText={setPromoCode}
        />
        <TouchableOpacity style={styles.applyButton} onPress={applyPromoCode}>
          <Text style={styles.applyButtonText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>

      {discount > 0 && (
        <Text style={styles.discountText}>
          Đã áp dụng mã khuyến mãi: Giảm {discount}% ({((product.price * discount) / 100).toLocaleString()} đ)
        </Text>
      )}
      <View style={styles.container}>
        <Text style={styles.title}>Sản phẩm tương tự</Text>
        <FlatList
          data={similarProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            console.log('Trước khi nhấn:', showCommentInput);
            setShowCommentInput(!showCommentInput);
            console.log('Sau khi nhấn:', !showCommentInput);
          }}
        >
          <MaterialIcons name="comment" size={24} color={appColors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="shopping-cart" size={24} color={appColors.danger} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyNowButton} onPress={placeOrder}>
          <Text style={styles.buyNowText}>Mua Ngay</Text>
        </TouchableOpacity>
      </View>

      {showCommentInput && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Nhập bình luận..."
            value={commentContent}
            onChangeText={setCommentContent}
          />
          <TouchableOpacity style={styles.sendButton} onPress={addComment}>
            <Text style={styles.sendButtonText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={comments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentUser}>{item.userName}</Text>
            <Text style={styles.commentContent}>{item.content}</Text>
          </View>
        )}
        style={styles.commentList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: width, height: height / 2, resizeMode: 'cover' },
  detailsContainer: { padding: 20 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  price: { fontSize: 18, color: appColors.danger },
  errorText: { fontSize: 16, color: appColors.danger, textAlign: 'center', marginTop: 20 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderColor: appColors.gray,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  promoCodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: appColors.gray,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: appColors.danger,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  discountText: {
    color: appColors.success,
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },

  iconButton: { padding: 10 },
  buyNowButton: {
    backgroundColor: appColors.danger,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: appColors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.danger,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  buyNowText: { color: '#fff', fontWeight: 'bold' },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: appColors.gray,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: appColors.gray,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: appColors.danger,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  commentList: { marginTop: 10, paddingHorizontal: 10 },
  commentItem: { marginBottom: 10 },
  commentUser: { fontWeight: 'bold' },
  commentContent: { color: appColors.danger },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productCard: {
    width: 150,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#f00',
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;