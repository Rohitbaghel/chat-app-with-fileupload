export const ADD_MESSAGE = "ADD_MESSAGE";
export const ADD_FILE = "ADD_FILE";

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const addFile = (file) => ({
  type: ADD_FILE,
  payload: file,
});
