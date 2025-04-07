import { Stack } from "expo-router"
import Header from "@/components/headers/Header"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function ProfileStackLayout() {
  const insets = useSafeAreaInsets()

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
