(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jiboProgrammingChallenge = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/// <reference path="../typings/index.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const PIXI = require("pixi.js");
const pixi_sound_1 = require("pixi-sound");
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
;
class Key {
    constructor(code) {
        this.code = code;
        this.isDown = false;
        this.isUp = true;
        this.press = undefined;
        this.release = undefined;
        //The `downHandler`
        this.downHandler = (event) => {
            if (event.keyCode === this.code) {
                if (this.isUp && this.press) {
                    this.press();
                    event.preventDefault();
                }
                this.isDown = true;
                this.isUp = false;
            }
        };
        //The `upHandler`
        this.upHandler = (event) => {
            if (event.keyCode === this.code) {
                if (this.isDown && this.release) {
                    this.release();
                    event.preventDefault();
                }
                this.isDown = false;
                this.isUp = true;
            }
        };
        //Attach event listeners
        window.addEventListener("keydown", this.downHandler, false);
        window.addEventListener("keyup", this.upHandler, false);
    }
}
class Keys {
}
Keys.UpArrow = new Key(38);
Keys.DownArrow = new Key(40);
Keys.LeftArrow = new Key(37);
Keys.RightArrow = new Key(39);
Keys.Enter = new Key(13); // select cell or size
Keys.Spacebar = new Key(32); // move ahead when Playing
Keys.AAA = new Key(65); // Abort Mission [Play]->[Pick]
Keys.RRR = new Key(82); // Randomize Direction Arrows
Keys.SSS = new Key(83); // reSize the board
Keys.TTT = new Key(84);
class Sounds {
    constructor() {
        pixi_sound_1.default.add({
            circuits_operational: './sounds/circuits_operational.mp3',
            play_a_game: './sounds/play_a_game.mp3',
            what_doing_dave: './sounds/what_doing_dave.mp3',
            open_pod_bay_doors: './sounds/open_pod_bay_doors.mp3',
            disconnect_me: {
                src: './sounds/disconnect_me.mp3',
                sprites: {
                    cannot_allow: { start: 3.4, end: 5.35 }
                }
            },
            picked_up_a_fault: './sounds/picked_up_a_fault.mp3',
            human_error: './sounds/human_error.mp3',
            quite_sure: './sounds/quite_sure.mp3',
            jeopardize_mission: './sounds/jeopardize_mission.mp3',
            extremely_well: './sounds/extremely_well.mp3',
            ignition: './sounds/ignition.mp3',
            functional: './sounds/functional.mp3',
            fifteen_and_nominal: {
                src: './sounds/fifteen.mp3',
                sprites: {
                    fifteen: { start: 0, end: 1.6 },
                    nominal: { start: 1.7, end: 6 }
                }
            },
            good_evening_dave: {
                src: './sounds/good_evening_dave.mp3',
                sprites: {
                    smoothly: { start: 1.5, end: 3.251 }
                }
            },
            mission_completed: './sounds/mission_completed.mp3',
            cant_do_that: './sounds/cant_do_that.mp3',
            enjoyable_game: './sounds/enjoyable_game.mp3',
            theme: './sounds/2001_theme.mp3'
        }, {
            preload: true
        });
        Keys.TTT.press = () => {
            // playing -> picking
            pixi_sound_1.default.stopAll();
            pixi_sound_1.default.play('theme');
        };
    }
}
Sounds.Sound = pixi_sound_1.default.Sound;
Sounds.LoopingSounds = [
    { alias: 'disconnect_me', sprite: 'cannot_allow' },
    'picked_up_a_fault',
    'human_error',
    'quite_sure',
    'jeopardize_mission'
];
Sounds.NonLoopingSounds = [
    { alias: 'fifteen_and_nominal', sprite: 'nominal' },
    'ignition',
    'extremely_well',
    'functional',
    { alias: 'good_evening_dave', sprite: 'smoothly' }
];
var GameSettings = {
    Game: {
        BackgroundColor: 8509648 /* TBLUE */,
        SpriteSheetFile: 'images/sprite_sheet/floyd.json',
        TextureFiles: {
            UpArrow: 'arrow.up.64x64.png',
            DownArrow: 'arrow.down.64x64.png',
            LeftArrow: 'arrow.left.64x64.png',
            RightArrow: 'arrow.right.64x64.png',
            Background: 'jupiter.1280x720.jpg'
        }
    },
    GameBoard: {
        Size: 5,
        MaxSize: 9,
        InitialCell: { i: 2, j: 2 },
        Left: 80,
        BorderWidth: 12,
        BorderRadius: 12,
        BackgroundColor: 8509648 /* TBLUE */,
        BorderColor: 16767759 /* YELLOW */
    },
    Cell: {
        Width: 72,
        BorderWidth: 1,
        // BorderWidth:      3,
        ImageScale: 0.5,
        BackgroundColor: 1310781 /* PURPLE2 */,
        BorderColor: 16777215 /* WHITE */
    },
    Marker: {
        BorderWidth: 8,
        BackgroundColor: 16777215 /* WHITE */,
        BackgroundAlpha: 0,
        BorderAlpha: 1
    },
    Info: {
        FontSize: 16,
        Top: 50,
        Left: 800,
        Width: 360,
        Height: 566,
        BackgroundColor: 2228326 /* PURPLE */,
        BackgroundAlpha: 1,
        BorderWidth: 12,
        BorderRadius: 16,
        BorderColor: 16777215 /* WHITE */,
        BorderAlpha: 1,
        SeparatorWidth: 3
    }
};
// GameStates manage the Info pane, which keys are active, and what those keys do
class GameState {
    constructor(info) {
        this._active = false;
        this.info = undefined;
        this.info = info;
    }
    get active() {
        return this._active;
    }
    set active(value) {
        if (value === this._active)
            return;
        this._active ? this.deactivate() : this.activate();
        this._active = value;
    }
    activate() {
        this.info.visible = true;
    }
    deactivate() {
        this.info.visible = false;
    }
}
// Controls what happens during the 'play' portion of the game
class Play extends GameState {
    constructor() {
        super(...arguments);
        this.looping = false;
        this.sound_index = 0;
    }
    activate() {
        super.activate();
        pixi_sound_1.default.stopAll();
        this.looping = Game.board.willLoop(Game.board.currentCell);
        this.looping ? pixi_sound_1.default.play('what_doing_dave') : pixi_sound_1.default.play('fifteen_and_nominal', 'fifteen');
        this.sound_index = 0;
        Keys.Spacebar.press = () => {
            pixi_sound_1.default.stopAll();
            // Loop through sounds on each step along the path
            if (Game.board.index_on_board(Game.board.next_cell(Game.board.currentCell))) {
                Game.board.currentCell = Game.board.next_cell(Game.board.currentCell);
                if (this.looping) {
                    if (typeof Sounds.LoopingSounds[this.sound_index] === 'string') {
                        pixi_sound_1.default.play(Sounds.LoopingSounds[this.sound_index]);
                    }
                    else {
                        let sprite = Sounds.LoopingSounds[this.sound_index];
                        pixi_sound_1.default.play(sprite.alias, sprite.sprite);
                    }
                    this.sound_index = (this.sound_index + 1) % Sounds.LoopingSounds.length;
                }
                else {
                    if (typeof Sounds.NonLoopingSounds[this.sound_index] === 'string') {
                        pixi_sound_1.default.play(Sounds.NonLoopingSounds[this.sound_index]);
                    }
                    else {
                        let sprite = Sounds.NonLoopingSounds[this.sound_index];
                        pixi_sound_1.default.play(sprite.alias, sprite.sprite);
                    }
                    this.sound_index = (this.sound_index + 1) % Sounds.NonLoopingSounds.length;
                }
            }
            else {
                pixi_sound_1.default.play('mission_completed');
                Game.state.active = false;
                Game.state = Game.picking;
                Game.state.active = true;
            }
        };
        Keys.AAA.press = () => {
            // playing -> picking
            pixi_sound_1.default.stopAll();
            pixi_sound_1.default.play('open_pod_bay_doors');
            Game.state.active = false;
            Game.state = Game.picking;
            Game.state.active = true;
        };
    }
    deactivate() {
        super.deactivate();
        Keys.Spacebar.press = null;
        Keys.AAA.press = null;
    }
    update() { }
    ;
}
// control what happens while picking the starting cell
class Pick extends GameState {
    activate() {
        super.activate();
        Keys.UpArrow.press = () => {
            Game.board.currentCell = { i: Game.board.currentCell.i, j: (Game.board.size + Game.board.currentCell.j - 1) % Game.board.size };
        };
        Keys.DownArrow.press = () => {
            Game.board.currentCell = { i: Game.board.currentCell.i, j: (Game.board.currentCell.j + 1) % Game.board.size };
        };
        Keys.LeftArrow.press = () => {
            Game.board.currentCell = { i: (Game.board.size + Game.board.currentCell.i - 1) % Game.board.size, j: Game.board.currentCell.j };
        };
        Keys.RightArrow.press = () => {
            Game.board.currentCell = { i: (Game.board.currentCell.i + 1) % Game.board.size, j: Game.board.currentCell.j };
        };
        Keys.Enter.press = () => {
            // Switch from Picking to Playing
            Game.state.active = false;
            Game.state = Game.playing;
            Game.state.active = true;
        };
        Keys.SSS.press = () => {
            // reSize the board
            Game.state.active = false;
            Game.state = Game.sizing;
            Game.state.active = true;
        };
        Keys.RRR.press = () => {
            // re-randomize the board
            let size = Game.board.size;
            let ci = Game.board.currentCell;
            Game.stage.removeChild(Game.board);
            Game.board = new GameBoard(size);
            Game.board.currentCell = ci;
            Game.board.position.set((Game.renderer.width
                - GameSettings.Info.Width
                - GameSettings.Info.BorderWidth) / 2
                - Game.board.width / 2 - GameSettings.GameBoard.Left, (Game.renderer.height - Game.board.height) / 2);
            Game.stage.addChild(Game.board);
        };
    }
    deactivate() {
        super.deactivate();
        Keys.UpArrow.press = null;
        Keys.DownArrow.press = null;
        Keys.LeftArrow.press = null;
        Keys.RightArrow.press = null;
        Keys.Enter.press = null;
        Keys.SSS.press = null;
        Keys.RRR.press = null;
    }
    update() { }
    ;
}
// control what happens while reSizing the GameBoard
class Size extends GameState {
    activate() {
        super.activate();
        Keys.UpArrow.press = () => {
            let size = Game.board.size;
            if (size >= GameSettings.GameBoard.MaxSize) {
                pixi_sound_1.default.stopAll();
                pixi_sound_1.default.play('cant_do_that');
                return;
            }
            Game.stage.removeChild(Game.board);
            Game.board = new GameBoard(size + 1);
            Game.board.position.set((Game.renderer.width
                - GameSettings.Info.Width
                - GameSettings.Info.BorderWidth) / 2
                - Game.board.width / 2 - GameSettings.GameBoard.Left, (Game.renderer.height - Game.board.height) / 2);
            Game.stage.addChild(Game.board);
        };
        Keys.DownArrow.press = () => {
            let size = Game.board.size;
            if (size <= 1) {
                pixi_sound_1.default.stopAll();
                pixi_sound_1.default.play('cant_do_that');
                return;
            }
            Game.stage.removeChild(Game.board);
            Game.board = new GameBoard(size - 1);
            Game.board.position.set((Game.renderer.width
                - GameSettings.Info.Width
                - GameSettings.Info.BorderWidth) / 2
                - Game.board.width / 2 - GameSettings.GameBoard.Left, (Game.renderer.height - Game.board.height) / 2);
            Game.stage.addChild(Game.board);
        };
        Keys.Enter.press = () => {
            // Switch from Sizing to Picking
            Game.state.active = false;
            Game.state = Game.picking;
            Game.state.active = true;
        };
    }
    deactivate() {
        super.deactivate();
        Keys.UpArrow.press = null;
        Keys.DownArrow.press = null;
        Keys.Enter.press = null;
    }
    update() { }
    ;
}
// a square on the board
class GameCell extends PIXI.Container {
    constructor(direction) {
        super();
        this.direction = direction;
        this.background = new PIXI.Graphics();
        this.arrow = undefined;
        this.background.beginFill(GameSettings.Cell.BackgroundColor);
        this.background.lineStyle(GameSettings.Cell.BorderWidth, GameSettings.Cell.BorderColor, 1);
        this.background.drawRect(0, 0, GameSettings.Cell.Width, GameSettings.Cell.Width);
        this.background.endFill();
        this.addChild(this.background);
        this.arrow = new PIXI.Sprite(Game.arrow_textures[this.direction]);
        this.arrow.anchor.set(0.5, 0.5);
        this.arrow.position.set(GameSettings.Cell.Width / 2, GameSettings.Cell.Width / 2);
        this.arrow.scale.set(GameSettings.Cell.ImageScale, GameSettings.Cell.ImageScale);
        this.addChild(this.arrow);
    }
}
class GameBoard extends PIXI.Container {
    constructor(size) {
        super();
        this.size = size;
        this._border = undefined;
        this.cells = [];
        this._currentCell = { i: 0, j: 0 };
        this.marker = new PIXI.Container();
        this._red_marker = new PIXI.Graphics();
        this._yellow_marker = new PIXI.Graphics();
        this._green_marker = new PIXI.Graphics();
        // set up the boarder around the board
        this._border = this.make_border(16767759 /* YELLOW */);
        this.addChild(this._border);
        // set up the cells of the board
        for (let i = 0; i < size; i++) {
            this.cells[i] = [];
            for (let j = 0; j < size; j++) {
                let cell_direction = Math.floor(Math.random() * 4);
                this.cells[i].push(new GameCell(cell_direction));
                this.position_cell({ i, j });
                this.addChild(this.cells[i][j]);
            }
            ;
        }
        ;
        // set up the marker and the three sub-markers
        this._red_marker = this.make_marker(15606306 /* RED */);
        this._yellow_marker = this.make_marker(16767759 /* YELLOW */);
        this._green_marker = this.make_marker(3778336 /* GREEN */);
        this._red_marker.visible = false;
        this._green_marker.visible = false;
        this.marker.addChild(this._red_marker, this._yellow_marker, this._green_marker);
        this.addChild(this.marker);
        this.place_marker_at(this.currentCell);
    }
    make_border(c) {
        let border = new PIXI.Graphics();
        border.beginFill(GameSettings.GameBoard.BackgroundColor, 1);
        border.lineStyle(GameSettings.GameBoard.BorderWidth, c, 1);
        border.drawRect(0, 0, GameSettings.Cell.Width * this.size + GameSettings.GameBoard.BorderWidth + GameSettings.Cell.BorderWidth, GameSettings.Cell.Width * this.size + GameSettings.GameBoard.BorderWidth + GameSettings.Cell.BorderWidth);
        border.endFill();
        return border;
    }
    make_marker(c) {
        let marker = new PIXI.Graphics();
        marker.beginFill(GameSettings.Marker.BackgroundColor, GameSettings.Marker.BackgroundAlpha);
        marker.lineStyle(GameSettings.Marker.BorderWidth, c, GameSettings.Marker.BorderAlpha);
        marker.drawRect(0, 0, GameSettings.Cell.Width - GameSettings.Cell.BorderWidth - GameSettings.Marker.BorderWidth, GameSettings.Cell.Width - GameSettings.Cell.BorderWidth - GameSettings.Marker.BorderWidth);
        marker.endFill();
        return marker;
    }
    get currentCell() {
        return Object.assign({}, this._currentCell);
    }
    set currentCell(value) {
        this.place_marker_at(value);
        this._currentCell = Object.assign({}, value);
    }
    position_cell(ci) {
        this.cells[ci.i][ci.j].position.set(GameSettings.GameBoard.BorderWidth / 2 + GameSettings.Cell.BorderWidth / 2 + GameSettings.Cell.Width * ci.i, GameSettings.GameBoard.BorderWidth / 2 + GameSettings.Cell.BorderWidth / 2 + GameSettings.Cell.Width * ci.j);
    }
    place_marker_at(ci) {
        let cp = this.cells[ci.i][ci.j].position;
        this.marker.position.set(cp.x + GameSettings.Cell.BorderWidth / 2 + GameSettings.Marker.BorderWidth / 2, cp.y + GameSettings.Cell.BorderWidth / 2 + GameSettings.Marker.BorderWidth / 2);
        if (this.willLoop(ci)) {
            this._red_marker.visible = true;
            this._yellow_marker.visible = false;
            this._green_marker.visible = false;
        }
        else {
            this._red_marker.visible = false;
            this._yellow_marker.visible = false;
            this._green_marker.visible = true;
        }
    }
    // next cell based on the direction of the passed in cell
    next_cell(ci) {
        switch (this.cells[ci.i][ci.j].direction) {
            case Direction.Up:
                return { i: ci.i, j: ci.j - 1 };
            case Direction.Down:
                return { i: ci.i, j: ci.j + 1 };
            case Direction.Left:
                return { i: ci.i - 1, j: ci.j };
            case Direction.Right:
                return { i: ci.i + 1, j: ci.j };
        }
    }
    index_on_board(ci) {
        return ((ci.i >= 0) && (ci.i < this.size) && (ci.j >= 0) && (ci.j < this.size));
    }
    // Implementation of Floyd’s Cycle-Finding Algorithm
    // based on http://www.geeksforgeeks.org/write-a-c-function-to-detect-loop-in-a-linked-list/
    //
    willLoop(ci) {
        let tortoise = Object.assign({}, ci);
        let leap = Object.assign({}, ci);
        let frog = Object.assign({}, ci);
        while (this.index_on_board(tortoise) &&
            this.index_on_board(leap = this.next_cell(frog)) &&
            this.index_on_board(frog = this.next_cell(leap))) {
            // if either leap or frog catch up to tortoise, there is a loop
            if ((tortoise.i === leap.i) && (tortoise.j === leap.j))
                return true;
            if ((tortoise.i === frog.i) && (tortoise.j === frog.j))
                return true;
            tortoise = this.next_cell(tortoise);
        }
        // one of the racers went off the board; no loop
        return false;
    }
}
class Game {
    constructor() {
        this.initializeAndRunGame = (loader, resources) => {
            // load the texture resources
            var id = PIXI.loader.resources[GameSettings.Game.SpriteSheetFile].textures;
            Game.arrow_textures[Direction.Up] = id[GameSettings.Game.TextureFiles.UpArrow];
            Game.arrow_textures[Direction.Down] = id[GameSettings.Game.TextureFiles.DownArrow];
            Game.arrow_textures[Direction.Left] = id[GameSettings.Game.TextureFiles.LeftArrow];
            Game.arrow_textures[Direction.Right] = id[GameSettings.Game.TextureFiles.RightArrow];
            // Add the background image
            Game.stage.addChild(new PIXI.Sprite(id[GameSettings.Game.TextureFiles.Background]));
            // Setup the game board
            Game.board = new GameBoard(GameSettings.GameBoard.Size);
            Game.board.currentCell = GameSettings.GameBoard.InitialCell;
            // use Game.board.width and .height as these are dynamic based on the size of the board
            Game.board.position.set((Game.renderer.width
                - GameSettings.Info.Width
                - GameSettings.Info.BorderWidth) / 2
                - Game.board.width / 2 - GameSettings.GameBoard.Left, (Game.renderer.height - Game.board.height) / 2);
            Game.stage.addChild(Game.board);
            // Set up the Info Pane
            // todo: could pull this into a function or class
            Game.info = new PIXI.Container();
            let border = new PIXI.Graphics();
            border.beginFill(GameSettings.Info.BackgroundColor, GameSettings.Info.BackgroundAlpha);
            border.lineStyle(GameSettings.Info.BorderWidth, GameSettings.Info.BorderColor, GameSettings.Info.BorderAlpha);
            border.drawRoundedRect(0, 0, GameSettings.Info.Width, GameSettings.Info.Height, GameSettings.Info.BorderRadius);
            border.endFill();
            Game.info.position.set(GameSettings.Info.Left, (Game.renderer.height - GameSettings.Info.Height) / 2);
            let text = new PIXI.Text("HAL'lo and Welcome", { fontFamily: 'Arial', fontSize: 24, fill: 16777215 /* WHITE */, align: 'center' });
            text.position.set((GameSettings.Info.Width - text.width) / 2, 20);
            Game.info.addChild(border, text);
            let s0 = new PIXI.Graphics();
            s0.lineStyle(GameSettings.Info.BorderWidth, GameSettings.Info.BorderColor, GameSettings.Info.BorderAlpha);
            s0.moveTo(0, 0);
            s0.lineTo(GameSettings.Info.Width, 0);
            s0.position.set(0, 72);
            Game.info.addChild(s0);
            // Info for Picking mode
            text = new PIXI.Text("Use Arrow-Keys to move the starting position", { fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: 16777215 /* WHITE */, align: 'left' });
            text.position.set((GameSettings.Info.Width - text.width) / 2, 116);
            Game.picking_info.addChild(text);
            //
            text = new PIXI.Text("Starting from a red bordered cell\nwill enter a loop", { fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: 16777215 /* WHITE */, align: 'left' });
            text.position.set(60, 146);
            Game.picking_info.addChild(text);
            //
            text = new PIXI.Text("Starting from a green bordered cell\nwill exit the board", { fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: 16777215 /* WHITE */, align: 'left' });
            text.position.set(60, 196);
            Game.picking_info.addChild(text);
            //
            let s1 = new PIXI.Graphics();
            s1.lineStyle(GameSettings.Info.SeparatorWidth, GameSettings.Info.BorderColor, GameSettings.Info.BorderAlpha);
            s1.moveTo(0, 0);
            s1.lineTo(GameSettings.Info.Width, 0);
            s1.position.set(0, 272);
            Game.picking_info.addChild(s1);
            //
            text = new PIXI.Text("Press 'Enter' to begin following the arrows", { fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: 16777215 /* WHITE */, align: 'left' });
            text.position.set((GameSettings.Info.Width - text.width) / 2, 313);
            Game.picking_info.addChild(text);
            //
            let s3 = s1.clone();
            s3.position.set(0, 372);
            Game.picking_info.addChild(s3);
            //
            text = new PIXI.Text("Press 'R' to randomize the arrows", { fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: 16777215 /* WHITE */, align: 'left' });
            text.position.set((GameSettings.Info.Width - text.width) / 2, 411);
            Game.picking_info.addChild(text);
            //
            let s4 = s1.clone();
            s4.position.set(0, 472);
            Game.picking_info.addChild(s4);
            //
            text = new PIXI.Text("Press 'S' to resize the board", { fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: 16777215 /* WHITE */, align: 'left' });
            text.position.set((GameSettings.Info.Width - text.width) / 2, 506);
            Game.picking_info.addChild(text);
            // Info for Playing mode
            text = new PIXI.Text("Press 'Spacebar' to advance the marker", { fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: 16777215 /* WHITE */, align: 'left' });
            text.position.set((GameSettings.Info.Width - text.width) / 2, 116);
            Game.playing_info.addChild(text);
            //
            let s5 = s1.clone();
            s5.position.set(0, 175);
            Game.playing_info.addChild(s5);
            //
            text = new PIXI.Text("Press 'A' to abort the mission", { fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: 16777215 /* WHITE */, align: 'left' });
            text.position.set((GameSettings.Info.Width - text.width) / 2, 210);
            Game.playing_info.addChild(text);
            // Info for Sizing mode
            text = new PIXI.Text("Use 'Up' and 'Down' Arrow-Keys\nto change the size of the board", { fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: 16777215 /* WHITE */, align: 'left' });
            text.position.set((GameSettings.Info.Width - text.width) / 2, 106);
            Game.sizing_info.addChild(text);
            //
            let s6 = s1.clone();
            s6.position.set(0, 175);
            Game.sizing_info.addChild(s6);
            //
            text = new PIXI.Text("Press 'Enter' to accept the board size", { fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: 16777215 /* WHITE */, align: 'left' });
            text.position.set((GameSettings.Info.Width - text.width) / 2, 210);
            Game.sizing_info.addChild(text);
            Game.picking_info.visible = false;
            Game.playing_info.visible = false;
            Game.sizing_info.visible = false;
            Game.info.addChild(Game.picking_info, Game.playing_info, Game.sizing_info);
            Game.stage.addChild(Game.info);
            // Initialize the GamesStates
            Game.playing = new Play(Game.playing_info);
            Game.picking = new Pick(Game.picking_info);
            Game.sizing = new Size(Game.sizing_info);
            // start the game loop
            Game.state = Game.picking;
            Game.state.active = true;
            pixi_sound_1.default.stopAll();
            pixi_sound_1.default.play('circuits_operational');
            Game.loop();
        };
        Game.renderer.backgroundColor = GameSettings.Game.BackgroundColor;
        document.body.appendChild(Game.renderer.view);
        PIXI.loader
            .add(GameSettings.Game.SpriteSheetFile)
            .load(this.initializeAndRunGame);
    }
}
// GameStates
Game.playing = undefined;
Game.picking = undefined;
Game.sizing = undefined;
Game.state = undefined;
Game.board = undefined;
// Context dependent usage information
Game.info = undefined;
Game.picking_info = new PIXI.Container();
Game.playing_info = new PIXI.Container();
Game.sizing_info = new PIXI.Container();
Game.renderer = new PIXI.WebGLRenderer(1280, 720);
Game.stage = new PIXI.Container();
Game.arrow_textures = [];
Game._sounds = new Sounds();
Game.loop = () => {
    // start the timer for the next animation loop
    requestAnimationFrame(Game.loop);
    // any per frame logic
    Game.state.update();
    // this is the main render call that makes pixi draw your container and its children.
    Game.renderer.render(Game.stage);
};
// kick the whole thing off
let game = new Game();

},{"pixi-sound":undefined,"pixi.js":undefined}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEsOENBQThDOztBQUU5QyxnQ0FBaUM7QUFDakMsMkNBQW1DO0FBRW5DLElBQUssU0FLSjtBQUxELFdBQUssU0FBUztJQUNaLHFDQUFFLENBQUE7SUFDRix5Q0FBSSxDQUFBO0lBQ0oseUNBQUksQ0FBQTtJQUNKLDJDQUFLLENBQUE7QUFDUCxDQUFDLEVBTEksU0FBUyxLQUFULFNBQVMsUUFLYjtBQUFBLENBQUM7QUFnQkY7SUFDRSxZQUFtQixJQUFZO1FBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtRQVUvQixXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLFNBQUksR0FBYyxJQUFJLENBQUM7UUFDdkIsVUFBSyxHQUFlLFNBQVMsQ0FBQztRQUM5QixZQUFPLEdBQWEsU0FBUyxDQUFDO1FBRTlCLG1CQUFtQjtRQUNuQixnQkFBVyxHQUF5QixDQUFDLEtBQW9CO1lBQ3ZELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzVCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDYixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3pCLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLENBQUM7UUFDSCxDQUFDLENBQUM7UUFFRixpQkFBaUI7UUFDakIsY0FBUyxHQUF5QixDQUFDLEtBQW9CO1lBQ3JELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxD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QUFDO0FBRXhCLGlCQUFZLEdBQW1CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3BELGlCQUFZLEdBQW1CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3BELGdCQUFXLEdBQW1CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBRW5ELGFBQVEsR0FBdUIsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNqRSxVQUFLLEdBQW1CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBRTdDLG1CQUFjLEdBQWtCLEVBQUUsQ0FBQztBQUVuQyxZQUFPLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQStKYixTQUFJLEdBQUc7SUFDN0IsOENBQThDO0lBQzlDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVqQyxzQkFBc0I7SUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUVwQixxRkFBcUY7SUFDckYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQTtBQUdILDJCQUEyQjtBQUMzQixJQUFJLElBQUksR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxuXG5pbXBvcnQgUElYSSA9IHJlcXVpcmUoJ3BpeGkuanMnKTtcbmltcG9ydCBQSVhJc291bmQgZnJvbSAncGl4aS1zb3VuZCc7XG5cbmVudW0gRGlyZWN0aW9uIHtcbiAgVXAsXG4gIERvd24sXG4gIExlZnQsXG4gIFJpZ2h0XG59O1xuXG5jb25zdCBlbnVtIEdhbWVDb2xvciB7XG4gIFdISVRFICAgPSAweEZGRkZGRixcbiAgQkxVRSAgICA9IDB4OTJjOWM0LFxuICBUQkxVRSAgID0gMHg4MUQ4RDAsXG4gIFRCTFVFMiAgPSAweDYwREZFNSxcbiAgUFVSUExFICA9IDB4MjIwMDY2LFxuICBQVVJQTEUyID0gMHgxNDAwM2QsXG4gIEdSRUVOICAgPSAweDM5YTcyMCxcbiAgWUVMTE9XICA9IDB4ZmZkYjBmLFxuICBSRUQgICAgID0gMHhFRTIyMjJcbn1cblxudHlwZSBLZXlib2FyZEV2ZW50SGFuZGxlciA9IChldmVudDpLZXlib2FyZEV2ZW50KT0+dm9pZDtcblxuY2xhc3MgS2V5IHtcbiAgY29uc3RydWN0b3IocHVibGljIGNvZGU6IG51bWJlcikge1xuICAgIC8vQXR0YWNoIGV2ZW50IGxpc3RlbmVyc1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJrZXlkb3duXCIsIHRoaXMuZG93bkhhbmRsZXIsIGZhbHNlXG4gICAgKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwia2V5dXBcIiwgdGhpcy51cEhhbmRsZXIsIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGlzRG93bjogYm9vbGVhbiA9IGZhbHNlO1xuICBpc1VwOiAgIGJvb2xlYW4gPSB0cnVlO1xuICBwcmVzczogICgpPT52b2lkICA9IHVuZGVmaW5lZDtcbiAgcmVsZWFzZTogKCk9PnZvaWQgPSB1bmRlZmluZWQ7XG5cbiAgLy9UaGUgYGRvd25IYW5kbGVyYFxuICBkb3duSGFuZGxlcjogS2V5Ym9hcmRFdmVudEhhbmRsZXIgPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gdGhpcy5jb2RlKSB7XG4gICAgICBpZiAodGhpcy5pc1VwICYmIHRoaXMucHJlc3MpIHtcbiAgICAgICAgdGhpcy5wcmVzcygpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5pc0Rvd24gPSB0cnVlO1xuICAgICAgdGhpcy5pc1VwID0gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIC8vVGhlIGB1cEhhbmRsZXJgXG4gIHVwSGFuZGxlcjogS2V5Ym9hcmRFdmVudEhhbmRsZXIgPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gdGhpcy5jb2RlKSB7XG4gICAgICBpZiAodGhpcy5pc0Rvd24gJiYgdGhpcy5yZWxlYXNlKSB7XG4gICAgICAgIHRoaXMucmVsZWFzZSgpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5pc0Rvd24gPSBmYWxzZTtcbiAgICAgIHRoaXMuaXNVcCA9IHRydWU7XG4gICAgfVxuICB9O1xufVxuXG5jbGFzcyBLZXlzIHtcbiAgc3RhdGljIHJlYWRvbmx5IFVwQXJyb3c6IEtleSAgICAgPSBuZXcgS2V5KDM4KTtcbiAgc3RhdGljIHJlYWRvbmx5IERvd25BcnJvdzogS2V5ICAgPSBuZXcgS2V5KDQwKTtcbiAgc3RhdGljIHJlYWRvbmx5IExlZnRBcnJvdzogS2V5ICAgPSBuZXcgS2V5KDM3KTtcbiAgc3RhdGljIHJlYWRvbmx5IFJpZ2h0QXJyb3c6IEtleSAgPSBuZXcgS2V5KDM5KTtcbiAgc3RhdGljIHJlYWRvbmx5IEVudGVyOiBLZXkgICAgICAgPSBuZXcgS2V5KDEzKTsgLy8gc2VsZWN0IGNlbGwgb3Igc2l6ZVxuICBzdGF0aWMgcmVhZG9ubHkgU3BhY2ViYXI6IEtleSAgICA9IG5ldyBLZXkoMzIpOyAvLyBtb3ZlIGFoZWFkIHdoZW4gUGxheWluZ1xuICBzdGF0aWMgcmVhZG9ubHkgQUFBOiBLZXkgICAgICAgICA9IG5ldyBLZXkoNjUpOyAvLyBBYm9ydCBNaXNzaW9uIFtQbGF5XS0+W1BpY2tdXG4gIHN0YXRpYyByZWFkb25seSBSUlI6IEtleSAgICAgICAgID0gbmV3IEtleSg4Mik7IC8vIFJhbmRvbWl6ZSBEaXJlY3Rpb24gQXJyb3dzXG4gIHN0YXRpYyByZWFkb25seSBTU1M6IEtleSAgICAgICAgID0gbmV3IEtleSg4Myk7IC8vIHJlU2l6ZSB0aGUgYm9hcmRcbiAgc3RhdGljIHJlYWRvbmx5IFRUVDogS2V5ICAgICAgICAgPSBuZXcgS2V5KDg0KTtcbn1cblxuY2xhc3MgU291bmRzIHtcbiAgc3RhdGljIHJlYWRvbmx5IFNvdW5kID0gUElYSXNvdW5kLlNvdW5kO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIFBJWElzb3VuZC5hZGQoe1xuICAgICAgY2lyY3VpdHNfb3BlcmF0aW9uYWw6ICcuL3NvdW5kcy9jaXJjdWl0c19vcGVyYXRpb25hbC5tcDMnLFxuICAgICAgcGxheV9hX2dhbWU6ICAgICAgICAgICcuL3NvdW5kcy9wbGF5X2FfZ2FtZS5tcDMnLFxuICAgICAgd2hhdF9kb2luZ19kYXZlOiAgICAgICcuL3NvdW5kcy93aGF0X2RvaW5nX2RhdmUubXAzJyxcbiAgICAgIG9wZW5fcG9kX2JheV9kb29yczogICAnLi9zb3VuZHMvb3Blbl9wb2RfYmF5X2Rvb3JzLm1wMycsXG4gICAgICBkaXNjb25uZWN0X21lOiB7XG4gICAgICAgIHNyYzogICAgICAgICAgICAgICAgJy4vc291bmRzL2Rpc2Nvbm5lY3RfbWUubXAzJyxcbiAgICAgICAgc3ByaXRlczoge1xuICAgICAgICAgIGNhbm5vdF9hbGxvdzoge3N0YXJ0OiAzLjQsIGVuZDogNS4zNX1cbiAgICAgICAgfX0sXG4gICAgICBwaWNrZWRfdXBfYV9mYXVsdDogICAgJy4vc291bmRzL3BpY2tlZF91cF9hX2ZhdWx0Lm1wMycsXG4gICAgICBodW1hbl9lcnJvcjogICAgICAgICAgJy4vc291bmRzL2h1bWFuX2Vycm9yLm1wMycsXG4gICAgICBxdWl0ZV9zdXJlOiAgICAgICAgICAgJy4vc291bmRzL3F1aXRlX3N1cmUubXAzJyxcbiAgICAgIGplb3BhcmRpemVfbWlzc2lvbjogICAnLi9zb3VuZHMvamVvcGFyZGl6ZV9taXNzaW9uLm1wMycsXG4gICAgICBleHRyZW1lbHlfd2VsbDogICAgICAgJy4vc291bmRzL2V4dHJlbWVseV93ZWxsLm1wMycsXG4gICAgICBpZ25pdGlvbjogICAgICAgICAgICAgJy4vc291bmRzL2lnbml0aW9uLm1wMycsXG4gICAgICBmdW5jdGlvbmFsOiAgICAgICAgICAgJy4vc291bmRzL2Z1bmN0aW9uYWwubXAzJyxcbiAgICAgIGZpZnRlZW5fYW5kX25vbWluYWw6IHtcbiAgICAgICAgc3JjOiAgICAgICAgICAgICAgICAnLi9zb3VuZHMvZmlmdGVlbi5tcDMnLFxuICAgICAgICBzcHJpdGVzOiB7XG4gICAgICAgICAgZmlmdGVlbjoge3N0YXJ0OiAwLCBlbmQ6IDEuNn0sXG4gICAgICAgICAgbm9taW5hbDoge3N0YXJ0OiAxLjcsIGVuZDogNn1cbiAgICAgICAgfX0sXG4gICAgICBnb29kX2V2ZW5pbmdfZGF2ZToge1xuICAgICAgICBzcmM6ICAgICAgICAgICAgICAgICcuL3NvdW5kcy9nb29kX2V2ZW5pbmdfZGF2ZS5tcDMnLFxuICAgICAgICBzcHJpdGVzOiB7XG4gICAgICAgICAgc21vb3RobHk6IHtzdGFydDogMS41LCBlbmQ6IDMuMjUxfVxuICAgICAgICB9fSxcbiAgICAgIG1pc3Npb25fY29tcGxldGVkOiAgICAnLi9zb3VuZHMvbWlzc2lvbl9jb21wbGV0ZWQubXAzJyxcbiAgICAgIGNhbnRfZG9fdGhhdDogICAgICAgICAnLi9zb3VuZHMvY2FudF9kb190aGF0Lm1wMycsXG4gICAgICBlbmpveWFibGVfZ2FtZTogICAgICAgJy4vc291bmRzL2Vuam95YWJsZV9nYW1lLm1wMycsXG4gICAgICB0aGVtZTogICAgICAgICAgICAgICAgJy4vc291bmRzLzIwMDFfdGhlbWUubXAzJ1xuICAgIH0sXG4gICAge1xuICAgICAgcHJlbG9hZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgS2V5cy5UVFQucHJlc3MgPSAoKTp2b2lkID0+IHtcbiAgICAgIC8vIHBsYXlpbmcgLT4gcGlja2luZ1xuICAgICAgUElYSXNvdW5kLnN0b3BBbGwoKTtcbiAgICAgIFBJWElzb3VuZC5wbGF5KCd0aGVtZScpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZWFkb25seSBMb29waW5nU291bmRzOiAoc3RyaW5nIHwge2FsaWFzOiBzdHJpbmcsIHNwcml0ZTogc3RyaW5nfSlbXSA9IFtcbiAgICB7YWxpYXM6ICdkaXNjb25uZWN0X21lJywgc3ByaXRlOiAnY2Fubm90X2FsbG93J30sXG4gICAgJ3BpY2tlZF91cF9hX2ZhdWx0JyxcbiAgICAnaHVtYW5fZXJyb3InLFxuICAgICdxdWl0ZV9zdXJlJyxcbiAgICAnamVvcGFyZGl6ZV9taXNzaW9uJ1xuICBdO1xuXG4gIHN0YXRpYyByZWFkb25seSBOb25Mb29waW5nU291bmRzOiAoc3RyaW5nIHwge2FsaWFzOiBzdHJpbmcsIHNwcml0ZTogc3RyaW5nfSlbXSA9IFtcbiAgICB7YWxpYXM6ICdmaWZ0ZWVuX2FuZF9ub21pbmFsJywgc3ByaXRlOiAnbm9taW5hbCd9LFxuICAgICdpZ25pdGlvbicsXG4gICAgJ2V4dHJlbWVseV93ZWxsJyxcbiAgICAnZnVuY3Rpb25hbCcsXG4gICAge2FsaWFzOiAnZ29vZF9ldmVuaW5nX2RhdmUnLCBzcHJpdGU6ICdzbW9vdGhseSd9XG4gIF07XG59XG5cbnZhciBHYW1lU2V0dGluZ3MgPSB7XG4gIEdhbWU6IHtcbiAgICBCYWNrZ3JvdW5kQ29sb3I6ICBHYW1lQ29sb3IuVEJMVUUsXG4gICAgU3ByaXRlU2hlZXRGaWxlOiAgJ2ltYWdlcy9zcHJpdGVfc2hlZXQvZmxveWQuanNvbicsXG4gICAgVGV4dHVyZUZpbGVzOiB7XG4gICAgICBVcEFycm93OiAgICAgICAgJ2Fycm93LnVwLjY0eDY0LnBuZycsXG4gICAgICBEb3duQXJyb3c6ICAgICAgJ2Fycm93LmRvd24uNjR4NjQucG5nJyxcbiAgICAgIExlZnRBcnJvdzogICAgICAnYXJyb3cubGVmdC42NHg2NC5wbmcnLFxuICAgICAgUmlnaHRBcnJvdzogICAgICdhcnJvdy5yaWdodC42NHg2NC5wbmcnLFxuICAgICAgQmFja2dyb3VuZDogICAgICdqdXBpdGVyLjEyODB4NzIwLmpwZydcbiAgICB9XG4gIH0sXG4gIEdhbWVCb2FyZDoge1xuICAgIFNpemU6ICAgICAgICAgICAgIDUsXG4gICAgTWF4U2l6ZTogICAgICAgICAgOSxcbiAgICBJbml0aWFsQ2VsbDogICAgICB7aTogMiwgajogMn0sXG4gICAgTGVmdDogICAgICAgICAgICAgODAsIC8vIHNoaWZ0cyB0aGUgR2FtZUJvYXJkIHRvIHRoZSBsZWZ0XG4gICAgQm9yZGVyV2lkdGg6ICAgICAgMTIsXG4gICAgQm9yZGVyUmFkaXVzOiAgICAgMTIsXG4gICAgQmFja2dyb3VuZENvbG9yOiAgR2FtZUNvbG9yLlRCTFVFLFxuICAgIEJvcmRlckNvbG9yOiAgICAgIEdhbWVDb2xvci5ZRUxMT1dcbiAgfSxcbiAgQ2VsbDoge1xuICAgIFdpZHRoOiAgICAgICAgICAgIDcyLFxuICAgIEJvcmRlcldpZHRoOiAgICAgIDEsXG4gICAgLy8gQm9yZGVyV2lkdGg6ICAgICAgMyxcbiAgICBJbWFnZVNjYWxlOiAgICAgICAwLjUsXG4gICAgQmFja2dyb3VuZENvbG9yOiAgR2FtZUNvbG9yLlBVUlBMRTIsXG4gICAgQm9yZGVyQ29sb3I6ICAgICAgR2FtZUNvbG9yLldISVRFXG4gIH0sXG4gIE1hcmtlcjoge1xuICAgIEJvcmRlcldpZHRoOiAgICAgIDgsXG4gICAgQmFja2dyb3VuZENvbG9yOiAgR2FtZUNvbG9yLldISVRFLFxuICAgIEJhY2tncm91bmRBbHBoYTogIDAsXG4gICAgQm9yZGVyQWxwaGE6ICAgICAgMVxuICB9LFxuICBJbmZvOiB7XG4gICAgRm9udFNpemU6ICAgICAgICAgMTYgYXMgbnVtYmVyLFxuICAgIFRvcDogICAgICAgICAgICAgIDUwLFxuICAgIExlZnQ6ICAgICAgICAgICAgIDgwMCxcbiAgICBXaWR0aDogICAgICAgICAgICAzNjAsXG4gICAgSGVpZ2h0OiAgICAgICAgICAgNTY2LFxuICAgIEJhY2tncm91bmRDb2xvcjogIEdhbWVDb2xvci5QVVJQTEUsXG4gICAgQmFja2dyb3VuZEFscGhhOiAgMSxcbiAgICBCb3JkZXJXaWR0aDogICAgICAxMixcbiAgICBCb3JkZXJSYWRpdXM6ICAgICAxNixcbiAgICBCb3JkZXJDb2xvcjogICAgICBHYW1lQ29sb3IuV0hJVEUsXG4gICAgQm9yZGVyQWxwaGE6ICAgICAgMSxcbiAgICBTZXBhcmF0b3JXaWR0aDogICAzXG4gIH1cbn07XG5cbi8vIEdhbWVTdGF0ZXMgbWFuYWdlIHRoZSBJbmZvIHBhbmUsIHdoaWNoIGtleXMgYXJlIGFjdGl2ZSwgYW5kIHdoYXQgdGhvc2Uga2V5cyBkb1xuYWJzdHJhY3QgY2xhc3MgR2FtZVN0YXRlIHtcbiAgX2FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIHJlYWRvbmx5IGluZm86IFBJWEkuQ29udGFpbmVyID0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKGluZm86IFBJWEkuQ29udGFpbmVyKSB7XG4gICAgdGhpcy5pbmZvID0gaW5mbztcbiAgfVxuXG4gIGdldCBhY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZTtcbiAgfVxuXG4gIHNldCBhY3RpdmUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUgPT09IHRoaXMuX2FjdGl2ZSkgcmV0dXJuO1xuXG4gICAgdGhpcy5fYWN0aXZlID8gdGhpcy5kZWFjdGl2YXRlKCkgOiB0aGlzLmFjdGl2YXRlKCk7XG5cbiAgICB0aGlzLl9hY3RpdmUgPSB2YWx1ZTtcbiAgfVxuXG4gIGFjdGl2YXRlKCk6IHZvaWQge1xuICAgIHRoaXMuaW5mby52aXNpYmxlID0gdHJ1ZTtcbiAgfVxuXG4gIGRlYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgdGhpcy5pbmZvLnZpc2libGUgPSBmYWxzZTtcbiAgfVxuXG4gIGFic3RyYWN0IHVwZGF0ZSgpOiB2b2lkO1xufVxuXG4vLyBDb250cm9scyB3aGF0IGhhcHBlbnMgZHVyaW5nIHRoZSAncGxheScgcG9ydGlvbiBvZiB0aGUgZ2FtZVxuY2xhc3MgUGxheSBleHRlbmRzIEdhbWVTdGF0ZSB7XG4gIGxvb3Bpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgc291bmRfaW5kZXg6IG51bWJlciA9IDA7XG5cbiAgYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgc3VwZXIuYWN0aXZhdGUoKTtcblxuICAgIFBJWElzb3VuZC5zdG9wQWxsKCk7XG4gICAgdGhpcy5sb29waW5nID0gR2FtZS5ib2FyZC53aWxsTG9vcChHYW1lLmJvYXJkLmN1cnJlbnRDZWxsKTtcbiAgICB0aGlzLmxvb3BpbmcgPyBQSVhJc291bmQucGxheSgnd2hhdF9kb2luZ19kYXZlJykgOiBQSVhJc291bmQucGxheSgnZmlmdGVlbl9hbmRfbm9taW5hbCcsICdmaWZ0ZWVuJyk7XG4gICAgdGhpcy5zb3VuZF9pbmRleCA9IDA7XG5cbiAgICBLZXlzLlNwYWNlYmFyLnByZXNzID0gKCk6dm9pZCA9PiB7XG4gICAgICBQSVhJc291bmQuc3RvcEFsbCgpO1xuXG4gICAgICAvLyBMb29wIHRocm91Z2ggc291bmRzIG9uIGVhY2ggc3RlcCBhbG9uZyB0aGUgcGF0aFxuICAgICAgaWYgKEdhbWUuYm9hcmQuaW5kZXhfb25fYm9hcmQoR2FtZS5ib2FyZC5uZXh0X2NlbGwoR2FtZS5ib2FyZC5jdXJyZW50Q2VsbCkpKSB7XG4gICAgICAgIEdhbWUuYm9hcmQuY3VycmVudENlbGwgPSBHYW1lLmJvYXJkLm5leHRfY2VsbChHYW1lLmJvYXJkLmN1cnJlbnRDZWxsKTtcbiAgICAgICAgaWYgKHRoaXMubG9vcGluZykge1xuICAgICAgICAgIGlmICh0eXBlb2YgU291bmRzLkxvb3BpbmdTb3VuZHNbdGhpcy5zb3VuZF9pbmRleF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBQSVhJc291bmQucGxheShTb3VuZHMuTG9vcGluZ1NvdW5kc1t0aGlzLnNvdW5kX2luZGV4XSBhcyBzdHJpbmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBzcHJpdGUgPSBTb3VuZHMuTG9vcGluZ1NvdW5kc1t0aGlzLnNvdW5kX2luZGV4XSBhcyB7YWxpYXM6IHN0cmluZywgc3ByaXRlOiBzdHJpbmd9O1xuICAgICAgICAgICAgUElYSXNvdW5kLnBsYXkoc3ByaXRlLmFsaWFzLCBzcHJpdGUuc3ByaXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zb3VuZF9pbmRleCA9ICh0aGlzLnNvdW5kX2luZGV4KzEpJVNvdW5kcy5Mb29waW5nU291bmRzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIFNvdW5kcy5Ob25Mb29waW5nU291bmRzW3RoaXMuc291bmRfaW5kZXhdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgUElYSXNvdW5kLnBsYXkoU291bmRzLk5vbkxvb3BpbmdTb3VuZHNbdGhpcy5zb3VuZF9pbmRleF0gYXMgc3RyaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgc3ByaXRlID0gU291bmRzLk5vbkxvb3BpbmdTb3VuZHNbdGhpcy5zb3VuZF9pbmRleF0gYXMge2FsaWFzOiBzdHJpbmcsIHNwcml0ZTogc3RyaW5nfTtcbiAgICAgICAgICAgIFBJWElzb3VuZC5wbGF5KHNwcml0ZS5hbGlhcywgc3ByaXRlLnNwcml0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc291bmRfaW5kZXggPSAodGhpcy5zb3VuZF9pbmRleCsxKSVTb3VuZHMuTm9uTG9vcGluZ1NvdW5kcy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBQSVhJc291bmQucGxheSgnbWlzc2lvbl9jb21wbGV0ZWQnKTtcbiAgICAgICAgR2FtZS5zdGF0ZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgR2FtZS5zdGF0ZSA9IEdhbWUucGlja2luZztcbiAgICAgICAgR2FtZS5zdGF0ZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIEtleXMuQUFBLnByZXNzID0gKCk6dm9pZCA9PiB7XG4gICAgICAvLyBwbGF5aW5nIC0+IHBpY2tpbmdcbiAgICAgIFBJWElzb3VuZC5zdG9wQWxsKCk7XG4gICAgICBQSVhJc291bmQucGxheSgnb3Blbl9wb2RfYmF5X2Rvb3JzJyk7XG4gICAgICBHYW1lLnN0YXRlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgR2FtZS5zdGF0ZSA9IEdhbWUucGlja2luZztcbiAgICAgIEdhbWUuc3RhdGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBkZWFjdGl2YXRlKCk6IHZvaWQge1xuICAgIHN1cGVyLmRlYWN0aXZhdGUoKTtcblxuICAgIEtleXMuU3BhY2ViYXIucHJlc3MgPSBudWxsO1xuICAgIEtleXMuQUFBLnByZXNzID0gbnVsbDtcbiAgfVxuXG4gIHVwZGF0ZSgpOiB2b2lkIHt9O1xufVxuXG4vLyBjb250cm9sIHdoYXQgaGFwcGVucyB3aGlsZSBwaWNraW5nIHRoZSBzdGFydGluZyBjZWxsXG5jbGFzcyBQaWNrIGV4dGVuZHMgR2FtZVN0YXRlIHtcbiAgYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgc3VwZXIuYWN0aXZhdGUoKTtcblxuICAgIEtleXMuVXBBcnJvdy5wcmVzcyA9ICgpOnZvaWQgPT4ge1xuICAgICAgR2FtZS5ib2FyZC5jdXJyZW50Q2VsbCA9IHtpOiBHYW1lLmJvYXJkLmN1cnJlbnRDZWxsLmksIGo6IChHYW1lLmJvYXJkLnNpemUrR2FtZS5ib2FyZC5jdXJyZW50Q2VsbC5qLTEpJUdhbWUuYm9hcmQuc2l6ZX07XG4gICAgfVxuXG4gICAgS2V5cy5Eb3duQXJyb3cucHJlc3MgPSAoKTp2b2lkID0+IHtcbiAgICAgIEdhbWUuYm9hcmQuY3VycmVudENlbGwgPSB7aTogR2FtZS5ib2FyZC5jdXJyZW50Q2VsbC5pLCBqOiAoR2FtZS5ib2FyZC5jdXJyZW50Q2VsbC5qKzEpJUdhbWUuYm9hcmQuc2l6ZX07XG4gICAgfVxuXG4gICAgS2V5cy5MZWZ0QXJyb3cucHJlc3MgPSAoKTp2b2lkID0+IHtcbiAgICAgIEdhbWUuYm9hcmQuY3VycmVudENlbGwgPSB7aTogKEdhbWUuYm9hcmQuc2l6ZStHYW1lLmJvYXJkLmN1cnJlbnRDZWxsLmktMSklR2FtZS5ib2FyZC5zaXplLCBqOiBHYW1lLmJvYXJkLmN1cnJlbnRDZWxsLmp9O1xuICAgIH1cblxuICAgIEtleXMuUmlnaHRBcnJvdy5wcmVzcyA9ICgpOnZvaWQgPT4ge1xuICAgICAgR2FtZS5ib2FyZC5jdXJyZW50Q2VsbCA9IHtpOiAoR2FtZS5ib2FyZC5jdXJyZW50Q2VsbC5pKzEpJUdhbWUuYm9hcmQuc2l6ZSwgajogR2FtZS5ib2FyZC5jdXJyZW50Q2VsbC5qfTtcbiAgICB9XG5cbiAgICBLZXlzLkVudGVyLnByZXNzID0gKCk6dm9pZCA9PiB7XG4gICAgICAvLyBTd2l0Y2ggZnJvbSBQaWNraW5nIHRvIFBsYXlpbmdcbiAgICAgIEdhbWUuc3RhdGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICBHYW1lLnN0YXRlID0gR2FtZS5wbGF5aW5nO1xuICAgICAgR2FtZS5zdGF0ZS5hY3RpdmUgPSB0cnVlO1xuICAgIH1cblxuICAgIEtleXMuU1NTLnByZXNzID0gKCk6dm9pZCA9PiB7XG4gICAgICAvLyByZVNpemUgdGhlIGJvYXJkXG4gICAgICBHYW1lLnN0YXRlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgR2FtZS5zdGF0ZSA9IEdhbWUuc2l6aW5nO1xuICAgICAgR2FtZS5zdGF0ZS5hY3RpdmUgPSB0cnVlO1xuICAgIH1cblxuICAgIEtleXMuUlJSLnByZXNzID0gKCk6dm9pZCA9PiB7XG4gICAgICAvLyByZS1yYW5kb21pemUgdGhlIGJvYXJkXG4gICAgICBsZXQgc2l6ZTogbnVtYmVyID0gR2FtZS5ib2FyZC5zaXplO1xuICAgICAgbGV0IGNpOiBDZWxsSW5kZXggPSBHYW1lLmJvYXJkLmN1cnJlbnRDZWxsO1xuXG4gICAgICBHYW1lLnN0YWdlLnJlbW92ZUNoaWxkKEdhbWUuYm9hcmQpO1xuICAgICAgR2FtZS5ib2FyZCA9IG5ldyBHYW1lQm9hcmQoc2l6ZSk7XG4gICAgICBHYW1lLmJvYXJkLmN1cnJlbnRDZWxsID0gY2k7XG4gICAgICBHYW1lLmJvYXJkLnBvc2l0aW9uLnNldCgoR2FtZS5yZW5kZXJlci53aWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gR2FtZVNldHRpbmdzLkluZm8uV2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIEdhbWVTZXR0aW5ncy5JbmZvLkJvcmRlcldpZHRoKS8yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gR2FtZS5ib2FyZC53aWR0aC8yIC0gR2FtZVNldHRpbmdzLkdhbWVCb2FyZC5MZWZ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKEdhbWUucmVuZGVyZXIuaGVpZ2h0IC0gR2FtZS5ib2FyZC5oZWlnaHQpLzIpO1xuICAgICAgR2FtZS5zdGFnZS5hZGRDaGlsZChHYW1lLmJvYXJkKTtcbiAgICB9XG4gIH1cblxuICBkZWFjdGl2YXRlKCk6IHZvaWQge1xuICAgIHN1cGVyLmRlYWN0aXZhdGUoKTtcblxuICAgIEtleXMuVXBBcnJvdy5wcmVzcyA9IG51bGw7XG4gICAgS2V5cy5Eb3duQXJyb3cucHJlc3MgPSBudWxsO1xuICAgIEtleXMuTGVmdEFycm93LnByZXNzID0gbnVsbDtcbiAgICBLZXlzLlJpZ2h0QXJyb3cucHJlc3MgPSBudWxsO1xuICAgIEtleXMuRW50ZXIucHJlc3MgPSBudWxsO1xuICAgIEtleXMuU1NTLnByZXNzID0gbnVsbDtcbiAgICBLZXlzLlJSUi5wcmVzcyA9IG51bGw7XG4gIH1cblxuICB1cGRhdGUoKTogdm9pZCB7fTtcbn1cblxuLy8gY29udHJvbCB3aGF0IGhhcHBlbnMgd2hpbGUgcmVTaXppbmcgdGhlIEdhbWVCb2FyZFxuY2xhc3MgU2l6ZSBleHRlbmRzIEdhbWVTdGF0ZSB7XG4gIGFjdGl2YXRlKCk6IHZvaWQge1xuICAgIHN1cGVyLmFjdGl2YXRlKCk7XG5cbiAgICBLZXlzLlVwQXJyb3cucHJlc3MgPSAoKTp2b2lkID0+IHtcbiAgICAgIGxldCBzaXplOiBudW1iZXIgPSBHYW1lLmJvYXJkLnNpemU7XG5cbiAgICAgIGlmIChzaXplID49IEdhbWVTZXR0aW5ncy5HYW1lQm9hcmQuTWF4U2l6ZSkge1xuICAgICAgICBQSVhJc291bmQuc3RvcEFsbCgpO1xuICAgICAgICBQSVhJc291bmQucGxheSgnY2FudF9kb190aGF0Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgfVxuXG4gICAgICBHYW1lLnN0YWdlLnJlbW92ZUNoaWxkKEdhbWUuYm9hcmQpO1xuICAgICAgR2FtZS5ib2FyZCA9IG5ldyBHYW1lQm9hcmQoc2l6ZSsxKTtcbiAgICAgIEdhbWUuYm9hcmQucG9zaXRpb24uc2V0KChHYW1lLnJlbmRlcmVyLndpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBHYW1lU2V0dGluZ3MuSW5mby5XaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gR2FtZVNldHRpbmdzLkluZm8uQm9yZGVyV2lkdGgpLzJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBHYW1lLmJvYXJkLndpZHRoLzIgLSBHYW1lU2V0dGluZ3MuR2FtZUJvYXJkLkxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoR2FtZS5yZW5kZXJlci5oZWlnaHQgLSBHYW1lLmJvYXJkLmhlaWdodCkvMik7XG4gICAgICBHYW1lLnN0YWdlLmFkZENoaWxkKEdhbWUuYm9hcmQpO1xuICAgIH1cblxuICAgIEtleXMuRG93bkFycm93LnByZXNzID0gKCk6dm9pZCA9PiB7XG4gICAgICBsZXQgc2l6ZTogbnVtYmVyID0gR2FtZS5ib2FyZC5zaXplO1xuXG4gICAgICBpZiAoc2l6ZSA8PSAxKSB7XG4gICAgICAgIFBJWElzb3VuZC5zdG9wQWxsKCk7XG4gICAgICAgIFBJWElzb3VuZC5wbGF5KCdjYW50X2RvX3RoYXQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBHYW1lLnN0YWdlLnJlbW92ZUNoaWxkKEdhbWUuYm9hcmQpO1xuICAgICAgR2FtZS5ib2FyZCA9IG5ldyBHYW1lQm9hcmQoc2l6ZS0xKTtcbiAgICAgIEdhbWUuYm9hcmQucG9zaXRpb24uc2V0KChHYW1lLnJlbmRlcmVyLndpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBHYW1lU2V0dGluZ3MuSW5mby5XaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gR2FtZVNldHRpbmdzLkluZm8uQm9yZGVyV2lkdGgpLzJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBHYW1lLmJvYXJkLndpZHRoLzIgLSBHYW1lU2V0dGluZ3MuR2FtZUJvYXJkLkxlZnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoR2FtZS5yZW5kZXJlci5oZWlnaHQgLSBHYW1lLmJvYXJkLmhlaWdodCkvMik7XG4gICAgICBHYW1lLnN0YWdlLmFkZENoaWxkKEdhbWUuYm9hcmQpO1xuICAgIH1cblxuICAgIEtleXMuRW50ZXIucHJlc3MgPSAoKTp2b2lkID0+IHtcbiAgICAgIC8vIFN3aXRjaCBmcm9tIFNpemluZyB0byBQaWNraW5nXG4gICAgICBHYW1lLnN0YXRlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgR2FtZS5zdGF0ZSA9IEdhbWUucGlja2luZztcbiAgICAgIEdhbWUuc3RhdGUuYWN0aXZlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBkZWFjdGl2YXRlKCk6IHZvaWQge1xuICAgIHN1cGVyLmRlYWN0aXZhdGUoKTtcblxuICAgIEtleXMuVXBBcnJvdy5wcmVzcyA9IG51bGw7XG4gICAgS2V5cy5Eb3duQXJyb3cucHJlc3MgPSBudWxsO1xuICAgIEtleXMuRW50ZXIucHJlc3MgPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlKCk6IHZvaWQge307XG59XG5cbi8vIGluZGV4IG9mIGNlbGxzIG9uIHRoZSBib2FyZFxudHlwZSBDZWxsSW5kZXggPSB7aTpudW1iZXIsIGo6bnVtYmVyfTtcblxuLy8gYSBzcXVhcmUgb24gdGhlIGJvYXJkXG5jbGFzcyBHYW1lQ2VsbCBleHRlbmRzIFBJWEkuQ29udGFpbmVyXG57XG4gIHByaXZhdGUgYmFja2dyb3VuZDogUElYSS5HcmFwaGljcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gIHByaXZhdGUgYXJyb3c6ICAgICAgUElYSS5TcHJpdGUgPSB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGRpcmVjdGlvbjpEaXJlY3Rpb24pXG4gIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5iYWNrZ3JvdW5kLmJlZ2luRmlsbChHYW1lU2V0dGluZ3MuQ2VsbC5CYWNrZ3JvdW5kQ29sb3IpO1xuICAgIHRoaXMuYmFja2dyb3VuZC5saW5lU3R5bGUoR2FtZVNldHRpbmdzLkNlbGwuQm9yZGVyV2lkdGgsIEdhbWVTZXR0aW5ncy5DZWxsLkJvcmRlckNvbG9yLCAxKTtcbiAgICB0aGlzLmJhY2tncm91bmQuZHJhd1JlY3QoMCwgMCwgR2FtZVNldHRpbmdzLkNlbGwuV2lkdGgsIEdhbWVTZXR0aW5ncy5DZWxsLldpZHRoKTtcbiAgICB0aGlzLmJhY2tncm91bmQuZW5kRmlsbCgpO1xuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5iYWNrZ3JvdW5kKTtcblxuICAgIHRoaXMuYXJyb3cgPSBuZXcgUElYSS5TcHJpdGUoR2FtZS5hcnJvd190ZXh0dXJlc1t0aGlzLmRpcmVjdGlvbl0pO1xuICAgIHRoaXMuYXJyb3cuYW5jaG9yLnNldCgwLjUsMC41KTtcbiAgICB0aGlzLmFycm93LnBvc2l0aW9uLnNldChHYW1lU2V0dGluZ3MuQ2VsbC5XaWR0aC8yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWVTZXR0aW5ncy5DZWxsLldpZHRoLzIpO1xuICAgIHRoaXMuYXJyb3cuc2NhbGUuc2V0KEdhbWVTZXR0aW5ncy5DZWxsLkltYWdlU2NhbGUsIEdhbWVTZXR0aW5ncy5DZWxsLkltYWdlU2NhbGUpO1xuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5hcnJvdyk7XG4gIH1cbn1cblxuY2xhc3MgR2FtZUJvYXJkIGV4dGVuZHMgUElYSS5Db250YWluZXIge1xuICBwcm90ZWN0ZWQgX2JvcmRlcjogUElYSS5HcmFwaGljcyA9IHVuZGVmaW5lZDtcblxuICBwcm90ZWN0ZWQgY2VsbHM6ICAgICAgICAgIEdhbWVDZWxsW11bXSAgPSBbXSBhcyBHYW1lQ2VsbFtdW107XG4gIHByb3RlY3RlZCBfY3VycmVudENlbGw6ICAgQ2VsbEluZGV4ICAgICA9IHtpOiAwLCBqOiAwfTtcblxuICBwdWJsaWMgICAgbWFya2VyOiAgICAgICAgIFBJWEkuQ29udGFpbmVyID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG4gIHByb3RlY3RlZCBfcmVkX21hcmtlcjogICAgUElYSS5HcmFwaGljcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gIHByb3RlY3RlZCBfeWVsbG93X21hcmtlcjogUElYSS5HcmFwaGljcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gIHByb3RlY3RlZCBfZ3JlZW5fbWFya2VyOiAgUElYSS5HcmFwaGljcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG5cbiAgcHJpdmF0ZSBtYWtlX2JvcmRlcihjOiBHYW1lQ29sb3IpOiBQSVhJLkdyYXBoaWNzIHtcbiAgICBsZXQgYm9yZGVyOlBJWEkuR3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuXG4gICAgYm9yZGVyLmJlZ2luRmlsbChHYW1lU2V0dGluZ3MuR2FtZUJvYXJkLkJhY2tncm91bmRDb2xvciwgMSk7XG4gICAgYm9yZGVyLmxpbmVTdHlsZShHYW1lU2V0dGluZ3MuR2FtZUJvYXJkLkJvcmRlcldpZHRoLCBjLCAxKTtcbiAgICBib3JkZXIuZHJhd1JlY3QoMCwgMCxcbiAgICAgIEdhbWVTZXR0aW5ncy5DZWxsLldpZHRoKnRoaXMuc2l6ZSArIEdhbWVTZXR0aW5ncy5HYW1lQm9hcmQuQm9yZGVyV2lkdGggKyBHYW1lU2V0dGluZ3MuQ2VsbC5Cb3JkZXJXaWR0aCxcbiAgICAgIEdhbWVTZXR0aW5ncy5DZWxsLldpZHRoKnRoaXMuc2l6ZSArIEdhbWVTZXR0aW5ncy5HYW1lQm9hcmQuQm9yZGVyV2lkdGggKyBHYW1lU2V0dGluZ3MuQ2VsbC5Cb3JkZXJXaWR0aCk7XG4gICAgYm9yZGVyLmVuZEZpbGwoKTtcblxuICAgIHJldHVybiBib3JkZXI7XG4gIH1cblxuICBwcml2YXRlIG1ha2VfbWFya2VyKGM6IEdhbWVDb2xvcik6IFBJWEkuR3JhcGhpY3Mge1xuICAgIGxldCBtYXJrZXI6UElYSS5HcmFwaGljcyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG5cbiAgICBtYXJrZXIuYmVnaW5GaWxsKEdhbWVTZXR0aW5ncy5NYXJrZXIuQmFja2dyb3VuZENvbG9yLCBHYW1lU2V0dGluZ3MuTWFya2VyLkJhY2tncm91bmRBbHBoYSk7XG4gICAgbWFya2VyLmxpbmVTdHlsZShHYW1lU2V0dGluZ3MuTWFya2VyLkJvcmRlcldpZHRoLCBjLCBHYW1lU2V0dGluZ3MuTWFya2VyLkJvcmRlckFscGhhKTtcbiAgICBtYXJrZXIuZHJhd1JlY3QoMCwgMCxcbiAgICAgICAgICAgICAgICAgICAgR2FtZVNldHRpbmdzLkNlbGwuV2lkdGggLSBHYW1lU2V0dGluZ3MuQ2VsbC5Cb3JkZXJXaWR0aCAtIEdhbWVTZXR0aW5ncy5NYXJrZXIuQm9yZGVyV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIEdhbWVTZXR0aW5ncy5DZWxsLldpZHRoIC0gR2FtZVNldHRpbmdzLkNlbGwuQm9yZGVyV2lkdGggLSBHYW1lU2V0dGluZ3MuTWFya2VyLkJvcmRlcldpZHRoKTtcbiAgICBtYXJrZXIuZW5kRmlsbCgpO1xuXG4gICAgcmV0dXJuIG1hcmtlcjtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzaXplOiBudW1iZXIpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLy8gc2V0IHVwIHRoZSBib2FyZGVyIGFyb3VuZCB0aGUgYm9hcmRcbiAgICB0aGlzLl9ib3JkZXIgPSB0aGlzLm1ha2VfYm9yZGVyKEdhbWVDb2xvci5ZRUxMT1cpO1xuXG4gICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9ib3JkZXIpO1xuXG4gICAgLy8gc2V0IHVwIHRoZSBjZWxscyBvZiB0aGUgYm9hcmRcbiAgICBmb3IgKGxldCBpPTA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIHRoaXMuY2VsbHNbaV0gPSBbXSBhcyBHYW1lQ2VsbFtdO1xuXG4gICAgICBmb3IgKGxldCBqPTA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgICAgbGV0IGNlbGxfZGlyZWN0aW9uOkRpcmVjdGlvbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpO1xuICAgICAgICB0aGlzLmNlbGxzW2ldLnB1c2gobmV3IEdhbWVDZWxsKGNlbGxfZGlyZWN0aW9uKSk7XG5cbiAgICAgICAgdGhpcy5wb3NpdGlvbl9jZWxsKHtpLCBqfSk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5jZWxsc1tpXVtqXSk7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICAvLyBzZXQgdXAgdGhlIG1hcmtlciBhbmQgdGhlIHRocmVlIHN1Yi1tYXJrZXJzXG5cbiAgICB0aGlzLl9yZWRfbWFya2VyID0gdGhpcy5tYWtlX21hcmtlcihHYW1lQ29sb3IuUkVEKTtcbiAgICB0aGlzLl95ZWxsb3dfbWFya2VyID0gdGhpcy5tYWtlX21hcmtlcihHYW1lQ29sb3IuWUVMTE9XKTtcbiAgICB0aGlzLl9ncmVlbl9tYXJrZXIgPSB0aGlzLm1ha2VfbWFya2VyKEdhbWVDb2xvci5HUkVFTik7XG5cbiAgICB0aGlzLl9yZWRfbWFya2VyLnZpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLl9ncmVlbl9tYXJrZXIudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5tYXJrZXIuYWRkQ2hpbGQodGhpcy5fcmVkX21hcmtlciwgdGhpcy5feWVsbG93X21hcmtlciwgdGhpcy5fZ3JlZW5fbWFya2VyKTtcblxuICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5tYXJrZXIpO1xuICAgIHRoaXMucGxhY2VfbWFya2VyX2F0KHRoaXMuY3VycmVudENlbGwpO1xuICB9XG5cbiAgcHVibGljIGdldCBjdXJyZW50Q2VsbCgpOiBDZWxsSW5kZXgge1xuICAgIHJldHVybiB7Li4udGhpcy5fY3VycmVudENlbGx9O1xuICB9XG5cbiAgcHVibGljIHNldCBjdXJyZW50Q2VsbCh2YWx1ZTogQ2VsbEluZGV4KSB7XG4gICAgdGhpcy5wbGFjZV9tYXJrZXJfYXQodmFsdWUpO1xuICAgIHRoaXMuX2N1cnJlbnRDZWxsID0gey4uLnZhbHVlfTtcbiAgfVxuXG4gIHByaXZhdGUgcG9zaXRpb25fY2VsbChjaTogQ2VsbEluZGV4KTogdm9pZCB7XG4gICAgdGhpcy5jZWxsc1tjaS5pXVtjaS5qXS5wb3NpdGlvbi5zZXQoXG4gICAgICBHYW1lU2V0dGluZ3MuR2FtZUJvYXJkLkJvcmRlcldpZHRoLzIgKyBHYW1lU2V0dGluZ3MuQ2VsbC5Cb3JkZXJXaWR0aC8yICsgR2FtZVNldHRpbmdzLkNlbGwuV2lkdGgqY2kuaSxcbiAgICAgIEdhbWVTZXR0aW5ncy5HYW1lQm9hcmQuQm9yZGVyV2lkdGgvMiArIEdhbWVTZXR0aW5ncy5DZWxsLkJvcmRlcldpZHRoLzIgKyBHYW1lU2V0dGluZ3MuQ2VsbC5XaWR0aCpjaS5qKTtcbiAgfVxuXG4gIHByaXZhdGUgcGxhY2VfbWFya2VyX2F0KGNpOiBDZWxsSW5kZXgpIHtcbiAgICBsZXQgY3A6IFBJWEkuUG9pbnQgPSB0aGlzLmNlbGxzW2NpLmldW2NpLmpdLnBvc2l0aW9uO1xuXG4gICAgdGhpcy5tYXJrZXIucG9zaXRpb24uc2V0KGNwLnggKyBHYW1lU2V0dGluZ3MuQ2VsbC5Cb3JkZXJXaWR0aC8yICsgR2FtZVNldHRpbmdzLk1hcmtlci5Cb3JkZXJXaWR0aC8yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcC55ICsgR2FtZVNldHRpbmdzLkNlbGwuQm9yZGVyV2lkdGgvMiArIEdhbWVTZXR0aW5ncy5NYXJrZXIuQm9yZGVyV2lkdGgvMik7XG5cbiAgICBpZiAodGhpcy53aWxsTG9vcChjaSkpIHtcbiAgICAgIHRoaXMuX3JlZF9tYXJrZXIudmlzaWJsZSA9IHRydWU7XG4gICAgICB0aGlzLl95ZWxsb3dfbWFya2VyLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2dyZWVuX21hcmtlci52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5fcmVkX21hcmtlci52aXNpYmxlID0gZmFsc2U7XG4gICAgICB0aGlzLl95ZWxsb3dfbWFya2VyLnZpc2libGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2dyZWVuX21hcmtlci52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBuZXh0IGNlbGwgYmFzZWQgb24gdGhlIGRpcmVjdGlvbiBvZiB0aGUgcGFzc2VkIGluIGNlbGxcbiAgcHVibGljIG5leHRfY2VsbChjaTogQ2VsbEluZGV4KTogQ2VsbEluZGV4IHtcbiAgICBzd2l0Y2ggKHRoaXMuY2VsbHNbY2kuaV1bY2kual0uZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlIERpcmVjdGlvbi5VcDpcbiAgICAgICAgcmV0dXJuIHtpOiBjaS5pLCBqOiBjaS5qLTF9O1xuXG4gICAgICBjYXNlIERpcmVjdGlvbi5Eb3duOlxuICAgICAgICByZXR1cm4ge2k6IGNpLmksIGo6IGNpLmorMX07XG5cbiAgICAgIGNhc2UgRGlyZWN0aW9uLkxlZnQ6XG4gICAgICAgIHJldHVybiB7aTogY2kuaS0xLCBqOiBjaS5qfTtcblxuICAgICAgY2FzZSBEaXJlY3Rpb24uUmlnaHQ6XG4gICAgICAgIHJldHVybiB7aTogY2kuaSsxLCBqOiBjaS5qfTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5kZXhfb25fYm9hcmQoY2k6IENlbGxJbmRleCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoKGNpLmkgPj0gMCkgJiYgKGNpLmkgPCB0aGlzLnNpemUpICYmIChjaS5qID49IDApICYmIChjaS5qIDwgdGhpcy5zaXplKSk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRhdGlvbiBvZiBGbG95ZOKAmXMgQ3ljbGUtRmluZGluZyBBbGdvcml0aG1cbiAgLy8gYmFzZWQgb24gaHR0cDovL3d3dy5nZWVrc2ZvcmdlZWtzLm9yZy93cml0ZS1hLWMtZnVuY3Rpb24tdG8tZGV0ZWN0LWxvb3AtaW4tYS1saW5rZWQtbGlzdC9cbiAgLy9cbiAgcHVibGljIHdpbGxMb29wKGNpOiBDZWxsSW5kZXgpOiBib29sZWFuIHtcbiAgICBsZXQgdG9ydG9pc2U6IENlbGxJbmRleCA9IHsuLi5jaX07XG4gICAgbGV0IGxlYXA6ICAgICBDZWxsSW5kZXggPSB7Li4uY2l9O1xuICAgIGxldCBmcm9nOiAgICAgQ2VsbEluZGV4ID0gey4uLmNpfTtcblxuICAgIHdoaWxlICh0aGlzLmluZGV4X29uX2JvYXJkKHRvcnRvaXNlKSAmJlxuICAgICAgICAgICB0aGlzLmluZGV4X29uX2JvYXJkKGxlYXA9dGhpcy5uZXh0X2NlbGwoZnJvZykpICYmXG4gICAgICAgICAgIHRoaXMuaW5kZXhfb25fYm9hcmQoZnJvZz10aGlzLm5leHRfY2VsbChsZWFwKSkpXG4gICAge1xuICAgICAgLy8gaWYgZWl0aGVyIGxlYXAgb3IgZnJvZyBjYXRjaCB1cCB0byB0b3J0b2lzZSwgdGhlcmUgaXMgYSBsb29wXG4gICAgICBpZiAoKHRvcnRvaXNlLmkgPT09IGxlYXAuaSkgJiYgKHRvcnRvaXNlLmogPT09IGxlYXAuaikpIHJldHVybiB0cnVlO1xuICAgICAgaWYgKCh0b3J0b2lzZS5pID09PSBmcm9nLmkpICYmICh0b3J0b2lzZS5qID09PSBmcm9nLmopKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgdG9ydG9pc2UgPSB0aGlzLm5leHRfY2VsbCh0b3J0b2lzZSk7XG4gICAgfVxuXG4gICAgLy8gb25lIG9mIHRoZSByYWNlcnMgd2VudCBvZmYgdGhlIGJvYXJkOyBubyBsb29wXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmNsYXNzIEdhbWUge1xuICAvLyBHYW1lU3RhdGVzXG4gIHN0YXRpYyBwbGF5aW5nOiAgUGxheSA9IHVuZGVmaW5lZDtcbiAgc3RhdGljIHBpY2tpbmc6ICBQaWNrID0gdW5kZWZpbmVkO1xuICBzdGF0aWMgc2l6aW5nOiAgIFNpemUgPSB1bmRlZmluZWQ7XG5cbiAgc3RhdGljIHN0YXRlOiBHYW1lU3RhdGUgPSB1bmRlZmluZWQ7XG4gIHN0YXRpYyBib2FyZDogR2FtZUJvYXJkID0gdW5kZWZpbmVkO1xuXG4gIC8vIENvbnRleHQgZGVwZW5kZW50IHVzYWdlIGluZm9ybWF0aW9uXG4gIHN0YXRpYyBpbmZvOiBQSVhJLkNvbnRhaW5lciA9IHVuZGVmaW5lZDtcblxuICBzdGF0aWMgcmVhZG9ubHkgcGlja2luZ19pbmZvOiBQSVhJLkNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuICBzdGF0aWMgcmVhZG9ubHkgcGxheWluZ19pbmZvOiBQSVhJLkNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuICBzdGF0aWMgcmVhZG9ubHkgc2l6aW5nX2luZm86IFBJWEkuQ29udGFpbmVyID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG5cbiAgc3RhdGljIHJlYWRvbmx5IHJlbmRlcmVyOiBQSVhJLldlYkdMUmVuZGVyZXIgPSBuZXcgUElYSS5XZWJHTFJlbmRlcmVyKDEyODAsIDcyMCk7XG4gIHN0YXRpYyByZWFkb25seSBzdGFnZTogUElYSS5Db250YWluZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcblxuICBzdGF0aWMgcmVhZG9ubHkgYXJyb3dfdGV4dHVyZXM6UElYSS5UZXh0dXJlW10gPSBbXTtcblxuICBzdGF0aWMgcmVhZG9ubHkgX3NvdW5kcyA9IG5ldyBTb3VuZHMoKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBHYW1lLnJlbmRlcmVyLmJhY2tncm91bmRDb2xvciA9IEdhbWVTZXR0aW5ncy5HYW1lLkJhY2tncm91bmRDb2xvcjtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKEdhbWUucmVuZGVyZXIudmlldyk7XG5cbiAgICBQSVhJLmxvYWRlclxuICAgICAgLmFkZChHYW1lU2V0dGluZ3MuR2FtZS5TcHJpdGVTaGVldEZpbGUpXG4gICAgICAubG9hZCh0aGlzLmluaXRpYWxpemVBbmRSdW5HYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUFuZFJ1bkdhbWUgPSAobG9hZGVyOlBJWEkubG9hZGVycy5Mb2FkZXIsIHJlc291cmNlczphbnkpID0+IHtcbiAgICAvLyBsb2FkIHRoZSB0ZXh0dXJlIHJlc291cmNlc1xuICAgIHZhciBpZCA9IFBJWEkubG9hZGVyLnJlc291cmNlc1tHYW1lU2V0dGluZ3MuR2FtZS5TcHJpdGVTaGVldEZpbGVdLnRleHR1cmVzO1xuXG4gICAgR2FtZS5hcnJvd190ZXh0dXJlc1tEaXJlY3Rpb24uVXBdICAgID0gaWRbR2FtZVNldHRpbmdzLkdhbWUuVGV4dHVyZUZpbGVzLlVwQXJyb3ddO1xuICAgIEdhbWUuYXJyb3dfdGV4dHVyZXNbRGlyZWN0aW9uLkRvd25dICA9IGlkW0dhbWVTZXR0aW5ncy5HYW1lLlRleHR1cmVGaWxlcy5Eb3duQXJyb3ddO1xuICAgIEdhbWUuYXJyb3dfdGV4dHVyZXNbRGlyZWN0aW9uLkxlZnRdICA9IGlkW0dhbWVTZXR0aW5ncy5HYW1lLlRleHR1cmVGaWxlcy5MZWZ0QXJyb3ddO1xuICAgIEdhbWUuYXJyb3dfdGV4dHVyZXNbRGlyZWN0aW9uLlJpZ2h0XSA9IGlkW0dhbWVTZXR0aW5ncy5HYW1lLlRleHR1cmVGaWxlcy5SaWdodEFycm93XTtcblxuICAgIC8vIEFkZCB0aGUgYmFja2dyb3VuZCBpbWFnZVxuICAgIEdhbWUuc3RhZ2UuYWRkQ2hpbGQobmV3IFBJWEkuU3ByaXRlKGlkW0dhbWVTZXR0aW5ncy5HYW1lLlRleHR1cmVGaWxlcy5CYWNrZ3JvdW5kXSkpO1xuXG4gICAgLy8gU2V0dXAgdGhlIGdhbWUgYm9hcmRcbiAgICBHYW1lLmJvYXJkID0gbmV3IEdhbWVCb2FyZChHYW1lU2V0dGluZ3MuR2FtZUJvYXJkLlNpemUpO1xuICAgIEdhbWUuYm9hcmQuY3VycmVudENlbGwgPSBHYW1lU2V0dGluZ3MuR2FtZUJvYXJkLkluaXRpYWxDZWxsO1xuXG4gICAgLy8gdXNlIEdhbWUuYm9hcmQud2lkdGggYW5kIC5oZWlnaHQgYXMgdGhlc2UgYXJlIGR5bmFtaWMgYmFzZWQgb24gdGhlIHNpemUgb2YgdGhlIGJvYXJkXG4gICAgR2FtZS5ib2FyZC5wb3NpdGlvbi5zZXQoKEdhbWUucmVuZGVyZXIud2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBHYW1lU2V0dGluZ3MuSW5mby5XaWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIEdhbWVTZXR0aW5ncy5JbmZvLkJvcmRlcldpZHRoKS8yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIEdhbWUuYm9hcmQud2lkdGgvMiAtIEdhbWVTZXR0aW5ncy5HYW1lQm9hcmQuTGVmdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoR2FtZS5yZW5kZXJlci5oZWlnaHQgLSBHYW1lLmJvYXJkLmhlaWdodCkvMik7XG4gICAgR2FtZS5zdGFnZS5hZGRDaGlsZChHYW1lLmJvYXJkKTtcblxuICAgIC8vIFNldCB1cCB0aGUgSW5mbyBQYW5lXG4gICAgLy8gdG9kbzogY291bGQgcHVsbCB0aGlzIGludG8gYSBmdW5jdGlvbiBvciBjbGFzc1xuICAgIEdhbWUuaW5mbyA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuICAgIGxldCBib3JkZXI6IFBJWEkuR3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgIGJvcmRlci5iZWdpbkZpbGwoR2FtZVNldHRpbmdzLkluZm8uQmFja2dyb3VuZENvbG9yLCBHYW1lU2V0dGluZ3MuSW5mby5CYWNrZ3JvdW5kQWxwaGEpO1xuICAgIGJvcmRlci5saW5lU3R5bGUoR2FtZVNldHRpbmdzLkluZm8uQm9yZGVyV2lkdGgsIEdhbWVTZXR0aW5ncy5JbmZvLkJvcmRlckNvbG9yLCBHYW1lU2V0dGluZ3MuSW5mby5Cb3JkZXJBbHBoYSk7XG4gICAgYm9yZGVyLmRyYXdSb3VuZGVkUmVjdCgwLCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgR2FtZVNldHRpbmdzLkluZm8uV2lkdGgsIEdhbWVTZXR0aW5ncy5JbmZvLkhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWVTZXR0aW5ncy5JbmZvLkJvcmRlclJhZGl1cyk7XG4gICAgYm9yZGVyLmVuZEZpbGwoKTtcblxuICAgIEdhbWUuaW5mby5wb3NpdGlvbi5zZXQoR2FtZVNldHRpbmdzLkluZm8uTGVmdCwgKEdhbWUucmVuZGVyZXIuaGVpZ2h0IC0gR2FtZVNldHRpbmdzLkluZm8uSGVpZ2h0KS8yLCk7XG5cblxuICAgIGxldCB0ZXh0ID0gbmV3IFBJWEkuVGV4dChcIkhBTCdsbyBhbmQgV2VsY29tZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9udEZhbWlseSA6ICdBcmlhbCcsIGZvbnRTaXplOiAyNCwgZmlsbCA6IEdhbWVDb2xvci5XSElURSwgYWxpZ24gOiAnY2VudGVyJ30pO1xuICAgIHRleHQucG9zaXRpb24uc2V0KChHYW1lU2V0dGluZ3MuSW5mby5XaWR0aC10ZXh0LndpZHRoKS8yLCAyMCk7XG4gICAgR2FtZS5pbmZvLmFkZENoaWxkKGJvcmRlciwgdGV4dCk7XG5cbiAgICBsZXQgczA6IFBJWEkuR3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgIHMwLmxpbmVTdHlsZShHYW1lU2V0dGluZ3MuSW5mby5Cb3JkZXJXaWR0aCwgR2FtZVNldHRpbmdzLkluZm8uQm9yZGVyQ29sb3IsIEdhbWVTZXR0aW5ncy5JbmZvLkJvcmRlckFscGhhKTtcbiAgICBzMC5tb3ZlVG8oMCwgMCk7XG4gICAgczAubGluZVRvKEdhbWVTZXR0aW5ncy5JbmZvLldpZHRoLCAwKTtcbiAgICBzMC5wb3NpdGlvbi5zZXQoMCwgNzIpO1xuICAgIEdhbWUuaW5mby5hZGRDaGlsZChzMCk7XG5cbiAgICAvLyBJbmZvIGZvciBQaWNraW5nIG1vZGVcbiAgICB0ZXh0ID0gbmV3IFBJWEkuVGV4dChcIlVzZSBBcnJvdy1LZXlzIHRvIG1vdmUgdGhlIHN0YXJ0aW5nIHBvc2l0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAge2ZvbnRGYW1pbHk6ICdBcmlhbCcsIGZvbnRTaXplOiBHYW1lU2V0dGluZ3MuSW5mby5Gb250U2l6ZSwgZmlsbDogR2FtZUNvbG9yLldISVRFLCBhbGlnbjogJ2xlZnQnfSk7XG4gICAgdGV4dC5wb3NpdGlvbi5zZXQoKEdhbWVTZXR0aW5ncy5JbmZvLldpZHRoLXRleHQud2lkdGgpLzIsIDExNik7XG4gICAgR2FtZS5waWNraW5nX2luZm8uYWRkQ2hpbGQodGV4dCk7XG4gICAgLy9cbiAgICB0ZXh0ID0gbmV3IFBJWEkuVGV4dChcIlN0YXJ0aW5nIGZyb20gYSByZWQgYm9yZGVyZWQgY2VsbFxcbndpbGwgZW50ZXIgYSBsb29wXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAge2ZvbnRGYW1pbHk6ICdBcmlhbCcsIGZvbnRTaXplOiBHYW1lU2V0dGluZ3MuSW5mby5Gb250U2l6ZSwgZmlsbDogR2FtZUNvbG9yLldISVRFLCBhbGlnbjogJ2xlZnQnfSk7XG4gICAgdGV4dC5wb3NpdGlvbi5zZXQoNjAsIDE0Nik7XG4gICAgR2FtZS5waWNraW5nX2luZm8uYWRkQ2hpbGQodGV4dCk7XG4gICAgLy9cbiAgICB0ZXh0ID0gbmV3IFBJWEkuVGV4dChcIlN0YXJ0aW5nIGZyb20gYSBncmVlbiBib3JkZXJlZCBjZWxsXFxud2lsbCBleGl0IHRoZSBib2FyZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHtmb250RmFtaWx5OiAnQXJpYWwnLCBmb250U2l6ZTogR2FtZVNldHRpbmdzLkluZm8uRm9udFNpemUsIGZpbGw6IEdhbWVDb2xvci5XSElURSwgYWxpZ246ICdsZWZ0J30pO1xuICAgIHRleHQucG9zaXRpb24uc2V0KDYwLCAxOTYpO1xuICAgIEdhbWUucGlja2luZ19pbmZvLmFkZENoaWxkKHRleHQpO1xuICAgIC8vXG4gICAgbGV0IHMxOiBQSVhJLkdyYXBoaWNzID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgICBzMS5saW5lU3R5bGUoR2FtZVNldHRpbmdzLkluZm8uU2VwYXJhdG9yV2lkdGgsIEdhbWVTZXR0aW5ncy5JbmZvLkJvcmRlckNvbG9yLCBHYW1lU2V0dGluZ3MuSW5mby5Cb3JkZXJBbHBoYSk7XG4gICAgczEubW92ZVRvKDAsIDApO1xuICAgIHMxLmxpbmVUbyhHYW1lU2V0dGluZ3MuSW5mby5XaWR0aCwgMCk7XG4gICAgczEucG9zaXRpb24uc2V0KDAsIDI3Mik7XG4gICAgR2FtZS5waWNraW5nX2luZm8uYWRkQ2hpbGQoczEpO1xuICAgIC8vXG4gICAgdGV4dCA9IG5ldyBQSVhJLlRleHQoXCJQcmVzcyAnRW50ZXInIHRvIGJlZ2luIGZvbGxvd2luZyB0aGUgYXJyb3dzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAge2ZvbnRGYW1pbHk6ICdBcmlhbCcsIGZvbnRTaXplOiBHYW1lU2V0dGluZ3MuSW5mby5Gb250U2l6ZSwgZmlsbDogR2FtZUNvbG9yLldISVRFLCBhbGlnbjogJ2xlZnQnfSk7XG4gICAgdGV4dC5wb3NpdGlvbi5zZXQoKEdhbWVTZXR0aW5ncy5JbmZvLldpZHRoLXRleHQud2lkdGgpLzIsIDMxMyk7XG4gICAgR2FtZS5waWNraW5nX2luZm8uYWRkQ2hpbGQodGV4dCk7XG4gICAgLy9cbiAgICBsZXQgczM6IFBJWEkuR3JhcGhpY3MgPSBzMS5jbG9uZSgpO1xuICAgIHMzLnBvc2l0aW9uLnNldCgwLCAzNzIpO1xuICAgIEdhbWUucGlja2luZ19pbmZvLmFkZENoaWxkKHMzKTtcbiAgICAvL1xuICAgIHRleHQgPSBuZXcgUElYSS5UZXh0KFwiUHJlc3MgJ1InIHRvIHJhbmRvbWl6ZSB0aGUgYXJyb3dzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAge2ZvbnRGYW1pbHk6ICdBcmlhbCcsIGZvbnRTaXplOiBHYW1lU2V0dGluZ3MuSW5mby5Gb250U2l6ZSwgZmlsbDogR2FtZUNvbG9yLldISVRFLCBhbGlnbjogJ2xlZnQnfSk7XG4gICAgdGV4dC5wb3NpdGlvbi5zZXQoKEdhbWVTZXR0aW5ncy5JbmZvLldpZHRoLXRleHQud2lkdGgpLzIsIDQxMSk7XG4gICAgR2FtZS5waWNraW5nX2luZm8uYWRkQ2hpbGQodGV4dCk7XG4gICAgLy9cbiAgICBsZXQgczQ6IFBJWEkuR3JhcGhpY3MgPSBzMS5jbG9uZSgpO1xuICAgIHM0LnBvc2l0aW9uLnNldCgwLCA0NzIpO1xuICAgIEdhbWUucGlja2luZ19pbmZvLmFkZENoaWxkKHM0KTtcbiAgICAvL1xuICAgIHRleHQgPSBuZXcgUElYSS5UZXh0KFwiUHJlc3MgJ1MnIHRvIHJlc2l6ZSB0aGUgYm9hcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9udEZhbWlseTogJ0FyaWFsJywgZm9udFNpemU6IEdhbWVTZXR0aW5ncy5JbmZvLkZvbnRTaXplLCBmaWxsOiBHYW1lQ29sb3IuV0hJVEUsIGFsaWduOiAnbGVmdCd9KTtcbiAgICB0ZXh0LnBvc2l0aW9uLnNldCgoR2FtZVNldHRpbmdzLkluZm8uV2lkdGgtdGV4dC53aWR0aCkvMiwgNTA2KTtcbiAgICBHYW1lLnBpY2tpbmdfaW5mby5hZGRDaGlsZCh0ZXh0KTtcblxuICAgIC8vIEluZm8gZm9yIFBsYXlpbmcgbW9kZVxuICAgIHRleHQgPSBuZXcgUElYSS5UZXh0KFwiUHJlc3MgJ1NwYWNlYmFyJyB0byBhZHZhbmNlIHRoZSBtYXJrZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9udEZhbWlseTogJ0FyaWFsJywgZm9udFNpemU6IEdhbWVTZXR0aW5ncy5JbmZvLkZvbnRTaXplLCBmaWxsOiBHYW1lQ29sb3IuV0hJVEUsIGFsaWduOiAnbGVmdCd9KTtcbiAgICB0ZXh0LnBvc2l0aW9uLnNldCgoR2FtZVNldHRpbmdzLkluZm8uV2lkdGgtdGV4dC53aWR0aCkvMiwgMTE2KTtcbiAgICBHYW1lLnBsYXlpbmdfaW5mby5hZGRDaGlsZCh0ZXh0KTtcbiAgICAvL1xuICAgIGxldCBzNTogUElYSS5HcmFwaGljcyA9IHMxLmNsb25lKCk7XG4gICAgczUucG9zaXRpb24uc2V0KDAsIDE3NSk7XG4gICAgR2FtZS5wbGF5aW5nX2luZm8uYWRkQ2hpbGQoczUpO1xuICAgIC8vXG4gICAgdGV4dCA9IG5ldyBQSVhJLlRleHQoXCJQcmVzcyAnQScgdG8gYWJvcnQgdGhlIG1pc3Npb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9udEZhbWlseTogJ0FyaWFsJywgZm9udFNpemU6IEdhbWVTZXR0aW5ncy5JbmZvLkZvbnRTaXplLCBmaWxsOiBHYW1lQ29sb3IuV0hJVEUsIGFsaWduOiAnbGVmdCd9KTtcbiAgICB0ZXh0LnBvc2l0aW9uLnNldCgoR2FtZVNldHRpbmdzLkluZm8uV2lkdGgtdGV4dC53aWR0aCkvMiwgMjEwKTtcbiAgICBHYW1lLnBsYXlpbmdfaW5mby5hZGRDaGlsZCh0ZXh0KTtcblxuICAgIC8vIEluZm8gZm9yIFNpemluZyBtb2RlXG4gICAgdGV4dCA9IG5ldyBQSVhJLlRleHQoXCJVc2UgJ1VwJyBhbmQgJ0Rvd24nIEFycm93LUtleXNcXG50byBjaGFuZ2UgdGhlIHNpemUgb2YgdGhlIGJvYXJkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAge2ZvbnRGYW1pbHk6ICdBcmlhbCcsIGZvbnRTaXplOiBHYW1lU2V0dGluZ3MuSW5mby5Gb250U2l6ZSwgZmlsbDogR2FtZUNvbG9yLldISVRFLCBhbGlnbjogJ2xlZnQnfSk7XG4gICAgdGV4dC5wb3NpdGlvbi5zZXQoKEdhbWVTZXR0aW5ncy5JbmZvLldpZHRoLXRleHQud2lkdGgpLzIsIDEwNik7XG4gICAgR2FtZS5zaXppbmdfaW5mby5hZGRDaGlsZCh0ZXh0KTtcbiAgICAvL1xuICAgIGxldCBzNjogUElYSS5HcmFwaGljcyA9IHMxLmNsb25lKCk7XG4gICAgczYucG9zaXRpb24uc2V0KDAsIDE3NSk7XG4gICAgR2FtZS5zaXppbmdfaW5mby5hZGRDaGlsZChzNik7XG4gICAgLy9cbiAgICB0ZXh0ID0gbmV3IFBJWEkuVGV4dChcIlByZXNzICdFbnRlcicgdG8gYWNjZXB0IHRoZSBib2FyZCBzaXplXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAge2ZvbnRGYW1pbHk6ICdBcmlhbCcsIGZvbnRTaXplOiBHYW1lU2V0dGluZ3MuSW5mby5Gb250U2l6ZSwgZmlsbDogR2FtZUNvbG9yLldISVRFLCBhbGlnbjogJ2xlZnQnfSk7XG4gICAgdGV4dC5wb3NpdGlvbi5zZXQoKEdhbWVTZXR0aW5ncy5JbmZvLldpZHRoLXRleHQud2lkdGgpLzIsIDIxMCk7XG4gICAgR2FtZS5zaXppbmdfaW5mby5hZGRDaGlsZCh0ZXh0KTtcblxuICAgIEdhbWUucGlja2luZ19pbmZvLnZpc2libGUgPSBmYWxzZTtcbiAgICBHYW1lLnBsYXlpbmdfaW5mby52aXNpYmxlID0gZmFsc2U7XG4gICAgR2FtZS5zaXppbmdfaW5mby52aXNpYmxlID0gZmFsc2U7XG5cbiAgICBHYW1lLmluZm8uYWRkQ2hpbGQoR2FtZS5waWNraW5nX2luZm8sIEdhbWUucGxheWluZ19pbmZvLCBHYW1lLnNpemluZ19pbmZvKTtcblxuICAgIEdhbWUuc3RhZ2UuYWRkQ2hpbGQoR2FtZS5pbmZvKTtcblxuICAgIC8vIEluaXRpYWxpemUgdGhlIEdhbWVzU3RhdGVzXG4gICAgR2FtZS5wbGF5aW5nID0gbmV3IFBsYXkoR2FtZS5wbGF5aW5nX2luZm8pO1xuICAgIEdhbWUucGlja2luZyA9IG5ldyBQaWNrKEdhbWUucGlja2luZ19pbmZvKTtcbiAgICBHYW1lLnNpemluZyA9IG5ldyBTaXplKEdhbWUuc2l6aW5nX2luZm8pO1xuXG4gICAgLy8gc3RhcnQgdGhlIGdhbWUgbG9vcFxuICAgIEdhbWUuc3RhdGUgPSBHYW1lLnBpY2tpbmc7XG4gICAgR2FtZS5zdGF0ZS5hY3RpdmUgPSB0cnVlO1xuXG4gICAgUElYSXNvdW5kLnN0b3BBbGwoKTtcbiAgICBQSVhJc291bmQucGxheSgnY2lyY3VpdHNfb3BlcmF0aW9uYWwnKTtcbiAgICBHYW1lLmxvb3AoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgcmVhZG9ubHkgbG9vcCA9ICgpID0+IHtcbiAgICAgIC8vIHN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIG5leHQgYW5pbWF0aW9uIGxvb3BcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShHYW1lLmxvb3ApO1xuXG4gICAgICAvLyBhbnkgcGVyIGZyYW1lIGxvZ2ljXG4gICAgICBHYW1lLnN0YXRlLnVwZGF0ZSgpO1xuXG4gICAgICAvLyB0aGlzIGlzIHRoZSBtYWluIHJlbmRlciBjYWxsIHRoYXQgbWFrZXMgcGl4aSBkcmF3IHlvdXIgY29udGFpbmVyIGFuZCBpdHMgY2hpbGRyZW4uXG4gICAgICBHYW1lLnJlbmRlcmVyLnJlbmRlcihHYW1lLnN0YWdlKTtcbiAgfVxufVxuXG4vLyBraWNrIHRoZSB3aG9sZSB0aGluZyBvZmZcbmxldCBnYW1lOiBHYW1lID0gbmV3IEdhbWUoKTtcbiJdfQ==
