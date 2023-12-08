interface MainState {
    filterTag: string;
    game:any;
  }
  
  const initialState: MainState = {
    filterTag: "",
    game : {}
  };
  
  export enum MainActionTypes {
    SET_FILTER_TAG = "SET_FILTER_TAG",
    SET_GAME = "SET_GAME",
  }

  
  const mainReducer = (state = initialState, action: any): MainState => {
    switch (action.type) {
      
      case MainActionTypes.SET_FILTER_TAG:
        return { ...state, filterTag: action.payload };
      

      case MainActionTypes.SET_GAME:
        return { ...state, game: action.payload };
      
      default:
        return state;
    }
  };
  
  export default mainReducer;
  