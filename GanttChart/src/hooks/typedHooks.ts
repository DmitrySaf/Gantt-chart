import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { AppDispatch, ProjectState } from "../store/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<ProjectState> = useSelector;
