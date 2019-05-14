const fs = require('fs');
function map(map_n){
    var map_text = fs.readFileSync("./views/Assets/PacmanMap" + map_n +  ".txt").toString().replace(/\n/g,"");
    var map_text_line = map_text.split("\r");

    for(var x = 0; x < map_text_line.length; x++){
        temp_line = map_text_line[x].split("")
        temp_array=[]
        for(var y = 0; y < temp_line.length; y++){
            temp_array[y]=parseInt(temp_line[y],10)
        }
        map_text_line[x] = temp_array
    }
    return map_text_line
}
module.exports={
    map
}
