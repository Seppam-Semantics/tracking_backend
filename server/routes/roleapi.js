const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
app.set('superSecret', config.secret);



//  show case to madan

// async function generateQuery(data) {
//     return new Promise((resolve, reject) => {
//         if (data) {
//             const formattedData = data.slice(0, -1);
//             resolve(`${formattedData};`);
//         } else {
//             resolve('');
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

router.get('/roles', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pgetall_role(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', roles: [] });
                    }
                    else {

                         rows.RowDataPacket[0].forEach(data => {
                            try {
                                data.profiles = JSON.parse(data.profiles);
                            } catch (error) {
                                data.profiles = {};
                            }
                        });
                        res.send({ success: true, roles: rows.RowDataPacket[0] })
                    

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
router.get('/roles/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pview_role(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', role: [] });
                    }
                    else {
                        const profiles = await generateArray(rows.RowDataPacket[0][0].profiles);

                        res.send({
                            success: true, role: {
                                profiles: profiles
                            }
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
router.post('/roles', async (req, res, next) => {
    try {
        var profiles = [];
        var profileQuery = '';
        var id = req.body.id ? req.body.id : 0;
        var name = req.body.name;
        profiles = req.body.profiles;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;

        if (profiles) {
            profileQuery = 'INSERT INTO tmp_roles_profile(roleId,profileId) values'
            profileQuery = await generateQuery(id, profiles, profileQuery);
        }

        console.log(id, name, profileQuery, loginId, orgId);
        client.executeNonQuery('ppost_roles(?,?,?,?,?)', [id, name, profileQuery, loginId, orgId],
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
router.delete('/roles/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_role(?,?,?)', [id, loginId, orgId],
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