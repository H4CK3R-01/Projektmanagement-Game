const Player = require('./Player');
const Hunter = require('./Hunter');

class Game {

    static MAX_PLAYERS = 4;
    static MAX_POSITION = 16;
    static STATUS = {
        SETTING_UP: 0,
        ONGOING: 1,
        IS_DRAW: 2,
        IS_WON: 3
    };

    constructor() {
        this.currentStatus = Game.STATUS.SETTING_UP;
        this.players = [];
        this.currentPlayerIndex = 0;
        this.round = 0;
        this.hunter = new Hunter();
        this.playerNames = [];
        this.used_cards = [];
    }

    finish_turn() {
        this.update_game_status();

        if (this.currentStatus !== Game.STATUS.ONGOING) return;
        if (!this.players.some(player => player.isAlive === true)) return;

        let roundIsOver = false;
        do {
            this.currentPlayerIndex++;
            if (this.currentPlayerIndex >= this.players.length) {
                this.currentPlayerIndex = 0;
                roundIsOver = true;
            }
        } while (!this.players[this.currentPlayerIndex].isAlive); // skip dead players

        if (roundIsOver) this.#finish_round();
    }

    #finish_round() {
        this.round++;
        if (this.players.some(player => player.position >= Game.MAX_POSITION / 2)) {
            this.hunter.isAlive = true;
        }
        if (this.hunter.isAlive) {
            this.hunter.move_by(1);
            this.hunter.hunt(this.players);
        }
        this.update_game_status();
    }

    add_player(name) {
        let canAddPlayer = this.players.length < Game.MAX_PLAYERS;
        if (canAddPlayer) this.players.push(new Player(name));
        return canAddPlayer;
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
        if (this.players[this.currentPlayerIndex] === undefined) return false;
        return this.players[this.currentPlayerIndex].name === name;
    }

    get_player_index(name) {
        return this.players.findIndex(player => player.name === name);
    }

    move_player(name, amount) {
        let index = this.get_player_index(name);
        if (index === -1) return;
        this.players[index].move_by(amount);
        this.update_game_status();
    }

    update_game_status() {
        if (!this.players.some(player => player.isAlive === true)) this.currentStatus = Game.STATUS.IS_DRAW;

        let index = this.players.findIndex(player => player.position >= Game.MAX_POSITION);
        if (index !== -1) {
            this.currentStatus = Game.STATUS.IS_WON;
        }
    }

    getPlayerNames() {
        return this.playerNames;
    }

    addPlayerName(playerName) {
        this.playerNames.push(playerName);
    }

    removePlayerName(playerName) {
        this.playerNames.splice(this.playerNames.indexOf(playerName), 1);
    }
}

module.exports = Game;