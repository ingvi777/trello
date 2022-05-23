import { Router } from 'express';
import mongoose from 'mongoose';
import {desk} from '../models/desk.js';
import {list} from '../models/list.js';
import {card} from '../models/card.js';

const router = Router();

//found desks
router.get('/',async (req, res) => {
    const desks = await desk.find({}).lean();
    res.render('index',{
        desks
    });
});
//delete desk
router.get('/deleteDesk',async (req, res) => {
    const idDesk = Object.values(req.query)[0];
    const idDeskObj = new mongoose.Types.ObjectId(idDesk);
    await desk.deleteOne({ _id: idDeskObj });

    res.redirect('/');
});
//create desk
router.post('/createDesk', async (req, res) => {
    const newDesk = new desk({ name: req.body.desk });
    await newDesk.save(function (err) {
        if (err) return err;
        // saved!
    });
    res.redirect('/');
});
//found lists
router.get('/lists',async (req, res) => {
    const nameDesk = req.query.reqNameDesk;
    const idDesk = req.query.reqIdDesk;
    const idDeskObj = new mongoose.Types.ObjectId(idDesk);
    //found lists
    const lists = await list.find( { idDesk : idDeskObj} ).lean();
    //found cards
    if( lists[0] ) {
        for (let key in lists) {
            lists[key].cards = [];
            for (let e of lists[key].idCards) {
                if (e) {
                    const answerArrObj = await card.find({_id: e}).lean();
                    if (answerArrObj[0] !== undefined) lists[key].cards.push(answerArrObj[0]);
                }
            }
        }
    }
    res.render('lists',{
        nameDesk, idDesk, lists
    });
});
//create list
router.post('/createList', async (req, res) => {
    const nameDesk = req.body.nameDesk;
    const idDesk = req.body.idDesk;
    const objList = new mongoose.Types.ObjectId(idDesk);
    const newDesk = new list({
        idDesk: objList,
        nameDesk: nameDesk
    });
    await newDesk.save(function (err) {
        if (err) return err;
            // saved!
    });
const str = '/lists?reqNameDesk='+nameDesk+'&reqIdDesk='+idDesk;
res.redirect(str);
});
//delete list
router.post('/deleteList', async (req, res) => {
    const nameDesk = req.body.nameDesk;
    const idDesk = req.body.idDesk;
    const idList = req.body.idList;
    const objList = new mongoose.Types.ObjectId(idList);
    await list.deleteOne({ _id: objList });
    const str = '/lists?reqNameDesk='+nameDesk+'&reqIdDesk='+idDesk;
    res.redirect(str);
});
//create card
router.post('/createCard', async (req, res) => {
    const idDesk = req.body.idDesk;
    const nameDesk = req.body.nameDesk;
    const idList = req.body.idList;
    const nameCard = req.body.nameCard;

    //create card
    const newCard = new card(
        {nameCard: nameCard}
    );
    await newCard.save( async function (err,doc) {
        if (err) return err;
        //found id card
        const idCart = doc._id;

        //update list
        const objIdList = new mongoose.Types.ObjectId(idList);
        const objIdCard = new mongoose.Types.ObjectId(idCart);
        await list.findOneAndUpdate(
            {_id : objIdList},
            {
                $push : {
                    idCards: objIdCard
                }
            }
        );
        const str = '/lists?reqNameDesk='+nameDesk+'&reqIdDesk='+idDesk;
        res.redirect(str);
    });
});
//update and delete card
router.post('/updateOrDeleteCard', async (req, res) => {
    let requestString = Object.keys(req.body)[0];
    let request = JSON.parse(requestString);

    if (request.status === 'update'){
        const idCardObj = new mongoose.Types.ObjectId(request.idCard);

        await card.findOneAndUpdate(
            {_id : idCardObj},
            {
                $set : {
                    nameCard: request.inputValue,
                    description: request.textareaValue
                }
            }
        );
        const str = '/lists?reqNameDesk='+ request.nameDesk + '&reqIdDesk=' + request.idDesk;
        res.redirect(str);
    }
    if (request.status === 'delete'){
        const idListObj = new mongoose.Types.ObjectId(request.idList);
        const idCardObj = new mongoose.Types.ObjectId(request.idCard);
        const lists = await list.find( { _id : idListObj} ).lean();

        let idCardArrDelete = lists[0].idCards.filter(function (elem) {
            return String(elem) !== String(idCardObj) && String(elem).length === 24;
        });

        await list.findOneAndUpdate(
            {_id : idListObj},
            {
                $set : {
                    idCards: idCardArrDelete
                }
            }
        );

        await desk.deleteOne({ _id: idCardObj });
        const str = '/lists?reqNameDesk='+ request.nameDesk + '&reqIdDesk=' + request.idDesk;
        res.redirect(str);
    }
});
export {router}