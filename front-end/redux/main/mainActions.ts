import { MainActionTypes } from "./mainReducer";

export const setFilterTag = (_payload:any): any => {
  return {
    type: MainActionTypes.SET_FILTER_TAG,
    payload : _payload
  };
};

export const setRubrics = (_payload:any): any => {
  return {
    type: MainActionTypes.SET_RUBRICS,
    payload : _payload
  };
};


export const setAllGames = (_payload:any): any => {
  return {
    type: MainActionTypes.SET_ALL_GAMES,
    payload : _payload
  };
};

export const setGame = (_payload:any): any => {
  return {
    type: MainActionTypes.SET_GAME,
    payload : _payload
  };
};




 
