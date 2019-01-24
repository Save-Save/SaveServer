module.exports = {
    realUsage : (...arg)=>{
        let tempValue = arg[0];
        let Arr = arg[1];

        if(tempValue === 0){
            return 0;
        }else if(tempValue ===1){
            return Arr[0];
        }else{
            return (Arr[tempValue-1]-Arr[tempValue-2]);
        }
    }

}