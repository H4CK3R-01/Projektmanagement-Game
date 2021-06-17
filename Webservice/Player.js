class Player {
    constructor(name) {
        this.name = name;
        this.position = 0;
        this.isAlive = true;
    }

    move_by(amount) {
        this.position += amount;
        //todo: move by 1 only on the last 3 fields
        if (this.position >= 16) {
            // todo: win
        }
    }
}

module.exports = Player;