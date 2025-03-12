import mongoose from 'mongoose';
import { createRazorInstance } from '../../config/config.config.js';
import { asyncHandler } from '../../errors/asynHandler.js';
import ErrorHandler from '../../errors/errorHandler.js';
import { ordersModel } from '../../models/order.model.js';
import { productsModel } from '../../models/products.model.js';
import crypto from 'crypto';

// create order for cash on deliver
export const createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems } = req.body;
  req.body.user = req.user.id;
  const validateStock = async (product) => {
    const orderedProduct = await productsModel.findById(product.productId);
    orderedProduct.quantity -= product.quantity;
    await orderedProduct.save({ validateBeforeSave: false });
  };

  orderItems.forEach(async (order) => {
    validateStock(order);
  });

  const order = await ordersModel.create(req.body);

  res.status(200).json({
    success: true,
    message: 'Order created successfully',
    order,
  });
});

// create order for online payment using card or upi.
export const checkout = asyncHandler(async (req, res, next) => {
  const order = req.body;

  // we get all products from products models for get their price
  const orderItemId = order.orderItems.map(
    (order) => new mongoose.Types.ObjectId(order.productId),
  );

  // now we calculate the total price of all products
  const amount = await productsModel.aggregate([
    { $match: { _id: { $in: orderItemId } } },
    {
      $project: {
        _id: 0,
        price: 1,
      },
    },
  ]).lean();

  // now we calculate the total price
  const price = amount.reduce((acc, { price }, idx) => {
    acc += price * order?.orderItems[idx]?.quantity;
    return acc;
  }, 0);

  // now we calculate the tax and total price
  const taxPrice = price * 0.018;
  const totalPrice = price + taxPrice;

  const options = {
    amount: Math.round(totalPrice) * 100,
    currency: 'INR',
  };

  // create instance for razorpay.
  const instance = await createRazorInstance();
  // send request on razorpay server for creating the order on razorpay.
  const response = await instance.orders.create(options);

  // then send the response to client for verify the order that is provide by razorpay and also save the details in our database.
  if (response.status == 'created') {
    await ordersModel.create({
      ...order,
      shippingPrice: 0,
      totalPrice: totalPrice,
      taxPrice: taxPrice,
      paymentInfo: { razorpay_order_id: response.id },
      user: req?.user?.id,
    });

    return res.status(200).json({
      success: true,
      message: 'Order created successfully.',
      data: response,
    });
  } else {
    return next(new ErrorHandler('Failed to create order.', 500));
  }
});

// we have to need the api key for razorpay on client side the we provide them from server.
export const getRazorAPIKey = asyncHandler(async (req, res, next) => {
  const RAZOR_API_KEY = process.env.RAZOR_API_KEY;
  return res.status(200).json({
    message: 'You get successfully api key',
    success: true,
    data: RAZOR_API_KEY,
  });
});

// now we verify the order that is provide by razorpay
export const verifyOrder = asyncHandler(async (req, res, next) => {

// that requests is send from client side that is provide by razorpay
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  console.log(razorpay_order_id)

  const sign = razorpay_order_id + '|' + razorpay_payment_id;

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZOR_API_SECRET)
    .update(sign)
    .digest('hex');

    // if every thing is okk then we update the order that is provide by razorpay
  if (generated_signature == razorpay_signature) {
    await ordersModel.updateOne({
      paymentInfo : {razorpay_order_id : razorpay_order_id},
    },
    {
      $set : {
        paymentInfo : {status : 'paid' , razorpay_payment_id : razorpay_payment_id , razorpay_signature : razorpay_signature, },
        paidAt : Date.now(),
        orderStatus : 'confirmed'
      }
    }
  )
    res.status(200).json({
      success : true,
      message : 'Payment verified successfully',
    });
  }else{
    await ordersModel.deleteOne({paymentInfo : {razorpay_order_id : razorpay_order_id}})
    return next(new ErrorHandler('Failed to verify payment order.', 500));
  }

  
});

// we write controller for get single order.

export const getSingleOrder = asyncHandler(async (req , res , next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new ErrorHandler("Please send valid order id : ",402))

    const order = await ordersModel.findById(req.params.id).populate("user","firstname email")

    if(!order) return next(new ErrorHandler("Please send valid order id : ",402))

    res.status(200).json({
        success : true,
        message : "You get your order successfully",
        data : order
    })

})

// we write controller for get all orders

export const getAllOrders = asyncHandler(async (req , res , next) =>{
    const orders = await ordersModel.find({user : req.user.id});

    if(!orders) return next(new ErrorHandler("You have no any orders records !",403))

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success : true,
        message : "You get all orders successfully .",
        data : orders,
        totalAmount
    })
})

// we write controller for delete single order

export const deleteSingleOrder = asyncHandler(async (req , res , next) => {

    const deletedOrder = await ordersModel.findById(req.params.id)

    if(!deletedOrder) return next(new ErrorHandler("please send valid order id",402))

    if(deletedOrder.orderStatus == 'Delivered') return next(new ErrorHandler("Product already delivered",403))

    const updateProducts = async (deletedOrder) =>{ 
        const product = await productsModel.findById(deletedOrder.productId)
        product.stock += Number(deletedOrder.quantity);

        await product.save({validateBeforeSave : false})
    } 

     deletedOrder.orderItems.forEach(async (order) => {
        await updateProducts(order)
    
    })

    await ordersModel.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success : true,
        message : "You deleted product successfully"
    })
})