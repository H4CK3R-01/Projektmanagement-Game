class Player {
    curr_field = 0 ;
    coord_x = 0;
    coord_y = 0;

    constructor(socketUsername, sprites) {
        this.socketUsername = socketUsername;
        this.sprites = sprites;
        this.isAlive = true;
        this.coord_x = sprites[0].getX();
        this.coord_y = sprites[0].getY();
        this.curr_field = 0;
    }

    getX(){
        return this.coord_x;
    }

    getY(){
        return this.coord_y;
    }


    move(amount) {
        this.curr_field += amount;
        this.coord_x = this.sprites[this.curr_field].getX();
        this.coord_y = this.sprites[this.curr_field].getY();
        if (this.position === 15) {
            // todo: win
        }
    }

}

module.exports = Player;
