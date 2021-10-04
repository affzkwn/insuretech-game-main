import { useSelector } from "react-redux";

export function useCustomSelector(reducerName) {
    return useSelector(getSelectorFunc(reducerName));
}

export function getSelectorFunc(reducerName) {
    return state => state?.[reducerName];
}

