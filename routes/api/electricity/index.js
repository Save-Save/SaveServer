const express = require('express');
const router = express.Router();
const db = require('../../../module/db');
const moment = require('moment');
const fee = require('../../../module/fee');


//전기상세요금 확인
router.get('/', async (req, res, next) => {
    let date =  req.query.searchDate;
    let totalElect;

    if(!date){
        res.status(400).send({
            message:"잘못된 날짜 요청"
        })
    }
    //사용자의 목표량과 디데이 (전기에 대해서)
    let showQuery = `
    SELECT
        elect_goal, elect_day
    FROM user
    WHERE user.user_idx = ?`;

    let showResult = await db.queryParamArr(showQuery,[1]);
    

    //매달 쓴 전기양
    let electQuery = `
    SELECT
        sum(election.usage) as totalElect
    FROM savesave.election
    WHERE election.user_idx = ? AND write_time like ?
    `;
    let electResult =  await db.queryParamArr(electQuery, [1,date.concat('%')]);
    console.log(electResult);
    
    if(!electResult){
        totalElect = 0;
    }else{
        totalElect = electResult[0].totalElect;
    }
    let saveAmount = fee.saveAmount(showResult[0].elect_goal,electResult[0].totalElect)
    let savePrice = fee.electfee(saveAmount);

    let result = {
        electDday : showResult[0].elect_day,
        monthUsage : totalElect,
        monthUsagePrice : fee.electfee(electResult[0].totalElect),
        stepElectricity : fee.electStep(electResult[0].totalElect),
        saveAmount : saveAmount,
        savePrice : savePrice,
        sameEnvirAmount : 110 ,
        sameEnvirPrice : fee.electfee(110)
        
    }

    console.log(result);

    if(!showResult){
        res.status(500).send({
            message:"INTERNAL SERVER ERROR"
        })
    }else{
        res.status(200).send({
            message:"전기요금 상세보기 성공",
            data : result
        })
    }
});

router.post('/',)

module.exports = router;
