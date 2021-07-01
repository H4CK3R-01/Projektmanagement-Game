function Card(game_board_size, s, a1, a2, a3, a4, d, your_turn) {
    this.card = new PIXI.Graphics();
    this.s = s;
    this.a1 = a1;
    this.a2 = a2;
    this.a3 = a3;
    this.a4 = a4;
    if (a1.status) this.right_answer = this.a1.text;
    if (a2.status) this.right_answer = this.a2.text;
    if (a3.status) this.right_answer = this.a3.text;
    if (a4.status) this.right_answer = this.a4.text;
    this.d = d;
    this.your_turn = your_turn;
    this.card_x = game_board_size * 0.25 + 2.5;
    this.card_y = game_board_size / 2 - game_board_size * 0.72 / 2 + 2.5;
    this.card_height = game_board_size * 0.72;
    this.card_width = game_board_size * 0.5;
    this.buttons = [];
    let _this = this;

    this.showCard = function () {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 50,
            wordWrap: true,
            wordWrapWidth: game_board_size * 0.5 - 20,
        });

        const header_style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 70,
            wordWrap: true,
            wordWrapWidth: game_board_size * 0.5 - 20,
        });

        this.card.beginFill(0xffffff);
        switch (d) {
            case 1:
                this.card.lineStyle(30, 0x6C9A8B, 1);
                break;
            case 2:
                this.card.lineStyle(30, 0xFFDDA1, 1);
                break;
            case 3:
                this.card.lineStyle(30, 0xF47A93, 1);
                break;
        }
        this.card.beginFill(0xFFFFFF);
        this.card.moveTo(this.card_x + 50, this.card_y);
        this.card.lineTo(this.card_x + 0, this.card_y + 50);
        this.card.lineTo(this.card_x + 0, this.card_y + this.card_height);
        this.card.lineTo(this.card_x + 50, this.card_y + this.card_height + 50);
        this.card.lineTo(this.card_x + this.card_width - 50, this.card_y + this.card_height + 50);
        this.card.lineTo(this.card_x + this.card_width, this.card_y + this.card_height);
        this.card.lineTo(this.card_x + this.card_width, this.card_y + 50);
        this.card.lineTo(this.card_x + this.card_width - 50, this.card_y + 0);
        this.card.closePath();
        this.card.endFill();

        let header;
        if (this.d === 0) {
            header = new PIXI.Text("Scoreboard", header_style);
        } else {
            header = new PIXI.Text("Schwierigkeit " + this.d, header_style);
        }
        header.x = this.card_x + 20 + this.card.width / 2 - header.width / 2 - 2.5 - 20;
        header.y = this.card_y + 20;
        this.card.addChild(header);

        const basicText = new PIXI.Text(this.s, style);
        basicText.x = this.card_x + 20;
        basicText.y = this.card_y + 50 + header.height;
        this.card.addChild(basicText);

        // Answers
        let color = 0xffffff;
        if (this.d === 0) {
            color = 0xFFDDA1;
        }
        this.buttons.push(new Button(color, 0xcccccc, 0x4169E1, this.card_width - 40, 200, this.card_x + 20, this.card_y + this.card_height - 120 - 220 * 4, this.a1.text, this.a1.status, function () {
            if (_this.your_turn) {
                select_answer(0, _this.a1.text);
            }
        }));

        color = 0xffffff;
        if (this.d === 0) {
            color = 0x4169E1;
        }
        this.buttons.push(new Button(color, 0xcccccc, 0x4169E1, this.card_width - 40, 200, this.card_x + 20, this.card_y + this.card_height - 120 - 220 * 3, this.a2.text, this.a2.status, function () {
            if (_this.your_turn) {
                select_answer(1, _this.a2.text);
            }
        }));

        color = 0xffffff;
        if (this.d === 0) {
            color = 0x6C9A8B;
        }
        this.buttons.push(new Button(color, 0xcccccc, 0x4169E1, this.card_width - 40, 200, this.card_x + 20, this.card_y + this.card_height - 120 - 220 * 2, this.a3.text, this.a3.status, function () {
            if (_this.your_turn) {
                select_answer(2, _this.a3.text);
            }
        }));

        color = 0xffffff;
        if (this.d === 0) {
            color = 0xF47A93;
        }
        this.buttons.push(new Button(color, 0xcccccc, 0x4169E1, this.card_width - 40, 200, this.card_x + 20, this.card_y + this.card_height - 120 - 220 * 1, this.a4.text, this.a4.status, function () {
            if (_this.your_turn) {
                select_answer(3, _this.a4.text);
            }
        }));

        this.buttons.forEach(button => this.card.addChild(button.getButton()));


        // OK-Button
        this.card.addChild(new Button(0xffffff, 0xcccccc, 0xffffff, this.card_width - 40, 100, this.card_x + 20, this.card_y + this.card_height - 120, "OK", null, function () {
            if (answer !== null) {
                if (_this.right_answer === answer) { //TODO: do this in backend instead to prevent cheating
                    console.log("Richtig");
                    socket.emit('card finished', d, true);    
                } else {
                    console.log("Falsch");
                    socket.emit('card finished', d, false);   
                }
                show_card = false;
                answer = null;
                diced = false;
                rolled_number = null;
            } else {
                if (your_turn === true) {
                    alert("Bitte wähle eine Antwortmöglichkeit aus");
                } else {
                    show_card = false;
                    answer = null;
                    diced = false;
                    rolled_number = null;
                    card.destroyCard();
                    border_card_stack.clear();
                }
            }
        }).getButton());

        app.stage.addChild(this.card);
    };

    this.destroyCard = function () {
        if (this.card !== null) {
            this.card.destroy();
        }
    };

    function select_answer(id, text) {
        _this.buttons.forEach(button => button.unSelectButton());
        _this.buttons[id].selectButton();
        answer = text;
    }
}