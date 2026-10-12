# Luz Laundry — high fidelity HCI Prototype

A responsive HTML/CSS/JavaScript prototype for the **Luz Laundry Order Tracking and Record Management System**. It is designed for the ITEC 80 HCI laboratory activity and runs without a build tool or backend.

## Screens and features
1. Home / landing page
2. Staff login
3. Staff dashboard
4. New laundry order form
5. Orders list with search and status filter
6. Payment recording and payment records
7. Customer list with order counts
8. Customer order tracking
9. Order details and status update


## HCI principles demonstrated
- **Consistency:** shared colors, typography, labels, buttons, badges, and navigation.
- **Visibility:** page titles, status badges, dashboard metrics, required-field marks, and progress steps.
- **Feedback:** success toast messages, invalid-login message, missing-order message, and form validation.
- **User control:** navigation links, back/cancel buttons, and clear-form action.
- **Error prevention:** required fields, positive weight/payment validation, and prevention of payment exceeding the remaining balance.
- **Clear navigation:** home, staff dashboard sidebar, order detail, and customer tracking flow.
- **Visual hierarchy:** headings, summary cards, form sections, spacing, and emphasized primary buttons.


## Usability testing: issues and improvements
| Usability issue found or anticipated | Improvement in this prototype |
| --- | --- |
| A staff member may not know whether an order was saved. | A visible success message appears after saving an order. |
| A customer may enter an incorrect order number. | The tracking page displays a clear error and asks the customer to check the number. |
| Staff may accidentally record a payment larger than the balance. | The form checks the payment amount and prevents overpayment. |
| Staff may lose their place when moving between pages. | The same sidebar navigation and active-page styling are used on staff pages. |
| Small screens may make a wide order table hard to read. | Tables can scroll horizontally on mobile, while forms and navigation adapt to smaller screens. |

## Important limitations
- This is a front-end prototype, not a complete production system.
- Login is for demonstration only; do not use real or sensitive passwords.
- `localStorage` is not a central database and does not synchronize data across devices.
- Customer tracking is a manual lookup. Automatic SMS/push notifications are not implemented.
- Income is calculated from payments recorded in this browser; it is not a verified accounting report.
