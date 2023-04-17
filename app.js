const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const url = "mongodb+srv://leitejpedro:opZSDGuwyCyzBUka@cluster0.dg6lrg7.mongodb.net/?retryWrites=true&w=majority"
let itemTarefa = [];

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect(url, {dbName: "ToDoList"})

const itemsSchema = {
    name: String
};

const listSchema = {
    name: String,
    items: [itemsSchema]
};



const List = mongoose.model("List", listSchema);

const Item = mongoose.model("Item", itemsSchema);



const item1 = new Item ({
    name: "Bem vindo a sua lista !!!"
});

const item2 = new Item ({
    name: "Aperte no '+' para adicionar um item"
});

const item3 = new Item ({
    name: "<= Aperte aqui para apagar um item"
});

const defaultItems = [item1, item2, item3]





    




app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.set("view engine", "ejs")




app.get("/", function (req, res) {
    
    Item.find({}, (err, docs) =>{
        if (err) {
            console.log(err)
        } else {
            if (docs.length === 0) {
                    Item.insertMany(defaultItems, (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("Adicionado com sucesso")
                        }
                    })
            res.redirect("/")
            } else {
            res.render("list", {tituloLista: "Hoje", novoItem: docs});

            }

        }
    })
    


})

app.post("/", function (req, res) {

    let listName = req.body.list;
    let itemName = req.body.addlista
    const novoItem = new Item({
        name: itemName
    });


    if (listName === "Hoje"){
        novoItem.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, (err, docs) =>{
            if (err) {
                console.log(err)
            } else {
                docs.items.push(novoItem);
                docs.save();
                res.redirect("/"+ listName);
            }
            })
    }



})

app.post("/delete", (req, res) => {

    const itemDeletado = req.body._id;
    const listName = req.body.listName;

    if(listName === "Today") {

        Item.findByIdAndRemove(itemDeletado, (err) => {
            if (!err) {
            console.log("Tudo certo");
            }
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: itemDeletado}}}, (err, findList) => {
            if(!err){
                res.redirect("/" + listName)
            }
        } )
    }
})



app.get("/:listaCustomizada", function (req, res){

    const listaCustomizada = _.capitalize(req.params.listaCustomizada)

    List.findOne({name: listaCustomizada}, (err, foundList) => {

        if (!err) {
            if (!foundList) {
                // Cria uma nova lista
                const list = new List({
                    name: listaCustomizada,
                    items: defaultItems            
                });
                list.save();

                res.redirect("/"+listaCustomizada)
            } else {
                // Mostrar o que já existe
                res.render("list", {tituloLista: foundList.name, novoItem: foundList.items});

            }
            
        } 

    })
    
    



    
    

})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server está na porta 3000")
})

