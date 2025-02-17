const mongoose = require('mongoose');
let main = async function() {
  try{
    await mongoose.connect("mongodb+srv://triadsproject:pnHMTjnN4q4t6ZxS@cluster0.jixyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  }catch(err){
console.log(err);

  }
}
module.exports = main;