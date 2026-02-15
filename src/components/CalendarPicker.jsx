import { useState } from "react";
import { AZ_MONTHS, AZ_DAYS } from "../constants";
import "./CalendarPicker.css";

export default function CalendarPicker({ value, onChange, minDate }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const min = minDate ? new Date(minDate) : today;
    min.setHours(0, 0, 0, 0);

    const selected = value ? new Date(value) : null;

    const [viewYear, setViewYear] = useState(
        selected ? selected.getFullYear() : today.getFullYear()
    );
    const [viewMonth, setViewMonth] = useState(
        selected ? selected.getMonth() : today.getMonth()
    );

    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const startPad = firstDay.getDay(); // 0=Sun
    const totalDays = lastDay.getDate();

    const prevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const nextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    const handleClick = (day) => {
        const date = new Date(viewYear, viewMonth, day);
        date.setHours(0, 0, 0, 0);
        if (date < min) return;
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        onChange(`${y}-${m}-${d}`);
    };

    const isSelected = (day) => {
        if (!selected) return false;
        return (
            selected.getDate() === day &&
            selected.getMonth() === viewMonth &&
            selected.getFullYear() === viewYear
        );
    };

    const isDisabled = (day) => {
        const date = new Date(viewYear, viewMonth, day);
        date.setHours(0, 0, 0, 0);
        return date < min;
    };

    const isTodayDate = (day) => {
        return (
            today.getDate() === day &&
            today.getMonth() === viewMonth &&
            today.getFullYear() === viewYear
        );
    };

    // Can go back?
    const canPrev = viewYear > today.getFullYear() ||
        (viewYear === today.getFullYear() && viewMonth > today.getMonth());

    const dayLabels = ["B", "Be", "Ça", "Ç", "Ca", "C", "Ş"];

    const cells = [];
    for (let i = 0; i < startPad; i++) {
        cells.push(<div key={`pad-${i}`} className="cal-cell cal-empty" />);
    }
    for (let day = 1; day <= totalDays; day++) {
        const disabled = isDisabled(day);
        const sel = isSelected(day);
        const tod = isTodayDate(day);

        cells.push(
            <button
                key={day}
                className={`cal-cell cal-day ${sel ? "selected" : ""} ${disabled ? "disabled" : ""} ${tod ? "today" : ""}`}
                onClick={() => handleClick(day)}
                disabled={disabled}
            >
                {day}
            </button>
        );
    }

    return (
        <div className="calendar-picker glass-card-static">
            <div className="cal-header">
                <button
                    className="btn btn-ghost btn-icon"
                    onClick={prevMonth}
                    disabled={!canPrev}
                >
                    ←
                </button>
                <span className="cal-title">
                    {AZ_MONTHS[viewMonth]} {viewYear}
                </span>
                <button className="btn btn-ghost btn-icon" onClick={nextMonth}>
                    →
                </button>
            </div>

            <div className="cal-weekdays">
                {dayLabels.map((d) => (
                    <div key={d} className="cal-weekday">
                        {d}
                    </div>
                ))}
            </div>

            <div className="cal-grid">{cells}</div>
        </div>
    );
}
