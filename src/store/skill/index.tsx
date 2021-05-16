import React from 'react';
import { Skill } from '../../data';
import { Props } from '../types';
import { Action, State } from './types';
import { skills } from '../../data/skill';

export const initState: State = skills;

const reducer = (state: State, action: Action) => {
  state = state || [];

  switch (action.type) {
    case 'SKILL_INIT':
      return [...(action.payload as Skill[])];
    case 'SKILL_UPDATE': {
      const { payload } = action;
      const index = state.findIndex(p => p.name === payload.name);
      
      if (index < 0){
        return state;
      }

      state.splice(index, 1, payload);
      return [...state];
    }
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