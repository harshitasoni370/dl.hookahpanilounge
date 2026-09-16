import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCustomMoments as fetchCustomMomentsApi } from "../../utils/customMomentsApi";

export const fetchCustomMoments = createAsyncThunk(
  "customMoments/fetch",
  async (context, { signal }) => fetchCustomMomentsApi(context, { signal }),
  { condition: (_arg, { getState }) => getState().customMoments.status !== "loading" },
);

const customMomentsSlice = createSlice({
  name: "customMoments",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomMoments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomMoments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCustomMoments.rejected, (state, action) => {
        if (action.error.name === "AbortError") return;
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectCustomMoments = (state) => state.customMoments;
export default customMomentsSlice.reducer;
