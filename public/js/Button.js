function Button(default_color, hover_color, select_color, width, height, x, y, text, status, button_is_answer, click) {
    this.graphics = new PIXI.Graphics();
    this.default_color = default_color;
    this.hover_color = hover_color;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.text = text;
    this.status = status;
    this.button_is_answer = button_is_answer;
    this.click = click;
    this.selected = false;
    let _this = this;

    this.changeButtonColor = function (color) {
        this.graphics.clear();

        this.graphics.lineStyle(4, 0x000000, 1);
        this.graphics.beginFill(color);
        this.graphics.drawRect(this.x, this.y, this.width, this.height);
        this.graphics.endFill();
    };

    this.selectButton = function () {
        this.selected = true;
        this.changeButtonColor(select_color);
    };

    this.unSelectButton = function () {
        this.selected = false;
        this.changeButtonColor(default_color);
    };

    this.getButton = function () {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 60,
            wordWrap: true,
            wordWrapWidth: game_board_size * 0.5 - 20,
        });

        this.graphics.clear();

        this.graphics.lineStyle(4, 0x000000, 1);
        this.graphics.beginFill(this.default_color);
        this.graphics.drawRect(this.x, this.y, this.width, this.height);
        this.graphics.endFill();

        let text_field = new PIXI.Text(this.text, style);
        text_field.x = this.x + this.width / 2 - text_field.width / 2;
        text_field.y = this.y + this.height / 2 - text_field.height / 2;
        this.graphics.addChild(text_field);

        this.graphics.interactive = true;
        this.graphics.buttonMode = true;
        this.graphics.defaultCursor = 'pointer';
        this.graphics.on('click', function () {
            if (_this.button_is_answer) {
                if (_this.selected === true) {
                    _this.unSelectButton();
                } else {
                    _this.selectButton();
                }
            }
            click();
        });
        this.graphics.on('mouseover', function () {
            if (!_this.selected) {
                _this.changeButtonColor(_this.hover_color);
            }
        });
        this.graphics.on('mouseout', function () {
            if (!_this.selected) _this.changeButtonColor(_this.default_color);
        });
        return this.graphics;
    };
}
