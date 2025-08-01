import { Respond, ServerRes } from "../Types"

const CANNOT_FETCH_RESPONSE = Respond.ExternalServicesDown({
    service : "MusixMatch"
})
const COPRIGHTED_RESPONSE = Respond.ExternalServiceDeclined({
    service : "MusixMatch"
})

//
type __Internal_MusixmatchLyricResponse = {
	message: {
		header: {
			status_code: number;
			execute_time: number;
			available: number;
		};
		body: any;
	};
}

type __Internal_MusixmatchLyrics = {
    type : string;
	action_requested: string;
	backlink_url: string;
	can_edit: number;
	explicit: number;
	html_tracking_url: string;
	instrumental: number;
	locked: number;
	lyrics_body: __Internal_MusixmatchLyric[];
	subtitle_body: __Internal_MusixmatchSubtitle[];
	richsync_body: __Internal_MusixmatchRichsync[];
	lyrics_copyright: string;
	lyrics_id: number;
	lyrics_language: string;
	lyrics_language_description: string;
	pixel_tracking_url: string;
	published_status: number;
	publisher_list: any[];
	restricted: number;
	script_tracking_url: string;
	updated_time: string;
	verified: number;
}

type __Internal_MusixmatchLyric = {
	text: string;
}

type __Internal_MusixmatchSubtitle = {
	text: string;
	time: {
		total: number;
		minutes: number;
		seconds: number;
		hundredths: number;
	};
}

type __Internal_MusixmatchRichsync = {
	start: number;
	end: number;
	body: __Internal_MusixmatchRichsyncBody[];
	text: string;
}

type __Internal_MusixmatchRichsyncBody = {
	text: string;
	offset: number;
}

const enum __Internal_MusixmatchLyricTypes {
	"LYRICS" = 'track.lyrics.get',
    "SUBTITLES" = 'track.subtitles.get',
	"RICHSYNC" = 'track.richsync.get'
}

type __Internal_MusixmatchLyricType = __Internal_MusixmatchLyricTypes[keyof __Internal_MusixmatchLyricTypes];


//
type LyricSegment_hasTiming = {
    start_ms : number
    duration_ms : number
    text : string 
}

type LyricSegment_noTiming = {
    text : string
}

export type LyricRespond = {
    isrc : string
    type : "LYRICS" | "SUBTITLES" | "RICHSYNC"
    Segments : LyricSegment_hasTiming[] | LyricSegment_noTiming[]
}

export class MusixMatch {
    //LYRIC_TYPES: MusixmatchLyricTypes;
    static tokens: string[] = process.env.MusixMatchKeysCSV!.split(",");
    static get api_base() {
        return "https://curators.musixmatch.com/ws/1.1/";
    };
    static get token(){
        return this.tokens[Math.floor(Math.random() * this.tokens.length)];
    };
    addToken(...token: string[]): void {
        MusixMatch.tokens.push(...token);
    };
    // constructor(){
    //     //TODO : fix this
    //     let concatstr : string = process.env.key_concat_string!;
    //     let num = Number(process.env.key_length);

    //     let i = 0;
    //     while(i < concatstr.length){
    //         let substr = concatstr.slice(i, i + num);
    //         this.addToken(substr);
    //         i += num;
    //     }
    // };
    static getLyrics(isrc: string): Promise<LyricRespond>{
        //just lyrics, no time signature, no nothing
        return new Promise(async (res, rej) => {
            this.requestLyrics(isrc, __Internal_MusixmatchLyricTypes.LYRICS).then((req) => {
                const lyric = req.message.body.lyrics as __Internal_MusixmatchLyrics;
                if(lyric.restricted) throw COPRIGHTED_RESPONSE
                const Segments = this.processLyrics(lyric.lyrics_body.toString());
                res({
                    isrc,
                    type : "LYRICS",
                    Segments
                });
            }).catch((e) => {
                rej(e);
            });
          });
    };
    static getSubtitleLyrics(isrc: string): Promise<LyricRespond>{
        //time signatured lyrics to the sentences level
        return new Promise((res, rej) => {
            this.requestLyrics(isrc, __Internal_MusixmatchLyricTypes.SUBTITLES).then((req) => {
                const lyric = req.message.body.subtitle_list[0].subtitle;
                if(lyric.restricted) throw COPRIGHTED_RESPONSE
                const Segments = this.processSubtitles(lyric.subtitle_body.toString());
                res({
                    isrc,
                    type : "SUBTITLES",
                    Segments,
                });
            }).catch((e) => {
                rej(e);
            });
          });
    };
    static getRichsyncLyrics(isrc: string): Promise<LyricRespond>{
        //time signatured lyrics to the word level
        return new Promise((res, rej) => {
            this.requestLyrics(isrc, __Internal_MusixmatchLyricTypes.RICHSYNC).then((req) => {
              const lyric = req.message.body.richsync;
              if(lyric.restricted) throw COPRIGHTED_RESPONSE
              const Segments = this.processRichsync(lyric.richsync_body.toString());
                res({
                    isrc,
                    type : "RICHSYNC",
                    Segments
                });
            }).catch((e) => {
              rej(e);
            });
          });
    };
    static buildSearchParams(isrc: string): URLSearchParams{
        const params = {
            format: "json",
            track_isrc: isrc,
            tags: "nowplaying",
            user_language: "en",
            subtitle_format: "mxm",
            app_id: "web-desktop-app-v1.0",
            usertoken: this.token
          };
          return new URLSearchParams(params);
    };

    static async getLyricsAuto(isrc : string) : Promise<LyricRespond>{
        //auto in this priority:
        //richsync -> subtitle -> lyric

        return new Promise((res, rej) => {
            let arr = [this.getRichsyncLyrics(isrc), this.getSubtitleLyrics(isrc), this.getLyrics(isrc)]
            Promise.allSettled(arr).then(result => {
                if(result[0] && result[0].status == 'fulfilled') return res(result[0].value);
                if(result[1] && result[1].status == 'fulfilled') return res(result[1].value);
                if(result[2] && result[2].status == 'fulfilled') return res(result[2].value);            
                let a = CANNOT_FETCH_RESPONSE;
                rej(a);
            })
        })
    }

    static async requestLyrics(isrc: string, type: __Internal_MusixmatchLyricType): Promise<__Internal_MusixmatchLyricResponse>{
        const URL = `${this.api_base}/${type}?${this.buildSearchParams(isrc).toString()}`;
        const config = {
            headers :  {
                'Cookie': "x-mxm-user-id="
            }
        }
        const res = await Fetcher.get(
            URL, config, 
            (k) => (k as __Internal_MusixmatchLyricResponse), 
            () => undefined
        )

        if(res) return res;
        throw CANNOT_FETCH_RESPONSE;
    };

    static processLyrics(lyrics_body: string): LyricSegment_noTiming[] {
        const body = lyrics_body.split("\n");
        return body.map((item) => ({
            text: item
        }));
    };
    static processSubtitles(subtitle_body: string): LyricSegment_hasTiming[]{
        try{
            const parse_1 : __Internal_MusixmatchSubtitle[] = JSON.parse(subtitle_body);
            let total_durr = 0
            return parse_1.map((i, index) => {
                const res = {
                    text : i.text,
                    start_ms : total_durr,
                    duration_ms : i.time.total * 1000,
                }

                total_durr += res.duration_ms

                return res;
            })
        }catch(err){         
            return []
        }
    };
    static processRichsync(richsync_body: string): LyricSegment_hasTiming[] {
        const body : {
            ts : number, 
            te : number, 
            l : {c : string, o : number}[], 
            x : string
        }[] = JSON.parse(richsync_body);

        const parse_1 : __Internal_MusixmatchRichsync[] = body.map((item) => ({
            start: item.ts, //ms
            end: item.te, //ms
            body: item.l.map((item2) => ({
                text: item2.c,
                offset: item2.o * 1000
            })),
            text: item.x
        }));

        const res : LyricSegment_hasTiming[] = []
        parse_1.forEach((i, index) => {
            if(i.body.length){
                i.body.forEach(k => {
                    const next = i.body[index + 1] as __Internal_MusixmatchRichsyncBody | undefined
                    const nextStart_time = next ? next.offset + i.start : i.end

                    res.push({
                        text : k.text,
                        start_ms : i.start + k.offset, //I assume start is in milisecond? no clue
                        duration_ms : nextStart_time - i.start - k.offset
                    })
                })
            } else {
                res.push({
                    text : i.text,
                    start_ms : i.start,
                    duration_ms : i.end - i.start
                })
            }
        })

        return res
    };

    static get(isrc: string, type? : keyof typeof __Internal_MusixmatchLyricTypes | "AUTO"){
        return new Promise<ServerRes>((res, rej) => {

            let res_p : Promise<LyricRespond>;
            
            switch(type){
                case "LYRICS" : {res_p = this.getLyrics(isrc); break;}
                case "RICHSYNC" : {res_p = this.getRichsyncLyrics(isrc); break;}
                case "SUBTITLES" : {res_p = this.getSubtitleLyrics(isrc); break;}
                default : {res_p = this.getLyricsAuto(isrc); break}
            }
            
            res_p
            .then((d) => res(Respond.Lyric(d)))
            .catch((d : typeof COPRIGHTED_RESPONSE | typeof CANNOT_FETCH_RESPONSE) => res(d))
        })
    }
}

(globalThis as any).Musixmatch = MusixMatch