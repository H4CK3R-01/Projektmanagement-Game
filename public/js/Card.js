function Card(game_board_size, s, a1, a2, a3, a4, right_answer, d) {
    this.card = new PIXI.Graphics();
    this.s = s;
    this.a1 = a1;
    this.a2 = a2;
    this.a3 = a3;
    this.a4 = a4;
    this.right_answer = right_answer;
    this.d = d;
    this.card_x = game_board_size * 0.25 + 2.5;
    this.card_y = game_board_size / 2 - game_board_size * 0.72 / 2 + 2.5;
    this.card_height = game_board_size * 0.72;
    this.card_width = game_board_size * 0.5;
    this.buttons = [];
    let _this = this;

    this.showCard = function () {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 60,
            wordWrap: true,
            wordWrapWidth: game_board_size * 0.5 - 20,
        });

        const header_style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 70,
            wordWrap: true,
            wordWrapWidth: game_board_size * 0.5 - 20,
        });

        this.card.lineStyle(20, 0x6C9A8B, 1);
        this.card.beginFill(0xffffff);
        this.card.drawRoundedRect(this.card_x, this.card_y, this.card_width, this.card_height, 10);
        this.card.endFill();

        const header = new PIXI.Text("Schwierigkeit " + this.d, header_style);
        header.x = this.card_x + 20 + this.card.width / 2 - header.width / 2 - 2.5 - 20;
        header.y = this.card_y + 20;
        this.card.addChild(header);

        const basicText = new PIXI.Text(this.s, style);
        basicText.x = this.card_x + 20;
        basicText.y = this.card_y + 50 + header.height;
        this.card.addChild(basicText);

        // Answers
        this.buttons.push(new Button(0xffffff, 0xcccccc, 0xff00ff, this.card_width - 40, 150, this.card_x + 20, this.card_y + this.card_height - 120 - 170 * 4, this.a1, true, function () {
            select_answer(0);
        }));

        this.buttons.push(new Button(0xffffff, 0xcccccc, 0xff00ff, this.card_width - 40, 150, this.card_x + 20, this.card_y + this.card_height - 120 - 170 * 3, this.a2, true, function () {
            select_answer(1);
        }));

        this.buttons.push(new Button(0xffffff, 0xcccccc, 0xff00ff, this.card_width - 40, 150, this.card_x + 20, this.card_y + this.card_height - 120 - 170 * 2, this.a3, true, function () {
            select_answer(2);
        }));

        this.buttons.push(new Button(0xffffff, 0xcccccc, 0xff00ff, this.card_width - 40, 150, this.card_x + 20, this.card_y + this.card_height - 120 - 170 * 1, this.a4, true, function () {
            select_answer(3);
        }));

        this.buttons.forEach(button => this.card.addChild(button.getButton()));


        // OK-Button
        this.card.addChild(new Button(0xffffff, 0xcccccc, 0xffffff, this.card_width - 40, 100, this.card_x + 20, this.card_y + this.card_height - 120, "OK", false, function () {
            if (_this.right_answer === answer) {
                console.log("Richtig")
            } else {
                console.log("Falsch")
            }
            show_card = false;
            _this.card.destroy();
        }).getButton());

        app.stage.addChild(this.card);
    }


    function select_answer(id) {
        console.log(id)
        _this.buttons.forEach(button => button.unSelectButton());
        _this.buttons[id].selectButton();
        answer = id;
    }
}