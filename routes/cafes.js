let CLIENT_ID = process.env.apiClientId;
let CLIENT_SECRET = process.env.apiClientSecret;
let endpoint = `https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=${{
  CLIENT_ID
}}&client_secret=${{ CLIENT_SECRET }}&v=YYYYMMDD`;

axios.get(endpoint).then(response => {
  console.log(response.data);
});
