function Sprite(x, y, slow) {
    if(slow){
        this.sprite = PIXI.Sprite.from('/img/spriteSlow.jpg');
    }else{
        this.sprite = PIXI.Sprite.from('/img/sprite.jpg');
    }
    this.coord_x = x;
    this.coord_y = y;

    this.getSprite = function () {
        this.setSize(this.sprite, sprite_size);
        return this.sprite;
    };

    this.setSize = function (sprite, size) {
        sprite.x = this.coord_x * size - size * 0.2;
        sprite.y = this.coord_y * size - size * 0.2;
        sprite.width = size * 1.5;
        sprite.height = size * 1.5;
    };
}
