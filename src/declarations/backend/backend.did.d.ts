import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface GameState {
  'coins' : Array<Position>,
  'playerColor' : string,
  'score' : bigint,
  'playerName' : string,
  'playerPosition' : Position,
}
export interface Position { 'x' : bigint, 'y' : bigint }
export interface _SERVICE {
  'createCharacter' : ActorMethod<[string, string], GameState>,
  'getGameState' : ActorMethod<[], GameState>,
  'movePlayer' : ActorMethod<[bigint, bigint], GameState>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
