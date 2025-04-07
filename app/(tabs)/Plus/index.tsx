import React, { useState, useEffect } from "react"
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import { Formik, FormikHelpers } from "formik"
import {
  useAddProductMutation,
  useGetProductsQuery,
} from "@/store/api/serviceApiSlice"
interface FormValues {
  title: string
  price: string
  description: string
  category: string
  image: string
}
const Plus = () => {
  const [addProduct] = useAddProductMutation()
  const { data: products } = useGetProductsQuery({})
  const [open, setOpen] = useState(false)
  const [categoryItems, setCategoryItems] = useState<
    { label: string; value: string }[]
  >([])
  const [categoryValue, setCategoryValue] = useState(null)

  useEffect(() => {
    if (Array.isArray(products)) {
      const uniqueCategories = [
        ...new Set(products.map((product) => product.category)),
      ]
      setCategoryItems(
        uniqueCategories.map((cat) => ({ label: cat, value: cat }))
      )
    }
  }, [products])

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    const { title, price, description, image } = values
    if (!title || !price || !description || !categoryValue || !image) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    const newProduct = {
      ...values,
      category: categoryValue,
      price: parseFloat(values.price),
    }

    try {
      const response = await addProduct(newProduct)

      const product = response?.data

      resetForm()
      setCategoryValue(null)

      Alert.alert(
        "Success",
        `Product added successfully!\n\n` +
          `ID: ${product.id}\n` +
          `Title: ${product.title}\n` +
          `Price: $${product.price}\n` +
          `Description: ${product.description}\n` +
          `Category: ${product.category}\n` +
          `Image: ${product.image}`
      )
    } catch (error) {
      console.error("Error adding product:", error)
      Alert.alert("Error", "There was an issue adding the product.")
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Add a Product</Text>

        <Formik
          initialValues={{
            title: "",
            price: "",
            description: "",
            category: "",
            image: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View style={styles.form}>
              <TextInput
                placeholder="Title"
                style={styles.input}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                value={values.title}
              />
              <TextInput
                placeholder="Price"
                keyboardType="numeric"
                style={styles.input}
                onChangeText={handleChange("price")}
                onBlur={handleBlur("price")}
                value={values.price}
              />
              <TextInput
                placeholder="Description"
                style={styles.input}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
              />
              <Text style={styles.label}>Category</Text>
              <DropDownPicker
                placeholder="Select a category"
                open={open}
                value={categoryValue}
                items={categoryItems}
                setOpen={setOpen}
                setValue={setCategoryValue}
                setItems={setCategoryItems}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                listMode="SCROLLVIEW"
                zIndex={10}
              />
              <TextInput
                placeholder="Image URL"
                style={styles.input}
                onChangeText={handleChange("image")}
                onBlur={handleBlur("image")}
                value={values.image}
              />
              <View style={styles.buttonContainer}>
                <Button
                  title="Add"
                  color="#00C851"
                  onPress={() => handleSubmit()}
                />
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  form: {
    gap: 15,
    zIndex: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "black",
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  buttonContainer: {
    marginTop: 20,
  },
})

export default Plus
