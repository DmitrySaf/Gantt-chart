import { useEffect } from 'react';

import { fetchProject } from "../../store/slices/ProjectSlice";
import { useAppSelector, useAppDispatch } from "../../hooks/typedHooks";
import Spinner from "../Spinner/Spinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import './App.scss';

function App() {
  const { loadingStatus, name, period } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProject());
  }, []);

  if (loadingStatus === 'loading') return <Spinner />;
  if (loadingStatus === 'error') return <ErrorMessage />

  return (
    <>
      <h1>{name} / {period}</h1>
    </>
  );
}

export default App;