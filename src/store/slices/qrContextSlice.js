import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API, QR_CONTEXT_PARAMS, QR_CONTEXT_STORAGE_KEY } from "../../config/urls";
import { apiRequest } from "../../utils/apiClient";

function safeSessionSet(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / storage full — context memory me hi rahega */
  }
}

function readPersistedContext() {
  try {
    return JSON.parse(sessionStorage.getItem(QR_CONTEXT_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function publishContext(context) {
  safeSessionSet(QR_CONTEXT_STORAGE_KEY, context);
  window.qrContext = context;
}

export const fetchQrContext = createAsyncThunk(
  "qrContext/fetch",
  async (search, { signal, rejectWithValue }) => {
    const searchParams = new URLSearchParams(search);
    const params = Object.fromEntries(searchParams.entries());
    if (!QR_CONTEXT_PARAMS.some((key) => params[key])) return null;

    publishContext({ params, data: null, fetchedAt: null });

    const directContextKeys = ["companyId", "branchId", "tableId", "sessionId"];
    if (directContextKeys.every((key) => params[key])) {
      const data = Object.fromEntries(
        [...directContextKeys, "companyName", "branchName", "tableName", "tableNumber", "tableNo"]
          .filter((key) => params[key])
          .map((key) => [key, params[key]]),
      );
      const resolvedContext = { params, data, fetchedAt: new Date().toISOString() };
      publishContext(resolvedContext);
      window.dispatchEvent(new CustomEvent("qr-context-ready", { detail: resolvedContext }));
      return resolvedContext;
    }

    try {
      const data = await apiRequest(API.upstream.qrContext, { params, signal });

      const resolvedContext = { params, data, fetchedAt: new Date().toISOString() };
      publishContext(resolvedContext);
      window.dispatchEvent(new CustomEvent("qr-context-ready", { detail: resolvedContext }));
      return resolvedContext;
    } catch (error) {
      if (error.name === "AbortError") throw error;
      return rejectWithValue(error.message);
    }
  },
);

const qrContextSlice = createSlice({
  name: "qrContext",
  initialState: {
    context: readPersistedContext(),
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
