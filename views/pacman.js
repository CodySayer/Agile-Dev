function wait(sec) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + sec * 1000) {
    end = new Date().getTime();
  }
}

var basex = 0;
var basey = 0;
var buffer = 10;

var pacimg = 1;
var pac_xdir = 0;
var pac_ydir = 0;
var pac_y = basey + 256;
var pac_x = basex + 224;
console.log("y = " + pac_y + " x = " + pac_x)
var ghost_dir_y = [-1, -1, -1, -1];
var ghost_dir_x = [0, 0, 0, 0];
var ghost_x = [];
var ghost_y = [];

var move = 1;
var frame = 0;

var score = {
  {
    score
  }
} || 0;
var first = true;
var pal = 0;

function getscore() {
  document.getElementById("scoresubmit").value = score
}

function proc_map(map_vals, width) {
  var post_map = []
  for (var i = 0; i < map_vals.length / width; i++) {
    var temp_row = []
    for (var j = 0; j < width; j++) {
      temp_row[j] = map_vals[i * width + j]
    }
    post_map[i] = temp_row
  }
  return post_map
}
var processed_map = proc_map([{
  {
    values
  }
}], {
  {
    width
  }
});

function block() {
  if ((pac_x - basex) % 16 == 0) {
    if ((pac_y - basey) % 16 == 0) {
      if (processed_map[(pac_y - basey) / 16 + pac_ydir][(pac_x - basex) / 16 + pac_xdir] == 0) {
        move = 0;
      }
    }
  }
}

function eat() {
  if ((pac_x - basex) % 16 == 8 || (pac_y - basey) % 16 == 8) {
    if (pac_ydir == 1) {
      if (processed_map[(pac_y - basey - 8) / 16 + pac_ydir][(pac_x - basex) / 16] == 9) {
        score += 100
        processed_map[(pac_y - basey - 8) / 16 + pac_ydir][(pac_x - basex) / 16] = 1;
        document.getElementById("dot" + ((pac_y - basey - 8) / 16 + pac_ydir) + "_" + ((pac_x - basex) / 16)).className = "wall2";
        pal -= 1;
      }
    } else if (pac_ydir == -1) {
      if (processed_map[(pac_y - basey - 8) / 16][(pac_x - basex) / 16] == 9) {
        score += 100
        processed_map[(pac_y - basey - 8) / 16][(pac_x - basex) / 16] = 1;
        document.getElementById("dot" + ((pac_y - basey - 8) / 16) + "_" + ((pac_x - basex) / 16)).className = "wall2";
        pal -= 1;
      }
    } else if (pac_xdir == 1) {
      if (processed_map[(pac_y - basey) / 16][(pac_x - basex - 8) / 16 + pac_xdir] == 9) {
        score += 100
        processed_map[(pac_y - basey) / 16][(pac_x - basex - 8) / 16 + pac_xdir] = 1;
        document.getElementById("dot" + ((pac_y - basey) / 16) + "_" + ((pac_x - basex - 8) / 16 + pac_xdir)).className = "wall2";
        pal -= 1;
      }
    } else if (pac_xdir == -1) {
      if (processed_map[(pac_y - basey) / 16][(pac_x - basex - 8) / 16] == 9) {
        score += 100
        processed_map[(pac_y - basey) / 16][(pac_x - basex - 8) / 16] = 1;
        document.getElementById("dot" + ((pac_y - basey) / 16) + "_" + ((pac_x - basex - 8) / 16)).className = "wall2";
        pal -= 1;
      }
    }
    document.getElementById("score").innerHTML = score
  }
  pal -= 1
  console.log(pal);
  if (pal <= 0) {
    document.getElementById("progression").value = 1;
    submit();
  }
}

function pac_move() {
  if (move == 1) {
    pac_x += pac_xdir * 2;
    pac_y += pac_ydir * 2;
    document.getElementById("pacman").style.left = pac_x + "px";
    document.getElementById("pacman").style.top = pac_y + "px";
  }
  for (var i = 0; i < ghost_x.length; i++) {
    if (ghost_x[i] <= pac_x + 16 && ghost_x[i] >= pac_x) {
      if (ghost_y[i] <= pac_y + 16 && ghost_y[i] >= pac_y) {
        console.log('death1') //death
        pac_death()
      } else if (ghost_y[i] + 16 <= pac_y + 16 && ghost_y[i] + 16 >= pac_y) {
        console.log('death2')
        pac_death()
      }
    } else if (ghost_x[i] + 16 <= pac_x + 16 && ghost_x[i] + 16 >= pac_x) {
      if (ghost_y[i] <= pac_y + 16 && ghost_y[i] >= pac_y) {
        console.log('death1') //death
        pac_death()
      } else if (ghost_y[i] + 16 <= pac_y + 16 && ghost_y[i] + 16 >= pac_y) {
        console.log('death2')
        pac_death()
      }
    } else if (ghost_y[i] <= pac_y + 16 && ghost_y[i] >= pac_y) {
      if (ghost_x[i] <= pac_x + 16 && ghost_x[i] >= pac_x) {
        console.log('death3')
        pac_death()
      } else if (ghost_x[i] + 16 <= pac_x && ghost_x[i] + 16 >= pac_x) {
        console.log('death4') //death
        pac_death()
      }
    } else if (ghost_y[i] + 16 <= pac_y + 16 && ghost_y[i] + 16 >= pac_y) {
      if (ghost_x[i] <= pac_x + 16 && ghost_x[i] >= pac_x) {
        console.log('death3')
        pac_death()
      } else if (ghost_x[i] + 16 <= pac_x && ghost_x[i] + 16 >= pac_x) {
        console.log('death4') //death
        pac_death()
      }
    }
  }
}

function ghost_move() {
  for (var i = 0; i < ghost_x.length; i++) {
    ghost_x[i] += ghost_dir_x[i] * 2;
    ghost_y[i] += ghost_dir_y[i] * 2;
    document.getElementById("ghost" + i).style.left = ghost_x[i] + "px";
    document.getElementById("ghost" + i).style.top = ghost_y[i] + "px";
    if ((ghost_x[i] - basex) % 16 == 0) {
      if ((ghost_y[i] - basey) % 16 == 0) {
        var temp_dir = []
        if (ghost_dir_x[i] != 0) {
          if (processed_map[(ghost_y[i] - basey) / 16][(ghost_x[i] - basex) / 16 + ghost_dir_x[i]] == 0) {
            if (processed_map[(ghost_y[i] - basey) / 16 - 1][(ghost_x[i] - basex) / 16] != 0) {
              temp_dir[temp_dir.length] = -1
            }
            if (processed_map[(ghost_y[i] - basey) / 16 + 1][(ghost_x[i] - basex) / 16] != 0) {
              temp_dir[temp_dir.length] = 1
            }
            ghost_dir_x[i] = 0;
            ghost_dir_y[i] = temp_dir[Math.round(Math.random() * (temp_dir.length - 1))];
          }
        } else if (ghost_dir_y[i] != 0) {
          if (processed_map[(ghost_y[i] - basey) / 16 + ghost_dir_y[i]][(ghost_x[i] - basex) / 16] == 0) {
            if (processed_map[(ghost_y[i] - basey) / 16][(ghost_x[i] - basex) / 16 - 1] != 0) {
              temp_dir[temp_dir.length] = -1
            }
            if (processed_map[(ghost_y[i] - basey) / 16][(ghost_x[i] - basex) / 16 + 1] != 0) {
              temp_dir[temp_dir.length] = 1
            }
            ghost_dir_y[i] = 0;
            ghost_dir_x[i] = temp_dir[Math.round(Math.random() * (temp_dir.length - 1))];
          }
        }
      }
    }


  }
}

function pacman_upd() {
  direction(buffer);
  block();
  pac_move();
  eat();
  ghost_move();
}
var pacman_interval = setInterval(pacman_upd, 1000 / 30);

function pacman_map(draw_map, width) {
  var world_map = document.getElementById("map")
  var gc = 0;
  for (var i = 0; i < draw_map.length; i++) {
    for (var j = 0; j < width; j++) {
      if (draw_map[i][j] == 0) {
        world_map.innerHTML += "<div class='wall1' id='wall" + i.toString() + "_" + j.toString() + "'></img>";
        document.getElementById("wall" + i.toString() + "_" + j.toString()).style.left = (j * 16 + basex) + "px";
        document.getElementById("wall" + i.toString() + "_" + j.toString()).style.top = (i * 16 + basey) + "px";
      } else if (draw_map[i][j] == 8) {
        world_map.innerHTML += "<div class='wall3' id='wall" + i.toString() + "_" + j.toString() + "'></img>";
        document.getElementById("wall" + i.toString() + "_" + j.toString()).style.left = (j * 16 + basex) + "px";
        document.getElementById("wall" + i.toString() + "_" + j.toString()).style.top = (i * 16 + basey) + "px";
      }
      if (draw_map[i][j] == 2) {
        ghost_x[gc] = j * 16 + basex;
        ghost_y[gc] = i * 16 + basey;
        world_map.innerHTML += "<div id='ghost" + gc + "'></img>";
        document.getElementById("ghost" + gc).style.left = ghost_x[gc] + "px";
        document.getElementById("ghost" + gc).style.top = ghost_y[gc] + "px";
        gc++;
      }
    }
  }
}
pacman_map(processed_map, {
  {
    width
  }
});

function pac_change_dir(dir) {
  switch (dir) {
    case 0:
      pac_xdir = 0;
      pac_ydir = -1;
      move = 1;
      document.getElementById("pacman").style.transform = "rotate(-90deg)";
      break;
    case 1:
      pac_xdir = 0;
      pac_ydir = 1;
      move = 1;
      document.getElementById("pacman").style.transform = "rotate(90deg)";
      break;
    case 2:
      pac_xdir = -1;
      pac_ydir = 0;
      move = 1;
      document.getElementById("pacman").style.transform = "rotate(180deg)";
      break;
    case 3:
      pac_xdir = 1;
      pac_ydir = 0;
      move = 1;
      document.getElementById("pacman").style.transform = "rotate(0deg)";
  }
}

function direction(event) {
  if (first) {
    switch (event) {
      case 0:
        if ((pac_y - basey) % 16 == 0 && (pac_x - basex) % 16 == 0) {
          if (processed_map[Math.floor((pac_y - basey) / 16 - 1)][Math.floor((pac_x - basex) / 16)] != 0 && processed_map[Math.floor((pac_y - basey) / 16 - 1)][Math.floor((pac_x - basex) / 16)] != 8) {
            pac_change_dir(0);
          }
        } else if (pac_ydir == 1) {
          pac_change_dir(0)
        }
        break;
      case 1:
        if ((pac_y - basey) % 16 == 0 && (pac_x - basex) % 16 == 0) {
          if (processed_map[Math.floor((pac_y - basey) / 16 + 1)][Math.floor((pac_x - basex) / 16)] != 0 && processed_map[Math.floor((pac_y - basey) / 16 - 1)][Math.floor((pac_x - basex) / 16)] != 8) {
            pac_change_dir(1);
          }
        } else if (pac_ydir == -1) {
          pac_change_dir(1);
        }
        break;
      case 2:
        if ((pac_y - basey) % 16 == 0 && (pac_x - basex) % 16 == 0) {
          if (processed_map[Math.floor((pac_y - basey) / 16)][Math.floor((pac_x - basex) / 16 - 1)] != 0) {
            pac_change_dir(2);
          }
        } else if (pac_xdir == 1) {
          pac_change_dir(2);
        }
        break;
      case 3:
        if ((pac_y - basey) % 16 == 0 && (pac_x - basex) % 16 == 0) {
          if (processed_map[Math.floor((pac_y - basey) / 16)][Math.floor((pac_x - basex) / 16 + 1)] != 0) {
            pac_change_dir(3);
          }
        } else if (pac_xdir == -1) {
          pac_change_dir(3);
        }
        break;
    }
  }
}
document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == '38') {
    buffer = 0;
  } else if (e.keyCode == '40') {
    buffer = 1;
  } else if (e.keyCode == '37') {
    buffer = 2;
  } else if (e.keyCode == '39') {
    buffer = 3;
  }

}

function submit() {
  getscore();
  document.getElementById("scoreForm").submit();
}

function pac_death() {
  if (first) {
    first = false;
    document.getElementById("pacman").src = "Assets/death.gif"
    document.getElementById("pacman").style.transform = "rotate(0deg)";
    move = 0
    console.log("I'm hit")
    clearInterval(pacman_upd);
    var changer = setInterval(submit, 3000)
    console.log("should submit")
  }
}

function pacman_pallets(draw_map, width) {
  var world_map = document.getElementById("map")
  var x = 0;
  for (var i = 0; i < draw_map.length; i++) {
    for (var j = 0; j < width; j++) {
      if (draw_map[i][j] == 9) {
        world_map.innerHTML += "<div class='dot' id='dot" + i.toString() + "_" + j.toString() + "'></img>";
        document.getElementById("dot" + i.toString() + "_" + j.toString()).style.left = (j * 16 + basex) + "px";
        document.getElementById("dot" + i.toString() + "_" + j.toString()).style.top = (i * 16 + basey) + "px";
        pal += 1;
      }
    }
  }
}
pacman_pallets(processed_map, {
  {
    width
  }
});

console.log('please no cheating')
