const Player = require('./Player');
const Hunter = require("./Hunter");

class Game {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.started = false;
        this.round = 0;
        this.hunter = new Hunter();
    }

    finish_turn() {
        let move_to_next_round = false;
        // move on to next player; skip dead players
        do {
            if (this.players.length === 0) break;

            this.currentPlayerIndex++;
            if (this.currentPlayerIndex >= this.players.length) {
                this.currentPlayerIndex = 0;
                move_to_next_round = true;
            }
        } while (!this.players[this.currentPlayerIndex].isAlive); // skip dead players
        this.finish_round();
    }

    finish_round() {
        this.round++;
        // kill players with hunter
        if (this.round >= 5) {
            this.hunter.move_by(1);
            this.hunter.hunt(this.players);
        }
        // check if all players are dead
        if (!this.players.some(player => player.isAlive === true)) {
            // todo: end game (all players are dead)
        }
    }

    add_player(name) {
        this.players.push(new Player(name));
    }

    remove_player(name) {
        let index = this.get_player_index(name);
        if (index !== -1) {
            this.players.splice(index, 1);
            if (this.currentPlayerIndex >= index) this.currentPlayerIndex--;
        }
        if (this.currentPlayerIndex === index) this.finish_turn(); // if current player leaves: move on to next
    }

    current_player_is(name) {
        return this.players[this.currentPlayerIndex].name === name;
    }

    get_player_index(name) {
        return this.players.findIndex(player => player.name === name);
    }

    move_player(name, amount) {
        let index = this.get_player_index(name);
        this.players[index].move_by(amount);
    }
}

module.exports = Game;