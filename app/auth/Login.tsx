import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useLoginMutation } from "@/store/auth/authApiSlice"
import { router } from "expo-router"
import { useDispatch } from "react-redux"
import { setToken, setUser } from "@/store/auth/authSlice"

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({
    userName: "",
    password: "",
  })

  const dispatch = useDispatch()
  const [login, { isLoading, isError, error }] = useLoginMutation() // Utilisation du hook pour gérer le login et l'état

  const validateInputs = () => {
    const errors = {
      userName: "",
      password: "",
    }

    if (!userName) {
      errors.userName = "Email is required"
    }
    if (!password) {
      errors.password = "Password is required"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    setErrors(errors)

    // Return true if no errors
    return !errors.userName && !errors.password
  }

  const handleLogin = async () => {
    if (validateInputs()) {
      try {
        const result = await login({ username: userName, password })
        if (result.error) {
          const errorData =
            (result.error as any).data || "Login failed. Please try again."
          alert(errorData)
        } else {
          const token = result.data.token
          dispatch(setToken(token))
          dispatch(setUser(userName))
          router.push("/(tabs)/Home")
        }
      } catch (err) {
        console.error("Login failed: ", err)
        alert("An error occurred. Please try again later.")
      }
    }
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/logoProducts.png")}
        style={styles.logo}
      />

      {/* Title & Description */}
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.description}>
        Connectez-vous pour gérer vos produits facilement.
      </Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>UserName</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Name"
          keyboardType="default"
          value={userName}
          onChangeText={setUserName}
        />
        {errors.userName ? (
          <Text style={styles.errorText}>{errors.userName}</Text>
        ) : null}
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={{ backgroundColor: "#FFF", paddingVertical: 12, flex: 1 }} // Stretch the input to take available space
            placeholder="Enter your password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.iconWrapper}
          >
            <FontAwesome
              name={passwordVisible ? "eye" : "eye-slash"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <View style={styles.footerText}>
        <Text style={styles.forgetPassword}>Forgot Password? </Text>
        <TouchableOpacity>
          <Text style={styles.resetPassword}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7F8",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B573A",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#5E6D55",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  iconWrapper: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#0B573A",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  footerText: {
    flexDirection: "row",
    marginTop: 15,
  },
  forgetPassword: {
    fontSize: 14,
    color: "#333",
  },
  resetPassword: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0B573A",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
})
