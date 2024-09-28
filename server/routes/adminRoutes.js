const router = require("express").Router();
const multer = require('multer');
const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;

let Note = require('../schemas/noteSchema');
let RequestNote = require('../schemas/requestNoteSchema');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'notes')
    },
    filename: function (req, file, cb) {
        const data = req.body;
        const fileName = data.course + "_" + data.semester + "_" + data.subjectName + ".pdf";
        cb(null, fileName);
    }
})

let upload = multer({ storage: storage }).array('file');

router.route('/upload').post(upload, async (req, res) => {

    const noteData = req.body;

    const courseName = noteData.course;
    const semester = noteData.semester;
    const subjectName = noteData.subjectName;
    const fileName = courseName + "_" + semester + "_" + subjectName + ".pdf";

    let Course = require('../schemas/courseSchema')(courseName);

    const newNote = new Note({ subjectName, fileName });

    Course.findOneAndUpdate(
        { semester: semester },
        {
            $push: {
                notes: newNote
            }
        },
        {upsert: true, new: true, setDefaultsOnInsert: true}
        )
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
    const noteId = new ObjectId(req.query.noteId);
    const fileName = req.query.fileName;
    const semesterId = new ObjectId(req.query.semesterId);
    const courseName = req.query.courseName;

    let Course = require('../schemas/courseSchema')(courseName);


    Course.updateOne(
        { _id: semesterId },
        {
            $pull:
                { notes: { _id: noteId } }
        },
        { safe: true },
        function (error, result) {
            if (error) {
                console.log(error);
                return res.send(err);
            }
            else {
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
                Course.findOneAndDelete(
                    {_d: semesterId},
                    {
                       notes: {$exist: true, $size: 0} 
                    },
                    function(error, doc) {
                        if(error){
                            console.log("error2: ",error);
                        }else{
                            console.log("doc: ", doc);
                        }
                    }
                )
                return res.json(result);
            }

        });

});

router.route('/request').get((req, res) => {

    RequestNote.find().then((docs) => {
        return res.json({
            "status": res.statusCode,
            "message": "found!",
            "requestNotes": docs
        })
    })
        .catch((error) => { console.log(error) });

});

router.route('/accept').post((req, res) => {

    const requestNote = req.body.params.requestNote;
    const oldFileName = req.body.params.fileName;

    const id = requestNote._id;
    const newFileName = requestNote.courseName + "_" + requestNote.semester + "_" + requestNote.subjectName + ".pdf";
    const courseName = requestNote.courseName;
    const semester = requestNote.semester;
    const subjectName = requestNote.subjectName;
    
    RequestNote.findByIdAndDelete(
        {_id: id},
    ).then((docs) => {

        fs.rename(
            `../server/notes/${oldFileName}`,
            `../server/notes/${newFileName}`,
            () => {
                console.log("File renamed");
            }
        );

        let Course = require('../schemas/courseSchema')(courseName);
        const fileName = newFileName;
        const newNote = new Note({subjectName, fileName});
        console.log(newNote);
        Course.findOneAndUpdate(
            { semester: semester },
            {
                $push: {
                    notes: newNote
                }
            },
            {upsert: true, new: true, setDefaultsOnInsert: true}
            )
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
    }).catch((error) => {
        console.log(error);
    })

});


module.exports = router;