const express = require('express');
const router = express.Router();
const db = require('../../../module/db');
const moment = require('moment');
const fee = require('../../../module/fee');


router.get('/', async(req, res, next) => {
    let date = req.query.searchDate;
    if(!date){
        res.status(400).send({
            message:"잘못된 날짜 요청"
        });
    }

    //사용자의 목표량과 디데이 (수도에 대해서)
    let showQuery = `
    SELECT
        water_goal, water_day
    FROM user
    WHERE user.user_idx = ?`;

    let showResult = await db.queryParamArr(showQuery,[1]);

    //매달쓴 수도량
    let waterQuery =`
    SELECT
        sum(water.usage) as totalWater
    FROM savesave.water
    WHERE water.user_idx = ? AND write_time like ?
    `;
    let waterResult = await db.queryParamArr(waterQuery,[1,date.concat('%')]);

    let momentObj = moment(date,'YYYY-MM');
    let month = moment(date,'MM');
    let previousMonth = momentObj.subtract(1,'months').format('MM');
    let fullMonth = momentObj.format('YYYY-MM');
    

    //전달 쓴 수도량
    let previousWaterResult = await db.queryParamArr(waterQuery,[1,fullMonth.concat('%')]);

    //절약한 양
    let saveAmount = fee.saveAmountWater(month, waterResult[0].totalWater);

    //전 달에 절약한 양
    let previousAmount = fee.saveAmountWater(previousMonth,previousWaterResult[0].totalWater);


    //절약되지 않은 경우 처리
    if(saveAmount<=0){
        saveAmount = 0;
    }

    if(previousAmount<=0){
        previousAmount = 0;
    }

    let savePrice = fee.waterfee(saveAmount);
    let previousPrice = fee.waterfee(previousAmount);



    let result = {
        waterDday : showResult[0].water_day,
        monthUsage : waterResult[0].totalWater,
        monthUsagePrice : fee.waterfee(waterResult[0].totalWater).toFixed(0),
        saveAmount : saveAmount.toFixed(0),
        savePrice : savePrice.toFixed(0),
        predictionAmount : previousAmount.toFixed(0),
        predictionPrice : previousPrice.toFixed(0)
    }
    res.status(200).send({
        message: "수도 요금 보기 성공",
        data : result
    })

});



module.exports = router;
