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
router.get('/shop-category',auth,shopCategoryController.readShopCategory);
router.get('/shop-category/:id',auth,shopCategoryController.readDetailShopCategory);
router.post('/shop-category/',auth, uploadSingle, shopCategoryController.createShopCategory);
router.patch('/shop-category/:id',auth,uploadSingle,shopCategoryController.editShopCategory);
router.delete('/shop-category/:id',auth,shopCategoryController.deleteShopCategory);

//shop type
router.get('/shop-type',auth,shopTypeController.readShopType);
router.get('/shop-type/:id',auth,shopTypeController.readDetailShopType);
router.post('/shop-type/', uploadSingle, auth, shopTypeController.createShopType);
router.patch('/shop-type/:id',uploadSingle, auth,shopTypeController.editShopType);
router.delete('/shop-type/:id',auth,shopTypeController.deleteShopType);

//admin
router.get('/admin',auth,adminController.readAdmin);
router.get('/admin/:id',auth,adminController.readDetailAdmin);
router.post('/admin/',auth, adminController.createAdmin);
router.patch('/admin/:id',auth,adminController.editAdmin);
router.delete('/admin/:id',auth,adminController.deleteAdmin);

//customer
router.get('/customer',auth,customerController.readCustomer);
router.get('/customer/:id',auth,customerController.readDetailCustomer);
router.post('/customer/', auth,customerController.createCustomer);
router.patch('/customer/:id',auth,customerController.editCustomer);
router.delete('/customer/:id',auth,customerController.deleteCustomer);

//payment method
router.get('/payment-method',auth,paymentMethodController.readPaymentMethod);
router.get('/payment-method/:id',auth,paymentMethodController.readDetailPaymentMethod);
router.post('/payment-method/',auth,uploadSingle,paymentMethodController.createPaymentMethod);
router.patch('/payment-method/:id',auth,uploadSingle,paymentMethodController.editPaymentMethod);
router.delete('/payment-method/:id',auth,paymentMethodController.deletePaymentMethod);

//
router.get('/transaction',auth,transactionController.readTransaction);
router.get('/transaction/:id',auth,transactionController.readDetailTransaction);
router.post('/transaction/',auth, uploadSingle, transactionController.createTransaction);
router.patch('/transaction/:id',auth,uploadSingle,transactionController.editTransaction);
router.delete('/transaction/:id',auth,transactionController.deleteTransaction);

//shop category
router.get('/transaction-detail',auth,transactionDetailController.readTransactionDetail);
router.get('/transaction-detail/:id',auth,transactionDetailController.readDetailTransactionDetail);
router.post('/transaction-detail/',auth, uploadSingle, transactionDetailController.createTransactionDetail);
router.patch('/transaction-detail/:id',auth,uploadSingle,transactionDetailController.editTransactionDetail);
router.delete('/transaction-detail/:id',auth,transactionDetailController.deleteTransactionDetail);

//shop category
router.get('/shopping',auth,shoppingController.readShopping);
router.get('/shopping/:id',auth,shoppingController.readDetailShopping);
router.post('/shopping/',auth, uploadSingle, shoppingController.createShopping);
router.patch('/shopping/:id',auth,uploadSingle,shoppingController.editShopping);
router.delete('/shopping/:id',auth,shoppingController.deleteShopping);


module.exports = router;