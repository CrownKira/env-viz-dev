import { combineReducers } from 'redux';

export type StoreState = {
  dummyReducer: any;
}

export const reducers = combineReducers<StoreState>({
  dummyReducer: () => 1
});
