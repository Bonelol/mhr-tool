import React from 'react';
import { Props } from '../types';
import { Action, State } from './types';
import { armors } from '../../data/armor';
import { groupBy } from '../../utils/groupBy';

const grouped = groupBy(armors.filter(a => (a.rare || -1) > 3), armor => armor.type);
export const initState: State = {
  head: grouped.find(g => g.key === 1)?.values || [],
  chest: grouped.find(g => g.key === 2)?.values || [],
  brace: grouped.find(g => g.key === 3)?.values || [],
  belt: grouped.find(g => g.key === 4)?.values || [],
  leg: grouped.find(g => g.key === 5)?.values || [],
};

const reducer = (state: State, action: Action) => {
  state = state || [];

  switch (action.type) {
    default:
      return state;
  }
};

const stateCtx = React.createContext(initState);
const dispatchCtx = React.createContext((() => 0) as React.Dispatch<Action>);

export const Provider: React.ComponentType = (props: Props) => {
  const [state, dispatch] = React.useReducer(reducer, initState);

  return (
    <dispatchCtx.Provider value={dispatch}>
      <stateCtx.Provider value={state}>{props.children}</stateCtx.Provider>
    </dispatchCtx.Provider>
  );
};

export const useDispatch = () => React.useContext(dispatchCtx);
export const useState = () => React.useContext(stateCtx);