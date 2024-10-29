import { View, Text } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import { Stack } from 'expo-router/stack';


import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const TabsLayout = () => {
  
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'rgb(69 26 3)',
          tabBarInactiveTintColor: 'rgb(254 215 170)',
          tabBarStyle: { backgroundColor: 'transparent', borderColor: 'transparent', borderBlockColor: 'transparent', position: 'absolute' },
          headerShown: false,
          tabBarLabelStyle: {
            fontFamily: 'fatFont',
            fontSize: 12
          }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="airballoon" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="checklist"
          options={{
            title: 'Checklist',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="balloon" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <MaterialIcons name="history" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="createhabit"
          options={{
            href:null, 
            tabBarStyle: {
              display: "none",
            },
            title: 'Create Habit',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="plus-circle-outline" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="edithabit"
          options={{
            href: null,
            title: 'Edit Habit',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="pencil" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            href: null,
            title: 'Stats',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-bar" size={24} color={color} />,
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout
