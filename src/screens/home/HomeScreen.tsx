import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { HambergerMenu } from 'iconsax-react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';
import { appColors } from '../../constants/appColors';
import axiosClient from '../../apis/axiosClient';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const auth = useSelector(authSelector);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Fetch danh mục sản phẩm
  useEffect(() => {
<<<<<<< HEAD
    setTimeout(() => {
      setProducts(
        Array.from({ length: 10 }, (_, i) => ({ id: i, name: `Sản phẩm ${i + 1}` }))
      );
    }, 1000);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </View>
  );

  return (
    <View style={{ marginTop: 75 }}>
      <StatusBar barStyle="dark-content" />
      
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <HambergerMenu size={24} color={appColors.black} />
=======
    const fetchCategories = async () => {
      try {
        const result = await axiosClient.get('/products/categories');
        setCategories(result.map((item: any) => ({
          id: item._id,
          name: item.name,
        })));
      } catch (error) {
        console.error('Lỗi tải danh mục:', error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const result = await axiosClient.get('/products/top-selling');
        setProducts(result.map((item: any) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          imageUrl: `https://your-image-url.com/${item.image}`,
        })));
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
      }
    };

    fetchCategories();
    fetchAllProducts();
  }, []);

  // Xử lý tìm kiếm sản phẩm
  const handleSearch = async () => {
    try {
      const result = await axiosClient.get('/products/getvafiller', {
        params: {
          keyword: searchKeyword,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
        },
      });
setProducts(result.map((item: any) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          imageUrl: `https://your-image-url.com/${item.image}`, // Cập nhật URL ảnh nếu cần
          categoryId: item.category,
        })));
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sản phẩm:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Thanh tìm kiếm */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <HambergerMenu size={24} color={appColors.danger} />
>>>>>>> 0ef8feb (lan3)
        </TouchableOpacity>
        <TextInput
          placeholder="Tìm sản phẩm..."
          style={styles.searchInput}
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
        <TouchableOpacity>
          <MaterialIcons name="notifications" size={24} color={appColors.danger} />
        </TouchableOpacity>
        <Image
          source={{ uri: auth?.photoUrl || 'https://example.com/default-avatar.png' }}
          style={styles.avatar}
        />
      </View>

      {/* Bộ lọc sản phẩm */}
      <View style={styles.filterContainer}>
        <TextInput
          placeholder="Giá từ (VND)"
          keyboardType="numeric"
          style={styles.priceInput}
          value={minPrice}
          onChangeText={setMinPrice}
        />
        <TextInput
          placeholder="Đến (VND)"
          keyboardType="numeric"
          style={styles.priceInput}
          value={maxPrice}
          onChangeText={setMaxPrice}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
<<<<<<< HEAD
        <View style={styles.carouselContainer}>
          <Carousel
            ref={carouselRef}
            data={imageData}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={width - 40}
            loop
            autoplay
            autoplayInterval={3000}
          />
        </View>
=======
        {/* Danh mục sản phẩm */}
        <View style={styles.categoryContainer}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.categoryItem}>
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Danh sách sản phẩm */}
        <View style={styles.productContainer}>
          <Text style={styles.sectionTitle}>Sản phẩm</Text>
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })} // Điều hướng đến trang chi tiết sản phẩm
              >
                <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
          />

        </View>
>>>>>>> 0ef8feb (lan3)
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 75,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: appColors.gray,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    justifyContent: 'space-between',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: appColors.gray,
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 5,
  },
  searchButton: {
    backgroundColor: appColors.danger,
    padding: 10,
    borderRadius: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryItem: {
    backgroundColor: appColors.gray,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  productContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 40) / 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
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
    marginTop: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: appColors.danger,
    marginTop: 3,
  },
});

export default HomeScreen;
