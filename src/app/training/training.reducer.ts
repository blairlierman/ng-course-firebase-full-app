import { Exercise } from "./exercise.model";
import { TrainingActions, SET_AVAILABLE_TRAININGS, STOP_TRAINING, SET_FINISHED_TRAININGS, START_TRAINING} from "./training.actions";
import * as fromRoot from "../app.reducer";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { StaticReflector } from "@angular/compiler";

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise | null | undefined;
}

export interface State extends fromRoot.State
{
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null
}

export function trainingReducer(state = initialState, action: TrainingActions): TrainingState {
  switch(action.type)
  {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        availableExercises: action.payload
      }
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
        finishedExercises: action.payload
      }
    case START_TRAINING:
      return {
        ...state,
        activeTraining: {...state.availableExercises.find(ex => ex.id === action.payload)} as Exercise
      }
    case STOP_TRAINING:
      return {
        ...state
      }
    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);

