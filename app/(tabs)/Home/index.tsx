import { useGetProductsQuery } from "@/store/api/serviceApiSlice"
import { useEffect, useMemo, useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"

import { FontAwesome } from "@expo/vector-icons"
import { router } from "expo-router"

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategorie, setSelectedCategorie] = useState("All")
  const { data, isLoading, error, refetch, isFetching } = useGetProductsQuery(
    {}
  )

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(data)) return []

    return data.filter((product) => {
      const matchCategory =
        selectedCategorie === "All" || product.category === selectedCategorie

      const matchSearch =
        searchTerm.trim() === "" ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase())

      return matchCategory && matchSearch
    })
  }, [data, selectedCategorie, searchTerm])
  const categories = useMemo(() => {
    if (!data || !Array.isArray(data)) return []

    const categoryMap: { [key: string]: number } = {}

    data.forEach((product: any) => {
      categoryMap[product.category] = (categoryMap[product.category] || 0) + 1
    })

    const result = Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count,
    }))

    return [
      {
        name: "All",
        count: data.length,
      },
      ...result,
    ]
  }, [data])

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#10B981" style={styles.loader} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Input de recherche */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />

      {/* Label Catégories */}
      <Text style={styles.categoriesLabel}>Categories</Text>

      {/* Catégories dynamiques */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 100, marginBottom: 20 }}
      >
        {categories.map((category, index) => {
          const isSelected = selectedCategorie === category.name
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryCard,
                isSelected && styles.selectedCategoryCard,
              ]}
              onPress={() => setSelectedCategorie(category.name)}
            >
              <Text
                style={[
                  styles.categoryTitle,
                  isSelected && styles.selectedCategoryTitle,
                ]}
              >
                {category.name}
              </Text>
              <Text style={styles.categoryCount}>{category.count} items</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Label Produits */}

      <Text style={styles.productsLabel}>Products</Text>

      {/* Liste des produits */}
      <ScrollView
        style={styles.productList}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
      >
        {Array.isArray(data) &&
          filteredProducts.map((product: any) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/Home/Details",
                  params: { productId: product.id },
                })
              }
            >
              <View style={styles.productImageContainer}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{product.rating.rate}</Text>
                  <FontAwesome
                    name="star"
                    size={16}
                    color="gold"
                    style={{ marginLeft: 5 }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 15,
  },
  categoriesLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryScroll: {
    marginBottom: 20,
    height: 150,
  },
  categoryCard: {
    padding: 10,
    marginRight: 15,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    height: 80,
    width: 120,
    justifyContent: "space-between",
  },
  selectedCategoryCard: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  selectedCategoryTitle: {
    color: "white",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    height: "80%",
  },
  categoryCount: {
    marginTop: 5,
    fontSize: 12,
    color: "#555",
  },
  greenText: {
    color: "#10B981",
    fontWeight: "bold",
  },
  productsLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productList: {
    flex: 1,
  },
  productCard: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productCategory: {
    backgroundColor: "#0B573A",
    color: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  ratingText: {
    fontSize: 12,
    color: "#555",
  },
})

export default Home
