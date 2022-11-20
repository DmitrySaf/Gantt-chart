import { useEffect } from 'react';

import { fetchProject } from "../../store/slices/ProjectSlice";
import { useAppSelector, useAppDispatch } from "../../hooks/typedHooks";

import './App.scss';

function App() {
  const { loadingStatus } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProject());
  }, []);

  if (loadingStatus === 'loading') {

  }

  return (
    <>
      <h1></h1>
    </>
  );
}

export default App;