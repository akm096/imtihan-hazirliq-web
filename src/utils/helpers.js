import { AZ_MONTHS, AZ_DAYS } from "../constants";

/**
 * Format a date string (YYYY-MM-DD) to Azerbaijani readable format.
 * Example: "15 Fevral 2026, Bazar"
 */
export function formatDateAz(dateStr) {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = AZ_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    const weekDay = AZ_DAYS[d.getDay()];
    return `${day} ${month} ${year}, ${weekDay}`;
}

/**
 * Format a date to short Azerbaijani format.
 * Example: "15 Fev"
 */
export function formatDateShort(dateStr) {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = AZ_MONTHS[d.getMonth()].substring(0, 3);
    return `${day} ${month}`;
}

/**
 * Check if a date string is today.
 */
export function isToday(dateStr) {
    const today = new Date();
    const d = new Date(dateStr);
    return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
    );
}

/**
 * Check if a date is in the past (before today).
 */
export function isPast(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d < today;
}

/**
 * Get today's date in YYYY-MM-DD format.
 */
export function getTodayStr() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/**
 * Calculate days between two date strings.
 */
export function daysBetween(dateStr1, dateStr2) {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    return Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
}
