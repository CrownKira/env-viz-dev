import { combineReducers } from 'redux';

export interface StoreState {
  dummyReducer: any;
}

export const reducers = combineReducers<StoreState>({
  dummyReducer: () => 1
});
