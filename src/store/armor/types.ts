import { Armor } from '../../data';

export type Reducer = (state: State, action: Action) => State;

export type State = {
  head: Armor[];
  chest: Armor[];
  brace: Armor[];
  belt: Armor[];
  leg: Armor[];
};

export type Action =
  | { type: 'ARMOR_INIT'; payload: Armor[] }
  | { type: 'ARMOR_UPDATE'; payload: Armor };
