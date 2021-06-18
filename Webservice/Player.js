class Player {
    constructor(name) {
        this.name = name;
        this.position = 0;
        this.isAlive = true;
    }

    move_by(amount) {
        this.position += amount;
    }
}

module.exports = Player;