const User = require('../models/userModel');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const Booking = require('../models/bookingModel');

const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  //1 Get Tour Data From Collection
  const tours = await Tour.find();
  // 2 Build Template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    select: 'review rating user'
  });
  // if (!tour) {
  //   return next(new AppError('No Tour found with that name', 404));
  // }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js https://cdnjs.cloudflare.com"
  );
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: `Your account `
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: `Your account `,
    user: updatedUser
  });
});
