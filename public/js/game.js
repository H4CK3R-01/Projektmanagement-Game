let answer = null;
let show_card = false;

function Sprite(x, y) {
    this.sprite = PIXI.Sprite.from('/img/sprite.jpg');
    this.coord_x = x;
    this.coord_y = y;

    this.getSprite = function () {
        this.setSize(this.sprite, sprite_size);
        return this.sprite;
    }

    this.setSize = function (sprite, size) {
        sprite.x = this.coord_x * size - size * 0.2;
        sprite.y = this.coord_y * size - size * 0.2;
        sprite.width = size * 1.5;
        sprite.height = size * 1.5;
    }
}


let game = document.getElementById('game');

let game_board_size = 2000;
let size = calculate_size();
let sprite_size = Math.floor(game_board_size / 11);

const app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio,
    backgroundAlpha: 0,
    width: size / game_board_size,
    height: size / game_board_size
});
document.getElementById('game').appendChild(app.view);


// fields
let sprites = {
    0: new Sprite(1, 1),
    1: new Sprite(3, 1),
    2: new Sprite(5, 1),
    3: new Sprite(7, 1),
    4: new Sprite(9, 1),

    5: new Sprite(1, 3),
    6: new Sprite(9, 3),

    7: new Sprite(1, 5),
    8: new Sprite(9, 5),

    9: new Sprite(1, 7),
    10: new Sprite(9, 7),

    11: new Sprite(1, 9),
    12: new Sprite(3, 9),
    13: new Sprite(5, 9),
    14: new Sprite(7, 9),
    15: new Sprite(9, 9),
}

for (let i = 0; i < 16; i++) app.stage.addChild(sprites[i].getSprite());


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
    if(!show_card) {
        console.log("1");
        generate_card("Ein Bäcker möchte eine neue Filiale eröffnen. Wie sollte er das Budget einteilen?", "a1", "a2", "a3", "a4", 1, 1);
        show_card = true;
    }});
app.stage.addChild(cards_1);

let cards_2 = generate_card_stack(PIXI.Sprite.from('/img/card_stack.png'), 5, 3, function () {
    if(!show_card) {
        console.log("2");
        generate_card("Ein Bäcker möchte eine neue Filiale eröffnen. Wie sollte er das Budget einteilen?", "a1", "a2", "a3", "a4", 1, 1);
        show_card = true;
    }});
app.stage.addChild(cards_2);

let cards_3 = generate_card_stack(PIXI.Sprite.from('/img/card_stack.png'), 7, 3, function () {
    if(!show_card) {
        console.log("3");
        generate_card("Ein Bäcker möchte eine neue Filiale eröffnen. Wie sollte er das Budget einteilen?", "a1", "a2", "a3", "a4", 1, 1);
        show_card = true;
    }
});
app.stage.addChild(cards_3);


function generate_card_stack(sprite, x, y, onclick) {
    sprite.x = sprite_size * x - sprite_size * 0.2;
    sprite.y = sprite_size * y - sprite_size * 0.2;
    sprite.width = sprite_size * 1.5;
    sprite.height = sprite_size * 3 * 0.72;
    sprite.interactive = true;
    sprite.on('click', onclick);
    return sprite
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

function generate_card(s, a1, a2, a3, a4, right_a, d) {
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

    const card = new PIXI.Graphics();
    let start_x = game_board_size * 0.25 + 2.5;
    let start_y = game_board_size / 2 - game_board_size * 0.72 / 2 + 2.5;
    card.lineStyle(20, 0x6C9A8B, 1);
    card.beginFill(0xffffff);
    card.drawRoundedRect(start_x, start_y, game_board_size * 0.5, game_board_size * 0.72, 10);
    card.endFill();

    const header = new PIXI.Text("Schwierigkeit " + d, header_style);
    header.x = start_x + 20 + card.width / 2 - header.width / 2 - 2.5 - 20;
    header.y = start_y + 20;
    card.addChild(header);

    const basicText = new PIXI.Text(s, style);
    basicText.x = start_x + 20;
    basicText.y = start_y + 50 + header.height;
    card.addChild(basicText);


    // TODO Random answer order
    let answer_1 = generate_answer_button(new PIXI.Graphics(), 1, start_x, start_y, function () {
        select_answer(answer_1, answer_2, answer_3, answer_4, start_x, start_y, 1);
    });
    let answer_1_text = generate_answer_text(new PIXI.Text(a1, style), answer_1, start_x, start_y);
    card.addChild(answer_1);
    card.addChild(answer_1_text);

    let answer_2 = generate_answer_button(new PIXI.Graphics(), 2, start_x, start_y, function () {
        select_answer(answer_1, answer_2, answer_3, answer_4, start_x, start_y, 2);
    });
    let answer_2_text = generate_answer_text(new PIXI.Text(a2, style), answer_2, start_x, start_y);
    card.addChild(answer_2);
    card.addChild(answer_2_text);

    let answer_3 = generate_answer_button(new PIXI.Graphics(), 3, start_x, start_y, function () {
        select_answer(answer_1, answer_2, answer_3, answer_4, start_x, start_y, 3);
    });
    let answer_3_text = generate_answer_text(new PIXI.Text(a3, style), answer_3, start_x, start_y);
    card.addChild(answer_3);
    card.addChild(answer_3_text);

    let answer_4 = generate_answer_button(new PIXI.Graphics(), 4, start_x, start_y, function () {
        select_answer(answer_1, answer_2, answer_3, answer_4, start_x, start_y, 4);
    });
    let answer_4_text = generate_answer_text(new PIXI.Text("a4", style), answer_4, start_x, start_y);
    card.addChild(answer_4);
    card.addChild(answer_4_text);


    // OK-Button
    const ok = new PIXI.Graphics();
    ok.lineStyle(4, 0x000000, 1);
    ok.beginFill(0xffffff);
    ok.drawRect(start_x, start_y, game_board_size * 0.5 - 40, 100);
    ok.endFill();
    ok.x = 20;
    ok.y = game_board_size * 0.72 - 120;
    card.addChild(ok);

    const ok_text = new PIXI.Text('OK', style);
    ok_text.x = start_x + ok.x + ok.width / 2 - ok_text.width / 2;
    ok_text.y = start_y + ok.y + ok.height / 2 - ok_text.height / 2;
    card.addChild(ok_text);

    ok.interactive = true;
    ok.on('click', function () {
        if (right_a === answer) {
            console.log("Richtig")
        } else {
            console.log("Falsch")
        }
        show_card = false;
        card.destroy();
    });

    app.stage.addChild(card);
}


function select_answer(answer_1, answer_2, answer_3, answer_4, start_x, start_y, id) {
    if (answer === null) {
        answer = id;
        switch (answer) {
            case 1:
                draw_rect(answer_1, 0xff00ff, start_x, start_y);
                break;
            case 2:
                draw_rect(answer_2, 0xff00ff, start_x, start_y);
                break;
            case 3:
                draw_rect(answer_3, 0xff00ff, start_x, start_y);
                break;
            case 4:
                draw_rect(answer_4, 0xff00ff, start_x, start_y);
                break;
        }
    } else {
        draw_rect(answer_1, 0xffffff, start_x, start_y);
        draw_rect(answer_2, 0xffffff, start_x, start_y);
        draw_rect(answer_3, 0xffffff, start_x, start_y);
        draw_rect(answer_4, 0xffffff, start_x, start_y);
        answer = null;

        select_answer(answer_1, answer_2, answer_3, answer_4, start_x, start_y, id);
    }
}

function draw_rect(answer, color, start_x, start_y) {
    answer.clear();

    answer.lineStyle(4, 0x000000, 1);
    answer.beginFill(color);
    answer.drawRect(start_x, start_y, game_board_size * 0.5 - 40, 150);
    answer.endFill();
}

function generate_answer_button(answer, y, start_x, start_y, onclick) {
    draw_rect(answer, 0xffffff, start_x, start_y);

    answer.x = 20;
    answer.y = game_board_size * 0.72 - 120 - 170 * y;

    answer.interactive = true;
    answer.on('click', onclick);

    return answer;
}

function generate_answer_text(answer_text, rect, start_x, start_y) {
    answer_text.x = start_x + rect.x + rect.width / 2 - answer_text.width / 2;
    answer_text.y = start_y + rect.y + rect.height / 2 - answer_text.height / 2;
    return answer_text
}

function calculate_size() {
    if (game.offsetWidth > game.offsetHeight) {
        return game.offsetHeight;
    } else {
        return game.offsetWidth;
    }
}

// Resize
window.addEventListener('resize', resize);

function resize() {
    let size = calculate_size();
    app.stage.scale.set(size / game_board_size, size / game_board_size);

    app.renderer.resize(size, size)
}

resize();