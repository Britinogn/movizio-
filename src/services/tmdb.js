import axios from 'axios';

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});




export default tmdbApi;



// import axios from 'axios';

// const tmdbApi = axios.create({

//   baseURL: 'https://Movies-Verse.proxy-production.allthingsdev.co/api',
//    headers: { 
//       'x-apihub-key': 'jHBpofGh2YiZyo50zR-59vbB6AicEpUcVhqBgc8qmJjNA0V2tn', 
//       'x-apihub-host': 'Movies-Verse.allthingsdev.co', 
//       'x-apihub-endpoint': '4f700f4a-4bd2-4604-8d5b-7b5e4c976c65'
//    }

//       // baseURL:'https://api.themoviedb.org/3/authentication ',
//       // header: {
//       //    'Authorization':'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNDVlNWJmODdlOGYwNWI3NzcwOTAzMmM0YjhiNWQxNCIsIm5iZiI6MTc1NjM4NDU2NS4xNzI5OTk5LCJzdWIiOiI2OGIwNGQzNThkZGQ1NmRjMGJmYTlhNmMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vqkgGPdToxe95M-rnv8QrVI7nO5zLtVZWlR_u1FPboU' ,
//       //    'accept': 'application/json',
//       // }
     
// });


//  export const getUpcomingMovies = () => {
//   return api.get("/movies/upcoming-movies");
// };

//export default tmdbApi;













