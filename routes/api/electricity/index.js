const express = require('express');
const router = express.Router();
const db = require('../../../module/db');
const moment = require('moment');
const fee = require('../../../module/fee');


//전기상세요금 확인
router.get('/', async (req, res, next) => {
    let date =  req.query.searchDate;
    let totalElect;
    let totalElectPrevious

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
    

    //매달 쓴 전기량
    let electQuery = `
    SELECT
        sum(election.usage) as totalElect
    FROM savesave.election
    WHERE election.user_idx = ? AND write_time like ?
    `;
    let electResult =  await db.queryParamArr(electQuery, [1,date.concat('%')]);
    
    let momentObj = moment(date,'YYYY-MM');
    momentObj = momentObj.subtract(1,'months').format('YYYY-MM');

    let electTemp = await db.queryParamArr(electQuery,[1,momentObj.concat('%')]);
    console.log(electTemp[0].totalElect);


    if(!electResult){
        totalElect = 0;
    }else{
        totalElect = electResult[0].totalElect;
    }
    if(!electTemp){
        totalElectPrevious = 0;
    }else{
        totalElectPrevious = electTemp[0].totalElect;
    }


    let saveAmount = fee.saveAmountElect(totalElectPrevious,totalElect);
    let savePrice = fee.electfee(saveAmount);

    let result = {
        electDday : showResult[0].elect_day,
        monthUsage : totalElect.toFixed(0),
        monthUsagePrice : fee.electfee(electResult[0].totalElect),
        stepElectricity : fee.electStep(electResult[0].totalElect),
        saveAmount : saveAmount.toFixed(0),
        savePrice : savePrice.toFixed(0),
        predictionAmount : ((1.18/1.12)*totalElectPrevious).toFixed(0),
        predictionPrice : (fee.electfee((1.18/1.12)*totalElectPrevious)).toFixed(0)
        
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

router.post('/',async(req,res,next)=>{

});

module.exports = router;