import { Action, ActionReducer } from "@ngrx/store";
import { STOP_LOADING, START_LOADING, UIActions } from "./ui.actions";

export interface State {
  isLoading: boolean;
}

const initialState: State = {
  isLoading: false
}

export function uiReducer(state = initialState, action: UIActions): State {
  switch(action.type)
  {
    case START_LOADING:
      return {
        isLoading: true
      }
    case STOP_LOADING:
      return {
        isLoading: false
      }
    default:
      return state;
  }
}

export const getIsLoading = ((state: State) => state.isLoading)
