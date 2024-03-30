import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Center,
  Heading,
  Input,
  Stack,
  Text,
  Image,
  VStack,
  Skeleton,
} from "native-base";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Menu } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

import { restaurants } from "../services/mockData.json";

type HomeType = {
  navigate?: any;
};

const HomeScreen: React.FC<HomeType> = ({ navigate }) => {
  const [userLocation, setUserLocation] = useState("Olmazor");
  const [restaurantList, setRestaurantList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let location = await getLocation();
        setUserLocation(location);

        let apiUrl = `https://restaurant.free.mockoapp.net/restaurants-list/`;

        if (location) {
          apiUrl += `?location=${location}`;
        }

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRestaurantList(data.restaurants);
        } else {
          console.error("Failed to fetch restaurant data");
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userLocation]);

  // Function to get the user's current location
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return "Olmazor";
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        return `${location.coords.latitude},${location.coords.longitude}`;
      } catch (error) {
        console.log("Error getting current location:", error);
        return "Olmazor";
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      return "Olmazor";
    }
  };

  console.log(restaurantList);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 14,
          backgroundColor: "#f2f7ff",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        {/* User's Location Input */}
        <Input
          mt={4}
          width={"20%"}
          placeholder="Enter location"
          variant="unstyled"
          value={userLocation}
          onChangeText={(text) => setUserLocation(text)}
        />
      </View>

      {/* Asosiy kontent qismi */}
      <ScrollView style={{ flex: 1 }}>
        {loading ? (
          <Center w="100%" style={{ marginTop: 16 }}>
            <VStack
              w="90%"
              maxW="400"
              borderWidth="1"
              space={8}
              overflow="hidden"
              rounded="md"
              _dark={{
                borderColor: "coolGray.500",
              }}
              _light={{
                borderColor: "coolGray.200",
              }}
            >
              <Skeleton height={40} />
              <Skeleton.Text px={4} />
              <Skeleton px={4} my={4} rounded="md" startColor="primary.100" />
            </VStack>
          </Center>
        ) : restaurantList && restaurantList.length === 0 ? (
          <Center w="100%" style={{ marginTop: 16 }}>
            <Text>No results found</Text>
          </Center>
        ) : (
          restaurantList?.map((restaurant: any, index) => (
            <Pressable
              key={index}
              onPress={() =>
                navigation.navigate("RestaurantDetails", {
                  restaurantId: restaurant.id,
                })
              }
              style={{
                margin: 16,
                borderRadius: 8,
                overflow: "hidden",
                borderColor: "coolGray.200",
                borderWidth: 1,
                backgroundColor: "gray.50",
              }}
            >
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: restaurant.image }}
                  alt="Restaurant Image"
                  resizeMode="cover"
                  height={200}
                />
                <Center
                  bg="violet.500"
                  _dark={{ bg: "violet.400" }}
                  _text={{
                    color: "warmGray.50",
                    fontWeight: "700",
                    fontSize: "xs",
                  }}
                  position="absolute"
                  left={0}
                  bottom={0}
                  px={3}
                  py={1.5}
                >
                  TOP
                </Center>
              </View>
              <Stack p={4} space={3}>
                <Stack space={2}>
                  <Heading size="md" ml={-1}>
                    {restaurant.name}
                  </Heading>
                  <Text
                    fontSize="xs"
                    _light={{ color: "violet.500" }}
                    _dark={{ color: "violet.400" }}
                    fontWeight="500"
                    ml={-0.5}
                    mt={-1}
                  >
                    {restaurant.cuisine}
                  </Text>
                </Stack>
                <Text fontWeight="400">Rating: {restaurant.rating}</Text>
                <Text fontWeight="400">Distance: {restaurant.distance} km</Text>
              </Stack>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
