const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyparser.json());


// mongoose.connect('mongodb://localhost/hospicheck', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://hospiUser:hospiUser@hospicheckdbcluster-ti9c2.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true});

var db = mongoose.connection;

db.on('error', ()=>{
    console.log("error");
});

db.once('open', ()=>{
    console.log("connected to mongodb");
});

app.use((req, res, next)=> {
	console.log(`${req.method} request for '${req.url}'`);
	next();
});

//Hospital Data Insert

const hospital = mongoose.model('hospital', {

    hospName: String,
    hospAddr: String,
    city: String,
    phone: Number,
    type: String,
    img_path: String,
    website: String,
    wheelchairAccess: String,
    rating: Number,
    department: Array,
    diseases: Array
});

// const readdata = fs.readFileSync('json.json');
// const data = JSON.parse(readdata);

//*******************************dont delete (insertion of records commented) */

// data.records.forEach(element => {
        
//     const hospitalDataList = new hospital(
//     {

//         hospName: element.SV_NAME,
//         hospAddr: element.STREET_NUMBER, 
//         city: element.CITY,
//         phone: element.PHONE_NUMBER,
//         type: "hospital",
//         website: element.WEBSITE,
//         wheelchairAccess: element.WHEELCHAIR_ACCESSIBLE,
//         rating: (Math.random() * (4 - 3 + 1) + 3).toFixed(1),
//         department:["Cardiology","Ent","Gastroenterology","Gynaecology","Orthopedic"],
//         diseases: ["AIDS","Anthrax","Arthritis","Asthma","Cancer","Cardiovascular Disease",
//             "Celiac Disease","Chlamydia","Chronic Diseases","Chronic Obstructive Pulmonary Disease",
//             "Dengue Fever","Diabetes","Food Allergies and Intolerances","Genital Herpes","Gonorrhoea",
//             ,"Heart Disease","Hepatitis","Influenza Flu", "Lupus","Lyme Disease","Lymphogranuloma venereum (LGV)", "Mad Cow Disease (BSE)", "Malaria",
//             "Measles","Meningococcal Disease","Mental Health","Obesity","Osteoarthritis","Osteoporosis",
//             "Rabies","Reye's Syndrome","Sexually Transmitted Infections","Stroke","Sudden Infant Death Syndrome (SIDS)",
//             "Syphilis","Tuberculosis (TB)","West Nile Virus","Yellow Fever"]
        
//     });
//     hospitalDataList.save();
// });

//     //Clinics data insert

const clinics = mongoose.model('clinics', {
    
    clinicName: String,
    clinicAddr: String,
    city: String,
    phone: Number,
    type: String,
    website: String,
    img_path: String,
    wheelchairAccess: String,
    rating: Number,
    department: Array,
    diseases: Array
});

//*******************dont delete. Clinics data inserted */

// const readdata2 = fs.readFileSync('clinics.json');

// const data2 = JSON.parse(readdata2);

// data2.records.forEach(element => {

//     const clinicslist = new clinics(
//     {
    
//         clinicName: element.RG_NAME,
//         clinicAddr: element.STREET_NUMBER,
//         city: element.CITY,
//         phone: element.PHONE_NUMBER,
//         type: "walkin",
//         website: element.WEBSITE,
//         wheelchairAccess: element.WHEELCHAIR_ACCESSIBLE,
//         rating: (Math.random() * (4 - 3 + 1) + 3).toFixed(1),
//         department: ["Cardiology","Ent","Gastroenterology","Gynaecology","Orthopedic"],
//         diseases: ["AIDS","Anthrax","Arthritis","Asthma","Cancer","Cardiovascular Disease",
//             "Celiac Disease","Chlamydia","Chronic Diseases","Chronic Obstructive Pulmonary Disease",
//             "Dengue Fever","Diabetes","Food Allergies and Intolerances","Genital Herpes","Gonorrhoea",
//             ,"Heart Disease","Hepatitis","Influenza Flu", "Lupus","Lyme Disease","Lymphogranuloma venereum (LGV)", "Mad Cow Disease (BSE)", "Malaria",
//             "Measles","Meningococcal Disease","Mental Health","Obesity","Osteoarthritis","Osteoporosis",
//             "Rabies","Reye's Syndrome","Sexually Transmitted Infections","Stroke","Sudden Infant Death Syndrome (SIDS)",
//             "Syphilis","Tuberculosis (TB)","West Nile Virus","Yellow Fever"]
//     });
//     clinicslist.save();

// });

app.post("/searchQuery", (req, res)=>{

    console.log(req.body.searchinput);
    hospital.find().and([
        { $or: [{hospName:{$regex:req.body.searchinput,$options:'i'}}, {city: {$regex:req.body.searchinput,$options:'i'}}, {department: {$regex:req.body.searchinput,$options:'i'}},
        {diseases: {$regex:req.body.searchinput,$options:'i'}}]},
        {city: req.body.searchcity}
    ]).sort({ rating: -1 }).exec((err,docs)=>{
        if(!err) {
           
            res.send(docs);
            console.log(docs);
            console.log(docs.length);
        }
    });   
});

app.get("/searchQuery", (req,res)=>{
    // hospital.find({hospName: { $in: [
    //     mongoose.Types.ObjectId('5d3896a9b0fb2809211ec3ec'),
    
    hospital.find({hospName: { $in: ["Surrey Memorial Hospital","BC Children's Hospital","Vancouver General Hospital - Willow Pavilion"]}}).then((docs)=>{
		res.send(docs);
	});

});

app.post("/querySearch/singleHospital", (req,res)=>{
    // res.json("hey");
    hospital.find({hospName:req.body.hospName},(err,docs)=>{
        if(!err)
        {
            res.json(docs);
        }
    })
});

app.post("/searchQuery2", (req, res)=>{

    console.log(req.body.hospCheck);
    console.log(hospCheck);
    if(req.body.hospCheck=="true"){
    hospital.find( {$or:[ {hospName: req.body.searchcity1.trim()},{hospName: req.body.searchcity2.trim()}]}).exec((err,docs)=>{
        if(err){
            console.log(err);
        }
        else {
            res.json(docs);
            // console.log(docs);

            
            // console.log(req.body.searchcity2);
        }
    })
}
else{
    clinics.find( {$or:[ {clinicName: req.body.searchcity1.trim()},{clinicName: req.body.searchcity2.trim()}]}).exec((err,docs)=>{
        if(err){
            console.log(err);
        }
        else {
            res.json(docs);
            // console.log(docs);

            
            // console.log(req.body.searchcity2);
        }
    })

}
    // console.log(hospCheck);


    
});
let hospCheck;

app.post("/searchQueryfilter", (req,res) =>{
    console.log(req.body);

    
let city1,city2,city3,city4;
let dept1,dept2,dept3,dept4,dept5;

hospCheck = req.body.hospital;

    if(req.body.vancouver==true){
       city1= req.body.vancouver1;
    }
    else{
        city1='';
    }

    if(req.body.surrey==true){
        city2= req.body.surrey1;
    }
    else{
        city2='';
    }

    if(req.body.langley==true){
        city3= req.body.langley1;
    }
    else{
        city3='';
    }

    if(req.body.burnaby==true){
        city4= req.body.burnaby1;
    }
    else{
        city4='';
    }
    
    if(req.body.cardiology==true){
        dept1= req.body.cardiology1;
    }
    else{
        dept1='';
    }
    if(req.body.ent==true){
        dept2= req.body.ent1;
    }
    else{
        dept2='';
    }
    if(req.body.gas==true){
        dept3= req.body.gas1;
    }
    else{
        dept3='';
    }
    if(req.body.gynae==true){
        dept4= req.body.gynae1;
    }
    else{
        dept4='';
    }
    if(req.body.ortho==true){
        dept5= req.body.ortho1;
    }
    else{
        dept5='';
    }
    // if(req.body.richmond==true){
    //     city5= req.body.richmond1;
    // }
    // else{
    //     city5='';
    // }

    
    if(req.body.hospital === true)
    {   
        hospital.find(
            { $and: [{city: {$in:[city1,city2,city3,city4]}}, {department:{$in: [dept1,dept2,dept3,dept4,dept5]}}]}
        ).sort({ rating: -1 }).exec((err,docs)=>{
            if(!err) {
               
                res.send(docs);
                console.log(docs);
                console.log(docs.length);
            }
        });
        // hospital.find().and({city: {$in: [ city1, city2, city3, city4]}},{$or:{department: [dept1, dept2, dept3, dept4, dept5]}}).exec((err,docs)=>{

        // if(!err){
        //     res.send(docs);
        //     console.log(docs);
        //     console.log(docs.length);

        // }

        //     });
            // console.log(dept1+dept2+dept3+dept4+dept5);

        // console.log(city1);

        // hospital.find().and({$or:[{city: city1},{city: city2},{city: city3},{city: city4}]},{type:req.body.hospital1}).exec((err,docs)=>{
        //     if(err){
        //         console.log(err);
        //     }
        //     else {
        //         res.json(docs);
        //         console.log(docs);
        //         console.log(docs.length);
        //     }
        // })
    }
    else if(req.body.walkin==true){

        clinics.find(
            { $and: [{city: {$in:[city1,city2,city3,city4]}}, {department:{$in: [dept1,dept2,dept3,dept4,dept5]}}]}
        ).sort({ rating: -1 }).exec((err,docs)=>{
            if(!err) {
               
                res.send(docs);
                console.log(docs);
                console.log(docs.length);
            }
        });
        


    }
    
});
app.listen(3000, ()=> console.log("Server Running"));

