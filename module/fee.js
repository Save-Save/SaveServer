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

        const goalAmount = args[0];
        const usingAmount = args[1];

        return (goalAmount - usingAmount);
    
    }
    

    
}