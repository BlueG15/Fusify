export class Fetcher {
    //Global class so in case we switch to axios we dont have to change things that much
    static async get(
        url : string,
        options? : RequestInit,
    ) : Promise<Object | Response>;
    static async get<successType, failType>(
        url : string,
        options? : RequestInit,
        callback_success?: (res : any) => successType,
        callback_failure?: (res : Response) => failType
    ) : Promise<successType | failType>;
    static async get<successType, failType>(
        url : string,
        options? : RequestInit,
        callback_success?: (res : any) => successType,
        callback_failure?: (res : Response) => failType
    ){
        return fetch(url, options)
        .then(k => {
            if(k.ok) return k.json(); throw k;
        })
        .then(k => {
            if(callback_success) return callback_success(k);
            else return k
        })
        .catch(k => {
            if(callback_failure) return callback_failure(k);
            else return k
        })
    }
}

(globalThis as any).Fetcher = Fetcher