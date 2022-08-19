const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FoodSchema = new Schema({
  food_name: String,
  food_price: Number,
  food_image_name: String,
  food_image_id: String,
});

const Food = mongoose.model('Food', FoodSchema);

module.exports = Food;

