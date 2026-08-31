import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { URLS } from "../../config/urls";

export const fetchMenu = createAsyncThunk("menu/fetch", async (_, { signal }) => {
  const response = await fetch(URLS.assets.menu, { signal });
  if (!response.ok) throw new Error("Failed to load menu data");
  return response.json();
});

const menuSlice = createSlice({
  name: "menu",
  initialState: { data: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchMenu.fulfilled, (state, action) => { state.data = action.payload; state.status = "succeeded"; })
      .addCase(fetchMenu.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; });
  },
});

export const selectMenu = (state) => state.menu.data;
export const selectMenuStatus = (state) => state.menu.status;
export default menuSlice.reducer;
