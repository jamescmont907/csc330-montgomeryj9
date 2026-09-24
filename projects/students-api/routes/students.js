// routes/students.js
const router = require('express').Router();
const { body, param, query, validationResult } = require('express-validator');

// ─────────────────────────────────────────────────────────────
// In-memory "database" (stands in for a real DB in this lecture)
// ─────────────────────────────────────────────────────────────
let students = [
  { id: 1, name: 'Adam Smith',   email: 'ada@example.com',   role: 'admin' },
  { id: 2, name: 'Anthony Williams', email: 'linus@example.com', role: 'user'  },
  { id: 3, name: 'Grace Hopper',   email: 'grace@example.com', role: 'admin' },
];

// ─────────────────────────────────────────────────────────────
// Helper: run validationResult and respond 400 if errors exist
// ─────────────────────────────────────────────────────────────
function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;                       // caller should stop
  }
  return true;                          // caller can proceed
}

// ─────────────────────────────────────────────────────────────
// READ — list all students
//   Optional query params: ?role=admin  &  ?sort=name
// ─────────────────────────────────────────────────────────────
router.get(
  '/',
  query('role').optional().isIn(['admin', 'user'])
    .withMessage('role must be "admin" or "user"'),
  query('sort').optional().isIn(['name'])
    .withMessage('sort must be "name"'),
  (req, res) => {
    if (!checkValidation(req, res)) return;

    const { role, sort } = req.query;
    let result = students;

    if (role) {
      result = result.filter(s => s.role === role);
    }

    if (sort === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json(result);
  }
);

// ─────────────────────────────────────────────────────────────
// READ — one student by route param :id
// ─────────────────────────────────────────────────────────────
router.get(
  '/:id',
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
  (req, res) => {
    if (!checkValidation(req, res)) return;

    const id = Number(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  }
);

// ─────────────────────────────────────────────────────────────
// CREATE — add a new student (data comes from req.body)
// ─────────────────────────────────────────────────────────────
router.post(
  '/',
  body('name').trim().notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('email must be valid'),
  body('role').optional().isIn(['admin', 'user'])
    .withMessage('role must be "admin" or "user"'),
  (req, res) => {
    if (!checkValidation(req, res)) return;

    const { name, email, role } = req.body;

    const newStudent = {
      id: students.length ? Math.max(...students.map(s => s.id)) + 1 : 1,
      name,
      email,
      role: role || 'user',
    };

    students.push(newStudent);
    res.status(201).json(newStudent);
  }
);

// ─────────────────────────────────────────────────────────────
// UPDATE — partial update (route param :id + body fields)
// ─────────────────────────────────────────────────────────────
router.patch(
  '/:id',
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
  body('name').optional().trim().notEmpty()
    .withMessage('name cannot be empty'),
  body('email').optional().isEmail()
    .withMessage('email must be valid'),
  body('role').optional().isIn(['admin', 'user'])
    .withMessage('role must be "admin" or "user"'),
  (req, res) => {
    if (!checkValidation(req, res)) return;

    const id = Number(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    Object.assign(student, req.body);   // merge only the fields sent
    res.json(student);
  }
);

// ─────────────────────────────────────────────────────────────
// DELETE — remove a student by route param :id
// ─────────────────────────────────────────────────────────────
router.delete(
  '/:id',
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),
  (req, res) => {
    if (!checkValidation(req, res)) return;

    const id = Number(req.params.id);
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }

    students.splice(index, 1);
    res.status(204).end();              // 204 No Content
  }
);

module.exports = router;