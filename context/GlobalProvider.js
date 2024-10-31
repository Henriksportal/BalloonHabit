import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import {isToday, differenceInDays ,startOfWeek, isYesterday, subWeeks, endOfWeek, subMonths, endOfMonth, parseISO } from 'date-fns';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [goal, setGoal] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balloonArray, setBalloonArray] = useState([])
    const [poppedBalloonArray, setPoppedBalloonArray] = useState([])
    const [poppedCount, setPoppedCount] = useState(1)


    const popCalculator = (habit) => {

      if (isToday(habit.lastPoppedDate)) return false;
      
        try {
          const today = new Date()
          setPoppedCount(0)
          const lastCompletedDate = habit.lastCompletedDate
          ? parseISO(habit.lastCompletedDate)
          : parseISO(habit.startDate);
        
          switch (habit.type) {
            case 'Daily':
              console.log("am i here check 2", isYesterday(lastCompletedDate))
              setPoppedCount(
                habit.lastPoppedDate ? differenceInDays(today, habit.lastPoppedDate) : 1
              );
              return isYesterday(lastCompletedDate);

      
            case 'Weekly': {
              const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 0 });
              const lastWeekEnd = endOfWeek(lastWeekStart);
              setPoppedCount(
                habit.lastPoppedDate ? differenceInDays(today, habit.lastPoppedDate) : 1
              );
              return lastCompletedDate >= lastWeekStart && lastCompletedDate <= lastWeekEnd;
            }
      
            case 'Monthly': {
              const lastMonthStart = subMonths(new Date(), 1);
              const lastMonthEnd = endOfMonth(lastMonthStart);
              setPoppedCount(
                habit.lastPoppedDate ? differenceInDays(today, habit.lastPoppedDate) : 1
              );
              return lastCompletedDate >= lastMonthStart && lastCompletedDate <= lastMonthEnd;
            }
      
            default:
              console.log("am i here check 1")
              return false;
          }
        } catch (error) {
          
          return false;
        }
    };

    const checkPop = async(habitData) => {
      try {
        //console.log(habitData, "helloo data???", habitData.length !== 0)
        if (habitData.length !== 0) { 
          const updatedData = habitData.map((habit) => {
            
            if (popCalculator(habit)) {
              updatePoppedBalloons(habit.description)
              console.log("is this the case", poppedCount)
              return {
                ...habit,
                status: false,
                popped: habit.popped + poppedCount,
                lastPoppedDate: new Date().toISOString(),
              };
            } else {
              console.log("here returning ", habit)
              return habit;
            }
          
          });   
         
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


    const updatePoppedBalloons = async (description) => {
      try {
  
        const poppedBalloonsString = await AsyncStorage.getItem('PoppedBalloons');
        let Poppedballoons = poppedBalloonsString ? JSON.parse(poppedBalloonsString) : {};
    
        if (!Poppedballoons[goal]) {
          Poppedballoons[goal] = [];
        }
  
        // balloons[goal].push(type);
        Poppedballoons[goal].push({
          type: type,
          description: description
      });
      
        await AsyncStorage.setItem('Balloons', JSON.stringify(Poppedballoonsballoons));
        console.log(`Updated Balloons: ${JSON.stringify(Poppedballoons)}`);
      } catch (error) {
        console.error('Error updating Balloons:', error);
      }
    };

  
    const getData = async () => {
      setLoading(true);
      try {
        // Get habits
        const habitsValue = await AsyncStorage.getItem('habits');
        if (habitsValue !== null) {
          const habits = JSON.parse(habitsValue);
        
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

    const fetchPoppedBalloons = async () => {
      try {
        const PoppedballoonsString = await AsyncStorage.getItem('PoppedBalloons');

        if (PoppedballoonsString !== null) {
          const poppedBalloons = JSON.parse(PoppedballoonsString)
          setPoppedBalloonArray(poppedBalloons)
        }
      } catch (error) {
        console.error('Error retrieving PoppedBalloons:', error);
      }
    };

    useEffect(() => {
      getData();
      refetchBalloon();
      fetchPopped();
      
      
    }, [])

    const refetch = () => getData();
    const refetchBalloon = () => fetchBalloons();
    const fetchPopped = () => fetchPoppedBalloons();

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
            poppedBalloonArray,
            refetchBalloon,
            checkPop
          }}
        >
          {children}
        </GlobalContext.Provider>
      );
    };

export default GlobalProvider;
