import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchReservationCategories as fetchCategoriesApi,
  createReservation as createReservationApi,
} from "../../utils/reservationApi";

export const fetchReservationCategories = createAsyncThunk(
  "reservation/fetchCategories",
  async (context, { signal }) => fetchCategoriesApi({ ...context, signal }),
);

export const submitReservation = createAsyncThunk(
  "reservation/submit",
  async ({ payload, tableSessionId, deviceId }, { signal }) =>
    createReservationApi(payload, tableSessionId, { signal, deviceId }),
);

const reservationSlice = createSlice({
  name: "reservation",
  initialState: {
    categories: { items: [], status: "idle", error: null },
    submit: { status: "idle", error: null },
  },
  reducers: {
    resetReservationSubmit(state) {
      state.submit.status = "idle";
      state.submit.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservationCategories.pending, (state) => {
        state.categories.status = "loading";
        state.categories.error = null;
      })
      .addCase(fetchReservationCategories.fulfilled, (state, action) => {
        state.categories.items = action.payload;
        state.categories.status = "succeeded";
      })
      .addCase(fetchReservationCategories.rejected, (state, action) => {
        state.categories.status = "failed";
        state.categories.error = action.error.message;
      })
      .addCase(submitReservation.pending, (state) => {
        state.submit.status = "loading";
        state.submit.error = null;
      })
      .addCase(submitReservation.fulfilled, (state) => {
        state.submit.status = "succeeded";
      })
      .addCase(submitReservation.rejected, (state, action) => {
        state.submit.status = "failed";
        state.submit.error = action.error.message;
      });
  },
});

export const { resetReservationSubmit } = reservationSlice.actions;
export const selectReservationCategories = (state) => state.reservation.categories;
export const selectReservationSubmit = (state) => state.reservation.submit;
export default reservationSlice.reducer;
