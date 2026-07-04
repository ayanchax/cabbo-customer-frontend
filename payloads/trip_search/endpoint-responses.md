http://localhost:8000/api/v1/geography/

- Response :
  {
  "country_name": "India",
  "country_code": "IN",
  "phone_code": "+91",
  "currency_code": "INR",
  "currency_symbol": "₹",
  "currency_decimal_places": 2,
  "currency_lowest_unit_conversion_factor": 100,
  "flag": "🇮🇳",
  "time_zone": "Asia/Kolkata",
  "locale": "en_IN"
  }

http://localhost:8000/api/v1/customer/profile/is-logged-in

- Response : true or false

http://localhost:8000/api/v1/customer/profile/

- Response :
  {
  "name": "Ayan Chakraborty",
  "email": "ayanchax9088@gmail.com",
  "phone_number": "+91 9831305667",
  "profile_picture_url": "https://cabbo-dev-assets.s3.ap-south-2.amazonaws.com/customers/profile/77f7ddf3-4af8-46ad-b3fa-e318311c244f/images/avatar/0ec57e7518ab43229e4ec2780b779c8e.png",
  "is_email_verified": false,
  "joined_on": "2026-04-07T18:36:06",
  "number_of_trips": 43,
  "can_reinitiate_email_verification": true
  }


http://localhost:8000/api/v1/trips/bookings/my/feed?bucket=upcoming&page=1&limit=10

http://localhost:8000/api/v1/trips/bookings/my/feed?bucket=ongoing&page=1&limit=10

http://localhost:8000/api/v1/trips/bookings/my/feed?bucket=past&page=1&limit=10

- Response
[
{
"booking_id": "RENTAL-78NDVSZWFAD53WBY",
"origin": {
"display_name": "Padmeshwari Nagar, Medahalli",
"lat": 13.0262903,
"lng": 77.71184889999999,
"place_id": "ChIJI6a9M04QrjsRPWmuosLR-qE",
"address": "3/3, Rifco Shantiniketan Layout, Padmeshwari Nagar, Medahalli, Bengaluru, Karnataka 560049, India",
"country_code": "IN",
"state_code": "KA",
"region_code": "BLR"
},
"destination": {
"display_name": "Padmeshwari Nagar, Medahalli",
"lat": 13.0262903,
"lng": 77.71184889999999,
"place_id": "ChIJI6a9M04QrjsRPWmuosLR-qE",
"address": "3/3, Rifco Shantiniketan Layout, Padmeshwari Nagar, Medahalli, Bengaluru, Karnataka 560049, India",
"country_code": "IN",
"state_code": "KA",
"region_code": "BLR"
},
"driver":{
"name": "Babu Driver",
"phone": "+91 9812345678",
"email": "babu@example.com",
"profile_picture_url": "https://cabbo-dev-assets.s3.ap-south-2.amazonaws.com/drivers/profile/501e143a-aa76-43c9-a752-cc709872be42/images/avatar/e514c22d2c31421fbe2f718b05b24403.png",
"avg_rating": 4,
"cab_registration_number": "KA01AB2316",
"cab_type": "Sedan",
"fuel_type": "diesel",
"cab_model_and_make": "Maruti Swift Dzire",
"gender": "male"
},
"package": {
"included_hours": 6,
"included_km": 60,
"driver_allowance": 0,
"best_intended_for": "Great for half-day outings or city sightseeing."
},
"start_datetime": "2026-07-05T19:15:00",
"expected_end_datetime": "2026-07-06T01:15:00",
"included_kms": 60,
"num_adults": 3,
"num_children": 0,
"num_passengers": 3,
"in_car_amenities": {
"ac": true,
"music_system": true,
"water_bottle": true,
"tissues": true,
"candies": false,
"snacks": false,
"phone_charger": true,
"aux_cable": true,
"bluetooth": false,
"wifi": false
},
"status": "confirmed",
"base_fare": 1620,
"final_price": 1749,
"advance_payment": 129,
"balance_payment": 1620,
"price_breakdown": {
"base_fare": 1620,
"platform_fee": 129,
"driver_allowance": 0
},
"overages": {
"disclaimer": [
"If you exceed the included hours and/or kilometres in your selected package (6Hours / 60KM), an additional charge of ₹5 per minute and/or ₹14 per km will apply.",
"You will be charged the full fare even if your trip is shorter than the booked duration or included mileage.",
"Extra charges apply for tolls, paid parking, and exceeding included hours or mileage (if applicable) - pay the driver directly."
],
"overage_amount_per_km": 14,
"overage_amount_per_hour": 280,
"indicative_overage_warning": false
},
"rate_per_min": 4.86,
"inclusions": [
"Base fare",
"Premium AC cab with professional driver",
"Doorstep pickup and drop",
"Platform/Convenience fee",
"Well-maintained and sanitized vehicle",
"24/7 customer support",
"Water bottles and tissues"
],
"exclusions": [
"Personal expenses",
"Self sponsored driver meals",
"Tolls(if applicable)",
"Paid parking(if applicable)"
],
"special_needs_requests": "Hello, I want to board a pet too ?",
"timezone": "Asia/Kolkata",
"trip_type": {
"trip_type": "local",
"display_name": "Local City Ride",
"description": "Hourly rental for city travel. Flexible for errands, meetings, and sightseeing within city limits."
},
"currency": {
"code": "INR",
"symbol": "₹",
"lowest_unit_name": "Paise",
"lowest_unit_conversion_factor": 100
},
"fleet": {
"car_type": "Sedan",
"fuel_type": "diesel",
"name": "Sedan",
"description": "Comfortable sedans, suitable for city and outstation travel.",
"cab_names": [
"Dzire",
"Amaze",
"Indigo"
],
"inventory_cab_names": [
"Dzire"
],
"capacity": "4+1",
"passenger_capacity": 4,
"luggage_capacity": {
"num_large_suitcases": 1,
"num_carryons": 1,
"num_backpacks": 1,
"num_other_bags": 0
},
"roof_carrier": false,
"total_luggages": 3
},
"label": "upcoming"
},
.....
]

http://localhost:8000/api/v1/trips/bookings/RENTAL-TEXYSEZY08E17OLW

- Response
{
    "booking_id": "RENTAL-TEXYSEZY08E17OLW",
    "origin": {
        "display_name": "Kodigehalli Road, Medahalli",
        "lat": 13.0262608,
        "lng": 77.7121698,
        "place_id": "ChIJDyvGNU4QrjsR5uiUURGMeRw",
        "address": "267, Kodigehalli Rd, Rifco Shantiniketan Layout, Padmeshwari Nagar, Medahalli, Bengaluru, Karnataka 560049, India",
        "country_code": "IN",
        "state_code": "KA",
        "region_code": "BLR"
    },
    "destination": {
        "display_name": "Chickpet",
        "lat": 12.9709232,
        "lng": 77.5763139,
        "place_id": "ChIJ54y19ggWrjsRPKWxs8ydVc0",
        "address": "Chickpet, Bengaluru, Karnataka, India",
        "country_code": "IN",
        "state_code": "KA",
        "region_code": "BLR"
    },
    "package": {
        "included_hours": 4,
        "included_km": 40,
        "driver_allowance": 0,
        "best_intended_for": "Perfect for short city trips, errands, or quick meetings."
    },
    "start_datetime": "2026-06-01T14:15:00",
    "expected_end_datetime": "2026-06-01T18:15:00",
    "included_kms": 40,
    "num_adults": 1,
    "num_children": 0,
    "num_passengers": 1,
    "in_car_amenities": {
        "ac": true,
        "music_system": true,
        "water_bottle": true,
        "tissues": true,
        "candies": false,
        "snacks": false,
        "phone_charger": true,
        "aux_cable": true,
        "bluetooth": false,
        "wifi": false
    },
    "status": "confirmed",
    "base_fare": 1200,
    "final_price": 1319,
    "advance_payment": 119,
    "balance_payment": 1200,
    "price_breakdown": {
        "base_fare": 1200,
        "platform_fee": 119,
        "driver_allowance": 0
    },
    "overages": {
        "disclaimer": [
            "If you exceed the included hours and/or kilometres in your selected package (4Hours / 40KM), an additional charge of ₹5 per minute and/or ₹16 per km will apply.",
            "You will be charged the full fare even if your trip is shorter than the booked duration or included mileage.",
            "Extra charges apply for tolls, paid parking, and exceeding included hours or mileage (if applicable) - pay the driver directly."
        ],
        "overage_amount_per_km": 16,
        "overage_amount_per_hour": 300,
        "indicative_overage_warning": false
    },
    "rate_per_min": 5.5,
    "inclusions": [
        "Base fare",
        "Premium AC cab with professional driver",
        "Doorstep pickup and drop",
        "Platform/Convenience fee",
        "Well-maintained and sanitized vehicle",
        "24/7 customer support",
        "Water bottles and tissues"
    ],
    "exclusions": [
        "Personal expenses",
        "Self sponsored driver meals",
        "Tolls(if applicable)",
        "Paid parking(if applicable)"
    ],
    "timezone": "Asia/Kolkata",
    "trip_type": {
        "trip_type": "local",
        "display_name": "Local City Ride",
        "description": "Hourly rental for city travel. Flexible for errands, meetings, and sightseeing within city limits."
    },
    "currency": {
        "code": "INR",
        "symbol": "₹",
        "lowest_unit_name": "Paise",
        "lowest_unit_conversion_factor": 100
    },
    "fleet": {
        "car_type": "Sedan",
        "fuel_type": "diesel",
        "name": "Sedan",
        "description": "Comfortable sedans, suitable for city and outstation travel.",
        "cab_names": [
            "Dzire",
            "Amaze",
            "Indigo"
        ],
        "inventory_cab_names": [
            "Dzire"
        ],
        "capacity": "4+1",
        "passenger_capacity": 4,
        "luggage_capacity": {
            "num_large_suitcases": 1,
            "num_carryons": 1,
            "num_backpacks": 1,
            "num_other_bags": 0
        },
        "roof_carrier": false,
        "total_luggages": 3
    },
    "refund_and_cancellation_policy": [
        "Full refund if you cancel atleast 1 hour before trip start.",
        "If you cancel after this period, 50% of the paid amount will be refunded.",
        "Full refund if your trip could not be fulfilled due to Cabbo operational issues (e.g., no driver assigned, vehicle breakdown before trip start, or force majeure events).",
        "Refunds are processed instantly upon cancellation confirmation. Depending on your payment method, it may take 1-3 business days for the amount to reflect in your source account.",
        "For any refund or cancellation queries, please contact Cabbo support. We are committed to transparent and fair policies."
    ],
    "label": "past"
}

http://localhost:8000/api/v1/trips/support/
Response: 
{
    "display_name": "Cabbo Customer Support",
    "email": "support@cabbo.co.in",
    "phone_number": "+91-9876543210",
    "whatsapp_number": "+91-9876543210",
    "support_type": "customer"
}

http://localhost:8000/api/v1/trips/bookings/OUTSTATION-LU9ZSNHW90UCMOEV

Response:
{
    "booking_id": "OUTSTATION-LU9ZSNHW90UCMOEV",
    "origin": {
        "display_name": "Padmeshwari Nagar, Medahalli",
        "lat": 13.0262903,
        "lng": 77.71184889999999,
        "place_id": "ChIJI6a9M04QrjsRPWmuosLR-qE",
        "address": "3/3, Rifco Shantiniketan Layout, Padmeshwari Nagar, Medahalli, Bengaluru, Karnataka 560049, India",
        "country_code": "IN",
        "state_code": "KA",
        "region_code": "Bangalore Division"
    },
    "destination": {
        "display_name": "Ooty",
        "lat": 11.4102038,
        "lng": 76.6950324,
        "place_id": "ChIJjdfztYS9qDsRQj8-yRTbmxc",
        "address": "Ooty, Tamil Nadu, India",
        "country_code": "IN",
        "state_code": "TN",
        "region_code": "Ooty"
    },
    "is_interstate": true,
    "total_unique_states": 2,
    "unique_states": [
        "tamil nadu",
        "karnataka"
    ],
    "is_round_trip": true,
    "start_datetime": "2026-08-03T10:45:00",
    "expected_end_datetime": "2026-08-06T10:45:00",
    "end_datetime": "2026-08-06T10:45:00",
    "total_days": 3,
    "included_kms": 900,
    "num_adults": 2,
    "num_children": 0,
    "num_large_suitcases": 0,
    "num_carryons": 1,
    "num_backpacks": 0,
    "num_other_bags": 0,
    "num_luggages": 1,
    "num_passengers": 2,
    "in_car_amenities": {
        "ac": true,
        "music_system": true,
        "water_bottle": true,
        "tissues": true,
        "candies": true,
        "snacks": false,
        "phone_charger": true,
        "aux_cable": true,
        "bluetooth": true,
        "wifi": false
    },
    "status": "confirmed",
    "base_fare": 10800,
    "final_price": 12939,
    "advance_payment": 439,
    "balance_payment": 12500,
    "price_breakdown": {
        "base_fare": 10800,
        "permit_fee": 500,
        "platform_fee": 439,
        "driver_allowance": 1200
    },
    "overages": {
        "disclaimer": [
            "You will be charged the full fare even if your trip is shorter than the booked duration or included mileage.",
            "If you extend the trip beyond the booked 3 day(s), an additional ₹4000 per extra day will apply, that includes 300 kms and driver allowance for one day - pay the driver directly.",
            "If you exceed the included mileage of 900 kms, an overage charge of ₹12 per km will apply - pay the driver directly.",
            "If the driver is required to drive during night hours (8PM to 6AM), a night surcharge of ₹100.0 per hour will apply - pay the driver directly.",
            "Extra charges apply for tolls, paid parking, night driving surcharges, extra days, and extra mileage, if applicable - pay the driver directly.",
            "If the trip includes hill climbs, the cab AC may be switched off during such climbs."
        ],
        "overage_amount_per_km": 12,
        "overage_estimate_amount": 0,
        "indicative_overage_warning": false
    },
    "rate_per_km": 14.38,
    "inclusions": [
        "Base fare",
        "Premium AC cab with professional driver",
        "Doorstep pickup and drop",
        "Platform/Convenience fee",
        "Well-maintained and sanitized vehicle",
        "24/7 customer support",
        "Driver allowance",
        "Water bottles, candies, and tissues",
        "State entry taxes"
    ],
    "exclusions": [
        "Personal expenses",
        "Self sponsored driver meals",
        "Tolls(if applicable)",
        "Paid parking(if applicable)",
        "Self sponsored driver accomodation",
        "Night surcharges(if applicable)"
    ],
    "estimated_km": 566.86,
    "timezone": "Asia/Kolkata",
    "trip_type": {
        "trip_type": "outstation",
        "display_name": "Outstation Trip",
        "description": "Multi-day intercity travel. Ideal for business, leisure, or family trips outside your city."
    },
    "currency": {
        "code": "INR",
        "symbol": "₹",
        "lowest_unit_name": "Paise",
        "lowest_unit_conversion_factor": 100
    },
    "fleet": {
        "car_type": "Sedan",
        "fuel_type": "diesel",
        "name": "Sedan",
        "description": "Comfortable sedans, suitable for city and outstation travel.",
        "cab_names": [
            "Dzire",
            "Amaze",
            "Indigo"
        ],
        "inventory_cab_names": [
            "Dzire"
        ],
        "capacity": "4+1",
        "passenger_capacity": 4,
        "luggage_capacity": {
            "num_large_suitcases": 1,
            "num_carryons": 1,
            "num_backpacks": 1,
            "num_other_bags": 0
        },
        "roof_carrier": false,
        "total_luggages": 3
    },
    "refund_and_cancellation_policy": [
        "Full refund if you cancel atleast 1 day before trip start.",
        "If you cancel after this period, 80% of the paid amount will be refunded.",
        "Full refund if your trip could not be fulfilled due to Cabbo operational issues (e.g., no driver assigned, vehicle breakdown before trip start, or force majeure events).",
        "Refunds are processed instantly upon cancellation confirmation. Depending on your payment method, it may take 1-3 business days for the amount to reflect in your source account.",
        "For any refund or cancellation queries, please contact Cabbo support. We are committed to transparent and fair policies."
    ],
    "label": "upcoming"
}

http://localhost:8000/api/v1/trips/bookings/OUTSTATION-LU9ZSNHW90UCMOEV/cancel
Response {
    "message": "Trip status updated to cancelled successfully."
}

http://localhost:8000/api/v1/trips/refunds/refund/OUTSTATION-LU9ZSNHW90UCMOEV
Response
{
    "refund_status": "initiated",
    "refund_amount": 439,
    "refund_initiated_datetime": "2026-07-04T09:14:07",
    "refund_retried_datetime": null,
    "refund_type": "full"
}
http://localhost:8000/api/v1/trips/bookings/AIRPORTTFR-DROP-DY4LATHHAHMRJE0Q
Response
{
    "booking_id": "AIRPORTTFR-DROP-DY4LATHHAHMRJE0Q",
    "origin": {
        "display_name": "Padmeshwari Nagar, Medahalli",
        "lat": 13.0262903,
        "lng": 77.71184889999999,
        "place_id": "ChIJI6a9M04QrjsRPWmuosLR-qE",
        "address": "3/3, Rifco Shantiniketan Layout, Padmeshwari Nagar, Medahalli, Bengaluru, Karnataka 560049, India",
        "country_code": "IN",
        "state_code": "KA",
        "region_code": "BLR"
    },
    "destination": {
        "display_name": "Kempegowda International Airport Bengaluru",
        "lat": 13.198909,
        "lng": 77.7068926,
        "place_id": "ChIJZWJEdf4crjsRjkEpoelwbCk",
        "address": "Karnataka 560300, India",
        "country_code": "IN",
        "state_code": "KA",
        "region_code": "BLR",
        "mobility_hub": "airport"
    },
    "start_datetime": "2026-07-14T14:00:00",
    "num_adults": 2,
    "num_children": 0,
    "num_large_suitcases": 0,
    "num_carryons": 1,
    "num_backpacks": 0,
    "num_other_bags": 0,
    "num_luggages": 1,
    "num_passengers": 2,
    "in_car_amenities": {
        "ac": true,
        "music_system": true,
        "water_bottle": true,
        "tissues": true,
        "candies": false,
        "snacks": false,
        "phone_charger": false,
        "aux_cable": false,
        "bluetooth": false,
        "wifi": false
    },
    "status": "confirmed",
    "base_fare": 762,
    "final_price": 1031,
    "advance_payment": 149,
    "balance_payment": 882,
    "price_breakdown": {
        "toll": 120,
        "base_fare": 762,
        "platform_fee": 149
    },
    "overages": {
        "disclaimer": [
            "Fare applies to the selected airport transfer route. This fare includes selected toll-road tolls. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
        ],
        "overage_amount_per_km": 19,
        "overage_estimate_amount": 0,
        "indicative_overage_warning": false
    },
    "inclusions": [
        "Base fare",
        "Toll",
        "Premium AC cab with professional driver",
        "Doorstep pickup and drop",
        "Platform/Convenience fee",
        "Well-maintained and sanitized vehicle",
        "24/7 customer support",
        "Water bottles and tissues"
    ],
    "exclusions": [
        "Personal expenses",
        "Self sponsored driver meals",
        "Tolls(if applicable)",
        "Paid parking(if applicable)"
    ],
    "toll_road_preferred": true,
    "timezone": "Asia/Kolkata",
    "trip_type": {
        "trip_type": "airport_drop",
        "display_name": "Airport Drop",
        "description": "Drop to airport from your location. Timely service for stress-free departures."
    },
    "currency": {
        "code": "INR",
        "symbol": "₹",
        "lowest_unit_name": "Paise",
        "lowest_unit_conversion_factor": 100
    },
    "fleet": {
        "car_type": "Sedan",
        "fuel_type": "diesel",
        "name": "Sedan",
        "description": "Comfortable sedans, suitable for city and outstation travel.",
        "cab_names": [
            "Dzire",
            "Amaze",
            "Indigo"
        ],
        "inventory_cab_names": [
            "Dzire"
        ],
        "capacity": "4+1",
        "passenger_capacity": 4,
        "luggage_capacity": {
            "num_large_suitcases": 1,
            "num_carryons": 1,
            "num_backpacks": 1,
            "num_other_bags": 0
        },
        "roof_carrier": false,
        "total_luggages": 3
    },
    "refund_and_cancellation_policy": [
        "Full refund if you cancel atleast 30 minutes before trip start.",
        "If you cancel after this period, 20% of the paid amount will be refunded.",
        "Full refund if your trip could not be fulfilled due to Cabbo operational issues (e.g., no driver assigned, vehicle breakdown before trip start, or force majeure events).",
        "Refunds are processed instantly upon cancellation confirmation. Depending on your payment method, it may take 1-3 business days for the amount to reflect in your source account.",
        "For any refund or cancellation queries, please contact Cabbo support. We are committed to transparent and fair policies."
    ],
    "label": "upcoming"
}

http://localhost:8000/api/v1/trips/bookings/AIRPORTTFR-DROP-DY4LATHHAHMRJE0Q
Special request update patch 
{
    "message": "Trip details updated successfully"
}

http://localhost:8000/api/v1/legal/pages
Response
[
    {
        "slug": "help-support",
        "title": "Help & Support",
        "version": "1.0.0",
        "effective_date": "2026-07-02",
        "requires_acceptance": false
    },
    {
        "slug": "terms-of-service",
        "title": "Terms of Service",
        "version": "1.0.0",
        "effective_date": "2026-07-02",
        "requires_acceptance": true
    },
    {
        "slug": "privacy-policy",
        "title": "Privacy Policy",
        "version": "1.0.0",
        "effective_date": "2026-07-02",
        "requires_acceptance": true
    },
    {
        "slug": "cancellation-refund-policy",
        "title": "Cancellation & Refund Policy",
        "version": "1.0.0",
        "effective_date": "2026-07-02",
        "requires_acceptance": false
    },
    {
        "slug": "fare-charges-policy",
        "title": "Fare & Charges Policy",
        "version": "1.0.0",
        "effective_date": "2026-07-02",
        "requires_acceptance": false
    },
    {
        "slug": "safety-contact-grievance",
        "title": "Safety, Contact & Grievance",
        "version": "1.0.0",
        "effective_date": "2026-07-02",
        "requires_acceptance": false
    }
]

http://localhost:8000/api/v1/customer/email-verification/initiate
Response
{
    "message": "Verification email sent. Please check your inbox."
}

http://localhost:8000/api/v1/legal/pages/<slug>
Response:
{
    "slug": "terms-of-service",
    "title": "Terms of Service",
    "version": "1.0.0",
    "effective_date": "2026-07-02",
    "requires_acceptance": true,
    "content_format": "markdown",
    "content": "....."
}

http://localhost:8000/api/v1/locations/search?query=ke&lat=13.026237099487833&lng=77.71204758144981&session_token=2d099f7c-31bb-403c-8b60-15f8fe67e082

[
    {
        "display_name": "Kempegowda International Airport Bengaluru (BLR)",
        "lat": null,
        "lng": null,
        "place_id": "ChIJZWJEdf4crjsRjkEpoelwbCk",
        "address": "Karnataka, India",
        "country": null,
        "country_code": null,
        "state": null,
        "state_code": null,
        "region": null,
        "region_code": null,
        "postal_code": null,
        "mobility_hub": null
    },
    {
        "display_name": "Kempegowda, Majestic",
        "lat": null,
        "lng": null,
        "place_id": "ChIJlT19yhoWrjsRuA98ZfvQElw",
        "address": "Bengaluru, Karnataka, India",
        "country": null,
        "country_code": null,
        "state": null,
        "state_code": null,
        "region": null,
        "region_code": null,
        "postal_code": null,
        "mobility_hub": null
    },
    {
        "display_name": "Kempegowda Bus Terminal-1",
        "lat": null,
        "lng": null,
        "place_id": "ChIJGb24WwUWrjsReYk_fvp-K9Y",
        "address": "Kempegowda, Majestic, Bengaluru, Karnataka, India",
        "country": null,
        "country_code": null,
        "state": null,
        "state_code": null,
        "region": null,
        "region_code": null,
        "postal_code": null,
        "mobility_hub": null
    },
    {
        "display_name": "Kempapura",
        "lat": null,
        "lng": null,
        "place_id": "ChIJr7N-nQkjrjsRHgn78J3dnUY",
        "address": "Bengaluru, Karnataka, India",
        "country": null,
        "country_code": null,
        "state": null,
        "state_code": null,
        "region": null,
        "region_code": null,
        "postal_code": null,
        "mobility_hub": null
    },
    {
        "display_name": "Kempegowda Bus Station",
        "lat": null,
        "lng": null,
        "place_id": "ChIJB22hvRoWrjsRI1M5G3dsL_M",
        "address": "Kempegowda, Majestic, Bengaluru, Karnataka, India",
        "country": null,
        "country_code": null,
        "state": null,
        "state_code": null,
        "region": null,
        "region_code": null,
        "postal_code": null,
        "mobility_hub": null
    }
]

http://localhost:8000/api/v1/locations/place-details?place_id=ChIJZWJEdf4crjsRjkEpoelwbCk&session_token=2d099f7c-31bb-403c-8b60-15f8fe67e082

Response
{
    "display_name": "Kempegowda International Airport Bengaluru",
    "lat": 13.198909,
    "lng": 77.7068926,
    "place_id": "ChIJZWJEdf4crjsRjkEpoelwbCk",
    "address": "Karnataka 560300, India",
    "country": "India",
    "country_code": "IN",
    "state": "Karnataka",
    "state_code": "KA",
    "region": "Bangalore Division",
    "region_code": "Bangalore Division",
    "postal_code": "560300",
    "mobility_hub": "airport"
}

http://localhost:8000/api/v1/locations/place-details/reverse-geocode
Response
{
    "display_name": "Rashbehari Avenue Connector, East Kolkata Township",
    "lat": 22.5152825,
    "lng": 88.3896747,
    "place_id": "ChIJ4a0XIU1xAjoR2Fr8tL1gRWM",
    "address": "121, Rashbehari Ave Connector, Sarat Park, Gold Park, Rajdanga, East Kolkata Twp, Kolkata, West Bengal 700107, India",
    "country": "India",
    "country_code": "IN",
    "state": "West Bengal",
    "state_code": "WB",
    "region": "Presidency Division",
    "region_code": "Presidency Division",
    "postal_code": "700107",
    "mobility_hub": "transit_station"
}

http://localhost:8000/api/v1/trips/trip-type-classification/classify
Response
{
    "trip_type": "airport_pickup",
    "distance_km": 23.04,
    "has_distance_overage": false,
    "pickup": {
        "display_name": "Kempegowda International Airport Bengaluru",
        "lat": 13.198909,
        "lng": 77.7068926,
        "place_id": "ChIJZWJEdf4crjsRjkEpoelwbCk",
        "address": "Karnataka 560300, India",
        "country": "India",
        "country_code": "IN",
        "state": "Karnataka",
        "state_code": "KA",
        "region": "Bangalore",
        "region_code": "BLR",
        "postal_code": "560300",
        "mobility_hub": "airport"
    },
    "dropoff": {
        "display_name": "Padmeshwari Nagar, Medahalli",
        "lat": 13.0262903,
        "lng": 77.71184889999999,
        "place_id": "ChIJI6a9M04QrjsRPWmuosLR-qE",
        "address": "3/3, Rifco Shantiniketan Layout, Padmeshwari Nagar, Medahalli, Bengaluru, Karnataka 560049, India",
        "country": "India",
        "country_code": "IN",
        "state": "Karnataka",
        "state_code": "KA",
        "region": "Bangalore",
        "region_code": "BLR",
        "postal_code": "560049"
    },
    "serviceable": true
}

http://localhost:8000/api/v1/trips/prior-booking-window/<trip_type>/<region>


Response : number, e.g: 3

http://localhost:8000/api/v1/trips/search

Response:
{
    "options": [
        {
            "car_type": "Hatchback",
            "car_capacity": {
                "passenger_capacity": 4,
                "luggage_capacity": 3,
                "capacity_match": true,
                "recommended": true,
                "rank": 0,
                "roof_carrier": false
            },
            "fuel_type": "cng",
            "total_price": 834,
            "price_breakdown": {
                "base_fare": 585,
                "platform_fee": 149,
                "placard_charge": 0,
                "toll": 0,
                "parking": 100
            },
            "included_kms": 42,
            "rate_per_km": 19.86,
            "package_short_label": "Airport Pickup",
            "package": "Airport Pickup | AC Hatchback(4+1) - (cng)",
            "overages": {
                "indicative_overage_warning": false,
                "overage_amount_per_km": 17,
                "overage_estimate_amount": 0,
                "disclaimer": [
                    "Fare applies to the selected airport transfer route. This fare includes airport parking. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
                ]
            },
            "currency": {
                "symbol": "₹",
                "decimal_places": 2,
                "in_words": "Rupees",
                "international_name": "Indian Rupee",
                "symbol_position": "before",
                "code_position": "after",
                "thousand_separator": ",",
                "decimal_separator": ".",
                "lowest_unit_name": "Paise",
                "lowest_unit_conversion_factor": 100
            },
            "hash": "e14c3e48547bdaf362a7ab32d800d4e15ed3af9718cf804b75e028409bc059da"
        },
        {
            "car_type": "Sedan",
            "car_capacity": {
                "passenger_capacity": 4,
                "luggage_capacity": 3,
                "capacity_match": true,
                "recommended": false,
                "rank": 1,
                "roof_carrier": false
            },
            "fuel_type": "cng",
            "total_price": 997,
            "price_breakdown": {
                "base_fare": 748,
                "platform_fee": 149,
                "placard_charge": 0,
                "toll": 0,
                "parking": 100
            },
            "included_kms": 42,
            "rate_per_km": 23.74,
            "package_short_label": "Airport Pickup",
            "package": "Airport Pickup | AC Sedan(4+1) - (cng)",
            "overages": {
                "indicative_overage_warning": false,
                "overage_amount_per_km": 18,
                "overage_estimate_amount": 0,
                "disclaimer": [
                    "Fare applies to the selected airport transfer route. This fare includes airport parking. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
                ]
            },
            "currency": {
                "symbol": "₹",
                "decimal_places": 2,
                "in_words": "Rupees",
                "international_name": "Indian Rupee",
                "symbol_position": "before",
                "code_position": "after",
                "thousand_separator": ",",
                "decimal_separator": ".",
                "lowest_unit_name": "Paise",
                "lowest_unit_conversion_factor": 100
            },
            "hash": "6f4a4f84faaba4a05f7914b5eb0a30a3a5e2574c176e12efdaa3456f11eefdcd"
        },
        {
            "car_type": "Sedan",
            "car_capacity": {
                "passenger_capacity": 4,
                "luggage_capacity": 3,
                "capacity_match": true,
                "recommended": false,
                "rank": 1,
                "roof_carrier": false
            },
            "fuel_type": "diesel",
            "total_price": 1029,
            "price_breakdown": {
                "base_fare": 780,
                "platform_fee": 149,
                "placard_charge": 0,
                "toll": 0,
                "parking": 100
            },
            "included_kms": 42,
            "rate_per_km": 24.5,
            "package_short_label": "Airport Pickup",
            "package": "Airport Pickup | AC Sedan(4+1) - (diesel)",
            "overages": {
                "indicative_overage_warning": false,
                "overage_amount_per_km": 19,
                "overage_estimate_amount": 0,
                "disclaimer": [
                    "Fare applies to the selected airport transfer route. This fare includes airport parking. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
                ]
            },
            "currency": {
                "symbol": "₹",
                "decimal_places": 2,
                "in_words": "Rupees",
                "international_name": "Indian Rupee",
                "symbol_position": "before",
                "code_position": "after",
                "thousand_separator": ",",
                "decimal_separator": ".",
                "lowest_unit_name": "Paise",
                "lowest_unit_conversion_factor": 100
            },
            "hash": "541ed1b646690f0d7a2d69a104953b511637469d17f54c659ba24d74968d5fab"
        },
        {
            "car_type": "Sedan",
            "car_capacity": {
                "passenger_capacity": 4,
                "luggage_capacity": 3,
                "capacity_match": true,
                "recommended": false,
                "rank": 1,
                "roof_carrier": false
            },
            "fuel_type": "petrol",
            "total_price": 1062,
            "price_breakdown": {
                "base_fare": 813,
                "platform_fee": 149,
                "placard_charge": 0,
                "toll": 0,
                "parking": 100
            },
            "included_kms": 42,
            "rate_per_km": 25.29,
            "package_short_label": "Airport Pickup",
            "package": "Airport Pickup | AC Sedan(4+1) - (petrol)",
            "overages": {
                "indicative_overage_warning": false,
                "overage_amount_per_km": 20,
                "overage_estimate_amount": 0,
                "disclaimer": [
                    "Fare applies to the selected airport transfer route. This fare includes airport parking. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
                ]
            },
            "currency": {
                "symbol": "₹",
                "decimal_places": 2,
                "in_words": "Rupees",
                "international_name": "Indian Rupee",
                "symbol_position": "before",
                "code_position": "after",
                "thousand_separator": ",",
                "decimal_separator": ".",
                "lowest_unit_name": "Paise",
                "lowest_unit_conversion_factor": 100
            },
            "hash": "3623f85fd6b83f5e1103d527772c6c3a0ebad45a797933b1f747aca31bc18b4b"
        },
        {
            "car_type": "Premium Sedan",
            "car_capacity": {
                "passenger_capacity": 4,
                "luggage_capacity": 4,
                "capacity_match": true,
                "recommended": false,
                "rank": 2,
                "roof_carrier": false
            },
            "fuel_type": "cng",
            "total_price": 1029,
            "price_breakdown": {
                "base_fare": 780,
                "platform_fee": 149,
                "placard_charge": 0,
                "toll": 0,
                "parking": 100
            },
            "included_kms": 42,
            "rate_per_km": 24.5,
            "package_short_label": "Airport Pickup",
            "package": "Airport Pickup | AC Premium Sedan(4+1) - (cng)",
            "overages": {
                "indicative_overage_warning": false,
                "overage_amount_per_km": 19,
                "overage_estimate_amount": 0,
                "disclaimer": [
                    "Fare applies to the selected airport transfer route. This fare includes airport parking. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
                ]
            },
            "currency": {
                "symbol": "₹",
                "decimal_places": 2,
                "in_words": "Rupees",
                "international_name": "Indian Rupee",
                "symbol_position": "before",
                "code_position": "after",
                "thousand_separator": ",",
                "decimal_separator": ".",
                "lowest_unit_name": "Paise",
                "lowest_unit_conversion_factor": 100
            },
            "hash": "43512c7c9b25bfa7a7678e6cf847c37121ac29e15db07c23824444b9d1258a78"
        },
        {
            "car_type": "Premium Sedan",
            "car_capacity": {
                "passenger_capacity": 4,
                "luggage_capacity": 4,
                "capacity_match": true,
                "recommended": false,
                "rank": 2,
                "roof_carrier": false
            },
            "fuel_type": "diesel",
            "total_price": 1062,
            "price_breakdown": {
                "base_fare": 813,
                "platform_fee": 149,
                "placard_charge": 0,
                "toll": 0,
                "parking": 100
            },
            "included_kms": 42,
            "rate_per_km": 25.29,
            "package_short_label": "Airport Pickup",
            "package": "Airport Pickup | AC Premium Sedan(4+1) - (diesel)",
            "overages": {
                "indicative_overage_warning": false,
                "overage_amount_per_km": 20,
                "overage_estimate_amount": 0,
                "disclaimer": [
                    "Fare applies to the selected airport transfer route. This fare includes airport parking. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
                ]
            },
            "currency": {
                "symbol": "₹",
                "decimal_places": 2,
                "in_words": "Rupees",
                "international_name": "Indian Rupee",
                "symbol_position": "before",
                "code_position": "after",
                "thousand_separator": ",",
                "decimal_separator": ".",
                "lowest_unit_name": "Paise",
                "lowest_unit_conversion_factor": 100
            },
            "hash": "a676c809a5dd5552930274c8c351f91594715e5d38eee2a279ad910dad670178"
        },
        {
            "car_type": "Premium Sedan",
            "car_capacity": {
                "passenger_capacity": 4,
                "luggage_capacity": 4,
                "capacity_match": true,
                "recommended": false,
                "rank": 2,
                "roof_carrier": false
            },
            "fuel_type": "petrol",
            "total_price": 1094,
            "price_breakdown": {
                "base_fare": 845,
                "platform_fee": 149,
                "placard_charge": 0,
                "toll": 0,
                "parking": 100
            },
            "included_kms": 42,
            "rate_per_km": 26.05,
            "package_short_label": "Airport Pickup",
            "package": "Airport Pickup | AC Premium Sedan(4+1) - (petrol)",
            "overages": {
                "indicative_overage_warning": false,
                "overage_amount_per_km": 21,
                "overage_estimate_amount": 0,
                "disclaimer": [
                    "Fare applies to the selected airport transfer route. This fare includes airport parking. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
                ]
            },
            "currency": {
                "symbol": "₹",
                "decimal_places": 2,
                "in_words": "Rupees",
                "international_name": "Indian Rupee",
                "symbol_position": "before",
                "code_position": "after",
                "thousand_separator": ",",
                "decimal_separator": ".",
                "lowest_unit_name": "Paise",
                "lowest_unit_conversion_factor": 100
            },
            "hash": "1edb530fef4fb3baf862f79a90d8886a2b7c7e6aca89239fc86813cc4e3c3926"
        },
        {
            "car_type": "SUV",
            "car_capacity": {
                "passenger_capacity": 6,
                "luggage_capacity": 7,
                "capacity_match": true,
                "recommended": false,
                "rank": 3,
                "roof_carrier": true
            },
            "fuel_type": "cng",
            "total_price": 1452,
            "price_breakdown": {
                "base_fare": 1203,
                "platform_fee": 149,
                "placard_charge": 0,
                "toll": 0,
                "parking": 100
            },
            "included_kms": 42,
            "rate_per_km": 34.57,
            "package_short_label": "Airport Pickup",
            "package": "Airport Pickup | AC SUV(6+1) - (cng)",
            "overages": {
                "indicative_overage_warning": false,
                "overage_amount_per_km": 36,
                "overage_estimate_amount": 0,
                "disclaimer": [
                    "Fare applies to the selected airport transfer route. This fare includes airport parking. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
                ]
            },
            "currency": {
                "symbol": "₹",
                "decimal_places": 2,
                "in_words": "Rupees",
                "international_name": "Indian Rupee",
                "symbol_position": "before",
                "code_position": "after",
                "thousand_separator": ",",
                "decimal_separator": ".",
                "lowest_unit_name": "Paise",
                "lowest_unit_conversion_factor": 100
            },
            "hash": "a240ac9ab04cae27f6d53f15f2fed90a493d6857e6b75f34a136f0b30b6d3fd9"
        },
        {
            "car_type": "SUV",
            "car_capacity": {
                "passenger_capacity": 6,
                "luggage_capacity": 7,
                "capacity_match": true,
                "recommended": false,
                "rank": 3,
                "roof_carrier": true
            },
            "fuel_type": "petrol",
            "total_price": 1517,
            "price_breakdown": {
                "base_fare": 1268,
                "platform_fee": 149,
                "placard_charge": 0,
                "toll": 0,
                "parking": 100
            },
            "included_kms": 42,
            "rate_per_km": 36.12,
            "package_short_label": "Airport Pickup",
            "package": "Airport Pickup | AC SUV(6+1) - (petrol)",
            "overages": {
                "indicative_overage_warning": false,
                "overage_amount_per_km": 38,
                "overage_estimate_amount": 0,
                "disclaimer": [
                    "Fare applies to the selected airport transfer route. This fare includes airport parking. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
                ]
            },
            "currency": {
                "symbol": "₹",
                "decimal_places": 2,
                "in_words": "Rupees",
                "international_name": "Indian Rupee",
                "symbol_position": "before",
                "code_position": "after",
                "thousand_separator": ",",
                "decimal_separator": ".",
                "lowest_unit_name": "Paise",
                "lowest_unit_conversion_factor": 100
            },
            "hash": "aca4fb3c8ff7a705bb2bf9066b0819f38cd829bd83a4621550bbae36539b6802"
        },
        {
            "car_type": "SUV+",
            "car_capacity": {
                "passenger_capacity": 7,
                "luggage_capacity": 9,
                "capacity_match": true,
                "recommended": false,
                "rank": 4,
                "roof_carrier": true
            },
            "fuel_type": "diesel",
            "total_price": 1712,
            "price_breakdown": {
                "base_fare": 1463,
                "platform_fee": 149,
                "placard_charge": 0,
                "toll": 0,
                "parking": 100
            },
            "included_kms": 42,
            "rate_per_km": 40.76,
            "package_short_label": "Airport Pickup",
            "package": "Airport Pickup | AC SUV+(7+1) - (diesel)",
            "overages": {
                "indicative_overage_warning": false,
                "overage_amount_per_km": 42,
                "overage_estimate_amount": 0,
                "disclaimer": [
                    "Fare applies to the selected airport transfer route. This fare includes airport parking. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
                ]
            },
            "currency": {
                "symbol": "₹",
                "decimal_places": 2,
                "in_words": "Rupees",
                "international_name": "Indian Rupee",
                "symbol_position": "before",
                "code_position": "after",
                "thousand_separator": ",",
                "decimal_separator": ".",
                "lowest_unit_name": "Paise",
                "lowest_unit_conversion_factor": 100
            },
            "hash": "cb6920cfb0ca92dd5d44458491215e239ee59b243a6b919dba8b797a1660b8ac"
        },
        {
            "car_type": "SUV+",
            "car_capacity": {
                "passenger_capacity": 7,
                "luggage_capacity": 9,
                "capacity_match": true,
                "recommended": false,
                "rank": 4,
                "roof_carrier": true
            },
            "fuel_type": "petrol",
            "total_price": 1744,
            "price_breakdown": {
                "base_fare": 1495,
                "platform_fee": 149,
                "placard_charge": 0,
                "toll": 0,
                "parking": 100
            },
            "included_kms": 42,
            "rate_per_km": 41.52,
            "package_short_label": "Airport Pickup",
            "package": "Airport Pickup | AC SUV+(7+1) - (petrol)",
            "overages": {
                "indicative_overage_warning": false,
                "overage_amount_per_km": 43,
                "overage_estimate_amount": 0,
                "disclaimer": [
                    "Fare applies to the selected airport transfer route. This fare includes airport parking. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
                ]
            },
            "currency": {
                "symbol": "₹",
                "decimal_places": 2,
                "in_words": "Rupees",
                "international_name": "Indian Rupee",
                "symbol_position": "before",
                "code_position": "after",
                "thousand_separator": ",",
                "decimal_separator": ".",
                "lowest_unit_name": "Paise",
                "lowest_unit_conversion_factor": 100
            },
            "hash": "15ed06c29e543a41ae510a168eb6e9daec4d50757f676dee36be12a91e6933fd"
        }
    ],
    "preferences": {
        "trip_type": "airport_pickup",
        "origin": {
            "display_name": "Kempegowda International Airport Bengaluru",
            "lat": 13.198909,
            "lng": 77.7068926,
            "place_id": "ChIJZWJEdf4crjsRjkEpoelwbCk",
            "address": "Karnataka 560300, India",
            "country": "India",
            "country_code": "IN",
            "state": "Karnataka",
            "state_code": "KA",
            "region": "Bangalore",
            "region_code": "BLR",
            "postal_code": "560300",
            "mobility_hub": "airport"
        },
        "destination": {
            "display_name": "Padmeshwari Nagar, Medahalli",
            "lat": 13.0262903,
            "lng": 77.71184889999999,
            "place_id": "ChIJI6a9M04QrjsRPWmuosLR-qE",
            "address": "3/3, Rifco Shantiniketan Layout, Padmeshwari Nagar, Medahalli, Bengaluru, Karnataka 560049, India",
            "country": "India",
            "country_code": "IN",
            "state": "Karnataka",
            "state_code": "KA",
            "region": "Bangalore",
            "region_code": "BLR",
            "postal_code": "560049"
        },
        "start_date": "2026-08-29T12:30:00Z",
        "num_adults": 1,
        "num_children": 0,
        "num_large_suitcases": 0,
        "num_carryons": 0,
        "num_backpacks": 0,
        "num_other_bags": 0,
        "placard_required": false,
        "passenger": "self",
        "timezone": "Asia/Kolkata",
        "total_passengers": 1,
        "total_luggages": 0
    },
    "metadata": {
        "inclusions": [
            "Base fare",
            "Premium AC cab with professional driver",
            "Doorstep pickup and drop",
            "Platform/Convenience fee",
            "Well-maintained and sanitized vehicle",
            "24/7 customer support",
            "Parking",
            "Water bottles and tissues"
        ],
        "exclusions": [
            "Personal expenses",
            "Self sponsored driver meals",
            "Tolls(if applicable)",
            "Paid parking(if applicable)"
        ],
        "in_car_amenities": {
            "ac": true,
            "music_system": true,
            "water_bottle": true,
            "tissues": true
        },
        "total_trip_days": 1,
        "estimated_km": 32.49,
        "included_kms": 42,
        "choices": 11
    },
    "disclaimers": [
        "Fare applies to the selected airport transfer route. This fare includes airport parking. Extra charges may apply for customer-requested route changes, detours, additional stops, waiting, or charges outside the selected fare."
    ],
    "refund_and_cancellation_policy": [
        "Full refund if you cancel atleast 30 minutes before trip start.",
        "If you cancel after this period, 20% of the paid amount will be refunded.",
        "Full refund if your trip could not be fulfilled due to Cabbo operational issues (e.g., no driver assigned, vehicle breakdown before trip start, or force majeure events).",
        "Refunds are processed instantly upon cancellation confirmation. Depending on your payment method, it may take 1-3 business days for the amount to reflect in your source account.",
        "For any refund or cancellation queries, please contact Cabbo support. We are committed to transparent and fair policies."
    ]
}

http://localhost:8000/api/v1/trips/initiate-booking

Response
{
    "trip_id": "155530b6-ed0c-40a8-8445-7e12b32987a1",
    "order_id": "order_T9NHUnY0NiFcRk",
    "amount": 149,
    "amount_in_lowest_unit": 14900,
    "currency": "INR",
    "currency_symbol": "₹",
    "description": "Trip booking for airport_pickup trip by Ayan Chakraborty",
    "customer": {
        "name": "Ayan Chakraborty",
        "email": "ayanchax9088@gmail.com",
        "contact": "+91 9831305667"
    },
    "status": "created",
    "messages": {
        "status": "created",
        "status_text": "Your trip has been created!",
        "next_steps": [
            {
                "id": "COMPLETE_ADVANCE_PAYMENT",
                "step": "Complete Advance Payment",
                "instruction": "Please complete the advance payment to confirm your trip.",
                "reason": "This advance payment is our platform/convenience fee that helps us guarantee your trip booking."
            },
            {
                "id": "AWAIT_CONFIRMATION",
                "step": "Await Confirmation",
                "instruction": "You will receive a confirmation once the payment is successful."
            }
        ]
    },
    "fleet": {
       "name": "Premium Sedan",
        "description": "Premium sedans for extra comfort and luxury.",
        "cab_names": [
            "Honda City",
            "Etios",
            "Dzire Plus",
            "Aura",
            "Xcent",
            "Verna",
            "Ciaz",
            "Yaris",
            "Slavia"
        ],
        "inventory_cab_names": [
            "Etios",
            "Dzire Plus",
            "Xcent",
            "Aura"
        ],
        "capacity": "4+1",
        "passenger_capacity": 4,
        "luggage_capacity": {
            "num_large_suitcases": 1,
            "num_carryons": 2,
            "num_backpacks": 1,
            "num_other_bags": 0
        },
        "roof_carrier": false,
        "total_luggages": 4
    }
}

http://localhost:8000/api/v1/trips/confirm-booking
Response:
{
    "booking_id": "AIRPORTTFR-PICKUP-WMB37ALTBMX5WWFM",
    "messages": {
        "status": "confirmed",
        "status_text": "Your booking has been confirmed!",
        "next_steps": [
            {
                "id": "AWAIT_TRIP_DETAILS",
                "step": "Await trip details",
                "instruction": "Your booking is confirmed! You will receive the trip and driver details in your registered email shortly. You can also view all your trip details anytime in the app."
            },
            {
                "id": "PAY_REMAINING_FARE_TO_DRIVER",
                "step": "Pay remaining fare to driver after trip completion",
                "instruction": "After your trip is completed, please pay the remaining fare shown in the app, along with any additional charges such as tolls, paid parking, extra hours/kilometres, or night surcharges directly to the driver in cash/UPI."
            }
        ],
        "advisory": [
            {
                "id": "DO_NOT_PAY_FOR_DRIVER_ACCOMMODATION",
                "instruction": "You are not required or liable to arrange or pay for any driver accommodation.",
                "additional_info": "If you are willing to provide driver accommodation during the trip, please do so at your own discretion and Cabbo will not be responsible for any such arrangements."
            },
            {
                "id": "DO_NOT_PAY_FOR_DRIVER_FOOD",
                "instruction": "You are not required or liable to arrange or pay for any driver food or meals.",
                "additional_info": "If you are willing to provide driver food or meals during the trip, please do so at your own discretion and Cabbo will not be responsible for any such arrangements."
            },
            {
                "id": "DO_NOT_ENTERTAIN_UNWANTED_PAYMENT_REQUESTS_FROM_DRIVER",
                "instruction": "Please do not pay any money to the driver outside of the trip fare and applicable additional charges.",
                "additional_info": "You are only required to pay the remaining fare shown in the app and any applicable additional charges such as tolls, paid parking, extra hours/kilometres, or night surcharges. If the driver requests any other payments, please report it to our support team immediately."
            },
            {
                "id": "OPTIONAL_TIPPING",
                "instruction": "You are free to tip your driver directly in cash/UPI, at your own discretion.",
                "additional_info": "Tipping is not mandatory but greatly appreciated."
            },
            {
                "id": "CONTACT_SUPPORT_GENERAL",
                "instruction": "If you face any issues or have concerns during your trip, please contact Cabbo support immediately.",
                "additional_info": "Your comfort and safety are our priority. Our support team is always here to help you."
            }
        ]
    }
}


http://localhost:8000/api/v1/trips/cleanup

Response: {"message": "Trip data cleaned up successfully."}

http://localhost:8000/api/v1/trips/reviews
Response: Your trip review has been posted successfully.

http://localhost:8000/api/v1/trips/constraints
Response:
{"max_hops": 3,
                "min_trip_days": 2
                "max_trip_days":7
                "round_trip_only":True
}

http://localhost:8000/api/v1/trips/trip-packages/<trip_type>/<region_code>
Response:
[
    {

    "id": "346aca54-e872-4333-a472-12757e9fd152", Here ID is necessary because this ID goes into the search as we find ride.
    "included_hours": 4,
    "included_km": 40,
    "description": null,
    "best_intended_for": "Perfect for short city trips, errands, or quick meetings."
}
]

http://localhost:8000/api/v1/customer/profile/upload/profile-picture

Response:{
    key: s3key,
    url: s3url
}

http://localhost:8000/api/v1/customer/profile/update/name
Response
{"name": updated_name, "message": "Name updated successfully."}

http://localhost:8000/api/v1/customer/profile/update/email
Response
{
            "email": updated_email,
            "message": "Email updated successfully. Please verify your new email address.",
        }

http://localhost:8000/api/v1/auth/onboard/initiate
Response
{
            "message": "OTP sent to phone number.",
            "phone_number": phone_number,
            "last_sent_at": last_sent_at,
            "resend_interval_seconds": OTP_RESEND_INTERVAL_SECONDS,
        }

http://localhost:8000/api/v1/auth/onboard/verify
Response
{"message": "OTP verified successfully. You can proceed with account setup."}


http://localhost:8000/api/v1/auth/onboard
Response:
access_token=token,
        token_type="bearer",
        expires_in=JWT_EXPIRES_IN,  # n days in seconds
        first_time_login=True, 


http://localhost:8000/api/v1/auth/login/initiate
Response:
{
            "message": "OTP sent to phone number.",
            "phone_number": phone_number,
            "last_sent_at": last_sent_at,
            "resend_interval_seconds": OTP_RESEND_INTERVAL_SECONDS,
        }

http://localhost:8000/api/v1/auth/login
Response:
{access_token=token,
        token_type="bearer",
        expires_in=JWT_EXPIRES_IN,}



http://localhost:8000/api/v1/auth/resend-otp
Response:
{
            "message": "OTP resent to phone number.",
            "phone_number": payload.phone_number,
            "last_sent_at": last_sent_at,
            "resend_interval_seconds": OTP_RESEND_INTERVAL_SECONDS,
        }