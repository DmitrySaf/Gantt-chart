import { useEffect } from 'react';

import { fetchProject } from "../../store/slices/ProjectSlice";
import { useAppSelector, useAppDispatch } from "../../hooks/typedHooks";

import Spinner from "../Spinner/Spinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ExportButton from "../ExportButton/ExportButton";
import Table from "../Table/Table";

import './App.scss';

function App() {
  const { loadingStatus, name, period, chart } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProject());
  }, []);

  if (loadingStatus === 'loading') return <Spinner />;
  if (loadingStatus === 'error') return <ErrorMessage />;

  const valuesAreInvalid = () => {
    return (name.length === 0)
    || !/[0-9][0-9]\.[0|1][0-9]\.20[0-9][0-9]-[0-9][0-9]\.[0|1][0-9]\.20[0-9][0-9]/.test(period)
    || (chart.title.length === 0)
    || (isNaN(+new Date(chart.period_start)) || isNaN(+new Date(chart.period_end)));
  };

  if (valuesAreInvalid()) return ( <h1>Values are invalid</h1> )

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