import React, { useState, useEffect } from "react";
import { ScrollView, View, TouchableOpacity, Linking } from "react-native";
import { Text, Image, Box } from "native-base";

type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  distance: number;
  image: string;
  phone: string;
  address: string;
  website: string;
};

const RestaurantDetails = ({ route }: any) => {
  const [restaurantDetails, setRestaurantDetails] = useState<Restaurant | null>(
    null
  );

  const fetchRestaurantDetails = async (restaurantId: number) => {
    try {
      const response = await fetch(
        `https://absolute-initially-slug.ngrok-free.app/get-all-restaurants/`
      );
      if (response.ok) {
        const restaurants: any = await response.json();
        const restaurant = restaurants?.restaurants.find(
          (r: { id: number }) => r.id === restaurantId
        );
        if (restaurant) {
          setRestaurantDetails(restaurant);
        } else {
          console.error("Restaurant not found with ID:", restaurantId);
        }
      } else {
        console.error("Failed to fetch restaurant details");
      }
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
    }
  };

  useEffect(() => {
    const { restaurantId } = route.params;
    fetchRestaurantDetails(restaurantId);
  }, []);

  console.log(restaurantDetails);

  return (
    <ScrollView style={{ backgroundColor: "#f2f7ff" }}>
      {restaurantDetails ? (
        <View>
          <Image
            source={{ uri: restaurantDetails.image }}
            alt="Restaurant Image"
            resizeMode="cover"
            height={200}
          />
          <Box p={4}>
            <Text fontSize={24} fontWeight="bold" mb={2}>
              {restaurantDetails.name}
            </Text>
            <Text fontSize={18} mb={2}>
              Cuisine: {restaurantDetails.cuisine}
            </Text>
            <Text fontSize={18} mb={2}>
              Rating: {restaurantDetails.rating}
            </Text>
            <Text fontSize={18} mb={2}>
              Phone Number: {restaurantDetails.phone}{" "}
            </Text>
            <Text fontSize={18} mb={2}>
              Address: {restaurantDetails.address}{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                // Open the URL in the default browser when pressed
                Linking.openURL(restaurantDetails.website);
              }}
            >
              <Text fontSize={18}>Website: {restaurantDetails.website}</Text>
            </TouchableOpacity>
          </Box>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

export default RestaurantDetails;
