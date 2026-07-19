const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
});

const MAP_TOKEN = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: MAP_TOKEN });

main().then((res)=>{
    console.log("conected to database")
})
.catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initdb = async ()=>{
    await Listing.deleteMany({});
   initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6a46902431cce0065f1689ea"
}));
    for (let obj of initdata.data) {
        let response = await geocodingClient.forwardGeocode({
            query: obj.location,
            limit: 1
        }).send();

        obj.geometry = response.body.features[0].geometry;
    }
    await Listing.insertMany(initdata.data);
    console.log("data is intillized ");
}
initdb();