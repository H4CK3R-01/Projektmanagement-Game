class Hunter {
    constructor() {
        this.position = 0;
        this.isAlive = false;
    }

    getPosition() {
        return this.position;
    }

    move_by(amount) {
        this.position += amount;
    }

    hunt(playerArray) {
        for (let i = 0; i < playerArray.length; i++) {
            if (playerArray[i].position <= this.position - 1) {
                playerArray[i].isAlive = false;
            }
        }
    }
}

module.exports = Hunter;