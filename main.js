var express = require("express");
var hbs = require("hbs");
const async = require("hbs/lib/async");
const { ObjectId } = require("mongodb");

var app = express();

var MongoClient = require("mongodb").MongoClient;
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
//var url='mongodb://localhost:27017'
var url='mongodb+srv://PhamQuangHuy:huy28072002@cluster0.ah2nbyz.mongodb.net/test'
app.use(express.static(__dirname + '/public'));


/////////////////////////////
app.get('/edit',async(req,res)=>{
    let id = req.query.id;         
    let objectId = ObjectId(id);
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    let prod = await dbo.collection("shopeeProduct").findOne({_id:objectId});
    res.render('edit', {'prod':prod});
})


app.post('/update',async(req,res)=>{
    let id = req.body.id
    let objectId = ObjectId(id)
    let name = req.body.txtName
    let price = Number(req.body.txtPrice) 
    let picture = req.body.txtPicture
    let product = {
        'name': name,
        'price': price,
        'picture':picture
    }
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB")
    await dbo.collection("shopeeProduct").updateOne({_id:objectId},{$set:product})
    res.redirect('/view')
})
app.get('/delete',async (req,res)=>{
    let id=req.query.id
    let objectID=ObjectId(id)
    let client=await MongoClient.connect(url)
    let dbo=client.db("ProductDB")
    await dbo.collection("shopeeProduct").deleteOne({_id:objectID})
    res.redirect('/view')
})

app.post('/search',async (req,res)=>{
    let name=req.body.txtSearch
    let client=await MongoClient.connect(url)
    let dbo=client.db("ProductDB")
    //i co y nghia khong phan biet chu hoa hoac chu thuong
    let prod=await dbo.collection("shopeeProduct").find({'name':new RegExp(name,'i')}).toArray()
    res.render('viewProduct',{'prod':prod})
})

app.get('/view', async(req,res)=>{
    let client=await MongoClient.connect(url)
    let dbo=client.db("ProductDB")
    let prod=await dbo.collection("shopeeProduct").find().toArray()
    res.render('viewProduct',{'prod':prod})
})
app.post('/insertProduct',async(req,res)=>{
    let name=req.body.txtName
    let price=parseFloat(req.body.txtPrice)
    let picture=req.body.txtPicture
    let product={
        'name':name,
        'price':price,
        'picture':picture
    }
    let client=await MongoClient.connect(url)
    let dbo=client.db("ProductDB")
    await dbo.collection("shopeeProduct").insertOne(product)
    res.redirect('/view')
})
app.get('/asc',async(req,res)=>{
    let client=await MongoClient.connect(url)
    let dbo=client.db("ProductDB")
    let prod=await dbo.collection("shopeeProduct").find().sort({price:1}).toArray()
    res.render('viewProduct',{'prod':prod})
})
app.get('/desc',async(req,res)=>{
    let client=await MongoClient.connect(url)
    let dbo=client.db("ProductDB")
    let prod=await dbo.collection("shopeeProduct").find().sort({price:-1}).toArray()
    res.render('viewProduct',{'prod':prod})
})
app.get('/new',(req,res)=>{
    res.render('newProduct')
})
app.get('/',(req,res)=>{
    res.render('viewProduct')
})
// const showMenu=(toggleID,navbarID,bodyID)=>{
//     const toggle=document.getElementById(toggleID),
//     navbar= document.getElementById(navbarID),
//     bodypadding=document.getElementById(bodyID)

//     if(toggle&&navbar){
//         toggle.addEventListener('click',()=>{
//             navbar.classList.toggle('show')
//             toggle.classList.toggle('rotate')
//             bodypadding.classList.toggle('expander')
//         })
//     }
// }
// showMenu('nav-toggle','navbar','body')
// const linkColor=document.querySelectorAll('.nav__link')
// function colorLink(){
//     linkColor.forEach(l=>l.classList.remove('active'))
//     this.classList.add('active')
// }
// linkColor.forEach(l=>l,addEventListener('click',colorLink))
const PORT=process.env.PORT||5000
app.listen(PORT)
console.log('server is running')