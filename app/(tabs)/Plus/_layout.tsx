import { Stack } from "expo-router"
import Header from "@/components/headers/Header"

export default function PlusStackLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: "#DDEAEC" },
        headerShadowVisible: false,
        header: () => <Header />,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  )
}
