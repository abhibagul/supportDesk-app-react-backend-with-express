import express from 'express';
import { connectTodb, db } from './db.js';
const app = express();

//middleware
app.use(express.json());

//API
/**
 * Hello - TRIAL TO CHECK
 */
app.post('/hello', (req, res) => {
    let { name } = req.body;
    res.send(`Hello ${name}!`)
})

/**
 * /API/question/@Param = questionId
 * get details by post
 */
app.get('/API/question/:postUri', async (req, res) => {
    const { postUri } = req.params;

    const question = await db.collection("questions").findOne({ postUri })

    if (question) {
        res.json(question);
    } else {
        res.sendStatus(404);
    }

});

/**
 *  Get list of articles
 */
app.get('/API/articles/:sorting/:pageNum/:perPage/', async (req, res) => {

    const { pageNum, perPage, sorting } = req.params;
    let start = (pageNum * perPage) - perPage;
    let end = +perPage;
    let sort = { postRatings: 1 }
    if (sorting == "Popular") {
        sort = { questionDate: -1 }
    }



    try {

        const questionList = await db.collection("questions").find().sort(sort).limit(end).skip(start).toArray();

        // questionList.each((err, item) => {
        //     console.log('err', err, 'item', item)
        // });

        if (questionList) {
            res.send(questionList);
        } else {
            res.sendStatus(404);
        }

    } catch (e) {
        console.log(e.message);
    }

})

/**
 * /API/articles/respond/@param = postUri
 * Add response to the article
 * API/articles/responds/getting-started-with-create-react-app-07OSlJg7jX
 */
app.post('/API/articles/respond/:postUri', async (req, res) => {
    const { postUri } = req.params;
    const dataJson = req.body;

    await db.collection("questions").updateOne({ postUri }, {
        $push: { postCommets: dataJson }
    })

    const question = await db.collection("questions").findOne({ postUri })

    if (question) {
        res.json(question);
    } else {
        res.sendStatus(404);
    }
})

/**
 * /API/articles/create-new
 *  Create a new question
 */
app.post('/API/question/create-new', async (req, res) => {
    const dataJson = req.body;
    await db.collection("questions").insertOne(dataJson);

    const question = await db.collection("questions").findOne({ postUri: dataJson.postUri })

    if (question) {
        res.json(question);
    } else {
        res.sendStatus(404);
    }
})

connectTodb(() => {
    console.log('Connection to db success')
    app.listen(8000, () => {
        console.log('server is listining on port 8000')
    })
})
