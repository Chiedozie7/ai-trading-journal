import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import TradingCalendar from "../components/TradingCalendar";

function Calendar() {

    const axiosPrivate = useAxiosPrivate();

    const [calendarData,setCalendarData]=useState([]);

    const [searchParams,setSearchParams]=useSearchParams();

    useEffect(()=>{

        const fetchCalendar=async()=>{

            try{

                const response=await axiosPrivate.get("/analytics/calendar");

                setCalendarData(response.data);

            }catch(err){

                console.error(err);

            }

        };

        fetchCalendar();

    },[]);

    return(

        <TradingCalendar
            calendarData={calendarData}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
             from="/calendar"
        />

    );

}

export default Calendar;