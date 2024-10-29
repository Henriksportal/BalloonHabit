import { View, Text, StatusBar, TouchableOpacity, ScrollView, Animated, Easing, TextInput, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BalloonSvg from '../../assets/svg/BalloonSvg';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MemoizedBackgroundImage } from '../../assets/MemoizedImage';
import { useGlobalContext } from "../../context/GlobalProvider";
import BasketBalloonSvg from '@/assets/svg/BasketBalloonSvg';
import HeaderBalloonSvg from '@/assets/svg/HeaderBalloonSvg';
import CreateHabitBalloonSvg from '@/assets/svg/CreateHabitBalloonSvg';
import BasketBalloonNoRope from '@/assets/svg/BasketBalloonNoRope';



type BalloonType = 'Daily' | 'Weekly' | 'Monthly' | null;

const CreateHabit = () => {
  const { goal, refetch } = useGlobalContext();
 
  const router = useRouter();
  const ropeAnimation = useRef(new Animated.Value(0)).current;
  const [selectedBalloon, setSelectedBalloon] = useState<BalloonType>("Daily");
  const [selectedBalloonButton, setSelectedBalloonButton] = useState("");
  const [selectedBalloonColor, setselectedBalloonColor] = useState("")
  const [buttonSelectedToday, setButtonSelectedToday] = useState(true)
  const [buttonSelectedNext, setButtonSelectedNext] = useState(false)
  const [habitText, setHabitText] = useState("");

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ropeAnimation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(ropeAnimation, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();


  }, []);

  useEffect(() => {
    switch (selectedBalloon) {
      case 'Daily':
        return setSelectedBalloonButton("Tomorrow"), setselectedBalloonColor("text-daily");
      case 'Weekly':
        return setSelectedBalloonButton("Next Week"), setselectedBalloonColor("text-weekly");
      case 'Monthly':
        return setSelectedBalloonButton("Next Month"), setselectedBalloonColor("text-monthly");
      default:
        return setSelectedBalloonButton("");
    }
  }, [selectedBalloon]);


  const handleBalloonPress = (balloonType: BalloonType) => {
    setSelectedBalloon(balloonType);
  };

  const handleSelectorPress = () => {
    setButtonSelectedToday(true)
    setButtonSelectedNext(false)
  }

  const handleSelectorPressTwo = () => {
    setButtonSelectedNext(true)
    setButtonSelectedToday(false)
  }

  const getBalloonColor = (type: BalloonType, bool: boolean) => {
  
    switch (type) {
      case 'Daily':
        if(bool) {
          return 'daily';
        }
        return '#FDFD96';  // Yellow
      case 'Weekly':
        if(bool) {
          return 'weekly';
        }
        return '#ffa164';  // Orange
      case 'Monthly':
        if(bool) {
          return 'monthly';
        }
        return '#2196F3';  // Blue
      default:
        return '#2260ff';  // White
    }
  };

  const saveHabit = async () => {
    if (!selectedBalloon || !habitText) {
      Alert.alert("Error", "Please select a habit type and enter a habit description.");
      return;
    }

    const startDate = buttonSelectedToday ? new Date() : new Date(Date.now() + 24 * 60 * 60 * 1000); // Today or Tomorrow
    const habit = {
      id: Date.now().toString(), // Generate a unique ID
      type: selectedBalloon,
      description: habitText,
      startDate: startDate.toISOString(),
      createdAt: new Date().toISOString(),
      goal: goal,
      popped: 0,
      completed: 0,
      lastCompletedDate: null,  
      lastPoppedDate: null, 
    };

    try {
      const existingHabits = await AsyncStorage.getItem('habits');
      let habits = existingHabits ? JSON.parse(existingHabits) : [];
      
      // Ensure habits is an array
      if (!Array.isArray(habits)) {
        habits = [];
      }
      
      // Use spread operator to create a new array with the existing habits and the new habit
      const updatedHabits = [...habits, habit];
      
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
      Alert.alert("Success", "Habit created successfully!");
      setHabitText("");
      setSelectedBalloon(null);
      setButtonSelectedToday(false);
      setButtonSelectedNext(false);
      
      // Call getData after saving to log the updated habits
      // getData();
      refetch()
      router.push("/checklist")
    } catch (error) {
      console.error("Error saving habit:", error);
      Alert.alert("Error", "Failed to save habit. Please try again.");
    }
  };

  return (
    <View className='flex-1'>
      {/* BackGround Image  */}
      <ScrollView bounces={false}
      style={{ transform: [{ scaleY: -1 }] }}
      showsVerticalScrollIndicator={false}>
        <MemoizedBackgroundImage />
      </ScrollView>
      {/* BackGround Image End */}
      {/* Header Text  */}

            <View className='absolute w-full'>
        <View className='mt-5'>
          <View className='flex-row'>
            <Text className='ml-5 mt-10 text-3xl font-fatFont text-amber-950'>Create Habit</Text>
            
            {/* Balloon that directs user to Create Habit page */}
            <TouchableOpacity  onPress={() => {
              router.push('/checklist');
            }} className='absolute mt-5 self-start left-[75%]'>
              <HeaderBalloonSvg style={{ width: 80, height: 80 }} />
              <Text className='absolute self-center top-[28%] text-xs font-bubbleFont text-center text-amber-950'>{`Back`}</Text>
            </TouchableOpacity>
          </View>
          {/* Balloon that directs user to Create Habit page END */}

          <Text className='ml-5 italic font-extralight font-balloonFont text-[18px] text-amber-950'>{goal}</Text>
        </View>
        </View>

      <View className='absolute top-40 w-full px-5 '>
        <View className='flex-row justify-between'>
          {(['Daily', 'Weekly', 'Monthly'] as const).map((type) => (
            <TouchableOpacity key={type} onPress={() => handleBalloonPress(type)} className='items-center'>
              <Text className={`font-fatFont text-${getBalloonColor(type, true)} ${selectedBalloon === type ? null: 'opacity-40'} ` }>{type}</Text>
              {selectedBalloon === type ? (
                <BasketBalloonNoRope ropeAnimation={ropeAnimation} style={{ width: 100, height: 100}}  color={getBalloonColor(type, false)} />
              ) : (
                <View style={{ borderRadius: 50, overflow: 'hidden' }} className='opacity-40'>
                  <BasketBalloonNoRope ropeAnimation={ropeAnimation} style={{ width: 100, height: 100 }} color={getBalloonColor(type, false)} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedBalloon && (
          <View className='mt-5'>
            <Text className='italic font-textFontBase text-amber-950 opacity-80'>Write your {selectedBalloon.toLowerCase()} habit:</Text>
            <TextInput
              className='border-b-2 border-amber-950 rounded-lg p-2 h-[15%] text-base font-textFontBase text-amber-950'
              placeholderTextColor="#161616" 
              value={habitText}
              onChangeText={setHabitText}
              maxLength={45}
            />  
            <Text className='mt-10  italic font-textFontBase text-amber-950 opacity-80'>When do you want to start tracking the habit?</Text>
            <View className='mt-5 flex-row pb-5'>
              <TouchableOpacity onPress={handleSelectorPress} className={`ml-12 mt-5 p-2 rounded-lg ${buttonSelectedToday ? `border-4 border-amber-950` : null } black`}>
                <Text className={`${buttonSelectedToday ? "font-textFontBase" : null } font-textFontBase text-amber-950`}> Today</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSelectorPressTwo} className={`ml-10 mt-5 p-2 rounded-lg  border-black ${buttonSelectedNext ? "border-4 border-amber-950" : null }`}>
                <Text className={`${!buttonSelectedToday ? "font-textFontBase" : null } font-textFontBase text-amber-950`}>{selectedBalloonButton}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={saveHabit} className={`mt-5 shadow-xl rounded-full w-[50%] self-center`}>
              
              <Text className={`text-5xl font-balloonFont  p-2 self-center ${selectedBalloonColor}`}>Create</Text>

            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default CreateHabit;
