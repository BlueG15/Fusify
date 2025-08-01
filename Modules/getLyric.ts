import { __Module, ServerRes } from "../Types";

export class getLyric extends __Module<{isrc : string, type : "RICHSYNC" | "SUBTITLES" | "LYRICS" | "AUTO"}>{

    override isInputCorrect(k: Object): k is { isrc: string; type: "RICHSYNC" | "SUBTITLES" | "LYRICS" | "AUTO"; } {
        return this.checkInput(k, "isrc", "string") && this.checkInput(k, "type", "string")
    }

    override execute(input: { isrc: string; type: "RICHSYNC" | "SUBTITLES" | "LYRICS" | "AUTO"; }): Promise<ServerRes> {
        return MusixMatch.get(input.isrc, input.type)
    }
}