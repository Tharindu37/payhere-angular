import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PayhereService } from './service/payhere.service';
declare var payhere: any;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'payhere-angular';
  private payhereService = inject(PayhereService);
  // @ViewChild('payhere', { static: true }) payherepayment: ElementRef;
  constructor() {}
  pay() {
    this.payhereService.generateHash('ItemNo12345', '1000.0', 'LKR').subscribe(
      (response: any) => {
        console.log(response);
        this.payherePayment(response.hash);
      },
      (error) => {
        console.error('Error generating hash:', error);
      }
    );
  }

  payherePayment(hash: string) {
    console.log('Hash', hash);
    // Payment completed. It can be a successful failure.
    payhere.onCompleted = function onCompleted(orderId: string) {
      console.log('Payment completed. OrderID:' + orderId);
      // Note: validate the payment and show success or failure page to the customer
    };

    // Payment window closed
    payhere.onDismissed = function onDismissed() {
      // Note: Prompt user to pay again or show an error page
      console.log('Payment dismissed');
    };

    // Error occurred
    payhere.onError = function onError(error: any) {
      // Note: show an error page
      console.log('Error:' + error);
    };

    // Put the payment variables here
    var payment = {
      sandbox: true,
      merchant_id: '', // Replace your Merchant ID
      return_url: 'http://localhost:4200/', // Important
      cancel_url: 'http://localhost:4200/', // Important
      // notify_url: 'http://sample.com/notify',
      notify_url: 'http://localhost:3000/notify', // Replace with your notify URL - This should be public IP (No Localhost)
      order_id: 'ItemNo12345',
      items: 'Door bell wireles',
      amount: '1000.00',
      currency: 'LKR',
      hash: hash, // *Replace with generated hash retrieved from backend
      first_name: 'Saman',
      last_name: 'Perera',
      email: 'samanp@gmail.com',
      phone: '0771234567',
      address: 'No.1, Galle Road',
      city: 'Colombo',
      country: 'Sri Lanka',
      delivery_address: 'No. 46, Galle road, Kalutara South',
      delivery_city: 'Kalutara',
      delivery_country: 'Sri Lanka',
      custom_1: '',
      custom_2: '',
    };

    payhere.startPayment(payment);
  }
}
