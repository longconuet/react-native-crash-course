import { FlatList, Text, View, Image, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import { images } from "../../constants";
import { SearchInput, Trending, EmptyState, VideoCard } from "../../components";
import { searchPosts } from "../../lib/appwrite";
import useAppwrite from '../../lib/useAppwrite';
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const {query} = useLocalSearchParams();

  const [refreshing, setRefreshing] = useState(false)
  const {data: posts, refetch} = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className='my-6 px-4'>
            <Text className='font-pmedium text-sm text-gray-100'>Search Results</Text>
            <Text className='text-2xl font-psemibold text-white'>{query}</Text>

            <View className='mt-6 mb-8'>
              <SearchInput initialQuery={query} />
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

export default Search;
