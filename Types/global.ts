declare global {
    interface Math {
        /**
         * @returns A random number in the range 
         * * [min, max] if rounded (slightly non-uniform distribution, the ends have lower odds)
         * * [min, max) if not rounded (uniform dfistribution)
         */
        rng(max : number, min : number, round? : boolean) : number
    }

    var Fetcher: typeof import("./network_fetch").Fetcher;

    //Externals
    var MusixMatch: typeof import("../External/MusixMatch").MusixMatch;
    var Spotify: typeof import("../External/Spotify").Spotify;
    
}

Math.rng = function (max, min, round, a = Math.random() * (max - min) + min){
    return round ? this.round(a) : a
}

export {}