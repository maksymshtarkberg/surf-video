import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";

// Типизированный `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Типизированный `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
