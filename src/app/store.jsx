import { configureStore } from "@reduxjs/toolkit";
import commentReducer from "../features/comment";

export const store = configureStore({
  reducer: {
    comment: commentReducer,
  },
});
