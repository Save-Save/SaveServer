module.exports = {

    waterfee : (value) =>{
        if(value<=30){
            return(360 * value);
        }else if(value<=50){
            return(550 * value);
        }else{
            return(790 * value);
        }
        
    },

    electfee : (value) => {
        if(value<=200){
            return(910 * value);
        }else if(value<=400){
            return(1600 * value);
        }else{
            return(7300 * value);
        }
    },

    saveAmount : (...args) => {

        const goalAmount = args[0];// goal이 아닌 동환경 으로 바꿔야 한다.
        const usingAmount = args[1];

        return (goalAmount - usingAmount);
    
    },

    electStep : (value) =>{
        if(value<=100){
            return 1;
        }else if(value <= 200){
            return 2;
        }else if(value <= 300){
            return 3;
        }else if(value <= 400){
            return 4;
        }else if(value <= 500){
            return 5;
        }else{
            return 6;
        }
    }
}