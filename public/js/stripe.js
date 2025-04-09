/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async tourId => {
  try {
    const stripe = Stripe(
      'pk_test_51RBUTdQPL4afr17Gov0CdpyqlxrRzbPXGtGL3OxCNLC2NwcP4zCPCZboDhvkQPar6pVDAe2KEpHVRu08e1fq9lN500pCQzo6uV'
    );

    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
