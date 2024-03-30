import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Text, Image, Box } from "native-base";

type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  distance: number;
  image: string;
};

const RestaurantDetails = ({ route }: any) => {
  const [restaurantDetails, setRestaurantDetails] = useState<Restaurant | null>(
    null
  );

  const fetchRestaurantDetails = async (restaurantId: number) => {
    try {
      const response = await fetch(
        `https://restaurant.free.mockoapp.net/restaurants-list/`
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
            <Text fontSize={18}>Distance: {restaurantDetails.distance} km</Text>
          </Box>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

export default RestaurantDetails;
