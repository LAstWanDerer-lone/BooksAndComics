const router = require("express").Router();
const multer = require('multer');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;

let User = require('../schemas/userSchema');
let Admin = require('../schemas/adminSchema');
let RequestNote = require('../schemas/requestNoteSchema');

router.route('/getfile').get((req, res) => {
    const fileName = req.query.fileName;

    return res.download(`d:/share_notes/server/notes/${fileName}`, fileName, function (error) {
        if (error) {
            console.log(error);
        }
    });

});

router.route('/course').get((req, res) => {
    const courseName = req.query.courseName;
    let Course = require('../schemas/courseSchema')(courseName);

    Course.find().sort('semester')
        .then((notes) => {
            return res.json({
                "status": res.statusCode,
                "message": "found!",
                "courseData": notes
            })
        })
        .catch((error) => {
            return res.json({
                "status": res.statusCode,
                "message": error
            })
        });
});

router.route('/login').get((req, res) => {

    const email = req.query.email;
    const password = req.query.password;
    const isAdmin = req.query.isAdmin;

    if (isAdmin === "true") {
        Admin.find({
            email: email, password: password
        }, (error, adminFound) => {
            if (error) {
                return res.json({
                    "status": res.statusCode,
                    "message": `${error}`
                });
            } else {
                if (adminFound.length <= 0) {
                    return res.json({
                        "status": 404,
                        "message": `Admin Not Found!`
                    });
                } else {
                    return res.json({
                        "status": res.statusCode,
                        "message": `Admin Found!`,
                        "user": adminFound
                    });
                }
            }
        });
    } else {
        User.find({
            email: email, password: password
        }, (error, userFound) => {
            if (error) {
                return res.json({
                    "status": res.statusCode,
                    "message": `${error}`
                });
            } else {
                if (userFound.length <= 0) {
                    return res.json({
                        "status": 404,
                        "message": `User Not Found!`
                    });
                } else {
                    return res.json({
                        "status": res.statusCode,
                        "message": `User Found!`,
                        "user": userFound
                    });
                }
            }
        });
    }
});

router.route('/register').post((req, res) => {

    const userData = req.body;

    const firstName = userData.firstName;
    const lastName = userData.lastName;
    const college = userData.college;
    const email = userData.email;
    const password = userData.password;

    const newUser = new User({ firstName, lastName, college, email, password });

    newUser.save()
        .then((addedUser) => {
            return res.json({
                "status": res.statusCode,
                "message": "User Registered!",
                "user": addedUser
            });
        })
        .catch((error) => {
            return res.json({
                "status": 409,
                "message": `${error.message}`
            });
        });
});

router.route('/request').get((req, res) => {
    const userId = req.query.userId;

    RequestNote.find(
        { userId: userId }
    ).then((docs) => {
        return res.json({
            "status": res.statusCode,
            "message": "found!",
            "requestNotes": docs
        })
    })
        .catch((error) => { console.log(error) });

});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'notes');
    },
    filename: function (req, file, cb) {
        const data = req.body;
        const fileName = "request_"+data.course + "_" + data.semester + "_" + data.subjectName + ".pdf";
        cb(null, fileName);
    }
})

let upload = multer({ storage: storage }).array('file');

router.route('/upload').post(upload, async (req, res) => {

    const requestNoteData = req.body;

    const userId = requestNoteData.userId;
    const courseName = requestNoteData.course;
    const semester = requestNoteData.semester;
    const subjectName = requestNoteData.subjectName;
    const fileName = "request_"+courseName + "_" + semester + "_" + subjectName + ".pdf";

    const newRequestNote = new RequestNote({  userId, courseName, semester, subjectName, fileName});

    newRequestNote.save()
        .then((doc) => {
            console.log("doc:", doc);
            return res.json({ "status": res.statusCode, "message": "added!", "note": doc });
        })
        .catch((error) => {
            return res.json({
                "status": 500,
                "message": `${error}`
            });
        });

});

router.route('/delete').delete((req, res) => {
    const requesNoteId =  req.query.requestNoteId;
    const fileName = req.query.fileName;

    RequestNote.findByIdAndDelete(
        { _id: requesNoteId }
    ).then((doc) => {
        fs.unlink(
            `../server/notes/${fileName}`,
            function (error) {
                if (error) {
                    console.log("File Delete Error: ",error);
                } else {
                    console.log("File Deleted");
                }
            }
        );
        return res.json({ "status": res.statusCode, "message": "deleted!", "note": doc });
    })
    .catch((error) => {
        console.log(error);
    })

});

module.exports = router;