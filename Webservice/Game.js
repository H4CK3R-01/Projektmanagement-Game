const Hunter = require("./Hunter");

class Game {
    constructor() {
        this.players = [];
        this.whosNext = 0;
        this.started = false;
        this.round = 0;
        this.hunter = new Hunter();
    }

    finish_turn() {
        // move on to next player; skip dead players
        do {
            this.whosNext++;
            if (this.whosNext === this.players.length) {
                this.whosNext = 0;
                this.round++;
            }
        } while (!this.players[this.whosNext].isAlive);
        // kill players with hunter
        if (this.round >= 5) {
            this.hunter.move(1);
            this.hunter.hunt(this.players);
        }
        // check if all players are dead
        if (!this.players.some(player => player.isAlive === true)) {
            // todo: end game (all players are dead)
        }
    }
}

module.exports = Game;