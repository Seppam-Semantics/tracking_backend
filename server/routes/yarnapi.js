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

router.get('/yarn-spinner', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_yarnspinner(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, spinners: rows.RowDataPacket[0] })
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

router.get('/yarn-lcNo', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_yarnlcNo(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, lcNo: rows.RowDataPacket[0] })
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

router.get('/yarn-lcValue', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_yarnlcValue(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, lcValue: rows.RowDataPacket[0] })
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

router.get('/yarn-status', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_yarnStatus(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, status: rows.RowDataPacket[0] })
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


router.get('/yarn-pi', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_yarnPi(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, pi: rows.RowDataPacket[0] })
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
router.get('/yarn', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_yarn(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorders: [] });
                    }
                    else {
                        res.send({ success: true, yarn: rows.RowDataPacket[0] })
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

router.get('/yarn/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pview_yarn(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', employee: [] });
                    }
                    else {
                        const yarn = rows.RowDataPacket[0];
                        const yarn_lc_lines = rows.RowDataPacket[1];
                        const yarn_lot_check = rows.RowDataPacket[2];
                        const yarn_order_allocations = rows.RowDataPacket[3];
                        const yarn_receipts_lines = rows.RowDataPacket[4];
                        const yarn_quality_check = rows.RowDataPacket[5];
                        res.send({
                            success: true,
                            yarn :  yarn,
                            yarn_lc_lines :  yarn_lc_lines,
                            yarn_lot_check :  yarn_lot_check,
                            yarn_order_allocations :  yarn_order_allocations,
                            yarn_receipts_lines :  yarn_receipts_lines,
                            yarn_quality_check :  yarn_quality_check
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

router.post('/yarn', async (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var id = req.body.id ? req.body.id : 0;
        var spinner = req.body.spinner ? req.body.spinner : '';
        var lcDate = req.body.lcDate ? req.body.lcDate : NULL;
        var lcNo = req.body.lcNo ? req.body.lcNo : '';
        var pi = req.body.pi ? req.body.pi : '';
        var piDate = req.body.piDate ? req.body.piDate : NULL;
        var lcValue = req.body.lcValue ? req.body.lcValue : '';
        var yarnStatus = req.body.yarnStatus ? req.body.yarnStatus : '';

        var data = [];
        var headerQuery = "INSERT INTO tmp_yarn_lc_lines(line_id,yarnId,yarnType,lcYarnKgs,yarnRate,yarnValue,createdBy,orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var yarnId = id;
            var yarnType = datalist.yarnType ? datalist.yarnType : 0;
            var lcYarnKgs = datalist.lcYarnKgs ? datalist.lcYarnKgs : 0;
            var yarnRate = datalist.yarnRate ? datalist.yarnRate : 0;
            var yarnValue = datalist.yarnValue ? datalist.yarnValue : 0;
            bulkInsert =
                `(${db.escape(line_id)},
                ${db.escape(yarnId)},
                ${db.escape(yarnType)},
                ${db.escape(lcYarnKgs)},
                ${db.escape(yarnRate)},
                ${db.escape(yarnValue)},
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

        client.executeNonQuery('ppost_yarn(?,?,?,?,?,?,?,?,?,?,?)', [id, spinner, lcDate, lcNo, pi, piDate, lcValue, yarnStatus, headerQuery, loginId, orgId],
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

router.post('/yarn_lot_check', async (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var yarnId = req.body.yarnId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_yarn_lot_check(line_id,yarnLineId,yarnType,lotNo,sampleDate,resultDate,checkResults,acceptRejectStatus,createdBy,orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var yarnLineId = datalist.yarnLineId ? datalist.yarnLineId : 0;
            var yarnType = datalist.yarnType ? datalist.yarnType : '';
            var lotNo = datalist.lotNo ? datalist.lotNo : '';
            var sampleDate = datalist.sampleDate ? datalist.sampleDate : NULL;
            var resultDate = datalist.resultDate ? datalist.resultDate : NULL;
            var checkResults = datalist.checkResults ? datalist.checkResults : '';
            var acceptRejectStatus = datalist.acceptRejectStatus ? datalist.acceptRejectStatus : '';
            bulkInsert =
                `(${db.escape(line_id)},${db.escape(yarnLineId)},${db.escape(yarnType)},${db.escape(lotNo)},${db.escape(sampleDate)},${db.escape(resultDate)},${db.escape(checkResults)},${db.escape(acceptRejectStatus)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','
            }
            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_yarn_lot_check(?,?,?,?)', [yarnId, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        // if (id == 0) {
                        res.json({ success: true, message: 'added successfully' });
                        // } else {
                        //     res.json({ success: true, message: 'updated successfully' });
                        // }
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

router.post('/yarn_order_allocations', async (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var yarnId = req.body.yarnId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_yarn_order_allocations(line_id,yarnLineId,yarnType,utilisationOrderNo, colour, lotNo, allocatedYarnKgs, unallocatedYarnKgs,createdBy,orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var yarnLineId = datalist.yarnLineId ? datalist.yarnLineId : 0;
            var yarnType = datalist.yarnType ? datalist.yarnType : '';
            var utilisationOrderNo = datalist.utilisationOrderNo ? datalist.utilisationOrderNo : '';
            var colour = datalist.colour ? datalist.colour : '';
            var lotNo = datalist.lotNo ? datalist.lotNo : '';
            var allocatedYarnKgs = datalist.allocatedYarnKgs ? datalist.allocatedYarnKgs : '';
            var unallocatedYarnKgs = datalist.unallocatedYarnKgs ? datalist.unallocatedYarnKgs : '';
            bulkInsert =
                `(${db.escape(line_id)},${db.escape(yarnLineId)},${db.escape(yarnType)},${db.escape(utilisationOrderNo)},${db.escape(colour)},${db.escape(lotNo)},${db.escape(allocatedYarnKgs)},${db.escape(unallocatedYarnKgs)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','
            }
            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_yarn_order_allocations(?,?,?,?)', [yarnId, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        // if (id == 0) {
                        res.json({ success: true, message: 'added successfully' });
                        // } else {
                        //     res.json({ success: true, message: 'updated successfully' });
                        // }
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

router.post('/yarn_receipts_lines', async (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var yarnId = req.body.yarnId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_yarn_receipts_lines(line_id,yarnOrderId, spinningChallan, scandexChallan, receiptDt, knitFactory, BagsCtnNos, receiptYarnKgs, pendingReceiptKgs,createdBy,orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var yarnOrderId = datalist.yarnOrderId ? datalist.yarnOrderId : 0;
            var spinningChallan = datalist.spinningChallan ? datalist.spinningChallan : '';
            var scandexChallan = datalist.scandexChallan ? datalist.scandexChallan : '';
            var receiptDt = datalist.receiptDt ? datalist.receiptDt : NULL;
            var knitFactory = datalist.knitFactory ? datalist.knitFactory : '';
            var BagsCtnNos = datalist.BagsCtnNos ? datalist.BagsCtnNos : '';
            var receiptYarnKgs = datalist.receiptYarnKgs ? datalist.receiptYarnKgs : '';
            var pendingReceiptKgs = datalist.pendingReceiptKgs ? datalist.pendingReceiptKgs : '';
            bulkInsert =
                `(${db.escape(line_id)},${db.escape(yarnOrderId)},${db.escape(spinningChallan)},${db.escape(scandexChallan)},${db.escape(receiptDt)},${db.escape(knitFactory)},${db.escape(BagsCtnNos)},${db.escape(receiptYarnKgs)},${db.escape(pendingReceiptKgs)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','
            }
            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_yarn_receipts_lines(?,?,?,?)', [yarnId, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        // if (id == 0) {
                        res.json({ success: true, message: 'added successfully' });
                        // } else {
                        //     res.json({ success: true, message: 'updated successfully' });
                        // }
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

router.post('/yarn_quality_check', async (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var yarnId = req.body.yarnId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_yarn_quality_check(line_id,yarnReceiptId, checkDate, checkResults, yarnAcceptRejectStatus,createdBy,orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var yarnReceiptId = datalist.yarnReceiptId ? datalist.yarnReceiptId : 0;
            var checkDate = datalist.checkDate ? datalist.checkDate : null;
            var checkResults = datalist.checkResults ? datalist.checkResults : '';
            var yarnAcceptRejectStatus = datalist.yarnAcceptRejectStatus ? datalist.yarnAcceptRejectStatus : '';

            bulkInsert =
                `(${db.escape(line_id)},${db.escape(yarnReceiptId)},${db.escape(checkDate)},${db.escape(checkResults)},${db.escape(yarnAcceptRejectStatus)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','
            }
            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_yarn_quality_check(?,?,?,?)', [yarnId, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        // if (id == 0) {
                        res.json({ success: true, message: 'added successfully' });
                        // } else {
                        //     res.json({ success: true, message: 'updated successfully' });
                        // }
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

router.delete('/yarn/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_yarn(?,?,?)', [id, loginId, orgId],
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

router.get('/yarn-filter', (req, res, next) => {
    try {

        var id = req.query.id ? req.query.id : 0;
        var spinner = req.query.spinner ? req.query.spinner : '';
        // var date = req.query.date ? req.query.date : null;
        var lcNo = req.query.lcNo ? req.query.lcNo : '';
        var lcValue = req.query.lcValue ? req.query.lcValue : '';
        var yarnStatus = req.query.yarnStatus ? req.query.yarnStatus : '';
        var pi = req.query.pi ? req.query.pi : '';
        // var fabricType = req.query.fabricType ? req.query.fabricType : '';
        // var batchNo = req.query.batchNo ? req.query.batchNo : '';
        var orgId = req.decoded.orgId;

        Query = `select dy.id,dy.spinner,dy.lcNo,dy.lcValue,dy.yarnStatus,dy.piDate,dy.lcDate,dy.pi from yarn dy
        where dy.orgId = ${orgId}  and dy.status = 1 and dy.delStatus = 0`

        if (id != 0) {
            Query = Query + ` and dy.id = ('${id}')`
        }
        if (spinner != '') {
            Query = Query + ` and dy.spinner = ('${spinner}')`
        }
        if (lcNo != '') {
            Query = Query + ` and dy.lcNo IN ('${lcNo}')`
        }
        if (lcValue != '') {
            Query = Query + ` and dy.lcValue IN ('${lcValue}')`
        }
        if (yarnStatus != '') {
            Query = Query + ` and dy.yarnStatus IN ('${yarnStatus}')`
        }
        if (pi != '') {
            Query = Query + ` and dy.pi IN ('${pi}')`
        }

        // if (fabricType != '') {
        //     Query = Query + ` and dy.fabricType IN ('${fabricType}')`
        // }
        // if (batchNo != '') {
        //     Query = Query + ` and dy.batchNo IN ('${batchNo}')`
        // }


        // if (date != null) {
        //     Query = Query + ` and dy.date = ('${date}')`
        // }
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



module.exports = router;







