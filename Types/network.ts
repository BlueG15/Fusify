export type ServerRes<T extends Object = {}> = {
    timestamp : string // ISO
    status : number,
    fail : true,
    error : string
} | {
    timestamp : string // ISO
    status : number,
    fail : false,
    error : ""
} & T

function HTTPResConstructor(status : number, err : string = "") : (o : Object) => ServerRes<Object> {
    return (o : Object) : ServerRes<Object> => {
        return (err !== "") ? {
            fail : true,
            status : status, 
            error : err,
            timestamp : new Date( Date.now() ).toISOString(),
        } : {
            fail : false,
            status : status, 
            error : err,
            timestamp : new Date( Date.now() ).toISOString(),
        }
    }
}

export const Respond
= {
    //Good
    OK : HTTPResConstructor(200),

    //Error
    //user
    InvalidInput : HTTPResConstructor(400, "Incorrect input"),
    InvalidEndpoint : HTTPResConstructor(400, "Endpoint not exist"),

    //server
    ServerBusy : HTTPResConstructor(503, "Server busy"),
    UnexpectedError : HTTPResConstructor(500, "Unexpected code happened"),
    ExternalServicesDown : HTTPResConstructor(503, "External services unreachable"),
    
    //silly stuff
    Teapot : HTTPResConstructor(418, "I'm a teapot"),
} as const