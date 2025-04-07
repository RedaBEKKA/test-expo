import React from "react"
import { View, Text, StyleSheet, Platform } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useSelector } from "react-redux"

const Index = () => {
  const userName = useSelector((state: any) => state.auth.userName)
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 5 }]}>
      {/* Côté gauche */}
      <View style={styles.leftContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
        {userName && <Text style={styles.nameText}>{userName}</Text>}
      </View>

      {/* Côté droit */}
      <View style={styles.rightContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logoProducts.png")}
            style={styles.logo}
          />
        </View>
        <FontAwesome name="bars" size={28} color="black" style={styles.icon} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    elevation: 5,
    ...Platform.select({
      ios: {
        paddingTop: 20, // Ajouter un padding supplémentaire pour iOS si nécessaire
      },
      android: {
        paddingTop: 10, // Padding pour Android
      },
    }),
  },
  leftContainer: {
    flexDirection: "column",
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: "normal",
    color: "black",
  },
  nameText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    marginRight: 15,
  },
  logo: {
    width: 45,
    height: 45,
  },
  icon: {
    marginLeft: 15,
  },
})

export default Index
