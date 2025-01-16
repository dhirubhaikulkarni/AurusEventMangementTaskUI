import { createBrowserHistory } from 'history';
export const checkValueEmptyOrNull = (value) => {
    return (value === undefined || value === null || value === "" || value === "NULL" || value === "null") ? "" : value;
}
export const validateContactNumber = (number) => {
    const regex = /^\d{10}$/;
    return regex.test(number);
}
