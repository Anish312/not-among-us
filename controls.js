class Controls{
    constructor(type){
        this.forward=false;
        this.left=false;
        this.up=false;
        this.down=false;
 
        switch(type) {
         case "KEYS": 
            this.#addKeyboardListeners();
             break;
         case "DUMMY":
             this.forward=true;
             break;
        }
    }
 
   
    #addKeyboardListeners(){
        document.onkeydown=(event)=>{
           
            switch(event.key){
                case " ":
                    this.up=true;
                    break;
                case "ArrowRight":
                    this.forward=true;
                    break;
                case "ArrowLeft":
                    this.reverse=true;
                    break;
            }
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case " ":
                    this.up = false;
                    break;
               case "ArrowRight":
                    this.forward=false;
                    break;
                case "ArrowLeft":
                    this.reverse=false;
                    break;
            }
        }
    }
 }