import { Album, Artist, Track, Respond, ServerRes } from "../Types"

interface permissionObj {
    clientId : string,
    accessToken : string,
    accessTokenExpirationTimestampMs : number,
    isAnonymous: boolean
}

const CANNOT_FETCH_RESPONSE = Respond.ExternalServicesDown({
    service : "Spoitify"
})

export class Spotify {
    //TODO : do the implementation
    static perm : permissionObj //refresh daily

    static refreshToken(){

    }

    //TODO : implement this and removes void
    static search(key : string, offset : number = 0, limit : number = 50) : Promise<ServerRes> | void {
        
    }

    static getArtist(id : string) : Promise<ServerRes> {
        const url = 'https://api-partner.spotify.com/pathfinder/v1/query'
        const options = {
            params: {
                operationName: 'queryArtistOverview',
                variables: `{"uri":"spotify:artist:${id}","locale":"","includePrerelease":true}`,
                extensions: process.env.extensionStr
            },
            headers: {
                Authorization: `Bearer ${this.perm.accessToken}`
            }
        };

        return Fetcher.get(
            url, options, 
            (res) => Respond.Artist(new Artist(id, res.name, res.images, res.tracks)), //temp
            () => CANNOT_FETCH_RESPONSE
        )
    }

    static getPlaylist(id : string, offset : number = 0, limit : number = 50) : Promise<ServerRes> {
        const url = 'https://api-partner.spotify.com/pathfinder/v1/query'
        const options = {
            params: {
                operationName: 'fetchPlaylist',
                variables: `{"uri":"spotify:playlist:${id}","offset":${offset},"limit":${limit}}`,
                extensions: process.env.extensionStr3
            },
            headers: {
                Authorization: `Bearer ${this.perm.accessToken}`
            }
        };

        return Fetcher.get(
            url, options,
            (res) => Respond.Playlist(new Album(id, res.name, res.images, res.artists, res.tracks)), //temp
            () => CANNOT_FETCH_RESPONSE
        )
    }

    static getTrack(id : string) : Promise<ServerRes> {
        const url = 'https://api-partner.spotify.com/pathfinder/v1/query'
        const options = {
            params: {
                operationName: 'getTrack',
                variables: `{"uri":"spotify:track:${id}"}`,
                extensions: process.env.extensionStr2
            },
            headers: {
                Authorization: `Bearer ${this.perm.accessToken}`
            }
        };

        return Fetcher.get(
            url, options,
            (res) => Respond.Track(new Track(id, res.name, res.duration_ms, res.external_id.isrc)), //temp
            () => CANNOT_FETCH_RESPONSE
        )
    }


}

(globalThis as any).Spoitify = Spotify