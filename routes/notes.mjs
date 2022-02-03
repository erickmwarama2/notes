import { default as express } from 'express';
import { NotesStore as notes } from '../app.mjs';

export const router = express.Router();

router.get('/add', (req, res, next) => {
    res.render('noteedit', {
        title: "Add a Note",
        docreate: true,
        notekey: '',
        note: undefined
    })
});

router.post('/save', async (req, res, next) => {
    try{
        let note;

        if(req.body.docreate === 'create'){
            note = await notes.create(req.body.notekey, req.body.notetitle, req.body.body);
        }else{
            note = await notes.update(req.body.notekey, req.body.notetitle, req.body.body);
        }

        res.redirect('/notes/view?key='+req.body.notekey);
        //res.redirect('/');
    }catch(err){
        next(err);
    }
});

router.post('/destroy/confirm', async (req, res, next)=>{
    try{
        await notes.destroy(req.body.notekey);
        res.redirect('/');
    }catch(err){
        next(err);
    }
});

router.get('/destroy', async (req, res, next)=>{
    try{
        let note = await notes.read(req.query.key);
        res.render('notdestroy', {
            title: note? note.title : '',
            notekey: req.query.key,
            note: note
        })
    }catch(err){
        next(err);
    }
});

router.get('/edit', async (req, res, next) => {
    try{
        let note = await notes.read(req.query.key);
        res.render('noteedit', {
            title: note ? "Edit " + note.title : 'Add a Note',
            docreate: false,
            notekey: req.query.key,
            note: note
        })
    }catch(err){
        next(err);
    }
});

router.get('/view', async (req, res, next)=>{
    try{
        let note = await notes.read(req.query.key);

        res.render('noteview', {
            title: note ? note.title : "",
            notekey: req.query.key,
            note: note
        });
    }catch(err){
        next(err);
    }
});