/// <reference path="../typings/index.d.ts" />

import PIXI = require('pixi.js');
import PIXIsound from 'pixi-sound';

enum Direction {
  Up,
  Down,
  Left,
  Right
};

const enum GameColor {
  WHITE   = 0xFFFFFF,
  BLUE    = 0x92c9c4,
  TBLUE   = 0x81D8D0,
  TBLUE2  = 0x60DFE5,
  PURPLE  = 0x220066,
  PURPLE2 = 0x14003d,
  GREEN   = 0x39a720,
  YELLOW  = 0xffdb0f,
  RED     = 0xEE2222
}

type KeyboardEventHandler = (event:KeyboardEvent)=>void;

class Key {
  constructor(public code: number) {
    //Attach event listeners
    window.addEventListener(
      "keydown", this.downHandler, false
    );
    window.addEventListener(
      "keyup", this.upHandler, false
    );
  }

  isDown: boolean = false;
  isUp:   boolean = true;
  press:  ()=>void  = undefined;
  release: ()=>void = undefined;

  //The `downHandler`
  downHandler: KeyboardEventHandler = (event: KeyboardEvent): void => {
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
  upHandler: KeyboardEventHandler = (event: KeyboardEvent): void => {
    if (event.keyCode === this.code) {
      if (this.isDown && this.release) {
        this.release();
        event.preventDefault();
      }
      this.isDown = false;
      this.isUp = true;
    }
  };
}

class Keys {
  static readonly UpArrow: Key     = new Key(38);
  static readonly DownArrow: Key   = new Key(40);
  static readonly LeftArrow: Key   = new Key(37);
  static readonly RightArrow: Key  = new Key(39);
  static readonly Enter: Key       = new Key(13); // select cell or size
  static readonly Spacebar: Key    = new Key(32); // move ahead when Playing
  static readonly AAA: Key         = new Key(65); // Abort Mission [Play]->[Pick]
  static readonly RRR: Key         = new Key(82); // Randomize Direction Arrows
  static readonly SSS: Key         = new Key(83); // reSize the board
  static readonly TTT: Key         = new Key(84);
}

class Sounds {
  static readonly Sound = PIXIsound.Sound;

  constructor() {
    PIXIsound.add({
      circuits_operational: './sounds/circuits_operational.mp3',
      play_a_game:          './sounds/play_a_game.mp3',
      what_doing_dave:      './sounds/what_doing_dave.mp3',
      open_pod_bay_doors:   './sounds/open_pod_bay_doors.mp3',
      disconnect_me: {
        src:                './sounds/disconnect_me.mp3',
        sprites: {
          cannot_allow: {start: 3.4, end: 5.35}
        }},
      picked_up_a_fault:    './sounds/picked_up_a_fault.mp3',
      human_error:          './sounds/human_error.mp3',
      quite_sure:           './sounds/quite_sure.mp3',
      jeopardize_mission:   './sounds/jeopardize_mission.mp3',
      extremely_well:       './sounds/extremely_well.mp3',
      ignition:             './sounds/ignition.mp3',
      functional:           './sounds/functional.mp3',
      fifteen_and_nominal: {
        src:                './sounds/fifteen.mp3',
        sprites: {
          fifteen: {start: 0, end: 1.6},
          nominal: {start: 1.7, end: 6}
        }},
      good_evening_dave: {
        src:                './sounds/good_evening_dave.mp3',
        sprites: {
          smoothly: {start: 1.5, end: 3.251}
        }},
      mission_completed:    './sounds/mission_completed.mp3',
      cant_do_that:         './sounds/cant_do_that.mp3',
      enjoyable_game:       './sounds/enjoyable_game.mp3',
      theme:                './sounds/2001_theme.mp3'
    },
    {
      preload: true
    });

    Keys.TTT.press = ():void => {
      // playing -> picking
      PIXIsound.stopAll();
      PIXIsound.play('theme');
    }
  }

  static readonly LoopingSounds: (string | {alias: string, sprite: string})[] = [
    {alias: 'disconnect_me', sprite: 'cannot_allow'},
    'picked_up_a_fault',
    'human_error',
    'quite_sure',
    'jeopardize_mission'
  ];

  static readonly NonLoopingSounds: (string | {alias: string, sprite: string})[] = [
    {alias: 'fifteen_and_nominal', sprite: 'nominal'},
    'ignition',
    'extremely_well',
    'functional',
    {alias: 'good_evening_dave', sprite: 'smoothly'}
  ];
}

var GameSettings = {
  Game: {
    BackgroundColor:  GameColor.TBLUE,
    SpriteSheetFile:  'images/sprite_sheet/floyd.json',
    TextureFiles: {
      UpArrow:        'arrow.up.64x64.png',
      DownArrow:      'arrow.down.64x64.png',
      LeftArrow:      'arrow.left.64x64.png',
      RightArrow:     'arrow.right.64x64.png',
      Background:     'jupiter.1280x720.jpg'
    }
  },
  GameBoard: {
    Size:             5,
    MaxSize:          9,
    InitialCell:      {i: 2, j: 2},
    Left:             80, // shifts the GameBoard to the left
    BorderWidth:      12,
    BorderRadius:     12,
    BackgroundColor:  GameColor.TBLUE,
    BorderColor:      GameColor.YELLOW
  },
  Cell: {
    Width:            72,
    BorderWidth:      1,
    // BorderWidth:      3,
    ImageScale:       0.5,
    BackgroundColor:  GameColor.PURPLE2,
    BorderColor:      GameColor.WHITE
  },
  Marker: {
    BorderWidth:      8,
    BackgroundColor:  GameColor.WHITE,
    BackgroundAlpha:  0,
    BorderAlpha:      1
  },
  Info: {
    FontSize:         16 as number,
    Top:              50,
    Left:             800,
    Width:            360,
    Height:           566,
    BackgroundColor:  GameColor.PURPLE,
    BackgroundAlpha:  1,
    BorderWidth:      12,
    BorderRadius:     16,
    BorderColor:      GameColor.WHITE,
    BorderAlpha:      1,
    SeparatorWidth:   3
  }
};

// GameStates manage the Info pane, which keys are active, and what those keys do
abstract class GameState {
  _active: boolean = false;
  private readonly info: PIXI.Container = undefined;

  constructor(info: PIXI.Container) {
    this.info = info;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    if (value === this._active) return;

    this._active ? this.deactivate() : this.activate();

    this._active = value;
  }

  activate(): void {
    this.info.visible = true;
  }

  deactivate(): void {
    this.info.visible = false;
  }

  abstract update(): void;
}

// Controls what happens during the 'play' portion of the game
class Play extends GameState {
  looping: boolean = false;
  sound_index: number = 0;

  activate(): void {
    super.activate();

    PIXIsound.stopAll();
    this.looping = Game.board.willLoop(Game.board.currentCell);
    this.looping ? PIXIsound.play('what_doing_dave') : PIXIsound.play('fifteen_and_nominal', 'fifteen');
    this.sound_index = 0;

    Keys.Spacebar.press = ():void => {
      PIXIsound.stopAll();

      // Loop through sounds on each step along the path
      if (Game.board.index_on_board(Game.board.next_cell(Game.board.currentCell))) {
        Game.board.currentCell = Game.board.next_cell(Game.board.currentCell);
        if (this.looping) {
          if (typeof Sounds.LoopingSounds[this.sound_index] === 'string') {
            PIXIsound.play(Sounds.LoopingSounds[this.sound_index] as string);
          }
          else {
            let sprite = Sounds.LoopingSounds[this.sound_index] as {alias: string, sprite: string};
            PIXIsound.play(sprite.alias, sprite.sprite);
          }
          this.sound_index = (this.sound_index+1)%Sounds.LoopingSounds.length;
        }
        else {
          if (typeof Sounds.NonLoopingSounds[this.sound_index] === 'string') {
            PIXIsound.play(Sounds.NonLoopingSounds[this.sound_index] as string);
          }
          else {
            let sprite = Sounds.NonLoopingSounds[this.sound_index] as {alias: string, sprite: string};
            PIXIsound.play(sprite.alias, sprite.sprite);
          }
          this.sound_index = (this.sound_index+1)%Sounds.NonLoopingSounds.length;
        }
      }
      else {
        PIXIsound.play('mission_completed');
        Game.state.active = false;
        Game.state = Game.picking;
        Game.state.active = true;
      }
    }

    Keys.AAA.press = ():void => {
      // playing -> picking
      PIXIsound.stopAll();
      PIXIsound.play('open_pod_bay_doors');
      Game.state.active = false;
      Game.state = Game.picking;
      Game.state.active = true;
    }
  }

  deactivate(): void {
    super.deactivate();

    Keys.Spacebar.press = null;
    Keys.AAA.press = null;
  }

  update(): void {};
}

// control what happens while picking the starting cell
class Pick extends GameState {
  activate(): void {
    super.activate();

    Keys.UpArrow.press = ():void => {
      Game.board.currentCell = {i: Game.board.currentCell.i, j: (Game.board.size+Game.board.currentCell.j-1)%Game.board.size};
    }

    Keys.DownArrow.press = ():void => {
      Game.board.currentCell = {i: Game.board.currentCell.i, j: (Game.board.currentCell.j+1)%Game.board.size};
    }

    Keys.LeftArrow.press = ():void => {
      Game.board.currentCell = {i: (Game.board.size+Game.board.currentCell.i-1)%Game.board.size, j: Game.board.currentCell.j};
    }

    Keys.RightArrow.press = ():void => {
      Game.board.currentCell = {i: (Game.board.currentCell.i+1)%Game.board.size, j: Game.board.currentCell.j};
    }

    Keys.Enter.press = ():void => {
      // Switch from Picking to Playing
      Game.state.active = false;
      Game.state = Game.playing;
      Game.state.active = true;
    }

    Keys.SSS.press = ():void => {
      // reSize the board
      Game.state.active = false;
      Game.state = Game.sizing;
      Game.state.active = true;
    }

    Keys.RRR.press = ():void => {
      // re-randomize the board
      let size: number = Game.board.size;
      let ci: CellIndex = Game.board.currentCell;

      Game.stage.removeChild(Game.board);
      Game.board = new GameBoard(size);
      Game.board.currentCell = ci;
      Game.board.position.set((Game.renderer.width
                                  - GameSettings.Info.Width
                                  - GameSettings.Info.BorderWidth)/2
                                - Game.board.width/2 - GameSettings.GameBoard.Left,
                              (Game.renderer.height - Game.board.height)/2);
      Game.stage.addChild(Game.board);
    }
  }

  deactivate(): void {
    super.deactivate();

    Keys.UpArrow.press = null;
    Keys.DownArrow.press = null;
    Keys.LeftArrow.press = null;
    Keys.RightArrow.press = null;
    Keys.Enter.press = null;
    Keys.SSS.press = null;
    Keys.RRR.press = null;
  }

  update(): void {};
}

// control what happens while reSizing the GameBoard
class Size extends GameState {
  activate(): void {
    super.activate();

    Keys.UpArrow.press = ():void => {
      let size: number = Game.board.size;

      if (size >= GameSettings.GameBoard.MaxSize) {
        PIXIsound.stopAll();
        PIXIsound.play('cant_do_that');
        return;
     }

      Game.stage.removeChild(Game.board);
      Game.board = new GameBoard(size+1);
      Game.board.position.set((Game.renderer.width
                                  - GameSettings.Info.Width
                                  - GameSettings.Info.BorderWidth)/2
                                - Game.board.width/2 - GameSettings.GameBoard.Left,
                              (Game.renderer.height - Game.board.height)/2);
      Game.stage.addChild(Game.board);
    }

    Keys.DownArrow.press = ():void => {
      let size: number = Game.board.size;

      if (size <= 1) {
        PIXIsound.stopAll();
        PIXIsound.play('cant_do_that');
        return;
      }

      Game.stage.removeChild(Game.board);
      Game.board = new GameBoard(size-1);
      Game.board.position.set((Game.renderer.width
                                  - GameSettings.Info.Width
                                  - GameSettings.Info.BorderWidth)/2
                                - Game.board.width/2 - GameSettings.GameBoard.Left,
                              (Game.renderer.height - Game.board.height)/2);
      Game.stage.addChild(Game.board);
    }

    Keys.Enter.press = ():void => {
      // Switch from Sizing to Picking
      Game.state.active = false;
      Game.state = Game.picking;
      Game.state.active = true;
    }
  }

  deactivate(): void {
    super.deactivate();

    Keys.UpArrow.press = null;
    Keys.DownArrow.press = null;
    Keys.Enter.press = null;
  }

  update(): void {};
}

// index of cells on the board
type CellIndex = {i:number, j:number};

// a square on the board
class GameCell extends PIXI.Container
{
  private background: PIXI.Graphics = new PIXI.Graphics();
  private arrow:      PIXI.Sprite = undefined;

  constructor(public direction:Direction)
  {
    super();

    this.background.beginFill(GameSettings.Cell.BackgroundColor);
    this.background.lineStyle(GameSettings.Cell.BorderWidth, GameSettings.Cell.BorderColor, 1);
    this.background.drawRect(0, 0, GameSettings.Cell.Width, GameSettings.Cell.Width);
    this.background.endFill();
    this.addChild(this.background);

    this.arrow = new PIXI.Sprite(Game.arrow_textures[this.direction]);
    this.arrow.anchor.set(0.5,0.5);
    this.arrow.position.set(GameSettings.Cell.Width/2,
                            GameSettings.Cell.Width/2);
    this.arrow.scale.set(GameSettings.Cell.ImageScale, GameSettings.Cell.ImageScale);
    this.addChild(this.arrow);
  }
}

class GameBoard extends PIXI.Container {
  protected _border: PIXI.Graphics = undefined;

  protected cells:          GameCell[][]  = [] as GameCell[][];
  protected _currentCell:   CellIndex     = {i: 0, j: 0};

  public    marker:         PIXI.Container = new PIXI.Container();
  protected _red_marker:    PIXI.Graphics = new PIXI.Graphics();
  protected _yellow_marker: PIXI.Graphics = new PIXI.Graphics();
  protected _green_marker:  PIXI.Graphics = new PIXI.Graphics();

  private make_border(c: GameColor): PIXI.Graphics {
    let border:PIXI.Graphics = new PIXI.Graphics();

    border.beginFill(GameSettings.GameBoard.BackgroundColor, 1);
    border.lineStyle(GameSettings.GameBoard.BorderWidth, c, 1);
    border.drawRect(0, 0,
      GameSettings.Cell.Width*this.size + GameSettings.GameBoard.BorderWidth + GameSettings.Cell.BorderWidth,
      GameSettings.Cell.Width*this.size + GameSettings.GameBoard.BorderWidth + GameSettings.Cell.BorderWidth);
    border.endFill();

    return border;
  }

  private make_marker(c: GameColor): PIXI.Graphics {
    let marker:PIXI.Graphics = new PIXI.Graphics();

    marker.beginFill(GameSettings.Marker.BackgroundColor, GameSettings.Marker.BackgroundAlpha);
    marker.lineStyle(GameSettings.Marker.BorderWidth, c, GameSettings.Marker.BorderAlpha);
    marker.drawRect(0, 0,
                    GameSettings.Cell.Width - GameSettings.Cell.BorderWidth - GameSettings.Marker.BorderWidth,
                    GameSettings.Cell.Width - GameSettings.Cell.BorderWidth - GameSettings.Marker.BorderWidth);
    marker.endFill();

    return marker;
  }

  constructor(public size: number) {
    super();

    // set up the boarder around the board
    this._border = this.make_border(GameColor.YELLOW);

    this.addChild(this._border);

    // set up the cells of the board
    for (let i=0; i < size; i++) {
      this.cells[i] = [] as GameCell[];

      for (let j=0; j < size; j++) {
        let cell_direction:Direction = Math.floor(Math.random() * 4);
        this.cells[i].push(new GameCell(cell_direction));

        this.position_cell({i, j});
        this.addChild(this.cells[i][j]);
      };
    };

    // set up the marker and the three sub-markers

    this._red_marker = this.make_marker(GameColor.RED);
    this._yellow_marker = this.make_marker(GameColor.YELLOW);
    this._green_marker = this.make_marker(GameColor.GREEN);

    this._red_marker.visible = false;
    this._green_marker.visible = false;

    this.marker.addChild(this._red_marker, this._yellow_marker, this._green_marker);

    this.addChild(this.marker);
    this.place_marker_at(this.currentCell);
  }

  public get currentCell(): CellIndex {
    return {...this._currentCell};
  }

  public set currentCell(value: CellIndex) {
    this.place_marker_at(value);
    this._currentCell = {...value};
  }

  private position_cell(ci: CellIndex): void {
    this.cells[ci.i][ci.j].position.set(
      GameSettings.GameBoard.BorderWidth/2 + GameSettings.Cell.BorderWidth/2 + GameSettings.Cell.Width*ci.i,
      GameSettings.GameBoard.BorderWidth/2 + GameSettings.Cell.BorderWidth/2 + GameSettings.Cell.Width*ci.j);
  }

  private place_marker_at(ci: CellIndex) {
    let cp: PIXI.Point = this.cells[ci.i][ci.j].position;

    this.marker.position.set(cp.x + GameSettings.Cell.BorderWidth/2 + GameSettings.Marker.BorderWidth/2,
                             cp.y + GameSettings.Cell.BorderWidth/2 + GameSettings.Marker.BorderWidth/2);

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
  public next_cell(ci: CellIndex): CellIndex {
    switch (this.cells[ci.i][ci.j].direction) {
      case Direction.Up:
        return {i: ci.i, j: ci.j-1};

      case Direction.Down:
        return {i: ci.i, j: ci.j+1};

      case Direction.Left:
        return {i: ci.i-1, j: ci.j};

      case Direction.Right:
        return {i: ci.i+1, j: ci.j};
    }
  }

  public index_on_board(ci: CellIndex): boolean {
    return ((ci.i >= 0) && (ci.i < this.size) && (ci.j >= 0) && (ci.j < this.size));
  }

  // Implementation of Floyd’s Cycle-Finding Algorithm
  // based on http://www.geeksforgeeks.org/write-a-c-function-to-detect-loop-in-a-linked-list/
  //
  public willLoop(ci: CellIndex): boolean {
    let tortoise: CellIndex = {...ci};
    let leap:     CellIndex = {...ci};
    let frog:     CellIndex = {...ci};

    while (this.index_on_board(tortoise) &&
           this.index_on_board(leap=this.next_cell(frog)) &&
           this.index_on_board(frog=this.next_cell(leap)))
    {
      // if either leap or frog catch up to tortoise, there is a loop
      if ((tortoise.i === leap.i) && (tortoise.j === leap.j)) return true;
      if ((tortoise.i === frog.i) && (tortoise.j === frog.j)) return true;

      tortoise = this.next_cell(tortoise);
    }

    // one of the racers went off the board; no loop
    return false;
  }
}

class Game {
  // GameStates
  static playing:  Play = undefined;
  static picking:  Pick = undefined;
  static sizing:   Size = undefined;

  static state: GameState = undefined;
  static board: GameBoard = undefined;

  // Context dependent usage information
  static info: PIXI.Container = undefined;

  static readonly picking_info: PIXI.Container = new PIXI.Container();
  static readonly playing_info: PIXI.Container = new PIXI.Container();
  static readonly sizing_info: PIXI.Container = new PIXI.Container();

  static readonly renderer: PIXI.WebGLRenderer = new PIXI.WebGLRenderer(1280, 720);
  static readonly stage: PIXI.Container = new PIXI.Container();

  static readonly arrow_textures:PIXI.Texture[] = [];

  static readonly _sounds = new Sounds();

  constructor() {
    Game.renderer.backgroundColor = GameSettings.Game.BackgroundColor;
    document.body.appendChild(Game.renderer.view);

    PIXI.loader
      .add(GameSettings.Game.SpriteSheetFile)
      .load(this.initializeAndRunGame);
  }

  private initializeAndRunGame = (loader:PIXI.loaders.Loader, resources:any) => {
    // load the texture resources
    var id = PIXI.loader.resources[GameSettings.Game.SpriteSheetFile].textures;

    Game.arrow_textures[Direction.Up]    = id[GameSettings.Game.TextureFiles.UpArrow];
    Game.arrow_textures[Direction.Down]  = id[GameSettings.Game.TextureFiles.DownArrow];
    Game.arrow_textures[Direction.Left]  = id[GameSettings.Game.TextureFiles.LeftArrow];
    Game.arrow_textures[Direction.Right] = id[GameSettings.Game.TextureFiles.RightArrow];

    // Add the background image
    Game.stage.addChild(new PIXI.Sprite(id[GameSettings.Game.TextureFiles.Background]));

    // Setup the game board
    Game.board = new GameBoard(GameSettings.GameBoard.Size);
    Game.board.currentCell = GameSettings.GameBoard.InitialCell;

    // use Game.board.width and .height as these are dynamic based on the size of the board
    Game.board.position.set((Game.renderer.width
                                - GameSettings.Info.Width
                                - GameSettings.Info.BorderWidth)/2
                              - Game.board.width/2 - GameSettings.GameBoard.Left,
                            (Game.renderer.height - Game.board.height)/2);
    Game.stage.addChild(Game.board);

    // Set up the Info Pane
    // todo: could pull this into a function or class
    Game.info = new PIXI.Container();
    let border: PIXI.Graphics = new PIXI.Graphics();
    border.beginFill(GameSettings.Info.BackgroundColor, GameSettings.Info.BackgroundAlpha);
    border.lineStyle(GameSettings.Info.BorderWidth, GameSettings.Info.BorderColor, GameSettings.Info.BorderAlpha);
    border.drawRoundedRect(0, 0,
                           GameSettings.Info.Width, GameSettings.Info.Height,
                           GameSettings.Info.BorderRadius);
    border.endFill();

    Game.info.position.set(GameSettings.Info.Left, (Game.renderer.height - GameSettings.Info.Height)/2,);


    let text = new PIXI.Text("HAL'lo and Welcome",
                             {fontFamily : 'Arial', fontSize: 24, fill : GameColor.WHITE, align : 'center'});
    text.position.set((GameSettings.Info.Width-text.width)/2, 20);
    Game.info.addChild(border, text);

    let s0: PIXI.Graphics = new PIXI.Graphics();
    s0.lineStyle(GameSettings.Info.BorderWidth, GameSettings.Info.BorderColor, GameSettings.Info.BorderAlpha);
    s0.moveTo(0, 0);
    s0.lineTo(GameSettings.Info.Width, 0);
    s0.position.set(0, 72);
    Game.info.addChild(s0);

    // Info for Picking mode
    text = new PIXI.Text("Use Arrow-Keys to move the starting position",
                         {fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: GameColor.WHITE, align: 'left'});
    text.position.set((GameSettings.Info.Width-text.width)/2, 116);
    Game.picking_info.addChild(text);
    //
    text = new PIXI.Text("Starting from a red bordered cell\nwill enter a loop",
                         {fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: GameColor.WHITE, align: 'left'});
    text.position.set(60, 146);
    Game.picking_info.addChild(text);
    //
    text = new PIXI.Text("Starting from a green bordered cell\nwill exit the board",
                         {fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: GameColor.WHITE, align: 'left'});
    text.position.set(60, 196);
    Game.picking_info.addChild(text);
    //
    let s1: PIXI.Graphics = new PIXI.Graphics();
    s1.lineStyle(GameSettings.Info.SeparatorWidth, GameSettings.Info.BorderColor, GameSettings.Info.BorderAlpha);
    s1.moveTo(0, 0);
    s1.lineTo(GameSettings.Info.Width, 0);
    s1.position.set(0, 272);
    Game.picking_info.addChild(s1);
    //
    text = new PIXI.Text("Press 'Enter' to begin following the arrows",
                         {fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: GameColor.WHITE, align: 'left'});
    text.position.set((GameSettings.Info.Width-text.width)/2, 313);
    Game.picking_info.addChild(text);
    //
    let s3: PIXI.Graphics = s1.clone();
    s3.position.set(0, 372);
    Game.picking_info.addChild(s3);
    //
    text = new PIXI.Text("Press 'R' to randomize the arrows",
                         {fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: GameColor.WHITE, align: 'left'});
    text.position.set((GameSettings.Info.Width-text.width)/2, 411);
    Game.picking_info.addChild(text);
    //
    let s4: PIXI.Graphics = s1.clone();
    s4.position.set(0, 472);
    Game.picking_info.addChild(s4);
    //
    text = new PIXI.Text("Press 'S' to resize the board",
                         {fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: GameColor.WHITE, align: 'left'});
    text.position.set((GameSettings.Info.Width-text.width)/2, 506);
    Game.picking_info.addChild(text);

    // Info for Playing mode
    text = new PIXI.Text("Press 'Spacebar' to advance the marker",
                         {fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: GameColor.WHITE, align: 'left'});
    text.position.set((GameSettings.Info.Width-text.width)/2, 116);
    Game.playing_info.addChild(text);
    //
    let s5: PIXI.Graphics = s1.clone();
    s5.position.set(0, 175);
    Game.playing_info.addChild(s5);
    //
    text = new PIXI.Text("Press 'A' to abort the mission",
                         {fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: GameColor.WHITE, align: 'left'});
    text.position.set((GameSettings.Info.Width-text.width)/2, 210);
    Game.playing_info.addChild(text);

    // Info for Sizing mode
    text = new PIXI.Text("Use 'Up' and 'Down' Arrow-Keys\nto change the size of the board",
                         {fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: GameColor.WHITE, align: 'left'});
    text.position.set((GameSettings.Info.Width-text.width)/2, 106);
    Game.sizing_info.addChild(text);
    //
    let s6: PIXI.Graphics = s1.clone();
    s6.position.set(0, 175);
    Game.sizing_info.addChild(s6);
    //
    text = new PIXI.Text("Press 'Enter' to accept the board size",
                         {fontFamily: 'Arial', fontSize: GameSettings.Info.FontSize, fill: GameColor.WHITE, align: 'left'});
    text.position.set((GameSettings.Info.Width-text.width)/2, 210);
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

    PIXIsound.stopAll();
    PIXIsound.play('circuits_operational');
    Game.loop();
  }

  protected static readonly loop = () => {
      // start the timer for the next animation loop
      requestAnimationFrame(Game.loop);

      // any per frame logic
      Game.state.update();

      // this is the main render call that makes pixi draw your container and its children.
      Game.renderer.render(Game.stage);
  }
}

// kick the whole thing off
let game: Game = new Game();
