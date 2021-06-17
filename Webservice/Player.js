class Player {
    constructor(socketUsername) {
        this.socketUsername = socketUsername;
        this.position = 0;
        this.isAlive = true;
    }

    move(amount) {
        this.position += amount;
        if (this.position === 15) {
            // todo: win
        }
    }
}

module.exports = Player;