import { View, Text, Image } from 'react-native';
import { Tabs } from 'expo-router';
import {icons} from '../../constants';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center">
      <Image
        source={icon}
        resizeMode="contain"
        style={{ tintColor: color, width: 24, height: 24, marginTop: 22 }}
      />
      <View style={{ width: 70, alignItems: 'center' }}>
        <Text 
          className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} 
          style={{ color: color }}>
          {name}
        </Text>
      </View>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#D3D3D3', // Light gray when active
        tabBarInactiveTintColor: 'gray', // Dark gray when inactive
        tabBarInactiveBackgroundColor: 'black',
        tabBarStyle: {
          backgroundColor: 'black', // Overall background color
          borderTopWidth: 1,
          borderTopColor: '#232533',
          height: 84,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarItemStyle: {
          flex: 1, // Ensures tabs are evenly spaced
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          headerShown: false,
          gestureEnabled: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.map}
              color={color}
              name="Map"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="event"
        options={{
          title: 'Event',
          headerShown: false,
          gestureEnabled: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.sport}
              color={color}
              name="Event"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          gestureEnabled: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;