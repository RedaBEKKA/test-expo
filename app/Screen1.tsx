import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import { useRouter } from "expo-router"

export default function Screen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      {/* Partie supérieure avec le logo */}
      <View style={styles.topSection}>
        <Image
          source={require("../assets/images/logoProducts.png")}
          style={styles.logo}
        />
      </View>

      {/* Partie inférieure avec le texte et le bouton */}
      <View style={styles.bottomSection}>
        <Text style={styles.title}>Bienvenue dans l'application</Text>
        <Text style={styles.description}>
          Gérez vos produits facilement et efficacement avec notre application
          intuitive.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("/auth/Login")
          }}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F8",
    padding: 20,
  },
  topSection: {
    // flex: 1,
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B573A",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#5E6D55",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#0B573A",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})
