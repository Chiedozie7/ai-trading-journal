import { useState, useEffect } from "react"
import "../styles/Calendar.css";
import { useNavigate } from "react-router-dom";

import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    addMonths,
    subMonths,
} from "date-fns";

function TradingCalendar({
    calendarData,
    searchParams,
    setSearchParams,
}) {
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");


    const [currentDate, setCurrentDate] = useState(() => {
        if (monthParam && yearParam) {
            return new Date(Number(yearParam), Number(monthParam) - 1);
        }

        return new Date();
    });
   
    const navigate = useNavigate();

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Create a lookup object for quick access
    const calendarMap = {};

    calendarData.forEach((day) => {
        calendarMap[day.date] = day;
    });

    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        params.set("month", currentDate.getMonth() + 1);
        params.set("year", currentDate.getFullYear());

        setSearchParams(params, { replace: true });
    }, [currentDate]);

    return (
        <div className="trading-calendar">
            <div className="calendar-navigation">
                <button
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                    ←
                </button>

                <h2>{format(currentDate, "MMMM yyyy")}</h2>

                <button
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                    →
                </button>
            </div>
            <div className="calendar-legend">
                <div className="legend-item">
                    <span className="legend-color profit"></span>
                    <span>Profit</span>
                </div>

                <div className="legend-item">
                    <span className="legend-color loss"></span>
                    <span>Loss</span>
                </div>

                <div className="legend-item">
                    <span className="legend-color breakeven"></span>
                    <span>Breakeven</span>
                </div>
            </div>

            <div className="calendar-grid">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="calendar-header"
                    >
                        {day}
                    </div>
                ))}

                {calendarDays.map((day) => {
                    const formattedDate = format(day, "yyyy-MM-dd");
                    const tradeDay = calendarMap[formattedDate];
                    const isCurrentMonth = isSameMonth(day, currentDate);

                    return (
                        <div
                        key={formattedDate}
                            className={`calendar-day
        ${!isCurrentMonth ? "other-month" : ""}
        ${tradeDay?.netPL > 0 ? "profit-day" : ""}
        ${tradeDay?.netPL < 0 ? "loss-day" : ""}
        ${tradeDay?.netPL === 0 ? "breakeven-day" : ""}
        ${tradeDay ? "clickable-day" : ""}
    `}
                            onClick={() => {
                                if (!tradeDay) return;

                                navigate("/trades", {
                                    state: {
                                        selectedDate: formattedDate,
                                    },
                                });
                            }}
                        >
                            <div className="day-number">
                                {format(day, "d")}
                            </div>

                            {tradeDay && (
                                <>
                                    <div className="day-pl">
                                        {tradeDay.netPL}
                                    </div>

                                    <div className="day-trades">
                                        {tradeDay.trades}{" "}
                                        {tradeDay.trades === 1
                                            ? "trade"
                                            : "trades"}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TradingCalendar;