import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCelebrationPackages as fetchCelebrationPackagesApi } from "../../utils/celebrationPackagesApi";

const EMPTY_STATE = { items: [], status: "idle", error: null };

/** type: "birthday" | "corporate" */
export const fetchCelebrationPackages = createAsyncThunk(
  "celebrationPackages/fetch",
  async ({ type, companyId, branchId, moduleId }, { signal }) =>
    fetchCelebrationPackagesApi(type, { companyId, branchId, moduleId, signal }).then((items) => ({ type, items })),
  {
    condition: ({ type }, { getState }) => getState().celebrationPackages[type]?.status !== "loading",
  },
);

const celebrationPackagesSlice = createSlice({
  name: "celebrationPackages",
  initialState: {
    birthday: { ...EMPTY_STATE },
    corporate: { ...EMPTY_STATE },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCelebrationPackages.pending, (state, action) => {
        state[action.meta.arg.type].status = "loading";
        state[action.meta.arg.type].error = null;
      })
      .addCase(fetchCelebrationPackages.fulfilled, (state, action) => {
        const { type, items } = action.payload;
        state[type].items = items;
        state[type].status = "succeeded";
      })
      .addCase(fetchCelebrationPackages.rejected, (state, action) => {
        if (action.error.name === "AbortError") return;
        const type = action.meta.arg.type;
        state[type].status = "failed";
        state[type].error = action.error.message;
      });
  },
});

export const selectCelebrationPackages = (state) => state.celebrationPackages;
export default celebrationPackagesSlice.reducer;
