export const idlFactory = ({ IDL }) => {
  const Position = IDL.Record({ 'x' : IDL.Nat, 'y' : IDL.Nat });
  const GameState = IDL.Record({
    'coins' : IDL.Vec(Position),
    'playerColor' : IDL.Text,
    'score' : IDL.Nat,
    'playerName' : IDL.Text,
    'playerPosition' : Position,
  });
  return IDL.Service({
    'createCharacter' : IDL.Func([IDL.Text, IDL.Text], [GameState], []),
    'getGameState' : IDL.Func([], [GameState], ['query']),
    'movePlayer' : IDL.Func([IDL.Nat, IDL.Nat], [GameState], []),
  });
};
export const init = ({ IDL }) => { return []; };
