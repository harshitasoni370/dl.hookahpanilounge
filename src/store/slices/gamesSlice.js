import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchGames as fetchGamesApi } from "../../utils/gamesApi";

const EMPTY_STATE = { items: [], status: "idle", error: null };

/**
 * type: "playstation" | "board-games"
 * Actual network call + response normalization util/gamesApi.js me hai;
 * thunk sirf usko dispatch/state ke saath wire karta hai.
 */
export const fetchGames = createAsyncThunk(
  "games/fetch",
  async ({ type, companyId, branchId }, { signal }) => {
    const items = await fetchGamesApi(type, { companyId, branchId }, { signal });
    return { type, items };
  },
  {
    // Same type ke liye ek waqt me ek hi request chale.
    condition: ({ type }, { getState }) => getState().games[type]?.status !== "loading",
  },
);

const gamesSlice = createSlice({
  name: "games",
  initialState: {
    playstation: { ...EMPTY_STATE },
    "board-games": { ...EMPTY_STATE },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state, action) => {
        state[action.meta.arg.type].status = "loading";
        state[action.meta.arg.type].error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        const { type, items } = action.payload;
        state[type].items = items;
        state[type].status = "succeeded";
      })
      .addCase(fetchGames.rejected, (state, action) => {
        if (action.error.name === "AbortError") return;
        const type = action.meta.arg.type;
        state[type].status = "failed";
        state[type].error = action.error.message;
      });
  },
});

export const selectGames = (state) => state.games;
export default gamesSlice.reducer;
