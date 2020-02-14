const mongoose = require("mongoose");
const { Schema } = mongoose;
const cafeSchema = new Schema({
  imgName: String,
  image_url: String,
  name: String,
  location: {
    display_address: [String]
  },

  address: String,
  display_phone: String,
  price: {
    type: String,
    enum: ["€", "€€", "€€€"]
  },
  // wifi: {
  //   type: String,
  //   enum: ["★", "★★", "★★★"]
  // },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  coordinates: {
    latitude: Number,
    longitude: Number
  }
});

// example of a cafe from yelp businesses
// {
//   id: 'MqiobbxpvGTciQk75G9u2w',
//   alias: 'rausch-schokoladenhaus-berlin-2',
//   name: 'Rausch Schokoladenhaus',
//   image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/eYrjJ1s8KXHeB1rR2ROSzg/o.jpg',
//   is_closed: false,
//   url: 'https://www.yelp.com/biz/rausch-schokoladenhaus-berlin-2?adjust_creative=Ua_kQQTyo9b1nlSRDEO_eA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=Ua_kQQTyo9b1nlSRDEO_eA',
//   review_count: 309,
//   categories: [
//     { alias: 'chocolate', title: 'Chocolatiers & Shops' },
//     { alias: 'cafes', title: 'Cafes' }
//   ],
//   rating: 4.5,
//   coordinates: { latitude: 52.51199, longitude: 13.3913499 },
//   transactions: [],
//   price: '€€',
//   location: {
//     address1: 'Charlottenstr. 60',
//     address2: null,
//     address3: null,
//     city: 'Berlin',
//     zip_code: '10117',
//     country: 'DE',
//     state: 'BE',
//     display_address: [ 'Charlottenstr. 60', '10117 Berlin', 'Germany' ]
//   },
//   phone: '+4930757880',
//   display_phone: '+49 30 757880',
//   distance: 1222.212010727982
// }

const Cafe = mongoose.model("Room", cafeSchema);
module.exports = Cafe;
