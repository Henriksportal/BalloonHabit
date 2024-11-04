import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import {isToday, isBefore, subDays,  differenceInDays ,startOfWeek, isYesterday, subWeeks, endOfWeek, subMonths, endOfMonth, parseISO, startOfMonth } from 'date-fns';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [goal, setGoal] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balloonArray, setBalloonArray] = useState([])
    const [poppedCount, setPoppedCount] = useState(1)


    const popCalculator = (habit) => {

      const today = new Date();
      const yesterday = subDays(new Date(), 1);
      
      const lastPoppedDate = habit.lastPoppedDate
      ? parseISO(habit.lastPoppedDate)
      : parseISO(habit.startDate);
      
      setPoppedCount(0)
     
      
      if (isToday(lastPoppedDate)) return false;
    
        try {
     
        
        
          
          
          switch (habit.type) {
            case 'Daily':

              if (isToday(lastPoppedDate)) return false;

              const lastCompletedDate = habit.lastCompletedDate
              ? parseISO(habit.lastCompletedDate)
              : subDays(parseISO(habit.startDate), 1);

              setPoppedCount(differenceInDays(today, lastPoppedDate));
              return !(isYesterday(lastCompletedDate));
             

      
            case 'Weekly': {

              const startOfThisWeek = startOfWeek(today, { weekStartsOn: 0 });
              const endOfThisWeek = endOfWeek();

              if (lastPoppedDate >= startOfThisWeek && lastPoppedDate <= endOfThisWeek) return false;

              const lastCompletedDate = habit.lastCompletedDate
              ? parseISO(habit.lastCompletedDate)
              : subWeeks(parseISO(habit.startDate), 1);

              const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 0 });
              const lastWeekEnd = endOfWeek(lastWeekStart);
              const startWeek = startOfWeek(today)
              setPoppedCount(
                differenceInDays(today, lastPoppedDate)
              );
              return !(lastCompletedDate >= lastWeekStart && lastCompletedDate <= lastWeekEnd);
             
            }
      
            case 'Monthly': {

              const startOfThisMonth = startOfMonth(today);
              const endOfThisMonth = endOfWeek(startOfThisMonth);

              if (lastPoppedDate >= startOfThisMonth && lastPoppedDate <= endOfThisMonth) return false;



              const lastCompletedDate = habit.lastCompletedDate
              ? parseISO(habit.lastCompletedDate)
              : subMonths(parseISO(habit.startDate), 1);

              const lastMonthStart = subMonths(new Date(), 1);
              const lastMonthEnd = endOfMonth(lastMonthStart);
              const startMonth = startOfMonth(today)
              setPoppedCount(differenceInDays(today, lastPoppedDate));
              return !(lastCompletedDate >= lastMonthStart && lastCompletedDate <= lastMonthEnd);
              
            }
      
            default:
              return false;
          }
        } catch (error) {
          console.log('here wrong', error)
        }
    };

    const checkPop = async(habitData) => {
      try {
      
        if (habitData.length !== 0) { 
          const updatedData = habitData.map((habit) => {
            
            if (popCalculator(habit)) {
              
              return {
                ...habit,
                status: false,
                popped: habit.popped + poppedCount,
                lastPoppedDate: new Date().toISOString(),
              };
            } else {
              //console.log("condition was false", habit.description)
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
  
    useEffect(() => {
      getData();
      refetchBalloon();
    }, [])

    const refetch = () => getData();
    const refetchBalloon = () => fetchBalloons();
    

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
