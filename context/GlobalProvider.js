import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { format, isToday, subWeeks, endOfWeek, subMonths, endOfMonth, parseISO } from 'date-fns';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [goal, setGoal] = useState([]);
    const [data, setData] = useState([]);
    
    const [loading, setLoading] = useState(true);

    const [balloonArray, setBalloonArray] = useState([])

  

  
    const isLastCompletedInTimeframe = (item) => {
     // console.log('dragonfly')
      if (!item || item === isToday) return true;
    
      try {
        const lastCompletedDate = parseISO(item);
    
        switch (item.type) {
          case 'Daily':
            return isYesterday(lastCompletedDate);
    
          case 'Weekly': {
            const lastWeekStart = subWeeks(new Date(), 1);
            const lastWeekEnd = endOfWeek(lastWeekStart);
            return lastCompletedDate >= lastWeekStart && lastCompletedDate <= lastWeekEnd;
          }
    
          case 'Monthly': {
            const lastMonthStart = subMonths(new Date(), 1);
            const lastMonthEnd = endOfMonth(lastMonthStart);
            return lastCompletedDate >= lastMonthStart && lastCompletedDate <= lastMonthEnd;
          }
    
          default:
            return true;
        }
      } catch (error) {
        // If there's any error parsing the date, return false
        return true;
      }
    };

    const checkPop = async(habitData) => {
      try {
        console.log(habitData, "helloo data???", habitData.length !== 0)
        if (habitData.length !== 0) { 
          const updatedData = habitData.map((habit: Habit) => {
            
            if (!isLastCompletedInTimeframe(habit.lastCompletedDate)) {
              console.log("is this the case")
              return {
                ...habit,
                popped: habit.popped + 1,
              };
            } else {
              console.log("here returning ", habit)
              return habit;
            }
          
          });   
          console.log(updatedData, "checking this ")
          setData(updatedData);
          await AsyncStorage.setItem('habits', JSON.stringify(updatedData));
          refetchBalloon();
      } else {
        console.log('no Data!')
      }
  
      } catch (error) {
        console.error('Error updating data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    


    const getData = async () => {
      setLoading(true);
      try {
        // Get habits
        const habitsValue = await AsyncStorage.getItem('habits');
        if (habitsValue !== null) {
          const habits = JSON.parse(habitsValue);
          // console.log(habits, "0000000000")
          setData(habits);
          checkPop(habits)
      
        }

      } catch (error) {
        console.log('Error retrieving data:', error);
      } finally {
        
        
      }
    };

    const fetchBalloons = async () => {
      try {
        const balloonsString = await AsyncStorage.getItem('Balloons');
        if (balloonsString !== null) {
          const balloons = JSON.parse(balloonsString);
          setBalloonArray(balloons);
        }
      } catch (error) {
        console.error('Error retrieving balloons:', error);
      }
    };

    useEffect(() => {
      getData()
      refetchBalloon();
      
      
    }, [])

    const refetch = () => getData();
    const refetchBalloon = () => fetchBalloons();
    const reCheckPopped = () => checkPop();

    return (
        <GlobalContext.Provider
          value={{
            goal,
            setGoal,
            data,
            setData,
            refetch, 
            loading, 
            balloonArray, 
            refetchBalloon,
            checkPop
          }}
        >
          {children}
        </GlobalContext.Provider>
      );
    };

export default GlobalProvider;
