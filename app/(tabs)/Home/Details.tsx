import React, { useState, useMemo, useEffect } from "react"
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useLocalSearchParams, router } from "expo-router"
import { Formik } from "formik"
import { TextInput } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"

import {
  useDeleteProductByIdMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useGetProductsQuery,
} from "@/store/api/serviceApiSlice"
interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

const ProductDetails = () => {
  const { productId } = useLocalSearchParams()
  const { data, isLoading, error } = useGetProductByIdQuery(productId)
  const [deleteProduct] = useDeleteProductByIdMutation()
  const [updateProduct] = useUpdateProductMutation()
  const { data: allProducts } = useGetProductsQuery({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [open, setOpen] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [categoryItems, setCategoryItems] = useState<
    { label: string; value: string }[]
  >([])

  useEffect(() => {
    data && setProduct(data)
  }, [data])

  useEffect(() => {
    if (Array.isArray(allProducts)) {
      const uniqueCategories = [
        ...new Set(allProducts.map((product) => product.category)),
      ]
      setCategoryItems(
        uniqueCategories.map((cat) => ({ label: cat, value: cat }))
      )
    }
  }, [allProducts])

  const handleDelete = () => {
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(productId)
            Alert.alert("Deleted", "Product has been deleted.")
            router.push("/(tabs)/Home")
          } catch {
            Alert.alert("Error", "Unable to delete product.")
          }
        },
      },
    ])
  }

  const handleUpdate = async (values: any) => {
    try {
      const { title, description, category, image, price } = values
      if (!title || !description || !category || !image || !price) {
        Alert.alert("Error", "Please fill in all fields")
        return
      }

      const response = await updateProduct({
        id: productId,
        updatedProduct: values,
      })
      // The API response does not return the complete product object (e.g., no `id` or `rating`).
      // So we update only the editable fields and keep the rest of the original product data.
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              title: response.data.title,
              description: response.data.description,
              category: response.data.category,
              image: response.data.image,
              price: parseFloat(response.data.price),
            }
          : prev
      )
      Alert.alert("Success", "Product updated successfully.")
      setIsEditMode(false)
    } catch (error) {
      Alert.alert("Error", "Failed to update product.")
    }
  }

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error loading product</Text>

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Bouton retour */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: data.image }} style={styles.productImage} />
        </View>

        {/* Boutons Edit / Delete */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditMode((prev) => !prev)}
          >
            <Text style={styles.buttonText}>
              {isEditMode ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {isEditMode && product ? (
          <Formik
            initialValues={{
              title: product.title,
              description: product.description,
              category: product.category,
              price: String(product.price),
              image: product.image,
            }}
            onSubmit={handleUpdate}
          >
            {({ handleChange, handleSubmit, values, setFieldValue }) => (
              <ScrollView
                contentContainerStyle={{ paddingBottom: 30 }}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={values.title}
                  onChangeText={handleChange("title")}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  multiline
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  value={values.price}
                  onChangeText={handleChange("price")}
                  keyboardType="numeric"
                />

                <DropDownPicker
                  items={categoryItems}
                  open={open}
                  setOpen={setOpen}
                  value={values.category}
                  setValue={(callback) =>
                    setFieldValue("category", callback(values.category))
                  }
                  setItems={setCategoryItems}
                  placeholder="Select a category"
                  style={{ marginBottom: 20 }}
                  listMode="SCROLLVIEW"
                  zIndex={10}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Image URL"
                  value={values.image}
                  onChangeText={handleChange("image")}
                />
                <TouchableOpacity
                  onPress={() => {
                    handleSubmit()
                  }}
                  style={[styles.saveButton, { marginTop: 10 }]}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </Formik>
        ) : (
          product && (
            <ScrollView style={styles.productDetails}>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
              <Text style={styles.productDescription}>
                {product.description}
              </Text>
            </ScrollView>
          )
        )}

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{data.rating.rate}</Text>
          <FontAwesome name="star" size={16} color="gold" />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  productImage: {
    width: "30%",
    height: 200,
    resizeMode: "contain",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },

  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
    width: "50%",
    // marginLeft: 10,
    alignSelf: "center",
    alignItems: "center",
  },

  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  productDetails: {
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  productCategory: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  productDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  ratingText: {
    fontSize: 18,
    marginRight: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
})

export default ProductDetails
