const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
app.set('superSecret', config.secret);
// const { format } = require('date-fns');


// ============= Fabric Entries =======================================================================================================

router.get('/fabric-entrys', (req, res, next) => {
    try {
        var id = req.query.id ? req.query.id : 0;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        var entry = req.query.entry;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_fabric_entrys(?,?,?,?,?,?,?,?)', [id, buyer, orderNo, style, color, size, entry, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorder: [] });
                    }
                    else {
                        // console.log(rows.RowDataPacket);
                        const workorder = rows.RowDataPacket[0][0];
                        const fabricRolls = rows.RowDataPacket[1];
                        res.send({
                            success: true,
                            workorder: workorder,
                            fabricRolls: fabricRolls

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


router.post('/fabric-entrys', async (req, res, next) => {
    try {
        // console.log(req.body)
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_fabric_roll(id,workorderId,rollNo,fabBarcode,entry_1,entry_2,entry_3,entry_4,entry_5,entry_6,entry_7,createdBy,orgId) values "
        var workorderId = req.body.workorderId;
        var entry = req.body.entry;
        var data = req.body.entrys;
        var i = 0;

        for (let datalist of data) {

            var id = datalist.id ? datalist.id : 0;
            var rollNo = datalist.rollNo;
            var fabBarcode = datalist.fabBarcode;
            var entry_1 = datalist.entry_1 ? datalist.entry_1 : 0;
            var entry_2 = datalist.entry_2 ? datalist.entry_2 : 0;
            var entry_3 = datalist.entry_3 ? datalist.entry_3 : 0;
            var entry_4 = datalist.entry_4 ? datalist.entry_4 : 0;
            var entry_5 = datalist.entry_5 ? datalist.entry_5 : 0;
            var entry_6 = datalist.entry_6 ? datalist.entry_6 : 0;
            var entry_7 = datalist.entry_7 ? datalist.entry_7 : 0;

            bulkInsert =

                `(${db.escape(id)},${db.escape(workorderId)},${db.escape(rollNo)},${db.escape(fabBarcode)},${db.escape(entry_1)},${db.escape(entry_2)},${db.escape(entry_3)},${db.escape(entry_4)},${db.escape(entry_5)},${db.escape(entry_6)},${db.escape(entry_7)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','

            }

            i = i + 1;
        }

        // console.log(headerQuery)

        client.executeNonQuery('ppost_fabric_entrys(?,?,?,?,?,?)', [id, workorderId, entry, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        res.json({ success: true, message: 'added successfully' });
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

// ======================================================================================================================================
// ================================= Transcation datas ==================================================================================
//======================================================================================================================================= 

router.get('/transcation-entrys', (req, res, next) => {
    try {
        var id = req.query.id ? req.query.id : 0;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        var entry = req.query.entry;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_transcationEntry(?,?,?,?,?,?,?,?)', [id, buyer, orderNo, style, color, size, entry, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorder: [] });
                    }
                    else {
                        // console.log(rows.RowDataPacket);
                        const workorder = rows.RowDataPacket[0][0];
                        const entry1 = rows.RowDataPacket[1];
                        const entry2 = rows.RowDataPacket[2];
                        const entry3 = rows.RowDataPacket[3];
                        const entry4 = rows.RowDataPacket[4];
                        const entry5 = rows.RowDataPacket[5];
                        const entry6 = rows.RowDataPacket[6];
                        const entry7 = rows.RowDataPacket[7];
                        const total_1 = rows.RowDataPacket[8];
                        const total_2 = rows.RowDataPacket[9];
                        const total_3 = rows.RowDataPacket[10];
                        const total_4 = rows.RowDataPacket[11];
                        const total_5 = rows.RowDataPacket[12];
                        const total_6 = rows.RowDataPacket[13];
                        const total_7 = rows.RowDataPacket[14];


                        res.send({
                            success: true,
                            workorder: workorder,
                            entry1 : entry1,
                            entry2 : entry2,
                            entry3 : entry3,
                            entry4 : entry4,
                            entry5 : entry5,
                            entry6 : entry6,
                            entry7 : entry7,
                            total_1:total_1,
                            total_2:total_2,
                            total_3:total_3,
                            total_4:total_4,
                            total_5:total_5,
                            total_6:total_6,
                            total_7:total_7

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

router.post('/transcation-entry1', async (req, res, next) => {
    try {
        // console.log(req.body)
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_entry_1(entryId, workorderId,days, notes,noOfRolls,entry_1,production_date,createdBy,orgId) values "
        var workorderId = req.body.workorderId;
        var entry = req.body.entry;
        var data = req.body.entry1;
        var i = 0;

        for (let datalist of data) {

            var id = datalist.id ? datalist.id : 0;
            var days = datalist.days ? datalist.days : null;
            var notes = datalist.notes;
            var noOfRolls = datalist.noOfRolls? datalist.noOfRolls : 0;
            var entry_1 = datalist.entry_1 ? datalist.entry_1 : 0;
            var production_date = datalist.production_date

            bulkInsert =

                `(${db.escape(id)},${db.escape(workorderId)},${db.escape(days)},${db.escape(notes)},${db.escape(noOfRolls)},${db.escape(entry_1)},${db.escape(production_date)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','

            }

            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_transcationentry_1(?,?,?,?,?,?)', [id,workorderId, entry, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        res.json({ success: true, message: 'Entry-1 added successfully' });
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

router.post('/transcation-entry2', async (req, res, next) => {
    try {
        // console.log(req.body)
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_entry_2(entryId,workorderId,days,notes,noOfRolls,entry_2,production_date,createdBy,orgId) values "
        var workorderId = req.body.workorderId;
        var entry = req.body.entry;
        var data = req.body.entry2;
        var i = 0;

        for (let datalist of data) {

            var id = datalist.id ? datalist.id : 0;
            var days = datalist.days;
            var notes = datalist.notes;
            var noOfRolls = datalist.noOfRolls;
            var entry_2 = datalist.entry_2 ? datalist.entry_2 : 0;
            var production_date = datalist.production_date

            bulkInsert =

                `(${db.escape(id)},${db.escape(workorderId)},${db.escape(days)},${db.escape(notes)},${db.escape(noOfRolls)},${db.escape(entry_2)},${db.escape(production_date)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','

            }

            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_transcationentry_2(?,?,?,?,?,?)', [id, workorderId, entry, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        res.json({ success: true, message: 'Entry-2 added successfully' });
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


router.post('/transcation-entry3', async (req, res, next) => {
    try {
        // console.log(req.body)
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_entry_3(entryId,workorderId,days,notes,batchCode,noOfRolls,entry_3,production_date,createdBy,orgId) values "
        var workorderId = req.body.workorderId;
        var entry = req.body.entry;
        var data = req.body.entry3;
        var i = 0;

        for (let datalist of data) {

            var id = datalist.id ? datalist.id : 0;
            var days = datalist.days;
            var notes = datalist.notes;
            var batchCode = datalist.batchCode;
            var noOfRolls = datalist.noOfRolls;
            var entry_3 = datalist.entry_3 ? datalist.entry_3 : 0;
            var production_date = datalist.production_date

            bulkInsert =
                `(${db.escape(id)},${db.escape(workorderId)},${db.escape(days)},${db.escape(notes)},${db.escape(batchCode)},${db.escape(noOfRolls)},${db.escape(entry_3)},${db.escape(production_date)},${db.escape(loginId)},${db.escape(orgId)})`;
            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','
            }
            i = i + 1;
        }
        console.log(headerQuery)

        client.executeNonQuery('ppost_transcationentry_3(?,?,?,?,?,?)', [id, workorderId, entry, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        res.json({ success: true, message: 'Entry-3 added successfully' });
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

router.post('/transcation-entry4', async (req, res, next) => {
    try {
        // console.log(req.body)
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_entry_4(entryId,workorderId,days,notes,noOfRolls,entry_4,production_date,createdBy,orgId) values "
        var workorderId = req.body.workorderId;
        var entry = req.body.entry;
        var data = req.body.entry4;
        var i = 0;

        for (let datalist of data) {

            var id = datalist.id ? datalist.id : 0;
            var days = datalist.days;
            var notes = datalist.notes;
            var noOfRolls = datalist.noOfRolls;
            var entry_4 = datalist.entry_4 ? datalist.entry_4 : 0;
            var production_date = datalist.production_date

            bulkInsert =
                `(${db.escape(id)},${db.escape(workorderId)},${db.escape(days)},${db.escape(notes)},${db.escape(noOfRolls)},${db.escape(entry_4)},${db.escape(production_date)},${db.escape(loginId)},${db.escape(orgId)})`;
            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','
            }
            i = i + 1;
        }
        console.log(headerQuery)

        client.executeNonQuery('ppost_transcationentry_4(?,?,?,?,?,?)', [id, workorderId, entry, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        res.json({ success: true, message: 'Entry-4 added successfully' });
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

router.post('/transcation-entry5', async (req, res, next) => {
    try {
        // console.log(req.body)
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_entry_5(entryId,workorderId,days,notes,noOfRolls,entry_5,production_date,createdBy,orgId) values "
        var workorderId = req.body.workorderId;
        var entry = req.body.entry;
        var data = req.body.entry5;
        var i = 0;

        for (let datalist of data) {

            var id = datalist.id ? datalist.id : 0;
            var days = datalist.days;
            var notes = datalist.notes;
            var noOfRolls = datalist.noOfRolls;
            var entry_5 = datalist.entry_5 ? datalist.entry_5 : 0;
            var production_date = datalist.production_date

            bulkInsert =

                `(${db.escape(id)},${db.escape(workorderId)},${db.escape(days)},${db.escape(notes)},${db.escape(noOfRolls)},${db.escape(entry_5)},${db.escape(production_date)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','

            }

            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_transcationentry_5(?,?,?,?,?,?)', [id, workorderId, entry, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        res.json({ success: true, message: 'Entry-5 added successfully' });
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

router.post('/transcation-entry6', async (req, res, next) => {
    try {
        // console.log(req.body)
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_entry_6(entryId,workorderId,days,notes,noOfRolls,entry_6,production_date,createdBy,orgId) values "
        var workorderId = req.body.workorderId;
        var entry = req.body.entry;
        var data = req.body.entry6;
        var i = 0;

        for (let datalist of data) {

            var id = datalist.id ? datalist.id : 0;
            var days = datalist.days;
            var notes = datalist.notes;
            var noOfRolls = datalist.noOfRolls;
            var entry_6 = datalist.entry_6 ? datalist.entry_6 : 0;
            var production_date = datalist.production_date

            bulkInsert =

                `(${db.escape(id)},${db.escape(workorderId)},${db.escape(days)},${db.escape(notes)},${db.escape(noOfRolls)},${db.escape(entry_6)},${db.escape(production_date)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','

            }

            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_transcationentry_6(?,?,?,?,?,?)', [id, workorderId, entry, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        res.json({ success: true, message: 'Entry-6 added successfully' });
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

router.post('/transcation-entry7', async (req, res, next) => {
    try {
        // console.log(req.body)
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_entry_7(entryId,workorderId,days,notes,noOfRolls,entry_7,production_date,createdBy,orgId) values "
        var workorderId = req.body.workorderId;
        var entry = req.body.entry;
        var data = req.body.entry7;
        var i = 0;

        for (let datalist of data) {

            var id = datalist.id ? datalist.id : 0;
            var days = datalist.days;
            var notes = datalist.notes;
            var noOfRolls = datalist.noOfRolls;
            var entry_7 = datalist.entry_7 ? datalist.entry_7 : 0;
            var production_date = datalist.production_date

            bulkInsert =

                `(${db.escape(id)},${db.escape(workorderId)},${db.escape(days)},${db.escape(notes)},${db.escape(noOfRolls)},${db.escape(entry_7)},${db.escape(production_date)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','

            }

            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_transcationentry_7(?,?,?,?,?,?)', [id, workorderId, entry, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        res.json({ success: true, message: 'Entry-7 added successfully' });
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


router.delete('/entry1', (req, res, next) => {
    try {
        var id = req.query.id;
        var loginId = req.decoded.loginId;
        var line_Id = req.query.line_Id
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_entry1(?,?,?,?)', [id, line_Id, loginId, orgId],
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

router.delete('/entry2', (req, res, next) => {
    try {
        var id = req.query.id;
        var loginId = req.decoded.loginId;
        var line_Id = req.query.line_Id
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_entry2(?,?,?,?)', [id, line_Id, loginId, orgId],
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

router.delete('/entry3', (req, res, next) => {
    try {
        var id = req.query.id;
        var loginId = req.decoded.loginId;
        var line_Id = req.query.line_Id
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_entry3(?,?,?,?)', [id, line_Id, loginId, orgId],
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

router.delete('/entry4', (req, res, next) => {
    try {
        var id = req.query.id;
        var loginId = req.decoded.loginId;
        var line_Id = req.query.line_Id
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_entry4(?,?,?,?)', [id, line_Id, loginId, orgId],
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

router.delete('/entry5', (req, res, next) => {
    try {
        var id = req.query.id;
        var loginId = req.decoded.loginId;
        var line_Id = req.query.line_Id
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_entry5(?,?,?,?)', [id, line_Id, loginId, orgId],
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

router.delete('/entry6', (req, res, next) => {
    try {
        var id = req.query.id;
        var loginId = req.decoded.loginId;
        var line_Id = req.query.line_Id
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_entry6(?,?,?,?)', [id, line_Id, loginId, orgId],
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

router.delete('/entry7', (req, res, next) => {
    try {
        var id = req.query.id;
        var loginId = req.decoded.loginId;
        var line_Id = req.query.line_Id
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_entry7(?,?,?,?)', [id, line_Id, loginId, orgId],
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



router.post('/fabrictransfer', async (req, res, next) => {
    try {
        // console.log(req.body)
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_fab_entry(fabId,transferNo,transferDate,buyer,orderNo,style,color,size,woId,fabRolls,finishFabKg,createdBy,orgId) values "
        var data = req.body.fabentry;
        var i = 0;

        for (let datalist of data) {
            var id = datalist.id ? datalist.id : 0;
            var buyer = datalist.buyer;
            var orderNo = datalist.orderNo;
            var style = datalist.style;
            var color = datalist.color;
            var size = datalist.size;
            var woId = datalist.woId;
            var transferNo = datalist.transferNo;
            var fabRolls = datalist.fabRolls;
            var finishFabKg = datalist.finishFabKg ? datalist.finishFabKg : 0;
            var transferDate = datalist.transferDate;

            bulkInsert =

                `(${db.escape(id)},${db.escape(transferNo)},${db.escape(transferDate)},${db.escape(buyer)},${db.escape(orderNo)},${db.escape(style)},${db.escape(color)},${db.escape(size)},${db.escape(woId)},${db.escape(fabRolls)},${db.escape(finishFabKg)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','

            }

            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_fabrictransfer(?,?,?)', [headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'Something went worng' });
                    } else {
                        res.json({ success: true, message: 'Added successfully' });
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

router.get('/allFabEntrys', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var Buyer = req.query.Buyer ? req.query.Buyer : '';
        var Order = req.query.Order ? req.query.Order : '';
        var ToDate = req.query.toDate ? req.query.toDate : '';
        var FromDate = req.query.fromDate ? req.query.fromDate : '';
        Query = `SELECT 
        id, 
        buyer, 
        orderNo, 
        style, 
        color, 
        size, 
        woId, 
        rollNo, 
        finishKg, 
        date_format(transfer_date, "%Y-%m-%d") AS transfer_date, 
        transferno , 
        date_format(createdAt ,"%Y-%m-%d")
        FROM fabrictransfer WHERE orgId = ${orgId}`

        if (Buyer != '') {
            Query = Query + ` and buyer = ('${Buyer}')`
        }
        
        if (Order != '') {
            Query = Query + ` and orderNo = ('${Order}')`
        }

        if (FromDate != '') {
            Query = Query + ` and date_format(createdAt ,"%Y-%m-%d") BETWEEN ('${FromDate}') AND ('${ToDate}')`
        }


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', fabDetails: [] });
                    }
                    else {
                        const fabDetails = rows.RowDataPacket;

                        res.send({
                            success: true,
                            fabDetails: fabDetails
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




router.get('/singleFabEntrys/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pview_fabEntry(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', fabDetails: [] });
                    }
                    else {
                        const fabDetails = rows.RowDataPacket;

                        res.send({
                            success: true,
                            fabDetails: fabDetails
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


router.delete('/FabEntrysDelete/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_FabricsTransferList(?,?)', [id,orgId],
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


module.exports = router;