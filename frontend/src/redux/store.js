import { createStore } from "redux";
import chatReducer from "./reducers";

export const store = createStore(chatReducer);
