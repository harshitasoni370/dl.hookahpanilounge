import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { QR_CONTEXT_PARAMS, QR_CONTEXT_STORAGE_KEY, URLS } from "../../config/urls";

function readPersistedContext() {
  try {
    return JSON.parse(sessionStorage.getItem(QR_CONTEXT_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

export const fetchQrContext = createAsyncThunk(
  "qrContext/fetch",
  async (search, { signal, rejectWithValue }) => {
    const searchParams = new URLSearchParams(search);
    const params = Object.fromEntries(searchParams.entries());
    if (!QR_CONTEXT_PARAMS.some((key) => params[key])) return null;

    const context = { params, data: null, fetchedAt: null };
    sessionStorage.setItem(QR_CONTEXT_STORAGE_KEY, JSON.stringify(context));
    window.qrContext = context;

    try {
      const response = await fetch(`${URLS.api.qrContext}?${searchParams.toString()}`, { signal });
      if (!response.ok) throw new Error(`QR context request failed: ${response.status}`);
      const data = await response.json();
      const resolvedContext = { params, data, fetchedAt: new Date().toISOString() };
      sessionStorage.setItem(QR_CONTEXT_STORAGE_KEY, JSON.stringify(resolvedContext));
      window.qrContext = resolvedContext;
      window.dispatchEvent(new CustomEvent("qr-context-ready", { detail: resolvedContext }));
      return resolvedContext;
    } catch (error) {
      if (error.name === "AbortError") throw error;
      return rejectWithValue(error.message);
    }
  }
);

const persistedContext = readPersistedContext();

const qrContextSlice = createSlice({
  name: "qrContext",
  initialState: {
    context: persistedContext,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQrContext.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQrContext.fulfilled, (state, action) => {
        if (action.payload) state.context = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchQrContext.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const selectQrContext = (state) => state.qrContext.context;
export const selectQrContextStatus = (state) => state.qrContext.status;
export const selectQrContextError = (state) => state.qrContext.error;
export default qrContextSlice.reducer;
