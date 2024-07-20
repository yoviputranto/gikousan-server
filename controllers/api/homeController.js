const Shopping = require('../../models/Shopping');


module.exports={
    getTotal: async(req,res)=>{
        try {
            const unpaidShopping = await Shopping.find({status:"Belum Lunas"}).countDocuments();
            const bill = await Shopping.aggregate([
                {
                    $group:{
                        "_id":null,
                        total_bill : {$sum:"$bill"}
                    }
                }
            ])
            return res.status(200).json({success:true, data:{unpaid_transaction:unpaidShopping,total_bill:bill[0].total_bill}})
        } catch (error) {
            console.log(error);
            return res.status(500).json({success:false, message: "Internal Server Error"});
        }
    },
    

}