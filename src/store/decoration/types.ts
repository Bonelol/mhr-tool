import { Decoration } from '../../data';

export type Reducer = (state: State, action: Action) => State;
export type State = Decoration[];
export type Action =
  | { type: 'DECORATION_INIT'; payload: Decoration[] }
  | { type: 'DECORATION_UPDATE'; payload: Decoration };
