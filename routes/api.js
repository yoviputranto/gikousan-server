const router = require('express').Router();
const apiController = require('../controllers/apiController');
const shopCategoryController = require('../controllers/api/shopCategoryController');
const shopTypeController = require('../controllers/api/shopTypeController');
const adminController = require('../controllers/api/adminController');
const customerController = require('../controllers/api/customerController');
const paymentMethodController = require('../controllers/api/paymentMethodController');
const transactionController = require('../controllers/api/transactionController');
const transactionDetailController = require('../controllers/api/transactionDetailController');
const shoppingController = require('../controllers/api/shoppingController');
const authController = require('../controllers/api/authController');
const { uploadSingle } = require('../middlewares/multer');
const ShopCategory = require('../models/ShopCategory');
const auth = require('../middlewares/auth');

router.get('/test-connection',apiController.testConnection);

router.post('/login', authController.login);
router.post('/logout',auth,authController.logout);


//shop category
router.get('/shop-category',shopCategoryController.readShopCategory);
router.get('/shop-category/:id',shopCategoryController.readDetailShopCategory);
router.post('/shop-category/',auth, uploadSingle, shopCategoryController.createShopCategory);
router.patch('/shop-category/:id',uploadSingle,shopCategoryController.editShopCategory);
router.delete('/shop-category/:id',shopCategoryController.deleteShopCategory);

//shop type
router.get('/shop-type',shopTypeController.readShopType);
router.get('/shop-type/:id',shopTypeController.readDetailShopType);
router.post('/shop-type/', uploadSingle, shopTypeController.createShopType);
router.patch('/shop-type/:id',uploadSingle,shopTypeController.editShopType);
router.delete('/shop-type/:id',shopTypeController.deleteShopType);

//admin
router.get('/admin',adminController.readAdmin);
router.get('/admin/:id',adminController.readDetailAdmin);
router.post('/admin/', uploadSingle, adminController.createAdmin);
router.patch('/admin/:id',uploadSingle,adminController.editAdmin);
router.delete('/admin/:id',adminController.deleteAdmin);

//customer
router.get('/customer',customerController.readCustomer);
router.get('/customer/:id',customerController.readDetailCustomer);
router.post('/customer/', uploadSingle, customerController.createCustomer);
router.patch('/customer/:id',uploadSingle,customerController.editCustomer);
router.delete('/customer/:id',customerController.deleteCustomer);

//payment method
router.get('/payment-method',paymentMethodController.readPaymentMethod);
router.get('/payment-method/:id',paymentMethodController.readDetailPaymentMethod);
router.post('/payment-method/', uploadSingle, paymentMethodController.createPaymentMethod);
router.patch('/payment-method/:id',uploadSingle,paymentMethodController.editPaymentMethod);
router.delete('/payment-method/:id',paymentMethodController.deletePaymentMethod);

//
router.get('/transaction',transactionController.readTransaction);
router.get('/transaction/:id',transactionController.readDetailTransaction);
router.post('/transaction/', uploadSingle, transactionController.createTransaction);
router.patch('/transaction/:id',uploadSingle,transactionController.editTransaction);
router.delete('/transaction/:id',transactionController.deleteTransaction);

//shop category
router.get('/transaction-detail',transactionDetailController.readTransactionDetail);
router.get('/transaction-detail/:id',transactionDetailController.readDetailTransactionDetail);
router.post('/transaction-detail/', uploadSingle, transactionDetailController.createTransactionDetail);
router.patch('/transaction-detail/:id',uploadSingle,transactionDetailController.editTransactionDetail);
router.delete('/transaction-detail/:id',transactionDetailController.deleteTransactionDetail);

//shop category
router.get('/shopping',shoppingController.readShopping);
router.get('/shopping/:id',shoppingController.readDetailShopping);
router.post('/shopping/', uploadSingle, shoppingController.createShopping);
router.patch('/shopping/:id',uploadSingle,shoppingController.editShopping);
router.delete('/shopping/:id',shoppingController.deleteShopping);


module.exports = router;