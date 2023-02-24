import { ADD_MESSAGE, ADD_FILE } from "./actions";

const initialState = {
  messages: [],
  files: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case ADD_FILE:
      return {
        ...state,
        files: [...state.files, action.payload],
      };
    default:
      return state;
  }
};

export default rootReducer;
