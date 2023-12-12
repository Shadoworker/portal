interface MainState {
    filterTag: string;
    rubrics:any[];
    allGames : object;
    game:any;
  }
  
  const initialState: MainState = {
    filterTag: "",
    rubrics : [],
    allGames : {},
    game : {}
  };
  
  export enum MainActionTypes {
    SET_FILTER_TAG = "SET_FILTER_TAG",
    SET_RUBRICS = "SET_RUBRICS",
    SET_ALL_GAMES = "SET_ALL_GAMES",
    SET_GAME = "SET_GAME",
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
      
      default:
        return state;
    }
  };
  
  export default mainReducer;
  