class Player {
    constructor(name) {
        this.name = name;
        this.position = 0;
        this.isAlive = true;
    }

    move_by(amount) {
        if (this.position !== 16) {
            if (this.position > 11) {
                this.position++;
            } else if (this.position + amount > 11) {
                this.position = 12;
            } else {
                this.position += amount;
            }
        }
    }
}

module.exports = Player;