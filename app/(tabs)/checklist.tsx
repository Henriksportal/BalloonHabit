import { View, Text, StatusBar, TouchableOpacity, ScrollView, Animated, Easing, FlatList, Button, Alert, Switch } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'expo-router';
import { router } from 'expo-router';

import { MemoizedBackgroundImage } from '../../assets/MemoizedImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHabits from '../../components/RenderHabits';
import { useGlobalContext } from "../../context/GlobalProvider";
import RenderHabitAlter from '../../components/RenderHabitAlter';
import { format, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import HeaderBalloonSvg from '@/assets/svg/HeaderBalloonSvg';
import CountdownCheck from '@/components/CountdownCheck';




interface Habit {
  id: string;
  type: "Daily" | "Weekly" | "Monthly";
  status: boolean;
  completed: number;
  description: string;
  startDate: string;
  createdAt: string;
  goal: string;
  popped: number;
  lastCompletedDate: string;
}


const Checklist = () => {

  const ropeAnimation = useRef(new Animated.Value(0)).current;
  const [habitType, setHabitType] = useState<"Daily" | "Weekly" | "Monthly">("Daily")
  // const [totalCompleted, setTotalCompleted] = useState(0)

  const [dailyPress, setDailyPress] = useState(true)
  const [weeklyPress, setWeeklyPress] = useState(false)
  const [monthlyPress, setMonthlPress] = useState(false)
  const [balloonColor, setBalloonColor] = useState("bg-daily")
  const { goal, data, setData, refetchBalloon, refetch} = useGlobalContext();
  const [editPress, setEditPress] = useState(false)
  const [showTime, setShowTime] = useState(true)


  console.log(data, '------------------------ \n ------------------')

  const handleDailyPress = () => {
    setHabitType("Daily")
    setDailyPress(true)
    setWeeklyPress(false)
    setMonthlPress(false)
    setBalloonColor("bg-daily")
  }

  const handleWeeklyPress = () => {
    setHabitType("Weekly")
    setDailyPress(false)
    setWeeklyPress(true)
    setMonthlPress(false)
    setBalloonColor("bg-weekly")
  }

  const handleMonthlyPress = () => {
    setHabitType("Monthly")
    setDailyPress(false)
    setWeeklyPress(false)
    setMonthlPress(true)
    setBalloonColor("bg-monthly")
  }



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

  const handleCreatePress = () => {
    router.push({
      pathname: '/createhabit',
    });
  };

  const updateBalloons = async (type: "Daily" | "Weekly" | "Monthly", description :string) => {
    try {

      const balloonsString = await AsyncStorage.getItem('Balloons');
      let balloons = balloonsString ? JSON.parse(balloonsString) : {};
  
      if (!balloons[goal]) {
        balloons[goal] = [];
      }

      // balloons[goal].push(type);
      balloons[goal].push({
        type: type,
        completed: new Date(),
        description: description
    });
    
      await AsyncStorage.setItem('Balloons', JSON.stringify(balloons));
      console.log(`Updated Balloons: ${JSON.stringify(balloons)}`);
    } catch (error) {
      console.error('Error updating Balloons:', error);
    }
  };

  const habitCompleted = async (id: string) => {
    try {
      console.log(id);
      const updatedData = data.map((habit: Habit) => {
        if (habit.id === id) {
          updateBalloons(habit.type, habit.description);
          return {
            ...habit,
            completed: habit.completed + 1,
            lastCompletedDate: new Date().toISOString(),
          };
        }
        return habit;
      });

      // Update state and AsyncStorage
      setData(updatedData);
      await AsyncStorage.setItem('habits', JSON.stringify(updatedData));
      refetchBalloon();

    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  const handleDelete = (id: string) => {
    const updatedData = data.filter((habit: Habit) => habit.id !== id);
    setData(updatedData);
    AsyncStorage.setItem('habits', JSON.stringify(updatedData));
  };

  // const handleConfirm = (item: Habit) => {
  //   Alert.alert(
  //     'Confirmation',
  //     'Are you sure you want to proceed?',
  //     [
  //       {
  //         text: 'Cancel',
  //         onPress: () => null,
  //       },
  //       {
  //         text: 'Yes',
  //         onPress: () => handleDelete(item.id),
  //       },
  //     ],
  //     { cancelable: false } // Prevent the dialog from closing on touch outside
  //   );
  // };






  const isLastCompletedInTimeframe = (item) => {

    if (!item?.lastCompletedDate) return false;
    
    
    try {
      const lastCompletedDate = parseISO(item.lastCompletedDate);
      
      switch (item.type) {
        case 'Daily':
         
          return isToday(lastCompletedDate);
        
        case 'Weekly': {
          const weekStart = startOfWeek(new Date());
          const weekEnd = endOfWeek(new Date());
          return lastCompletedDate >= weekStart && lastCompletedDate <= weekEnd;
        }
        
        case 'Monthly': {
          const monthStart = startOfMonth(new Date());
          const monthEnd = endOfMonth(new Date());
          return lastCompletedDate >= monthStart && lastCompletedDate <= monthEnd;
        }
        
        default:
          
          return false;
      }
    } catch (error) {
      // If there's any error parsing the date, return false
      return false;
    }
  };

 

  const Item = ({ item }: { item: Habit }) => {
    const lastTap = useRef(0);
    const handleDoublePress = () => {
      const now = Date.now();
      const DOUBLE_PRESS_DELAY = 300;
      if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
        habitCompleted(item.id);
      } else {
        lastTap.current = now;
      }
    };
    
    console.log(item.description, !isLastCompletedInTimeframe(item))
    if (!editPress &&  !isLastCompletedInTimeframe(item)){
   
      return (
        <View>
           <TouchableOpacity onPress={handleDoublePress}>
          <View className={`rounded-2xl ml-2 mr-2 shadow-lg p-4 mb-4  flex-row ${balloonColor} `}>
            <RenderHabits data={item} />
          
          </View>
          </TouchableOpacity>
          
        </View>
      );
    } else if (editPress) {
      return (
        <View className=''>
         <View className={`rounded-2xl ml-2 mr-2 shadow-md p-4 mb-4  flex-row ${balloonColor} `}>
            <RenderHabitAlter data={item} onDelete={() => handleDelete(item.id)} />
          </View>
        </View>
      );
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
            <Text className='ml-5 mt-10 text-3xl font-fatFont text-amber-950'>Checklist</Text>
            
            {/* Balloon that directs user to Create Habit page */}
            <TouchableOpacity onPress={handleCreatePress} className='absolute mt-5 self-start left-[75%]'>
              <HeaderBalloonSvg  style={{ width: 80, height: 80 }} />
              <Text className='absolute top-[20%] self-center text-xs text-center font-bubbleFont text-amber-950'>{` Create\nHabit`}</Text>
            </TouchableOpacity>
          </View>
          {/* Balloon that directs user to Create Habit page END */}
          <Text className='ml-5  text-[18px] font-balloonFont text-amber-950'>{goal}</Text>
        </View>


        {/* new seg */}
        <View className='self-start flex-row mt-5 '>  
          <Text className='font-textFontBase ml-5 italic text-amber-950 opacity-80 self-center mr-2'>Double Click to complete a habit</Text>
          <View className='opacity-50'>          
              <Button title={`${!editPress ? "Edit" : "Done"}`} onPress={(() =>{
                setEditPress(!editPress)
              })} />
          </View>

        </View>
       
        {/* Habit List */}
        <View className='flex-row w-full justify-center mt-5 absolute top-40'>
        
          <TouchableOpacity className='w-[25%] self-center m-2' onPress={handleDailyPress}>
              <View className={`  ${dailyPress ?  "  opacity-100 border-b-4 border-daily rouned-full": "opacity-20"} rounded-lg`}>
                <Text className='p-1 text-base text-center font-fatFont text-daily'>Daily</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity className='w-[25%] self-center m-2' onPress={handleWeeklyPress}>
              <View className={`  ${weeklyPress ? "  opacity-100  border-b-4 border-weekly rouned-full": "opacity-20"} rounded-lg`}>
                <Text className='p-1 text-base text-center font-fatFont text-weekly' >Weekly</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity className='w-[25%] self-center m-2' onPress={handleMonthlyPress}>
              <View className={` ${monthlyPress ? " opacity-100  border-b-4 border-monthly rouned-full": "opacity-20"} rounded-lg`}>
                <Text className='p-1 text-base text-center font-fatFont text-monthly'>Monthly</Text>
              </View>
          </TouchableOpacity>
        
     
        </View>
        
        <Animated.View className="h-[200%] w-full absolute top-[120%] self-center mt-10">
        <FlatList
            data={data}
            renderItem={({ item }) => {
        
              console.log(item.description, item.goal, "baba")
              if (item.goal === goal && item.type === habitType) {
               
                return <Item item={item} />;
              }
              
              return null; // Or render a different component if needed
            }}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>

      
      </View>
    </View>
  );
};

export default Checklist;
