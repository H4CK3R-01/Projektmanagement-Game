/*
    Images
        background.jpg: https://www.lignaushop.de/images/product_images/popup_images/treppenstufe-buecherregal-fensterbank-eiche-country-rustikal-unbehandelt-wuppertal.JPG
        card_stack.png: https://www.google.de/url?sa=i&url=https%3A%2F%2Fwww.pngegg.com%2Fpt%2Fsearch%3Fq%3Drainha%2Bde%2Bcopas&psig=AOvVaw3wwfk87wAXBxqmdXnoGSfe&ust=1623254731054000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMjUoaG1iPECFQAAAAAdAAAAABA5
        dice.svg: https://www.svgrepo.com/download/198836/gambler-casino.svg
        sprite.jpg: https://media.istockphoto.com/photos/gray-granite-stone-texture-seamless-square-background-tile-ready-picture-id1096464726
*/
let curr_player = 1;
let player_array = [1, 1, 1, 1];
let player_color = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
let player_sprite_array = [];
let card;
let answer = null;
let show_card = false;
let diced = false;
let rolled_number = null;

let game = document.getElementById('game');
let app;
let border_card_stack = new PIXI.Graphics();

let game_board_size = 2000;
let max_size = calculate_size();
let sprite_size = Math.floor(game_board_size / 11);

const rolled_number_style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 140,
    fontWeight: 'bold',
    wordWrap: true,
    wordWrapWidth: game_board_size * 0.5 - 20,
});
let rolled_number_text = new PIXI.Text("", rolled_number_style);

// fields
let sprites = [
    // First row
    new Sprite(1, 1),
    new Sprite(3, 1),
    new Sprite(5, 1),
    new Sprite(7, 1),
    new Sprite(9, 1),

    // Second row
    new Sprite(1, 3),
    new Sprite(9, 3),

    // Third row
    new Sprite(1, 5),
    new Sprite(9, 5),

    // Fourth row
    new Sprite(1, 7),
    new Sprite(9, 7),

    // Fifth row
    new Sprite(1, 9),
    new Sprite(3, 9),
    new Sprite(5, 9),
    new Sprite(7, 9),
    new Sprite(9, 9),
];

function start_game() {
    app = new PIXI.Application({
        autoResize: true,
        resolution: devicePixelRatio,
        backgroundAlpha: 0,
        width: max_size / game_board_size,
        height: max_size / game_board_size
    });
    document.getElementById('game').appendChild(app.view);

    sprites.forEach(sprite => app.stage.addChild(sprite.getSprite()));


    // Red border
    let red_border = generate_red_border(new PIXI.Graphics());
    app.stage.addChild(red_border);


    // White circles
    let first_circle = generate_circle(new PIXI.Graphics(), 3, 9);
    app.stage.addChild(first_circle);

    let second_circle = generate_circle(new PIXI.Graphics(), 5, 9);
    app.stage.addChild(second_circle);

    let third_circle = generate_circle(new PIXI.Graphics(), 7, 9);
    app.stage.addChild(third_circle);


    // Card stacks
    let cards_1 = generate_card_stack(PIXI.Sprite.from('/img/card_stack.png'), 3, 3, function () {
        if (!show_card && rolled_number === 1) {
            console.log("1");
            socket.emit('get card', 1);
        }
    });
    app.stage.addChild(cards_1);

    let cards_2 = generate_card_stack(PIXI.Sprite.from('/img/card_stack.png'), 5, 3, function () {
        if (!show_card && rolled_number === 2) {
            console.log("2");
            socket.emit('get card', 2);
        }
    });
    app.stage.addChild(cards_2);

    let cards_3 = generate_card_stack(PIXI.Sprite.from('/img/card_stack.png'), 7, 3, function () {
        if (!show_card && rolled_number === 3) {
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
    dice.on('click', function () {
        if (!diced) {
            socket.emit('roll dice');
        }
    });
    app.stage.addChild(dice);

    app.stage.addChild(border_card_stack);


    // Logo
    let logo = PIXI.Sprite.from('/img/logo_2.png');
    logo.x = sprite_size * 3 - sprite_size * 0.2;
    logo.y = sprite_size * 5.5 - sprite_size * 0.2;
    logo.width = sprite_size * 3.5;
    logo.height = sprite_size * 1.5;
    // logo.rotation -= Math.PI / 8;
    app.stage.addChild(logo);

    socket.on('dice', function (randomInt) {
        rolled_number = randomInt;
        diced = true;
        border_card_stack.clear();
        border_card_stack.lineStyle(15, 0x862323, 1);
        border_card_stack.drawRoundedRect(sprite_size * (1 + 2 * rolled_number) - sprite_size * 0.2, sprite_size * 3 - sprite_size * 0.2, sprite_size * 1.5, sprite_size * 3 * 0.72, 10);

        rolled_number_text = new PIXI.Text(rolled_number, rolled_number_style);
        rolled_number_text.x = sprite_size * 7 - sprite_size * 0.2 + dice.width / 2 - rolled_number_text.width / 2;
        rolled_number_text.y = sprite_size * 6 - sprite_size * 0.2;
        app.stage.addChild(rolled_number_text);
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
        card.destroyCard();
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
    sprite.on('click', onclick);
    return sprite;
}

function generate_red_border(graphics) {
    graphics.lineStyle(sprite_size * 0.10, 0x862323, 1);
    graphics.drawRect(sprite_size * 9 - sprite_size * 0.2, sprite_size * 9 - sprite_size * 0.2, sprite_size * 1.5, sprite_size * 1.5);
    return graphics;
}

function generate_circle(graphics, x, y) {
    graphics.lineStyle(0);
    graphics.beginFill(0xffffff, 1);
    graphics.drawCircle(sprite_size * x - sprite_size * 0.2 + sprite_size * 0.75, sprite_size * y - sprite_size * 0.2 + sprite_size * 0.75, sprite_size / 4);
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