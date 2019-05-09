function pac_map(){
    this.basex = 0
    this.basey = 0
    this.pacimg = 1
    this.pac_xdir = 0
    this.pac_ydir = 0
    this.pac_y = this.basey + 256
    this.pac_x = this.basex + 224
    this.ghost_dir_y = [-1,-1,-1,-1]
    this.ghost_dir_x = [0,0,0,0]
    this.ghost_x=[]
    this.ghost_y=[]
    this.move = 1
    this.frame = 0
    this.score = 0
    this.first = true
    this.processed_map = []
    this.pacman_interval = ""
    this.proc_map = function(map, width){
        var post_map = [];
        for(var i = 0; i < map.length/width; i++){
            var temp_row = []
            for(var j = 0; j < width; j++){
                temp_row[j] = map[i*width+j]
            }
            post_map[i] = temp_row
        }
        return post_map
    }
    this.block = function(){
        if((this.pac_x - this.basex) % 16 == 0){
            if((this.pac_y - this.basey) % 16 == 0){
                if(this.processed_map[(this.pac_y - this.basey)/16 + this.pac_ydir][(this.pac_x - this.basex)/16 + this.pac_xdir] == 0){
                    this.move = 0; 
                    console.log("hit")       
                }
            }
        }
    }
    this.eat = function(){
        var curx = this.pac_x - this.basex;
        var cury = this.pac_y - this.basey;
        if(curx % 16 == 8 || cury % 16 == 8){
            if( this.pac_ydir == 1){
                if(this.processed_map[(cury -8)/16 + this.pac_ydir][(curx)/16] == 9){
                    this.score += 100
                    this.processed_map[(cury -8)/16 + this.pac_ydir][(curx)/16] = 1;
                    document.getElementById("dot" + ((cury -8)/16 +this.pac_ydir) + "_" + (curx/16)).className = "wall2";
                }
            }else if(this.pac_ydir == -1){
                if(this.processed_map[(cury -8)/16][curx/16] == 9){
                    this.score += 100          
                    this.processed_map[(cury -8)/16][curx/16] = 1;
                    document.getElementById("dot" + ((cury -8)/16) + "_" + ((curx)/16)).className = "wall2";
                }
            }
            else if (this.pac_xdir==1){
                if(this.processed_map[(pac_y - basey)/16][(curx - 8)/16 + this.pac_xdir] == 9){
                    this.score += 100
                    this.processed_map[(pac_y - basey)/16][(curx - 8)/16 + this.pac_xdir] = 1;
                    document.getElementById("dot" + ((cury)/16) + "_" + ((curx - 8)/16 + this.pac_xdir)).className = "wall2";
                }
            }else if(this.pac_xdir==-1){
                if(this.processed_map[(cury)/16][(curx - 8)/16] == 9){
                    this.score += 100
                    this.processed_map[(cury)/16][(curx - 8)/16] = 1;
                    document.getElementById("dot" + (cury/16) + "_" + ((curx - 8)/16)).className = "wall2";
                }
            }
        document.getElementById("score").innerHTML = this.score
    }
    }
    this.pac_move = function(){
        if(this.move == 1){
            console.log("should be moving")
            this.pac_x += this.pac_xdir * 2;
            this.pac_y += this.pac_ydir * 2;
            document.getElementById("pacman").style.left = this.pac_x + "px";
            document.getElementById("pacman").style.top = this.pac_y + "px";
            console.log("we made it")
            }
            for(var i = 0; i < this.ghost_x.length; i++){
                if(this.ghost_x[i] <= this.pac_x + 16 && this.ghost_x[i] >= this.pac_x){
                    if(this.ghost_y[i] <= this.pac_y + 16 && this.ghost_y[i] >= this.pac_y){
                    console.log('death1')//death
                    this.pac_death()
                }else if(this.ghost_y[i] + 16 <= this.pac_y + 16 && this.ghost_y[i] + 16 >= this.pac_y){
                    console.log('death2')
                    this.pac_death()
                }
            }
            else if(this.ghost_x[i] + 16 <= this.pac_x + 16 && this.ghost_x[i] + 16 >= this.pac_x){
                if(this.ghost_y[i] <= this.pac_y + 16 && this.ghost_y[i] >= this.pac_y){
                    console.log('death1')//death
                    this.pac_death()
                }else if(this.ghost_y[i] + 16 <= this.pac_y + 16 && this.ghost_y[i] + 16 >= this.pac_y){
                    console.log('death2')
                    this.pac_death()
                }
            }
            else if(this.ghost_y[i] <= this.pac_y + 16 && this.ghost_y[i] >= this.pac_y){
                if(this.ghost_x[i] <= this.pac_x + 16 && this.ghost_x[i] >= this.pac_x){
                    console.log('death3')
                    this.pac_death()
                }else if(this.ghost_x[i] + 16 <= this.pac_x && this.ghost_x[i] + 16 >= this.pac_x){
                    console.log('death4')//death
                    this.pac_death()
                }
            }
            else if(this.ghost_y[i] + 16 <= this.pac_y + 16 && this.ghost_y[i] + 16 >= this.pac_y){
                if(this.ghost_x[i] <= this.pac_x + 16 && this.ghost_x[i] >= this.pac_x){
                    console.log('death3')
                    this.pac_death()
                }
                else if(this.ghost_x[i] + 16 <= this.pac_x && this.ghost_x[i] + 16 >= this.pac_x){
                    console.log('death4')//death
                    this.pac_death()
                }
            }
        }
    }
    this.ghost_move = function(){
        for(var i = 0; i < this.ghost_x.length; i++){
            this.ghost_x[i] += this.ghost_dir_x[i] * 2;
            this.ghost_y[i] += this.ghost_dir_y[i] * 2;
            document.getElementById("ghost" + i).style.left = this.ghost_x[i] + "px";
            document.getElementById("ghost" + i).style.top = this.ghost_y[i] + "px";
            if((this.ghost_x[i]-this.basex) % 16 == 0){
                if((this.ghost_y[i]-this.basey) % 16 == 0){
                var temp_dir = []
                if(this.ghost_dir_x[i] != 0){
                    if(this.processed_map[(this.ghost_y[i]-this.basey)/16][(this.ghost_x[i]-this.basex)/16 + this.ghost_dir_x[i]] == 0){
                    if(this.processed_map[(this.ghost_y[i]-this.basey)/16 - 1][(this.ghost_x[i]-this.basex)/16] != 0){
                        temp_dir[temp_dir.length] = -1
                    }
                    if(this.processed_map[(this.ghost_y[i]-this.basey)/16 + 1][(this.ghost_x[i]-this.basex)/16] != 0){
                        temp_dir[temp_dir.length] = 1
                    }
                    this.ghost_dir_x[i] = 0;
                    this.ghost_dir_y[i] = temp_dir[Math.round(Math.random()*(temp_dir.length-1))];
                    }
                }
                else if(this.ghost_dir_y[i] != 0){
                    if(this.processed_map[(this.ghost_y[i]-this.basey)/16 + this.ghost_dir_y[i]][(this.ghost_x[i]-this.basex)/16] == 0){
                    if(this.processed_map[(this.ghost_y[i]-this.basey)/16][(this.ghost_x[i]-this.basex)/16 - 1] != 0){
                        temp_dir[temp_dir.length] = -1
                    }
                    if(this.processed_map[(this.ghost_y[i]-this.basey)/16][(this.ghost_x[i]-this.basex)/16 + 1] != 0){
                        temp_dir[temp_dir.length] = 1
                    }
                    this.ghost_dir_y[i] = 0;
                    this.ghost_dir_x[i] = temp_dir[Math.round(Math.random()*(temp_dir.length-1))];
                    }
                }
                }
            }
            
            
            }
    }
    this.pacman_upd = function(){
        block();
        pac_move();
        eat();
        ghost_move();
    }
    this.direction= function(event){
        if(this.first){
            switch(event) {
            case 0:
            if((this.pac_y-this.basey)%16 == 0 && (this.pac_x-this.basex)%16 == 0){
                if(this.processed_map[Math.floor((this.pac_y - this.basey)/16 - 1)][Math.floor((this.pac_x - this.basex)/16)]!=0 && this.processed_map[Math.floor((this.pac_y - this.basey)/16 - 1)][Math.floor((this.pac_x - this.basex)/16)]!=8){
                    this.pac_xdir = 0;
                    this.pac_ydir = -1;
                    this.move = 1;
                    document.getElementById("pacman").style.transform = "rotate(-90deg)";          
                }
            }
            else if (this.pac_ydir == 1){
                this.pac_xdir = 0;
                this.pac_ydir = -1;
                this.move = 1;
                document.getElementById("pacman").style.transform = "rotate(-90deg)";
            }
            break;
            case 1:
            if((this.pac_y-this.basey)%16 == 0 && (this.pac_x-this.basex)%16 == 0){
                if(this.processed_map[Math.floor((this.pac_y - this.basey)/16 + 1)][Math.floor((this.pac_x - this.basex)/16)]!=0 && this.processed_map[Math.floor((this.pac_y - this.basey)/16 - 1)][Math.floor((this.pac_x - this.basex)/16)]!=8){
                    this.pac_xdir = 0;
                    this.pac_ydir = 1;
                    this.move = 1;
                    document.getElementById("pacman").style.transform = "rotate(90deg)";
                }
            }
            else if (this.pac_ydir == -1){
                this.pac_xdir = 0;
                this.pac_ydir = 1;
                this.move = 1;
                document.getElementById("pacman").style.transform = "rotate(90deg)";
            }
            break;
            case 2:
            if((this.pac_y-this.basey)%16 == 0 && (this.pac_x-this.basex)%16 == 0){
                if(this.processed_map[Math.floor((this.pac_y - this.basey)/16)][Math.floor((this.pac_x - this.basex)/16 - 1)]!=0){
                    this.pac_xdir = -1;
                    this.pac_ydir = 0;
                    this.move = 1;
                    document.getElementById("pacman").style.transform = "rotate(180deg)";
                }
            }
            else if (this.pac_xdir == 1){
                this.pac_xdir = -1;
                this.pac_ydir = 0;
                this.move = 1;
                document.getElementById("pacman").style.transform = "rotate(180deg)";
            }
            break;
            case 3:
            if((this.pac_y-this.basey)%16 == 0 && (this.pac_x-this.basex)%16 == 0){
                if(this.processed_map[Math.floor((this.pac_y - this.basey)/16)][Math.floor((this.pac_x - this.basex)/16 + 1)]!=0){
                    this.pac_xdir = 1;
                    this.pac_ydir = 0;
                    this.move = 1;
                    document.getElementById("pacman").style.transform = "rotate(0deg)";
                }
            }
            else if (this.pac_xdir == -1){
                this.pac_xdir = 1;
                this.pac_ydir = 0;
                this.move = 1;
                document.getElementById("pacman").style.transform = "rotate(0deg)";
            }
            break;
            }
        }
    }
    this.pac_death = function(){
        if (this.first) {
            this.first = false;
            document.getElementById("pacman").src = "Assets/death.gif"
            document.getElementById("pacman").style.transform = "rotate(0deg)";
            this.move = 0
            console.log("I'm hit")
            clearInterval(this.pacman_upd);      
        }
    }
    this.pacman_map = function(draw_map, width){
        var world_map = document.getElementById("map")
        var gc = 0;
        for(var i = 0; i < draw_map.length; i++){
            for(var j = 0; j < width; j++){
                if(draw_map[i][j] == 0 ){
                    world_map.innerHTML += "<div class='wall1' id='wall" +i.toString() + "_" + j.toString() + "'></img>";
                    document.getElementById("wall" + i.toString() + "_" + j.toString()).style.left = (j*16 + this.basex) +"px";
                    document.getElementById("wall" + i.toString() + "_" + j.toString()).style.top = (i*16 + this.basey) +"px";
                }else if(draw_map[i][j] == 8){
                    world_map.innerHTML += "<div class='wall3' id='wall" +i.toString() + "_" + j.toString() + "'></img>";
                    document.getElementById("wall" + i.toString() + "_" + j.toString()).style.left = (j*16 + this.basex) +"px";
                    document.getElementById("wall" + i.toString() + "_" + j.toString()).style.top = (i*16 + this.basey) +"px";
                }
                if(draw_map[i][j] == 2){
                    this.ghost_x[gc] = j*16+this.basex;
                    this.ghost_y[gc] = i*16+this.basey;
                    world_map.innerHTML += "<div id='ghost" +gc + "'></img>";
                    document.getElementById("ghost"+gc).style.left = this.ghost_x[gc] + "px";
                    document.getElementById("ghost"+gc).style.top = this.ghost_y[gc] + "px";
                    gc++;
                }
            }
        }
    }
    this.pacman_pallets = function(draw_map, width){
            var world_map = document.getElementById("map")
            var x = 0;
            for(var i = 0; i < draw_map.length; i++){
            for(var j = 0; j < width; j++){
                if(draw_map[i][j] == 9){
                    world_map.innerHTML += "<div class='dot' id='dot" +i.toString() + "_" + j.toString() + "'></img>";
                    document.getElementById("dot" + i.toString() + "_" + j.toString()).style.left = (j*16 + this.basex) +"px";
                    document.getElementById("dot" + i.toString() + "_" + j.toString()).style.top = (i*16 + this.basey) +"px";
                }
            }
        }
    }
};