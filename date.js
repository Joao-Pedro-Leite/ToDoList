

module.exports.getDate = function () {
    

var today = new Date();
var options = {
    weekday: "long",
    month: "long",
    day: "numeric",
}

return today.toLocaleDateString("pt-BR", options);
}

module.exports.getDay = function () {
    

    var today = new Date();
    var options = {
        weekday: "long",
    }
    
    return today.toLocaleDateString("pt-BR", options);
    }
    
    