var noOfOpenTile= 0;//range between 0-2 denoting numbers of tiles open at a moment
var tile1;// denote first tile that was opened
var tile2;// denote second tile that was opened

var grid = {
   

    initialize: function(options) {
        this.options = options;
        this.inTransition = false;
        this.gridSize = options.gridSize;
        this.numOfTiles = this.gridSize*this.gridSize;
        this.el = options.el;
        this.createTiles();
        this.open = 0;
        this.solved = 0;
        for(var i=0 ; i < this.numOfTiles ; i++) {
            if(this.tiles[i].state === "open") {
                this.open++;
            } else if(this.tiles[i].state === "solved") {
                this.solved++;
            }
        }
        game.updateStatusGrid(this.blocks);
        this.isGameOn();
    },

    isGameOn: function() {
        if(this.solved === this.numOfTiles) {
            game.gameOver();
        }
    },

    tileClicked: function(self) {
        
        if(noOfOpenTile< 2 && self!= tile1){
            self.flip();

            noOfOpenTile++;
            if(noOfOpenTile=== 1){
                tile1= self;
            }
            else{
                tile2= self;
                if(tile1.val=== tile2.val){
                    tile1.solve();
                    this.blocks[tile1.index].state= "solved";
                    
                    tile2.solve();
                    this.blocks[tile2.index].state= "solved";
                    
                    grid.solved+=2;
                    noOfOpenTile-=2;
                    this.isGameOn();
                    
                    game.status.grid= this.blocks;
                    game.setStatus();
                }
                else{
                    setTimeout(function(){
                    tile1.flip();
                    tile2.flip();
                    tile1= null;
                    tile2= null;
                    noOfOpenTile-= 2;                        
                    }, 1000)                   
                }
            }

        } 
    },

    shuffle: function(arr){
        var no1;
        var no2;
        var temp;

        no1= Math.floor(Math.random()* (this.numOfTiles));
        no2= Math.floor(Math.random()* (this.numOfTiles));
        
        temp= arr[no1];
        arr[no1]= arr[no2];
        arr[no2]= temp;
    },

    createVals: function() {
        var vals= [];
        for(var j=1; j<=this.numOfTiles/2; j++){
            vals.push(j);
            vals.push(j);

        }
        
        for(var i=0; i<this.numOfTiles; i++){
            this.shuffle(vals);
        }

        return vals;

    },

    createTiles: function() {
        this.el.innerHTML = "";
        if(!this.options.blocks) {
            this.vals = this.createVals();
            this.blocks = [];
            for(var i=0;i<this.numOfTiles;i++) {
                this.blocks.push({
                    val: this.vals[i],
                    state: "closed"
                });
            }
        } else {
            this.blocks = this.options.blocks;
        }
        this.tiles = [];
        for(i=0;i<this.numOfTiles;i++) {
            if(i%this.gridSize === 0) {
                this.el.appendChild(document.createElement("br"));
            }
            this.tiles.push(new Tile({
                val: this.blocks[i].val,
                state: this.blocks[i].state,
                grid: this.el,
                index: i
            }));
        }
    }
};

var Tile = function(options) {

    var tile = {

        initialize: function(options) {
            this.options = options;
            this.val = options.val;
            this.index = options.index;
            this.state = typeof options.state ==="undefined" ? "closed" : options.state;//open, closed, solved
            this.createDomElement();
            this.events();
        },

        events: function() {
            var self = this;
            if(this.state !== "solved") {
                this.el.addEventListener('click', function(e) {
                    grid.tileClicked(self);
                });
            }
        },

        flip: function() {
            if(this.state !== "solved") {
                this.el.classList.remove("open");
                this.el.classList.remove("closed");
                if(this.state === "open") {
                    this.state = "closed";
                } else if(this.state === "closed") {
                    this.state = "open";
                }
                this.el.classList.add(this.state);
            }
            return this.state;
        },

        solve: function() {
            this.el.classList.remove("open");
            this.el.classList.remove("closed");
            this.el.classList.add("solved");
            this.state = "solved";
        },

        createDomElement: function() {
            this.el = document.createElement("div");
            this.el.innerHTML = "<span>" + (this.val) + "</span>";
            this.el.classList.add("tile");
            this.el.classList.add(this.state);
            this.options.grid.appendChild(this.el);
        }
    };

    tile.initialize(options);
    return tile;
};

var game = {

    initialize: function() {
        this.getDomElements();
        this.events();
        this.getStatus();
        this.startGame();


    },

    events: function() {
        var self = this;
        this.newGameButton.addEventListener('click', function(e) {
            self.newGame();
        });
    },

    getDomElements: function() {
        this.grid = document.getElementsByClassName('grid')[0];
        this.newGameButton = document.getElementsByClassName('newGameButton')[0];
    },

    updateStatusGrid: function(grid) {
        this.status.grid = grid;
        this.setStatus();
    },

    getStatus: function() {//called at start of game to initialize status of game;
       
        if(localStorage.status== null){//checks wheather page was loaded first time?
           this.status = {
               gameOn: false,
               grid : null,
               gridSize: 0
           };
        }
        else{
        //retrieve the status of game from localStorage;
            this.status= JSON.parse(localStorage.getItem("status"));         
        }
    },

    setStatus: function() {
      
            localStorage.setItem("status", JSON.stringify(this.status));
    },

    getGridSize: function() {
        var gridSize = 0;
        while(typeof gridSize !== "number" || gridSize < 2 || gridSize > 8 || gridSize%2 !== 0) {
            gridSize = prompt("What size do you want side of grid to be? (enter an even number between 2 and 8)", 4);
            gridSize = Number(gridSize);
        }
        return gridSize;
    },

    newGame: function() {
        if(this.status.gameOn === false) {
            this.startGame();
        } else {
            var ans = confirm("Are you sure you want to abandon this game and start another?");
            if(ans === true) {
                this.status.gameOn = false;
                this.startGame();
            }
        }
    },

    startGame: function() {
        if(this.status.gameOn === false) {
            this.status.gridSize = this.getGridSize();
            this.status.gameOn = true;
            this.status.grid = null;
            this.setStatus();
        }
        grid.initialize({
            gridSize: this.status.gridSize,
            el: this.grid,
            blocks: this.status.grid
        });
    },

    gameOver: function() {
        alert("Congratulations. You win!!");
        this.status.gameOn  = false;
        this.setStatus();
    }
};

document.body.onload = function(e) {
    game.initialize();
};