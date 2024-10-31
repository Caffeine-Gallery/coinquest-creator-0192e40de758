import Bool "mo:base/Bool";
import Char "mo:base/Char";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Random "mo:base/Random";
import Time "mo:base/Time";
import Nat8 "mo:base/Nat8";
import Nat "mo:base/Nat";

actor {
    // Types
    type Position = {
        x: Nat;
        y: Nat;
    };

    type GameState = {
        playerPosition: Position;
        playerName: Text;
        playerColor: Text;
        coins: [Position];
        score: Nat;
    };

    // State variables
    stable var gameState: ?GameState = null;

    // Constants
    let GRID_SIZE = 10;
    let COIN_COUNT = 5;

    // Helper function to generate random position
    private func generateRandomPosition() : async Position {
        let seed = await Random.blob();
        let rand = Random.Finite(seed);
        
        // Generate random x coordinate
        let xByte = switch (rand.byte()) {
            case null { 0 };
            case (?val) { Nat8.toNat(val) };
        };
        
        // Generate random y coordinate
        let yByte = switch (rand.byte()) {
            case null { 0 };
            case (?val) { Nat8.toNat(val) };
        };

        return {
            x = xByte % GRID_SIZE;
            y = yByte % GRID_SIZE;
        };
    };

    // Generate initial coins
    private func generateCoins() : async [Position] {
        var coins: [Position] = [];
        var i = 0;
        while (i < COIN_COUNT) {
            let pos = await generateRandomPosition();
            coins := Array.append(coins, [pos]);
            i += 1;
        };
        coins
    };

    // Create character and initialize game
    public shared func createCharacter(name: Text, color: Text) : async GameState {
        let initialState = {
            playerPosition = { x = 0; y = 0 };
            playerName = name;
            playerColor = color;
            coins = await generateCoins();
            score = 0;
        };
        gameState := ?initialState;
        initialState
    };

    // Get current game state
    public query func getGameState() : async GameState {
        switch (gameState) {
            case (null) {
                {
                    playerPosition = { x = 0; y = 0 };
                    playerName = "";
                    playerColor = "red";
                    coins = [];
                    score = 0;
                }
            };
            case (?state) { state };
        }
    };

    // Check if position has coin
    private func hasCoin(pos: Position, coins: [Position]) : Bool {
        for (coin in coins.vals()) {
            if (coin.x == pos.x and coin.y == pos.y) {
                return true;
            };
        };
        false
    };

    // Remove coin at position
    private func removeCoin(pos: Position, coins: [Position]) : [Position] {
        Array.filter(coins, func(coin: Position) : Bool {
            not (coin.x == pos.x and coin.y == pos.y)
        })
    };

    // Move player
    public shared func movePlayer(newX: Nat, newY: Nat) : async GameState {
        switch (gameState) {
            case (null) {
                Debug.trap("Game not initialized");
            };
            case (?state) {
                var newState = state;
                let newPos = { x = newX; y = newY };
                
                // Update position
                newState := {
                    playerPosition = newPos;
                    playerName = state.playerName;
                    playerColor = state.playerColor;
                    coins = state.coins;
                    score = state.score;
                };

                // Check for coin collection
                if (hasCoin(newPos, state.coins)) {
                    newState := {
                        playerPosition = newPos;
                        playerName = state.playerName;
                        playerColor = state.playerColor;
                        coins = removeCoin(newPos, state.coins);
                        score = state.score + 1;
                    };
                };

                gameState := ?newState;
                newState
            };
        }
    };
}
