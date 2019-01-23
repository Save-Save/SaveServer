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
        if(value<=100){

            return ((value * 60.7)+410);

        }else if(value<=200){
            let temp = (100 * 60.7);
            let temp1 = ((value-100)*125.9);

            return (910 + temp + temp1);

        }else if(value<=300){
            let temp = (100 * 60.7);
            let temp1 = (100 * 125.9) ;
            let temp2 = ((value-200)*187.9);

            return (1600 + temp+ temp1 + temp2);

        }else if(value<=400){
            let temp = (100 * 60.7);
            let temp1 = (100 * 125.9);
            let temp2 = (100 * 187.9);
            let temp3 = ((value-300)*280.6);
            
            return (3850 + temp+ temp1 +temp2+temp3);
        }else if(value<=500){

            let temp = (100 * 60.7);
            let temp1 = (100 * 125.9);
            let temp2 = (100 * 187.9);
            let temp3 = (100 * 280.6);
            let temp4 = ((value-400)*417.7);
            return (7300 + temp + temp1 + temp2 + temp3+ temp4);
        }else{
            let temp = (100 * 60.7);
            let temp1 = (100 * 125.9);
            let temp2 = (100 * 187.9);
            let temp3 = (100 * 280.6);
            let temp4 = ((value-500)*709.5);
            return (12940 + temp+temp1+temp2+temp3+temp4);
        }
    },

    saveAmountElect : (...args) => {

        const lastAmount = args[0];
        const currentAmount = args[1];
        
        let save = (1.18/1.12)*lastAmount;

        return (save-currentAmount);
    
    },
    saveAmountWater : (...args) =>{
        const month = args[0];
        const currentAmount = args[1];
        if(month === 12){
            return (21 - currentAmount);
        }else{
            return (22 - currentAmount);
        }
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