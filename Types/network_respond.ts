import type { LyricRespond } from "../External/MusixMatch"
import { Album, Artist, Track } from "./internal_data_format"

export type ServerRes<T extends Object = {}> = {
    timestamp : string // ISO
    status : number,
    fail : true,
    error : string
} | {
    timestamp : string // ISO
    status : number,
    fail : false,
} & T

function HTTPResConstructor<T extends Object = {}>(
    status : number, 
    error : string = "", 
    format : T | {} = {} //unused param, for type inference
) : (o : T) => ServerRes<T> {
    return (o : T) : ServerRes<T> => {

        const timestamp = new Date( Date.now() ).toISOString()

        return (error === "") ? {
            fail : true,
            status, 
            error,
            timestamp,
        } : {
            ...o,
            fail : false,
            status, 
            timestamp,
        }

    }
}

export const Respond = {
    //Good

    //TODO : make different types of responses instead of just this one OK
    //OK : HTTPResConstructor<Object>(200),
    Lyric : HTTPResConstructor<LyricRespond>(200),

    Track : HTTPResConstructor<Track>(200),
    Artist : HTTPResConstructor<Artist>(200),
    Playlist : HTTPResConstructor<Album>(200), //Playlist mayyyy not be an album, change later

    SearchResult : HTTPResConstructor(200, undefined, {
        result : [] as (Artist | Album | Track)[]
    }),

    //Error
    //user
    InvalidInput : HTTPResConstructor(400, "Incorrect input"),
    InvalidEndpoint : HTTPResConstructor(400, "Endpoint not exist"),

    //server
    ServerBusy : HTTPResConstructor(503, "Server busy"),
    UnexpectedError : HTTPResConstructor(500, "Unexpected code happened"),
    ExternalServicesDown : HTTPResConstructor(503, "External services unreachable", {
        service : ""
    }),
    ExternalServiceDeclined : HTTPResConstructor(503, "External services declined request", {
        service : ""
    }),
    
    //silly stuff
    Teapot : HTTPResConstructor(418, "I'm a teapot"),
} as const