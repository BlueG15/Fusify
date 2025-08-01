export class __Module<InputType extends Object, OutputType extends Object>{

    get name(){ return this.constructor.name }
    execute(input : InputType) : OutputType | void {}
    //haha fucking same problem here as in qp
    //i need conmponents to tell the system how to fulfill their input
    //ok, its not 100% the same, i dont think i can copy teh step based input system cause all the inputs here should be given in one go

    //temp solution, it aint gud but ive got nothing better for now
    isInputCorrect(k : Object) : k is InputType {return false}
    
}