import { __Module, ServerRes } from "../Types";

export class getArtist extends __Module<{id : string}> {
    override isInputCorrect(k: Object): k is { id: string; } {
        return this.checkInput(k, "id", "string")
    }

    override execute(input: { id: string; }): Promise<ServerRes> {
        return Spotify.getArtist(input.id)
    }
}