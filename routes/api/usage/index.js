const express = require('express');
const router = express.Router();
const db = require('../../../module/db');
const moment = require('moment');
const fee = require('../../../module/fee');

router.delete('/',async(req,res)=>{

    let date = moment().format('YYYY-MM');
    console.log(date);



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
    let deleteResult = await db.queryParamArr(deleteQuery,[date.concat("-1%"),2]);
    let deleteWaterResult = await db.queryParamArr(deleteWaterQuery,[date.concat("-1%"),2]);

    if(!deleteResult || !deleteWaterResult){
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
