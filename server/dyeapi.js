const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
const hash = require('password-hash');
app.set('superSecret', config.secret);


async function generateQuery(id, data, query) {
    return new Promise((resolve, reject) => {
        if (data) {
            for (let rows of data) {
                const _bulkInsert = '(' + db.escape(id) + ',' + db.escape(rows) + ')';
                query = query + _bulkInsert;
                if (rows === data[data.length - 1]) {
                    query += ';';
                } else {
                    query += ',';
                }
            }
            resolve(query);
        } else {
            resolve('');
        }
    });
}

async function generateArray(data) {
    return new Promise((resolve, reject) => {
        if (data) {
            resolve(JSON.parse(data));
        } else {
            resolve([]);
        }
    });
}

router.get('/dye-factory', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_dyefactory(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, factorys: rows.RowDataPacket[0] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.get('/dye-fabrictype', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_fabrictype(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, fabrictypes: rows.RowDataPacket[0] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.get('/dye-batchno', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_batchno(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, batchno: rows.RowDataPacket[0] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.get('/dye', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_dye(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorders: [] });
                    }
                    else {
                        res.send({ success: true, workorders: rows.RowDataPacket[0] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.get('/dye/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pview_dye(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', employee: [] });
                    }
                    else {
                        const header = rows.RowDataPacket[0];
                        const line = rows.RowDataPacket[1];
                        res.send({
                            success: true,
                            headerData: header,
                            lineData: line
                        })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.post('/dye', async (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var id = req.body.id ? req.body.id : 0;
        var dyeFactory = req.body.dyeFactory ? req.body.dyeFactory : '';
        var buyer = req.body.buyer ? req.body.buyer : '';
        var orderNo = req.body.orderNo ? req.body.orderNo : '';
        var style = req.body.style ? req.body.style : '';
        var color = req.body.color ? req.body.color : '';
        var fabricType = req.body.fabricType ? req.body.fabricType : '';
        var softner = req.body.softner ? req.body.softner : '';
        var silicon = req.body.silicon ? req.body.silicon : '';
        var enzyme = req.body.enzyme ? req.body.enzyme : '';
        var batchNo = req.body.batchNo ? req.body.batchNo : '';
        var batchRemarks = req.body.batchRemarks ? req.body.batchRemarks : '';
        var batch_batchMakeDate = req.body.batch_batchMakeDate ? req.body.batch_batchMakeDate : NULL;
        var batch_batchRollsSLCheck = req.body.batch_batchRollsSLCheck ? req.body.batch_batchRollsSLCheck : '';
        var dyeing_loadDatetime = req.body.dyeing_loadDatetime ? req.body.dyeing_loadDatetime : NULL;
        var dyeing_unloadingDateTime = req.body.dyeing_unloadingDateTime ? req.body.dyeing_unloadingDateTime : NULL;
        var dyeing_totalRunTime = req.body.dyeing_totalRunTime ? req.body.dyeing_totalRunTime : '';
        var dyeing_receipeChart = req.body.dyeing_receipeChart ? req.body.dyeing_receipeChart : '';
        var shade_lapDipOriginalQTX = req.body.shade_lapDipOriginalQTX ? req.body.shade_lapDipOriginalQTX : '';
        var shade_masterBatchCheck = req.body.shade_masterBatchCheck ? req.body.shade_masterBatchCheck : '';
        var shade_dyeUnloadShadeCheck = req.body.shade_dyeUnloadShadeCheck ? req.body.shade_dyeUnloadShadeCheck : '';
        var shade_shadeSubmissionDate = req.body.shade_shadeSubmissionDate ? req.body.shade_shadeSubmissionDate : NULL;
        var shade_shadeApprovalDate = req.body.shade_shadeApprovalDate ? req.body.shade_shadeApprovalDate : NULL;
        var shade_firstBatchNotOkReason = req.body.shade_firstBatchNotOkReason ? req.body.shade_firstBatchNotOkReason : '';
        var squeezer_squeezerDateTime = req.body.squeezer_squeezerDateTime ? req.body.squeezer_squeezerDateTime : NULL;
        var squeezer_rpmValue = req.body.squeezer_rpmValue ? req.body.squeezer_rpmValue : '';
        var squeezer_trolleyPlate = req.body.squeezer_trolleyPlate ? req.body.squeezer_trolleyPlate : '';
        var squeezer_overfeedValue = req.body.squeezer_overfeedValue ? req.body.squeezer_overfeedValue : '';
        var squeezer_padderPressureValue = req.body.squeezer_padderPressureValue ? req.body.squeezer_padderPressureValue : '';
        var squeezer_shape = req.body.squeezer_shape ? req.body.squeezer_shape : '';
        var squeezer_backAngle = req.body.squeezer_backAngle ? req.body.squeezer_backAngle : '';
        var dryer_dryerDatetime = req.body.dryer_dryerDatetime ? req.body.dryer_dryerDatetime : NULL;
        var dryer_temperatureValue = req.body.dryer_temperatureValue ? req.body.dryer_temperatureValue : '';
        var dryer_rpmValue = req.body.dryer_rpmValue ? req.body.dryer_rpmValue : '';
        var dryer_overfeedValue = req.body.dryer_overfeedValue ? req.body.dryer_overfeedValue : '';
        var calendar_rpmValue = req.body.calendar_rpmValue ? req.body.calendar_rpmValue : '';
        var calendar_steamHighLow = req.body.calendar_steamHighLow ? req.body.calendar_steamHighLow : '';
        var slitting_slittingDatetime = req.body.slitting_slittingDatetime ? req.body.slitting_slittingDatetime : NULL;
        var slitting_DTwister = req.body.slitting_DTwister ? req.body.slitting_DTwister : '';
        var slitting_trolleyPlate = req.body.slitting_trolleyPlate ? req.body.slitting_trolleyPlate : '';
        var stenter_stenterDatetime = req.body.stenter_stenterDatetime ? req.body.stenter_stenterDatetime : NULL;
        var stenter_temperatureValue = req.body.stenter_temperatureValue ? req.body.stenter_temperatureValue : '';
        var stenter_overfeedValue = req.body.stenter_overfeedValue ? req.body.stenter_overfeedValue : '';
        var stenter_diasettingValue = req.body.stenter_diasettingValue ? req.body.stenter_diasettingValue : '';
        var stenter_softnerSiliconUsage = req.body.stenter_softnerSiliconUsage ? req.body.stenter_softnerSiliconUsage : '';
        var compact_openCompactDatetime = req.body.compact_openCompactDatetime ? req.body.compact_openCompactDatetime : NULL;
        var compact_rpmValue = req.body.compact_rpmValue ? req.body.compact_rpmValue : '';
        var compact_overfeedValue = req.body.compact_overfeedValue ? req.body.compact_overfeedValue : '';
        var compact_diasettingValue = req.body.compact_diasettingValue ? req.body.compact_diasettingValue : '';
        var compact_steamHighLow = req.body.compact_steamHighLow ? req.body.compact_steamHighLow : '';
        var tubtex_tubtexDatetime = req.body.tubtex_tubtexDatetime ? req.body.tubtex_tubtexDatetime : NULL;
        var tubtex_yarnLot = req.body.tubtex_yarnLot ? req.body.tubtex_yarnLot : '';
        var tubtex_overfeedValue = req.body.tubtex_overfeedValue ? req.body.tubtex_overfeedValue : '';
        var tubtex_steamHighLow = req.body.tubtex_steamHighLow ? req.body.tubtex_steamHighLow : '';
        var tubtex_rollerKnifeSetting = req.body.tubtex_rollerKnifeSetting ? req.body.tubtex_rollerKnifeSetting : '';
        var tubtex_sideLoosePileCheck = req.body.tubtex_sideLoosePileCheck ? req.body.tubtex_sideLoosePileCheck : '';
        var tubtex_diaGSMCheck = req.body.tubtex_diaGSMCheck ? req.body.tubtex_diaGSMCheck : '';
        var tubtex_shadeLightBoxDataColor = req.body.tubtex_shadeLightBoxDataColor ? req.body.tubtex_shadeLightBoxDataColor : '';
        var finalbatch_shrinkageTwistingReport = req.body.finalbatch_shrinkageTwistingReport ? req.body.finalbatch_shrinkageTwistingReport : '';
        var finalbatch_GSMReport = req.body.finalbatch_GSMReport ? req.body.finalbatch_GSMReport : '';
        var finalbatch_rollRollShadeCheck = req.body.finalbatch_rollRollShadeCheck ? req.body.finalbatch_rollRollShadeCheck : '';
        var finalbatch_rubbingReportWetDry = req.body.finalbatch_rubbingReportWetDry ? req.body.finalbatch_rubbingReportWetDry : '';
        var finalbatch_phReportInhouseCheck = req.body.finalbatch_phReportInhouseCheck ? req.body.finalbatch_phReportInhouseCheck : '';
        var finalbatch_phenolicYellowingTest = req.body.finalbatch_phenolicYellowingTest ? req.body.finalbatch_phenolicYellowingTest : '';
        var finalbatch_qcInspectionReport = req.body.finalbatch_qcInspectionReport ? req.body.finalbatch_qcInspectionReport : '';
        var finalbatch_batchRollsWeight = req.body.finalbatch_batchRollsWeight ? req.body.finalbatch_batchRollsWeight : '';
        var finalbatch_finishRollsWeight = req.body.finalbatch_finishRollsWeight ? req.body.finalbatch_finishRollsWeight : '';
        var finalbatch_processLoss = req.body.finalbatch_processLoss ? req.body.finalbatch_processLoss : '';
        var finalbatch_fabricDeliveryDatetime = req.body.finalbatch_fabricDeliveryDatetime ? req.body.finalbatch_fabricDeliveryDatetime : NULL;


        var data = [];
        var headerQuery = "INSERT INTO tmp_dye_line(line_id,dyeId,size,griege,finish,difference,createdBy,orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var size = datalist.size ? datalist.size : 0;
            var dyeId = id;
            var griege = datalist.griege ? datalist.griege : 0;
            var finish = datalist.finish ? datalist.finish : 0;
            var difference = (griege - finish);
            bulkInsert =
                `(${db.escape(line_id)},
                ${db.escape(dyeId)},
                ${db.escape(size)},
                ${db.escape(griege)},
                ${db.escape(finish)},
                ${db.escape(difference)},
                ${db.escape(loginId)},
                ${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','
            }
            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_dye(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id, dyeFactory,buyer,orderNo,style,color,fabricType,softner,silicon,enzyme,batchNo,batchRemarks,batch_batchMakeDate,batch_batchRollsSLCheck,dyeing_loadDatetime,dyeing_unloadingDateTime,dyeing_totalRunTime,dyeing_receipeChart,shade_lapDipOriginalQTX,shade_masterBatchCheck,shade_dyeUnloadShadeCheck,shade_shadeSubmissionDate,shade_shadeApprovalDate,shade_firstBatchNotOkReason,squeezer_squeezerDateTime,squeezer_rpmValue,squeezer_trolleyPlate,squeezer_overfeedValue,squeezer_padderPressureValue,squeezer_shape,squeezer_backAngle,dryer_dryerDatetime,dryer_temperatureValue,dryer_rpmValue,dryer_overfeedValue,calendar_rpmValue,calendar_steamHighLow,slitting_slittingDatetime,slitting_DTwister,slitting_trolleyPlate,stenter_stenterDatetime,stenter_temperatureValue,stenter_overfeedValue,stenter_diasettingValue,stenter_softnerSiliconUsage,compact_openCompactDatetime,compact_rpmValue,compact_overfeedValue,compact_diasettingValue,compact_steamHighLow,tubtex_tubtexDatetime,tubtex_yarnLot,tubtex_overfeedValue,tubtex_steamHighLow,tubtex_rollerKnifeSetting,tubtex_sideLoosePileCheck,tubtex_diaGSMCheck,tubtex_shadeLightBoxDataColor,finalbatch_shrinkageTwistingReport,finalbatch_GSMReport,finalbatch_rollRollShadeCheck,finalbatch_rubbingReportWetDry,finalbatch_phReportInhouseCheck,finalbatch_phenolicYellowingTest,finalbatch_qcInspectionReport,finalbatch_batchRollsWeight,finalbatch_finishRollsWeight,finalbatch_processLoss,finalbatch_fabricDeliveryDatetime,headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (id == 0) {
                            res.json({ success: true, message: 'added successfully' });
                        } else {
                            res.json({ success: true, message: 'updated successfully' });
                        }

                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.delete('/dye/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_knit(?,?,?)', [id, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;

                    if (result.affectedRows == 0) {
                        res.json({ success: false, message: 'exsists' });
                    } else {
                        res.json({ success: true, message: 'delete successfully' });
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.get('/dye-filter', (req, res, next) => {
    try {

        var id = req.query.id ? req.query.id : 0;
        var dyeFactory = req.query.dyeFactory ? req.query.dyeFactory : '';
        // var date = req.query.date ? req.query.date : null;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var fabricType = req.query.fabricType ? req.query.fabricType : '';
        var batchNo =  req.query.batchNo ? req.query.batchNo : '';
        var orgId = req.decoded.orgId;

        Query = `select dy.id,dy.code,dy.dyeFactory,dy.buyer,dy.orderNo,dy.style,dy.color,dy.fabricType,dy.softner,dy.silicon,dy.enzyme,dy.batchNo,dy.batchRemarks,dy.batch_batchMakeDate,dy.batch_batchRollsSLCheck,dy.dyeing_loadDatetime,dy.dyeing_unloadingDateTime,dy.dyeing_totalRunTime,dy.dyeing_receipeChart,dy.shade_lapDipOriginalQTX,dy.shade_masterBatchCheck,dy.shade_dyeUnloadShadeCheck,dy.shade_shadeSubmissionDate,dy.shade_shadeApprovalDate,dy.shade_firstBatchNotOkReason,dy.squeezer_squeezerDateTime,dy.squeezer_rpmValue,dy.squeezer_trolleyPlate,dy.squeezer_overfeedValue,dy.squeezer_padderPressureValue,dy.squeezer_shape,dy.squeezer_backAngle,dy.dryer_dryerDatetime,dy.dryer_temperatureValue,dy.dryer_rpmValue,dy.dryer_overfeedValue,dy.calendar_rpmValue,dy.calendar_steamHighLow,dy.slitting_slittingDatetime,dy.slitting_DTwister,dy.slitting_trolleyPlate,dy.stenter_stenterDatetime,dy.stenter_temperatureValue,dy.stenter_overfeedValue,dy.stenter_diasettingValue,dy.stenter_softnerSiliconUsage,dy.compact_openCompactDatetime,dy.compact_rpmValue,dy.compact_overfeedValue,dy.compact_diasettingValue,dy.compact_steamHighLow,dy.tubtex_tubtexDatetime,dy.tubtex_yarnLot,dy.tubtex_overfeedValue,dy.tubtex_steamHighLow,dy.tubtex_rollerKnifeSetting,dy.tubtex_sideLoosePileCheck,dy.tubtex_diaGSMCheck,dy.tubtex_shadeLightBoxDataColor,dy.finalbatch_shrinkageTwistingReport,dy.finalbatch_GSMReport,dy.finalbatch_rollRollShadeCheck,dy.finalbatch_rubbingReportWetDry,dy.finalbatch_phReportInhouseCheck,dy.finalbatch_phenolicYellowingTest,dy.finalbatch_qcInspectionReport,dy.finalbatch_batchRollsWeight,dy.finalbatch_finishRollsWeight,dy.finalbatch_processLoss,dy.finalbatch_fabricDeliveryDatetime,dy.orgId,dy.createdAt,dyl.id as line_id,dyl.dyeId,dyl.size,dyl.griege,dyl.finish,dyl.difference from dye dy
        left join dye_line dyl on dyl.dyeId = dy.id  where dy.orgId = ${orgId}  and dy.status = 1 and dy.delStatus = 0`

        if (id != 0) {
            Query = Query + ` and dy.id = ('${id}')`
        }
        if (dyeFactory != '') {
            Query = Query + ` and dy.dyeFactory = ('${dyeFactory}')`
        }
        // if (date != null) {
        //     Query = Query + ` and dy.date = ('${date}')`
        // }
        if (buyer != '') {
            Query = Query + ` and dy.buyer IN ('${buyer}')`
        }
        if (orderNo != '') {
            Query = Query + ` and dy.orderNo IN ('${orderNo}')`
        }
        if (style != '') {
            Query = Query + ` and dy.style IN ('${style}')`
        }
        if (color != '') {
            Query = Query + ` and dy.color IN ('${color}')`
        }
        if (fabricType != '') {
            Query = Query + ` and dy.fabricType IN ('${fabricType}')`
        }
        if (batchNo != '') {
            Query = Query + ` and dy.batchNo IN ('${batchNo}')`
        }
        // if (size != '') {
        //     Query = Query + ` and ktl.size IN ('${size}')`
        // }
        // console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorder: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            knit: rows.RowDataPacket[0],
                        })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});


router.post('/dyeworkorder', async (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var id = req.body.id ? req.body.id : 0;
        var dyefty = req.body.dyefty;
        var dyefty_details = req.body.knitfty_details;
        var buyer = req.body.buyer;
        var orderNo = req.body.orderNo;
        var woNo = req.body.woNo;
        var woRefNo = req.body.woRefNo;
        var woDate = req.body.woDate;
        var completedDate = req.body.completedDate;
        var dyeKgs = req.body.knitKgs;
        var dyeValue = req.body.knitValue;
        var notes = req.body.notes;


        var data = [];
        var headerQuery = "INSERT INTO tmp_dyewo_line(line_id, dyeWoId, machDia, fabDia, fabType, style, color, fabGSM, pl, dyeKg, dyeRate, dyeValue, remarks, createdBy, orgId) values "

        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id? datalist.id : 0;
            var dyeWoId = id;
            var machDia = datalist.machDia;
            var fabDia = datalist.fabDia;
            var style = datalist.style ? datalist.style : '';
            var color = datalist.color ? datalist.color : '';
            var fabType = datalist.fabType;
            var fabGSM = datalist.fabGSM;
            var pl = datalist.pl;
            var dyeKg = datalist.dyeKg;
            var dyeRate = datalist.dyeRate;
            var dyeValue = datalist.dyeValue;
            var remarks = datalist.remarks;


            bulkInsert =
              `(${db.escape(line_id)},
                ${db.escape(dyeWoId)},
                ${db.escape(machDia)},
                ${db.escape(fabDia)},
                ${db.escape(fabType)},
                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(fabGSM)},
                ${db.escape(pl)},
                ${db.escape(dyeKg)},
                ${db.escape(dyeRate)},
                ${db.escape(dyeValue)},
                ${db.escape(remarks)},
                ${db.escape(loginId)},
                ${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','
            }
            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_dyeWorkOrder(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id, dyefty, dyefty_details, buyer, orderNo, woNo, woRefNo, woDate, completedDate, dyeKgs, dyeValue, notes, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (id == 0) {
                            res.json({ success: true, message: 'added successfully' });
                        } else {
                            res.json({ success: true, message: 'updated successfully' });
                        }

                    }
                }catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});


router.get('/dyeworkorder', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_dyeworkorder(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorders: [] });
                    }
                    else {
                        res.send({ success: true, workorders: rows.RowDataPacket[0] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.get('/dyeworkorder/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pview_dyeworkorder(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', lineData: [] });
                    }
                    else {
                        const header = rows.RowDataPacket[0];
                        const line = rows.RowDataPacket[1];
                        res.send({
                            success: true,
                            headerData: header,
                            lineData: line
                        })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});


module.exports = router;







