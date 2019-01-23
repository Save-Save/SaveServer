const express = require('express');
const router = express.Router();
const db = require('../../../module/db');
const moment = require('moment');
const fee = require('../../../module/fee');

/* GET home page. */
router.get('/', async (req, res, next) => {



    let startDay = moment().startOf('month').format('YYYY-MM-DD');
    let endDay = moment().endOf('month').format('YYYY-MM-DD');
    let totalWater;
    let totalElect;
    let savePrice;

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
    console.log(electResult);

    


    //매달 쓴 수도양
    let waterQuery  =`
    SELECT
        sum(water.usage) as totalWater
    FROM water
    WHERE user_idx = ? AND DATE(write_time) BETWEEN ? AND ?
    `
    let waterResult = await db.queryParamArr(waterQuery,[1,startDay,endDay]);
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

    //토탈 세이브한 양
    let tempWater = fee.saveAmount(showResult[0].water_goal,totalWater);
    let tempElect = fee.saveAmount(showResult[0].elect_goal,totalElect);
    savePrice = fee.electfee(tempElect)+fee.waterfee(tempWater);

    console.log(tempElect);
    console.log(tempWater);
    console.log(savePrice);




    let result = {
        userName : showResult[0].name,
        waterDday : showResult[0].water_day,
        electDday : showResult[0].elect_day,
        electGoalPrice : fee.electfee(showResult[0].elect_goal),
        waterGoalPrice : fee.waterfee(showResult[0].water_goal),
        waterPrice : fee.waterfee(totalWater),
        electPrice : fee.electfee(totalElect),
        savePrice : savePrice
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
