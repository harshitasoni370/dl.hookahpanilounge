import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchMembership as fetchMembershipApi } from "../../utils/membershipApi";

export const fetchMembership = createAsyncThunk(
  "membership/fetch",
  async (context, { signal }) => fetchMembershipApi({ ...context, signal }),
  { condition: (_arg, { getState }) => getState().membership.status !== "loading" },
);

const membershipSlice = createSlice({
  name: "membership",
  initialState: { data: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembership.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMembership.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchMembership.rejected, (state, action) => {
        if (action.error.name === "AbortError") return;
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectMembership = (state) => state.membership;
export default membershipSlice.reducer;
