const express = require('express');
const router = express.Router();
const db = require('../../../module/db');
const moment = require('moment');
const fee = require('../../../module/fee');

/* GET home page. */
router.get('/', async (req, res, next) => {

//.subtract(1,'months')

    let startDay = moment().startOf('month').format('YYYY-MM-DD');
    let endDay = moment().endOf('month').format('YYYY-MM-DD');
    let previousStart = moment().subtract(1,'months').startOf('month').format('YYYY-MM-DD');
    let previousEnd = moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD');
    let totalWater;
    let totalElect;
    let totalElectTemp;
    let totalWaterTemp;
    let tempElect;
    let tempWater;
    let savePrice;

    console.log(previousStart);
    let showQuery = `
    SELECT
        elect_goal, water_goal, name , water_day, elect_day
    FROM user
    WHERE user.user_idx = ?`;

    let showResult = await db.queryParamArr(showQuery,[1]);
    console.log(showResult);

    //매달 쓴 전기양
    let electQuery = `
    SELECT
        sum(election.usage) as totalElect
    FROM savesave.election
    WHERE election.user_idx = ? AND DATE(write_time) BETWEEN ? AND ?
    `;
    let electResult =  await db.queryParamArr(electQuery, [1,startDay,endDay]);
    let eTempResult = await db.queryParamArr(electQuery,[1,previousStart,previousEnd]);
    console.log(electResult);

    


    //매달 쓴 수도양
    let waterQuery  =`
    SELECT
        sum(water.usage) as totalWater
    FROM water
    WHERE user_idx = ? AND DATE(write_time) BETWEEN ? AND ?
    `
    let waterResult = await db.queryParamArr(waterQuery,[1,startDay,endDay]);
    let wTempResult = await db.queryParamArr(waterQuery,[1,previousStart,previousEnd]);
    console.log(waterResult);

    // 사용한 수도양이 없을 때
    if(!waterResult){

        totalWater = 0;

    }else{
        totalWater = waterResult[0].totalWater; 
    }

    // 사용한 전기양이 없을 때
    if(!electResult){

        totalElect = 0;

    }else{
        totalElect = electResult[0].totalElect;
    }
    // 전달 사용 전기량이 없을 때
    if(!eTempResult){
        totalElectTemp = 0;
    }else{
        totalElectTemp = eTempResult[0].totalElect;
    }
    if(!wTempResult){
        totalWaterTemp = 0;
    }else{
        totalWaterTemp = wTempResult[0].totalWater;
    }


    //토탈 세이브한 양
    let saveElect = fee.saveAmountElect(totalElectTemp,totalElect);
    let saveWater = fee.saveAmountWater(moment().format('M'),totalWater);
    savePrice =fee.electfee(saveElect)+fee.waterfee(saveWater);
    console.log(saveElect);
    console.log(saveWater);




    

    if(savePrice<0){ // 절약된 게 없으면 0으로 처리
        savePrice = 0;
    }



    let result = {
        userName : showResult[0].name,
        waterDday : showResult[0].water_day,
        electDday : showResult[0].elect_day,
        electGoalPrice : fee.electfee(showResult[0].elect_goal).toFixed(0),
        waterGoalPrice : fee.waterfee(showResult[0].water_goal).toFixed(0),
        waterPrice : fee.waterfee(totalWater).toFixed(0),
        electPrice : fee.electfee(totalElect).toFixed(0),
        savePrice : savePrice.toFixed(0)
    }

    if(!showResult){
        res.status(500).send({
            message:"INTERNAL SEVER ERROR"
        });
    }else{
        res.status(200).send({
            message:"success to show main",
            data : result
        });
    }

});

module.exports = router;
