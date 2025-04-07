import { Stack } from "expo-router"
import Header from "@/components/headers/Header"

export default function HomeStackLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: "#DDEAEC" },
        headerShadowVisible: false,
        header: () => <Header />,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Acceuil" }} />
      <Stack.Screen name="Details" options={{ title: "Details" }} />
    </Stack>
  )
}
