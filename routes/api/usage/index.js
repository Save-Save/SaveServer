const express = require('express');
const router = express.Router();
const db = require('../../../module/db');
const moment = require('moment');
const fee = require('../../../module/fee');

router.delete('/',async(req,res)=>{

    let date = moment().format('YYYY-MM');
    console.log(date);


    //목표량이랑 사용량 지우기
    //업데이트 1을 0으로 업데이트 해주기

    let deleteQuery = `
    DELETE 
    FROM election 
    WHERE write_time like ? AND user_idx =?
    `;

    let deleteWaterQuery = `
    DELETE 
    FROM water 
    WHERE write_time like ? AND user_idx = ?
    `
    let updateQuery =  `
    UPDATE user
    SET elect_goal=?, water_goal=?, state_elect=?,state_water=?
    WHERE user_idx=?
    `
    let deleteResult = await db.queryParamArr(deleteQuery,[date.concat("-2%"), 1]);
    let deleteWaterResult = await db.queryParamArr(deleteWaterQuery,[date.concat("-2%"),1]);
    let updateResult = await db.queryParamArr(updateQuery,[0,0,0,0,1])
    if(!deleteResult || !deleteWaterResult || !updateResult){
        res.status(500).send({
            message:"INTERNAL SEVER ERROR"
        });
    }else{
        res.status(200).send({
            message : "정보 삭제 성공!"
        })
    }

});

module.exports = router;
