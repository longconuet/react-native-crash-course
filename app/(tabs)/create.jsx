import { ScrollView, Text, TouchableOpacity, View, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import {useGlobalContext} from '../../context/GlobalProvider';
import { createVideoPost } from "../../lib/appwrite";

import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { icons } from "../../constants";

import * as ImagePicker from 'expo-image-picker'
import { router } from "expo-router";

const Create = () => {
  const {user} = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    thumbnail: null,
    video: null,
    prompt: ''
  })

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      if (selectType === 'image') {
        setForm({...form, thumbnail: result.assets[0]})
      }
      if (selectType === 'video') {
        setForm({...form, video: result.assets[0]})
      }
    }
    else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  }

  const submit = async () => {
    if (!form.title || !form.prompt || !form.video || !form.thumbnail) {
      return Alert.alert('Error', 'Please provide all fields');
    }

    setUploading(true);

    try {
      await createVideoPost({...form, userId: user.$id});
      
      Alert.alert('Success', 'Created new post successfully');
      router.push('/home')
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setForm({ 
        ...form,
        title: '',
        thumbnail: null,
        video: null,
        prompt: ''
      });

      setUploading(false);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className='px-4 my-6'>
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField 
          title='Video title'
          value={form.title}
          placeholder='Video title...'
          handleChangeText={(e) => setForm({...form, title: e})}
          otherStyles='mt-10'
        />

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>
            Upload Video
          </Text>

          <TouchableOpacity
            onPress={() => openPicker('video')}
          >
            {form.video ? (
              <Video 
                source={{uri: form.video.uri}}
                className='w-full h-64 rounded-2xl'
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                <View className='w-14 h-14 border border-dashed border-secondary-100 rounded-xl justify-center items-center'>
                  <Image 
                    source={icons.upload}
                    className='w-1/2 h-1/2'
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>
            Thumbnail Image
          </Text>

          <TouchableOpacity  onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image 
                source={{uri: form.thumbnail.uri}}
                className='w-full h-64 rounded-2xl'
                resizeMode="cover"
              />
            ) : (
              <View className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2'>
                <Image 
                  source={icons.upload}
                  className='w-5 h-5'
                  resizeMode="contain"
                />
                <Text className='text-sm text-gray-100 font-pmedium'>Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField 
          title='AI Prompt'
          value={form.prompt}
          placeholder='The prompt you used to create this video...'
          handleChangeText={(e) => setForm({...form, prompt: e})}
          otherStyles='mt-7'
        />

        <CustomButton 
          title='Submit & Publish'
          containerStyles='mt-7'
          handlePress={submit}
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
