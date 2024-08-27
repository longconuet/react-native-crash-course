import { FlatList, Text, View, Image, RefreshControl, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import { icons, images } from "../../constants";
import { EmptyState, VideoCard, InfoBox } from "../../components";
import { getUserPosts, signOut } from "../../lib/appwrite";
import useAppwrite from '../../lib/useAppwrite';
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";

const Profile = () => {
  const {user, setUser, setIsLoggedIn} = useGlobalContext();

  const {data: posts} = useAppwrite(() => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace('/sign-in')
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className='mt-6 mb-12 px-4 w-full justify-center items-center'>
            <TouchableOpacity
              className='w-full items-end mb-10'
              onPress={logout}
            >
              <Image 
                source={icons.logout}
                className='w-6 h-6'
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View className='w-16 h-16 rounded-lg justify-center items-center'>
              <Image 
                source={{uri: user?.avatar}}
                className='rounded-lg w-[90%] h-[90%]'
                resizeMode="cover"
              />
            </View>

            <InfoBox 
              title={user?.username}
              containerStyles='mt-5'
              titleStyles='text-lg'
            />

            <View className='mt-5 flex-row'>
              <InfoBox 
                title={posts.length || 0}
                subtitle='Posts'
                containerStyles='mr-10'
                titleStyles='text-xl'
              />
              <InfoBox 
                title='1.2k'
                subtitle='Follwers'
                titleStyles='text-xl'
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title='No Videos Found'
            subtitle='No videos found for this search query' 
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
