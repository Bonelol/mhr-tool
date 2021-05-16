import { Skill } from '../../data';

export type Reducer = (state: State, action: Action) => State;
export type State = Skill[];
export type Action =
  | { type: 'SKILL_INIT'; payload: Skill[] }
  | { type: 'SKILL_UPDATE'; payload: Skill };
