import { View, Text, TouchableOpacity, ImageBackground, Image, Animated, Easing, FlatList } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useGlobalContext } from "../../context/GlobalProvider";
import { startOfWeek, endOfWeek, parseISO } from 'date-fns';


type BalloonType = 'Daily' | 'Weekly' | 'Monthly';

interface BalloonItem {
  description: string;
  type: BalloonType;
  completed: string;
}

interface ItemProps {
  item: BalloonItem;
}

const Progress = () => {
  const { goal, balloonArray } = useGlobalContext();
  const ropeAnimation = useRef(new Animated.Value(0)).current;
  const [dailyPress, setDailyPress] = useState(true);
  const [weeklyPress, setWeeklyPress] = useState(false);

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

  const handleWeeklyPress = () => {
   
    setDailyPress(false);
    setWeeklyPress(true);
  };

  const handleDailyPress = () => {

    setWeeklyPress(false);
    setDailyPress(true);
  };

  const measureWeek = (completedDate: string): boolean => {
    const parsedDate = parseISO(completedDate);
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    return parsedDate >= weekStart && parsedDate <= weekEnd;
  };



  const getBalloonColor = (type: BalloonType): string => {
    switch (type) {
      case 'Daily':
        return 'bg-daily';
      case 'Weekly':
        return 'bg-weekly';
      case 'Monthly':
        return 'bg-monthly';
      default:
        return 'bg-#2260ff';
    }
  };

  const Item: React.FC<ItemProps> = ({ item }) => {
    return (
      <View className={`rounded-2xl ml-2 mr-2 shadow-lg p-2 mb-2 flex-row ${getBalloonColor(item?.type)}`}>
        <View className="flex-col items-start justify-between">
          <View className="flex-row items-center space-x-2 ml-2">
            <Text className='font-textFontBase text-base text-amber-950'>{item?.description}</Text>
          </View>
          <View className='flex-row ml-2'>
            <Text className='text-[12px] italic text-amber-950'>{item?.type} |</Text>
            <Text className='text-[12px] italic text-amber-950'> Completed: {item?.completed.slice(0,10)} {item.completed?.slice(11,16)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (

    <ImageBackground
    source={require('./../../assets/backgroundsvg.png')}
    className='flex-1'
    resizeMode='cover'>
     {/* <View className='flex-1'> */}
      {/* BackGround Image  */}
      {/* <ScrollView 
        bounces={false}
        style={{ transform: [{ scaleY: -1 }] }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          style={{ transform: [{ scaleY: -1 }], flex: 1 }}
          source={require('../../assets/photo2.png')}
          className="bottom-10 right-80 flex-1"
          resizeMode='cover'
        />
      </ScrollView> */}
      {/* BackGround Image End */}

      {/* Header Text  */}
      <View className='absolute w-[100%]'>
        <View className='mt-5'>
          <View className='flex-row'>
            <Text className='ml-5 mt-10 text-3xl font-fatFont text-amber-950'>History</Text>
          </View>
          <Text className='ml-5 font-balloonFont text-[18px] text-amber-950'>{goal}</Text>
        </View>
        <View className='top-[20%] ml-5'>
        </View>

        <View className='self-start flex-row mt-10'> 
          <Text className='font-textFontBase ml-5 italic text-amber-950 self-center mr-7 opacity-80'>Your habit complition histroy</Text>
        </View>
        {/* New Text components */}
        <View className='flex-row w-full justify-center mt-5 absolute top-[95%] '>
          <TouchableOpacity className='w-[30%] self-center m-4' onPress={handleDailyPress}>
            <View className={`   ${dailyPress ? "opacity-100 border-b-4 border-amber-950 rounded-full" : ""} rounded-lg`}>
              <Text className={`p-1 text-base  text-center font-fatFont ${dailyPress ? 'text-amber-950' : 'text-orange-200'}`}>This Week</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className='w-[30%] self-center m-4' onPress={handleWeeklyPress}>
            <View className={` ${weeklyPress ? "opacity-100 border-b-4 border-amber-950 rounded-full" : ""} rounded-lg`}>
              <Text className={`p-1 text-base  text-center font-fatFont ${weeklyPress ? 'text-amber-950' : 'text-orange-200'}`}>All</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="h-[215%] w-full absolute top-[130%] self-center mt-10  " >
          <FlatList
            data={balloonArray[goal]?.reverse() as BalloonItem[]}
            renderItem={({ item }) => {
              if (dailyPress) {
                if (measureWeek(item?.completed)) {
                  
                  return <Item item={item} />;
                }
                return null;
              }
              return <Item item={item} />;
            }}
            keyExtractor={(item) => item?.completed}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    {/* </View> */}
    </ImageBackground>
  );
};

export default Progress;
