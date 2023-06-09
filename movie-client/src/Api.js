/**
 * Created by Getinet Amare
 */

/* root url */
const root = 'http://localhost:9040/getinet';

const Api = {
    'movieList': (page) => `${root}/movie-list/${page}`,

    'movieCount': () => `${root}/movie-count`,
    'deleteMovies': (movies) => `${root}/delete-more/${movies.join("&")}`,


    'deleteMovie': (title) => `${root}/delete/${title}`,

    "addMovieInfo": (type) => `${root}/add-movie/${type.join("&")}`,

    'movieDetail': (title) => `${root}/${title}`,

    
    'types': () => `${root}/types`,

    
    'typeCount': (type) => `${root}/count/${type}`,

    
    'categoryList': (type, page) => `${root}/${type}/${page}`,

    
    'playMovie': (movie) => `${root}/play/${movie}`,

    
    'uploadMovie': () => `${root}/upload`,

    
    'userSignUp': (username, password, permission) => `${root}/user/sign-up?username=${username}&password=${password}&permission=${permission}`,

    
    'userSignIn': (username, password, permission) => `${root}/user/sign-in?username=${username}&password=${password}&permission=${permission}`,
};

export default Api;