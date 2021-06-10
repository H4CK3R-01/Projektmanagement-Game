function createPlayers(amount) {
    let players = new Array(amount);
    for (let i = 0; i < amount; i++) {
        players[i] = new Player();
    }
    return players;
}

class Player {
    constructor() {
        this.position = 0;
        this.alive = true;
    }

    move(amount) {
        this.position += amount;
        if (this.position === 15) {
            // todo: win
        }
    }
}

class Hunter {
    constructor() {
        this.position = 0;
    }

    move(amount) {
        this.position += amount;
    }

    hunt(players) {
        for (let i = 0; i < players.length; i++) {
            if (players[i].position <= this.position) {
                players[i].alive = false;
            }
        }
    }
}