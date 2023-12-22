import { produce } from "immer";

interface MainState {
    filterTag: string;
    rubrics:any[];
    allGames : object;
    game:any;
    user:any;
    pageOrigin : any;
  }
  
  const initialState: MainState = {
    filterTag: "All",
    rubrics : [],
    allGames : {},
    game : {},
    user : null,
    pageOrigin : null
  };
  
  export enum MainActionTypes {
    SET_FILTER_TAG = "SET_FILTER_TAG",
    SET_RUBRICS = "SET_RUBRICS",
    SET_ALL_GAMES = "SET_ALL_GAMES",
    SET_GAME = "SET_GAME",
    SET_USER = "SET_USER",
    SET_PAGE_ORIGIN = "SET_PAGE_ORIGIN",
  }

  
  const mainReducer = (state = initialState, action: any): MainState => {
    switch (action.type) {
      
      case MainActionTypes.SET_FILTER_TAG:
        return { ...state, filterTag: action.payload };
      
      case MainActionTypes.SET_RUBRICS:
        return { ...state, rubrics: action.payload };
        
      case MainActionTypes.SET_ALL_GAMES:
          var key = action.payload.key;
          var games = action.payload.games;
          var allGames = {...state.allGames};
          
          allGames[key] = games;

          return { ...state, allGames: allGames };
      
          
      case MainActionTypes.SET_GAME:
        return { ...state, game: action.payload };
    
        
      case MainActionTypes.SET_USER:

      return produce(state, draftState => {

        let element = action.payload;

       
        draftState.user = element;

      
      })  
      
      case MainActionTypes.SET_PAGE_ORIGIN:
        return { ...state, pageOrigin: action.payload };
      

      default:
        return state;
    }
  };
  
  export default mainReducer;
  