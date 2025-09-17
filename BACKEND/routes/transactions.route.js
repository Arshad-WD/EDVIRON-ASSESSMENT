const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getTransactions, getTransactionsBySchool, getTransactionStatus, updateTransaction } = require("../controllers/transaction.controller");

router.get("/transactions", authMiddleware, getTransactions);
router.get("/transactions/school/:schoolId", authMiddleware, getTransactionsBySchool);
router.get("/transaction-status/:custom_order_id", authMiddleware, getTransactionStatus);
router.put("/transactions/:id", authMiddleware,updateTransaction)

module.exports = router;

