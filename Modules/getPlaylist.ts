import { __Module, ServerRes } from "../Types";

export class getPlaylist extends __Module<{id : string, offset? : number, limit? : number}> {
    override isInputCorrect(k: Object): k is { id: string; } {
        return this.checkInput(k, "id", "string") && this.checkInputOptional(k, "offset", "number") && this.checkInputOptional(k, "limit", "number")
    }

    override execute(input: { id: string; offset?: number; limit?: number; }): Promise<ServerRes> {
        return Spotify.getPlaylist(input.id, input.offset, input.limit)
    }
}