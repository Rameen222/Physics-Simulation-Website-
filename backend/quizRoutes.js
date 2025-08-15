// backend/quizRoutes.js
const express = require("express");
const router = express.Router();
const db = require("./db"); // mysql2/promise pool

// GET all quizzes with questions and options  ->  returns { [slug]: { title, className, description, questions: [ {id, text, options:[{id,text,isCorrect}]} ] } }
router.get("/", async (req, res, next) => {
  const sql = `
    SELECT 
      q.id            AS quiz_id,
      q.slug,
      q.title,
      q.className,
      q.description,
      qs.id           AS question_id,
      qs.text         AS question_text,
      a.id            AS answer_id,
      a.option_text,
      a.is_correct
    FROM quizzes q
    JOIN questions qs ON q.id = qs.quiz_id
    JOIN answers   a  ON qs.id = a.question_id
    ORDER BY q.id, qs.id, a.id;
  `;

  try {
    const [rows] = await db.query(sql);

    const quizzes = {};
    for (const row of rows) {
      if (!quizzes[row.slug]) {
        quizzes[row.slug] = {
          title: row.title,
          className: row.className,
          description: row.description,
          questions: []
        };
      }

      const quiz = quizzes[row.slug];

      let question = quiz.questions.find(q => q.id === row.question_id);
      if (!question) {
        question = {
          id: row.question_id,
          text: row.question_text,
          options: []
        };
        quiz.questions.push(question);
      }

      question.options.push({
        id: row.answer_id,
        text: row.option_text,
        isCorrect: !!row.is_correct
      });
    }

    res.json(quizzes);
  } catch (err) {
    next(err);
  }
});

// GET single quiz by slug: /api/quizzes/:slug
// -> { title, description, questions:[ {id,text,options:[{text,isCorrect}]} ] }
router.get("/:slug", async (req, res, next) => {
  const sql = `
    SELECT
      q.title,
      q.description,
      qs.id    AS question_id,
      qs.text  AS question_text,
      a.option_text,
      a.is_correct
    FROM quizzes q
    JOIN questions qs ON q.id = qs.quiz_id
    JOIN answers   a  ON qs.id = a.question_id
    WHERE q.slug = ?
    ORDER BY qs.id, a.id;
  `;
  try {
    const [rows] = await db.query(sql, [req.params.slug]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const quiz = {
      title: rows[0].title,
      description: rows[0].description,
      questions: []
    };

    for (const row of rows) {
      let question = quiz.questions.find(q => q.id === row.question_id);
      if (!question) {
        question = {
          id: row.question_id,
          text: row.question_text,
          options: []
        };
        quiz.questions.push(question);
      }
      question.options.push({
        text: row.option_text,
        isCorrect: !!row.is_correct
      });
    }

    res.json(quiz);
  } catch (err) {
    next(err);
  }
});

// GET single question by ID: /api/quizzes/question/:id
// -> { id, text, options:[{text,isCorrect}] }
router.get("/question/:id", async (req, res, next) => {
  const sql = `
    SELECT
      qs.text       AS question_text,
      a.option_text,
      a.is_correct
    FROM questions qs
    JOIN answers   a  ON qs.id = a.question_id
    WHERE qs.id = ?
    ORDER BY a.id;
  `;
  try {
    const [rows] = await db.query(sql, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    const question = {
      id: Number(req.params.id),
      text: rows[0].question_text,
      options: rows.map(r => ({
        text: r.option_text,
        isCorrect: !!r.is_correct
      }))
    };

    res.json(question);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
