import { useEffect } from 'react';

import { fetchProject } from "../../store/slices/ProjectSlice";
import { useAppSelector, useAppDispatch } from "../../hooks/typedHooks";

import Spinner from "../Spinner/Spinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ExportButton from "../ExportButton/ExportButton";
import Table from "../Table/Table";

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
    <div className="project">
      <div className="project__header">
        <h1 className="project__title">{name} / {period}</h1>
        <ExportButton />
      </div>
      <Table />
    </div>
  );
}

export default App;