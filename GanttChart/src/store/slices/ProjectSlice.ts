/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ProjectChart {
  id: number,
  title: string,
  periodStart: string,
  periodEnd: string,
  sub?: ProjectChart[]
}

interface Project {
  name: string,
  period: string,
  chart: ProjectChart,
  loadingStatus: string
}

const initialState: Project = {
  name: '',
  period: '',
  chart: {
    id: 0,
    title: '',
    periodStart: '',
    periodEnd: '',
  },
  loadingStatus: 'idle',
};

export const fetchProject = createAsyncThunk(
  'project/fetchProject',
  async () => {
    const response = await fetch('https://cors-anywhere.herokuapp.com/http://82.202.204.94/tmp/test.php');
    const parsedResponse = await response.json();
    return parsedResponse;
  },
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state) => { state.loadingStatus = 'loading'; })
      .addCase(fetchProject.rejected, (state) => { state.loadingStatus = 'error'; })
      .addCase(fetchProject.fulfilled, (state, action) => {
        const {
          project,
          period,
          chart,
        } = action.payload;
        state.name = project;
        state.period = period;
        state.chart = {
          ...chart,
          periodStart: chart.period_start,
          periodEnd: chart.period_end,
        };
        state.loadingStatus = 'idle';
      })
      .addDefaultCase(() => {});
  },
});

export default projectSlice.reducer;
export type { ProjectChart };
