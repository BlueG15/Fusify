const enum DataTypes {
    Track,
    Artist,
    Album
}

export class UniversalDataType {
    constructor(
        readonly id : string,
        readonly type : number
    ){}
    is<T extends {id : string, type : number}>(k : T) : this is T {
        return this.type === k.type && this.id === k.id
    }
}

export class ImageObject {
    constructor(
        public readonly url : string,
        public readonly h : number, 
        public readonly w : number
    ){}
}

export class Track extends UniversalDataType {
    constructor(
        id : string,
        public readonly name : string,
        public readonly duration_ms : number,
        public readonly isrc? : string,
    ){
        super(id, DataTypes.Track)
    }
}

export class Artist extends UniversalDataType {
    constructor(
        id : string,
        public readonly name : string,
        public readonly images : ImageObject[],
        public readonly tracks : Track[],
    ){
        super(id, DataTypes.Artist)
    }
}

export class Album extends UniversalDataType {
    constructor(
        id : string, 
        public readonly name : string,
        public readonly images : ImageObject[],
        public readonly artists : Artist[],
        public readonly tracks : Track[]
    ){
        super(id, DataTypes.Album)
    }
}
