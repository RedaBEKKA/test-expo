import { Tabs } from "expo-router"
import React from "react"
import { Platform, Text, View } from "react-native"
import { FontAwesome } from "@expo/vector-icons"

import { HapticTab } from "@/components/HapticTab"

const APK_GREEN = "#0B573A"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: APK_GREEN,
        tabBarInactiveTintColor: "#999",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 5,
          height: 60,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
        },
      }}
      initialRouteName="Home"
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Plus"
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="plus-square" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
