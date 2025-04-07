import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useRouter, Slot } from "expo-router"

export default function AuthLayout() {
  const router = useRouter()
  const token = useSelector((state: any) => state.auth.token)

  useEffect(() => {
    if (token) {
      router.replace("/(tabs)/Home")
    }
  }, [token])

  return <Slot /> // Affiche les écrans enfants comme Login
}
