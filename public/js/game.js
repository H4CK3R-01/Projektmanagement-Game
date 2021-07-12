/*
    Images
        background.jpg: https://pixabay.com/get/ge3fe775ba1a5bfd2cc937b0687982214d547e5cf538543560fc25041c070ad5b860d8dd24df751dbc5c7d5ede3f672e7_1920.jpg?attachment=
        card_stack.png: https://www.google.de/url?sa=i&url=https%3A%2F%2Fwww.pngegg.com%2Fpt%2Fsearch%3Fq%3Drainha%2Bde%2Bcopas&psig=AOvVaw3wwfk87wAXBxqmdXnoGSfe&ust=1623254731054000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMjUoaG1iPECFQAAAAAdAAAAABA5
        dice.svg: https://www.svgrepo.com/download/198836/gambler-casino.svg
        sprite.jpg: https://media.istockphoto.com/photos/gray-granite-stone-texture-seamless-square-background-tile-ready-picture-id1096464726
*/
let positions = [0, 0, 0, 0];
let card;
let answer = null;
let show_card = false;
let diced = false;
let rolled_number = null;

let game = document.getElementById('game');
let app;
let border_card_stack = new PIXI.Graphics();
let my_turn;
let score_button;

let game_board_size = 2000;
let max_size = calculate_size();
let sprite_size = Math.floor(game_board_size / 11);

let playerNames = [];

// fields
let sprites = [
    new Sprite(1, 9, false), // lower left
    new Sprite(1, 7, false),
    new Sprite(1, 5, false),
    new Sprite(1, 3, false),
    new Sprite(1, 1, false), // upper left
    new Sprite(3, 1, false),
    new Sprite(5, 1, false),
    new Sprite(7, 1, false),
    new Sprite(9, 1, false), // upper right
    new Sprite(9, 3, false),
    new Sprite(9, 5, false),
    new Sprite(9, 7, false),
    new Sprite(9, 9, true), // lower right
    new Sprite(7, 9, true),
    new Sprite(5, 9, true),
    new Sprite(3, 9, true)
];

function start_game() {
    app = new PIXI.Application({
        autoResize: true,
        resolution: 1,
        backgroundAlpha: 0,
        width: max_size / game_board_size,
        height: max_size / game_board_size
    });
    document.getElementById('game').appendChild(app.view);

    sprites.forEach(sprite => app.stage.addChild(sprite.getSprite()));

    // Red border
    let red_border = generate_red_border(new PIXI.Graphics(), 1, 9);
    app.stage.addChild(red_border);


    // Player circles
    let player_a = generate_circle(new PIXI.Graphics(), 1, 9, 'yellow', 1);
    app.stage.addChild(player_a);

    let player_b = generate_circle(new PIXI.Graphics(), 1, 9, 'blue', 2);
    app.stage.addChild(player_b);

    let player_c = generate_circle(new PIXI.Graphics(), 1, 9, 'green', 3);
    app.stage.addChild(player_c);

    let player_d = generate_circle(new PIXI.Graphics(), 1, 9, 'red', 4);
    app.stage.addChild(player_d);


    // Card stacks
    let cards_1 = generate_card_stack(PIXI.Sprite.from('/img/card_stack_1.png'), 3, 3, function () {
        if (diced && !show_card && rolled_number === 1) {
            console.log("1");
            socket.emit('get card', 1);
        }
    });
    app.stage.addChild(cards_1);

    let cards_2 = generate_card_stack(PIXI.Sprite.from('/img/card_stack_2.png'), 5, 3, function () {
        if (diced && !show_card && rolled_number === 2) {
            console.log("2");
            socket.emit('get card', 2);
        }
    });
    app.stage.addChild(cards_2);

    let cards_3 = generate_card_stack(PIXI.Sprite.from('/img/card_stack_3.png'), 7, 3, function () {
        if (diced && !show_card && rolled_number === 3) {
            console.log("3");
            socket.emit('get card', 3);
        }
    });
    app.stage.addChild(cards_3);


    // Dice
    let diceTexture = PIXI.Texture.from('/img/dice.svg');
    let dice = new PIXI.Sprite(diceTexture);
    dice.x = sprite_size * 7 - sprite_size * 0.2;
    dice.y = sprite_size * 7 - sprite_size * 0.2;
    dice.width = 200;
    dice.height = 200;
    dice.interactive = true;
    dice.buttonMode = true;
    dice.defaultCursor = 'pointer';
    dice.on('pointerdown', function () {
        if (!diced) {
            socket.emit('roll dice');
        }
    });
    app.stage.addChild(dice);

    app.stage.addChild(border_card_stack);


    // Logo
    let logo = PIXI.Sprite.from('/img/logo.png');
    logo.x = sprite_size * 3 - sprite_size * 0.2;
    logo.y = sprite_size * 5.5 - sprite_size * 0.2;
    logo.width = sprite_size * 3.5;
    logo.height = sprite_size * 1.5;
    // logo.rotation -= Math.PI / 8;
    app.stage.addChild(logo);


    my_turn = new PIXI.Text("", new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 70,
        fontWeight: 'bold',
    }));
    my_turn.x = sprite_size * 6;
    my_turn.y = sprite_size * 8;
    app.stage.addChild(my_turn);


    let rolled_number_text = new PIXI.Text("", new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 140,
        fontWeight: 'bold',
        wordWrap: true,
        wordWrapWidth: game_board_size * 0.5 - 20,
    }));
    rolled_number_text.x = sprite_size * 7 - sprite_size * 0.2 + dice.width / 2 - rolled_number_text.width / 2;
    rolled_number_text.y = sprite_size * 6 - sprite_size * 0.2;
    app.stage.addChild(rolled_number_text);


    let score_button_text = new PIXI.Text("Scoreboard", new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 40,
        wordWrap: true,
        wordWrapWidth: this.width,
        breakWords: true,
        padding: 50
    }));
    score_button_text.x = sprite_size * 3 + 25 - sprite_size * 0.2;
    score_button_text.y = sprite_size * 7 + 25 - sprite_size * 0.2 + sprite_size * 0.5;

    score_button = new PIXI.Graphics();
    score_button.lineStyle(4, 0x000000, 1);
    score_button.beginFill(0x7d7d7d);
    score_button.drawRect(sprite_size * 3 - sprite_size * 0.2, sprite_size * 7 - sprite_size * 0.2 + sprite_size * 0.5, score_button_text.width + 50, score_button_text.height + 50);
    score_button.endFill();
    score_button.interactive = true;
    score_button.buttonMode = true;
    score_button.defaultCursor = 'pointer';
    score_button.on('pointerdown', function () {
        card = new Card(game_board_size, "",
            { "text": playerNames[0] ? playerNames[0] + ": " + positions[0] : ("Kein Spieler"), "status": false },
            { "text": playerNames[1] ? playerNames[1] + ": " + positions[1] : ("Kein Spieler"), "status": false },
            { "text": playerNames[2] ? playerNames[2] + ": " + positions[2] : ("Kein Spieler"), "status": false },
            {
                "text": playerNames[3] ? playerNames[3] + ": " + positions[3] : ("Kein Spieler"),
                "status": false
            }, 0, false);
        card.showCard();
        show_card = true;
    });

    app.stage.addChild(score_button);
    score_button.addChild(score_button_text);

    socket.on('updatePlayerNames', function (p) {
        playerNames = p;
    });


    socket.on('first player', function () {
        my_turn.text = "Your Turn";
    });

    socket.on('dice', function (randomInt) {
        rolled_number = randomInt;
        diced = true;
        border_card_stack.clear();
        border_card_stack.lineStyle(15, 0x862323, 1);
        border_card_stack.drawRoundedRect(sprite_size * (1 + 2 * rolled_number) - sprite_size * 0.2, sprite_size * 3 - sprite_size * 0.2, sprite_size * 1.5, sprite_size * 3 * 0.72, 10);

        rolled_number_text.text = rolled_number;
    });

    socket.on('card', function (data) {
        let u = data.username;
        let q = data.card.question;
        let a = data.card.answers;
        let d = data.card.difficulty;
        card = new Card(game_board_size, q, a[0], a[1], a[2], a[3], d, u === username);
        card.showCard();
        show_card = true;
    });

    socket.on('card destroyed', function () {
        diced = false;
        show_card = false;
        card.destroyCard();
        rolled_number_text.text = "";
        border_card_stack.clear();
    });

    socket.on('player moved', function (data) {
        my_turn.text = "";

        let player = data.player;
        let position = data.position;
        let next_player = data.next_player;

        let x, y;
        if (position < 16) {
            x = sprites[position].coord_x;
            y = sprites[position].coord_y;
        } else {
            x = 1;
            y = 9;
        }

        switch (player) {
            case 0:
                positions[0] = data.position;
                player_a.clear();
                player_a = generate_circle(new PIXI.Graphics(), x, y, 'yellow', 1);
                app.stage.addChild(player_a);
                break;
            case 1:
                positions[1] = data.position;
                player_b.clear();
                player_b = generate_circle(new PIXI.Graphics(), x, y, 'blue', 2);
                app.stage.addChild(player_b);
                break;
            case 2:
                positions[2] = data.position;
                player_c.clear();
                player_c = generate_circle(new PIXI.Graphics(), x, y, 'green', 3);
                app.stage.addChild(player_c);
                break;
            case 3:
                positions[3] = data.position;
                player_d.clear();
                player_d = generate_circle(new PIXI.Graphics(), x, y, 'red', 4);
                app.stage.addChild(player_d);
                break;
        }

        if (data.state == 2 || data.state == 3) {
            card = new Card(game_board_size, "",
                { "text": playerNames[0] ? playerNames[0] + ": " + positions[0] : ("Kein Spieler"), "status": false },
                { "text": playerNames[1] ? playerNames[1] + ": " + positions[1] : ("Kein Spieler"), "status": false },
                { "text": playerNames[2] ? playerNames[2] + ": " + positions[2] : ("Kein Spieler"), "status": false },
                { "text": playerNames[3] ? playerNames[3] + ": " + positions[3] : ("Kein Spieler"), "status": false },
                0, false, data.state);
            red_border.clear();
            card.showCard();
            show_card = true;
        }

        if (next_player === username) my_turn.text = "Your Turn";
    });

    socket.on('update Hunter', function (position) {
        x = sprites[position].coord_x;
        y = sprites[position].coord_y;
        red_border.clear();
        red_border = generate_red_border(new PIXI.Graphics(), x, y);
        app.stage.addChild(red_border);
    });

    resize();
}

function generate_card_stack(sprite, x, y, onclick) {
    sprite.x = sprite_size * x - sprite_size * 0.2;
    sprite.y = sprite_size * y - sprite_size * 0.2;
    sprite.width = sprite_size * 1.5;
    sprite.height = sprite_size * 3 * 0.72;
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.defaultCursor = 'pointer';
    sprite.on('pointerdown', onclick);
    return sprite;
}

function generate_red_border(graphics, x, y) {
    graphics.lineStyle(sprite_size * 0.10, 0x862323, 1);
    graphics.drawRect(sprite_size * x - sprite_size * 0.2, sprite_size * y - sprite_size * 0.2, sprite_size * 1.5, sprite_size * 1.5);
    return graphics;
}

function generate_circle(graphics, x, y, color, offset) {
    graphics.lineStyle(0);
    switch (color) {
        case 'yellow':
            graphics.beginFill(0xFFDDA1, 1);
            break;
        case 'red':
            graphics.beginFill(0xF47A93, 1);
            break;
        case 'green':
            graphics.beginFill(0x6C9A8B, 1);
            break;
        case 'blue':
            graphics.beginFill(0x4169E1, 1);
            break;
        case 'white':
            graphics.beginFill(0xFFFFFF, 1);
            break;
    }
    switch (offset) {
        case 1:
            graphics.drawCircle(sprite_size * x - 65 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size * y + 65 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size / 4);
            break; // upper left
        case 2:
            graphics.drawCircle(sprite_size * x + 65 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size * y + 65 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size / 4);
            break; // upper right
        case 3:
            graphics.drawCircle(sprite_size * x - 65 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size * y - 65 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size / 4);
            break; // lower left
        case 4:
            graphics.drawCircle(sprite_size * x + 65 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size * y - 65 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size / 4);
            break; // lower right
    }
    graphics.endFill();
    return graphics;
}

function calculate_size() {
    let width;
    let height;
    if (game.offsetWidth > window.innerWidth) {
        width = window.innerWidth - document.getElementById('chat').offsetWidth;
    } else {
        width = game.offsetWidth;
    }

    if (game.offsetHeight > window.innerHeight) {
        height = window.innerHeight - document.getElementsByTagName('header')[0].offsetHeight;
    } else {
        height = game.offsetHeight;
    }

    if (width > height) {
        return height;
    } else {
        return width;
    }
}

// Resize
window.addEventListener('resize', resize);

function resize() {
    let size = calculate_size();
    app.stage.scale.set(size / game_board_size, size / game_board_size);

    app.renderer.resize(size, size);
}