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
  Modal,
  Button,
  Popover,
  HStack,
  Icon,
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
import { SelectList } from "react-native-dropdown-select-list";

// Sample cuisines data
const cuisinesData = [
  { id: 1, name: "Italian" },
  { id: 2, name: "Mexican" },
  { id: 3, name: "Chinese" },
  { id: 4, name: "Indian" },
];

type HomeType = {
  navigate?: any;
};

const HomeScreen: React.FC<HomeType> = ({ navigate }) => {
  const [userLocation, setUserLocation] = useState("");
  const [restaurantList, setRestaurantList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState<any>(null);
  const [allRestaurantsChecked, setAllRestaurantsChecked] = useState(false);
  const [selectedTab, setSelectedTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSearchPress = () => {
    // setSelectedTab("search");
    setShowSearchModal(true);
  };

  const handleSearchSubmit = () => {
    console.log("Search submitted with query:", searchQuery);
    // Close the modal
    setShowSearchModal(false);

    fetchData();
  };

  const navigation = useNavigation<any>();

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [userLocation, allRestaurantsChecked, selectedCuisine])
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      let apiUrl =
        "https://absolute-initially-slug.ngrok-free.app/get-nearby-restaurants/";
      if (allRestaurantsChecked) {
        apiUrl = `https://absolute-initially-slug.ngrok-free.app/get-all-restaurants/?name=${searchQuery}&address=${userLocation}`;
      } else {
        const location = await getLocation();
        apiUrl += `?latitude=${location.latitude}&longitude=${location.longitude}`;
      }

      if (selectedCuisine) {
        apiUrl += `&cuisine=${selectedCuisine}`;
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

  console.log(restaurantList);

  // Function to get the user's current location
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return { latitude: 0, longitude: 0 };
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        console.log(location);
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
      } catch (error) {
        console.log("Error getting current location:", error);
        return { latitude: 0, longitude: 0 };
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      return { latitude: 0, longitude: 0 };
    }
  };

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
          width={"50%"}
          placeholder="Enter location"
          variant="unstyled"
          value={userLocation}
          onChangeText={(text) => setUserLocation(text)}
        />
        
        {/* Checkbox to toggle all restaurants */}
        <TouchableOpacity
          onPress={() => setAllRestaurantsChecked(!allRestaurantsChecked)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            <MaterialIcons
              name={
                allRestaurantsChecked ? "check-box" : "check-box-outline-blank"
              }
              size={24}
              color="black"
            />
            <Text>Show All Restaurants</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content Part */}
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10, marginRight: 16 }}>
          <SelectList
            setSelected={(val: any) => setSelectedCuisine(val)}
            data={cuisinesData.map((category) => ({
              key: category.id,
              value: category.name,
            }))}
            save="value"
            placeholder="Select cuisine"
          />
        </View>
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
        ) : restaurantList?.length === 0 ? (
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
                <Text fontWeight="400">
                  Distance:{" "}
                  {restaurant.distance ? restaurant?.distance?.toFixed(2) : 0}{" "}
                  km
                </Text>
              </Stack>
            </Pressable>
          ))
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          // padding: 16,
          paddingLeft: 14,
          paddingRight: 14,
          paddingBottom: 10,
          paddingTop: 14,
          backgroundColor: "#f2f7ff",
        }}
      >
        {/* Search Tab */}
        <Pressable onPress={handleSearchPress}>
          <HStack
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Icon
              as={<MaterialIcons name="search" />}
              size={5}
              color={selectedTab === "search" ? "#2d68f6" : "#6d6c6f"}
            />
            <Text color={selectedTab === "search" ? "#2d68f6" : "#6d6c6f"}>
              Search
            </Text>
          </HStack>
        </Pressable>
      </View>

      {/* Search Modal */}
      <Modal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)}>
        <Modal.Content>
          <Modal.Header>Search</Modal.Header>
          <Modal.Body>
            <Input
              placeholder="Enter name of the restaurant"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button onPress={handleSearchSubmit}>Submit</Button>
              <Button
                colorScheme="secondary"
                onPress={() => setShowSearchModal(false)}
              >
                Cancel
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;
