const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
const hash = require('password-hash');
app.set('superSecret', config.secret);
// const { format } = require('date-fns');


// async function generateDate(data) {
//     return new Promise((resolve, reject) => {
//         if (data) {
//             const now = new Date(data);
//             const formattedDate = format(now, 'yyyy-MM-dd');
//             resolve(formattedDate);
//         } else {
//             resolve();
//         }
//     });
// }

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

router.get('/employee', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_employee(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', employees: [] });
                    }
                    else {
                        res.send({ success: true, employees: rows.RowDataPacket[0] })
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


router.get('/employee/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pview_employee(?,?)', [orgId , id],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', employee: [] });
                    }
                    else {
                        const basicData = rows.RowDataPacket[0][0];
                        res.send({
                            success: true,
                            employee: basicData
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



router.post('/employee', async (req, res, next) => {
    try {


        var id = req.body.id ? req.body.id : 0;
        if (id === 0) {
            var password = hash.generate(req.body.password);
        } else {
            var password = '';
        }
        var name = req.body.name;
        var employeeCode = req.body.employeeCode;
        var email = req.body.email;
        var phone = req.body.phone;
        var address = req.body.address;
        var roleId = req.body.roleId;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;

        client.executeNonQuery('ppost_employee(?,?,?,?,?,?,?,?,?,?)', [id, employeeCode, name, email, phone, password, address, roleId, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.affectedRows == 0) {
                        res.json({ success: false, message: 'exsists' });
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


router.delete('/employee/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_employee(?,?,?)', [id, loginId, orgId],
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

router.get('fabricentrys', (req, res, next) => {
    try {
        var workorder = req.query.workorder;
        var entry = req.query.entry;
        console.log(req.query);
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pview_fabricroll(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', employee: [] });
                    }
                    else {
                        const basicData = rows.RowDataPacket[0][0];
                        res.send({
                            success: true,
                            // employee: basicData
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