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

    //전달 쓴 전기량
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
    if(saveAmount<=0){
        saveAmount = 0;
    }
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

router.post('/',async(req,res)=>{
    let goal = req.body.goal;
    
    if(!goal){

        res.status(400).send({

            message:"목표량이 입력되지 않음"
        });

    }
    let userQuery = `
    SELECT
        elect_goal, state_elect, elect_day
    FROM
        user
    WHERE user_idx = ?`;
    let userResult = await db.queryParamArr(userQuery,[1]);

    if(!userResult){
        res.status(500).send({
            message:"INTERNAL SERVER ERROR"
        });
    }





    if(userResult[0].state_elect === 0){
        console.log(333)
        let userUpdate = `
        UPDATE user 
        SET elect_goal=?, state_elect=?
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
    
});

module.exports = router;
