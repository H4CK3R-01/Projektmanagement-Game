class Hunter {
    constructor() {
        this.position = 0;
    }

    move(amount) {
        this.position += amount;
    }

    hunt(playerArray) {
        for (let i = 0; i < playerArray.length; i++) {
            if (playerArray[i].position <= this.position) {
                playerArray[i].isAlive = false;
            }
        }
    }
}

module.exports = Hunter;