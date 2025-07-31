export class Lyric_richsync_atom {
    constructor(
        public readonly text : string,
        public readonly offset : number,
    ){}
} 

export class Lyric_richsync {
    constructor(
        public readonly start : number,
        public readonly end : number,
        public readonly body : Lyric_richsync_atom[],
        public readonly text : string,
    ){}
}

export class Lyric_subtitle_atom {
    constructor(
        public readonly total: number,
 		public readonly minutes: number,
 		public readonly seconds: number,
 		public readonly hundredths: number,
    ){}
}

export class Lyric_subtitle {
    constructor(
        public readonly text : string,
        public readonly body : Lyric_subtitle_atom[]
    ){}
}

export class Lyric_raw {
    constructor(public readonly text : string){}
}

export class Lyric {
    constructor(
        public readonly body : Lyric_subtitle[] | Lyric_richsync[] | Lyric_raw[],
        public readonly language : string
    ){}
}