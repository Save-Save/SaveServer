const express = require('express');
const router = express.Router();
const db = require('../../../module/db');
const moment = require('moment');
const fee = require('../../../module/fee');
const SerialPort = require('serialport');


router.get('/', async(req, res, next) => {
    //const serialPo
    let date = req.query.searchDate;
    if(!date){
        res.status(400).send({
            message:"잘못된 날짜 요청"
        });
    }

    //사용자의 목표량과 디데이 (수도에 대해서)
    let showQuery = `
    SELECT
        water_goal, water_day, state_water
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

    if(!waterResult){
        res.status(500).send({
            message:"INTERNER SERVER ERROR"
        })
    }
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

    let monthUsage = waterResult[0].totalWater;
    if(monthUsage=== null){
        monthUsage = 0;
    }


    let result = {
        waterDday : showResult[0].water_day,
        monthUsage : monthUsage,
        monthUsagePrice : Number(fee.waterfee(monthUsage).toFixed(0)),
        saveAmount : Number(saveAmount.toFixed(0)),
        savePrice : Number(savePrice.toFixed(0)),
        predictionAmount : Number(previousAmount.toFixed(0)),
        predictionPrice : Number(previousPrice.toFixed(0)),
        waterGoal : Number(showResult[0].water_goal),
        waterGoalPrice : Number((fee.waterfee(showResult[0].water_goal)).toFixed(0)),
        stateGoal: showResult[0].state_water
    }
    res.status(200).send({
        message: "수도 요금 보기 성공",
        data : result
    })

});

router.post('/',async (req,res)=>{
    let goal = req.body.goal;

    if(!goal){
        res.status(400).send({
            message : "목표량이 입력되지 않음"
        });
    }

    let userQuery = `
    SELECT
        water_goal, state_water, water_day
    FROM
        user
    WHERE user_idx = ?`;
    let userResult = await db.queryParamArr(userQuery,[1]);

    if(!userResult){
        res.status(500).send({
            message:"INTERNAL SERVER ERROR"
        });
    }



    if(userResult[0].state_water === 0 ||userResult[0].state_water === 1){
        console.log(333)
        let userUpdate = `
        UPDATE user 
        SET water_goal=?, state_water=?
        WHERE user_idx = ?
        `;
        let userUpdateResult = await db.queryParamArr(userUpdate,[goal,1,1]);
        if(!userUpdateResult){
            res.status(500).send({
                message:"INTERNAL SERVER ERROR"
            });
        }
        
        res.status(201).send({
        message:"목표 변경하기 성공"
    });
    }else{
        console.log(111)
        res.status(400).send({
            message : "이미 목표를 설정함"
        })
    }
})



module.exports = router;
