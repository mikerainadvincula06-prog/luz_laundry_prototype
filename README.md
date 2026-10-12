# Luz Laundry — Coded HCI Prototype

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

## Run locally
- Download or extract the project folder.
- Open `index.html` in a browser, or open the folder in Acode and preview `index.html`.
- No npm installation or build command is needed.

## Demo login
- Username: `staff`
- Password: `laundry123`

This is a classroom prototype. It is **not a secure production login** because the credentials are checked in front-end JavaScript. Orders are saved in the browser's `localStorage`, so data is local to that browser/device and is not shared between customers or staff devices.

## Put it on GitHub using a phone
1. Sign in to GitHub and create a new **public repository**, for example `luz-laundry-prototype`.
2. Open the repository and choose **Add file → Upload files**.
3. Upload `index.html`, `style.css`, `script.js`, and `README.md` from this folder. If the phone file picker does not let you select files from a ZIP, extract the ZIP first.
4. Commit the files to the `main` branch.
5. Confirm that `index.html`, `style.css`, and `script.js` appear at the repository root.

## Deploy to Vercel
1. Sign in to Vercel with GitHub.
2. Choose **Add New → Project** and import `luz-laundry-prototype`.
3. Framework preset: **Other**.
4. Build command: leave blank.
5. Output directory: leave blank or use `.` if Vercel asks for one.
6. Click **Deploy**. Vercel will provide a live URL.
7. Whenever you commit code changes to the connected `main` branch, Vercel can redeploy it.

## HCI principles demonstrated
- **Consistency:** shared colors, typography, labels, buttons, badges, and navigation.
- **Visibility:** page titles, status badges, dashboard metrics, required-field marks, and progress steps.
- **Feedback:** success toast messages, invalid-login message, missing-order message, and form validation.
- **User control:** navigation links, back/cancel buttons, and clear-form action.
- **Error prevention:** required fields, positive weight/payment validation, and prevention of payment exceeding the remaining balance.
- **Clear navigation:** home, staff dashboard sidebar, order detail, and customer tracking flow.
- **Visual hierarchy:** headings, summary cards, form sections, spacing, and emphasized primary buttons.

## Meaningful task to demonstrate
1. Open the site and click **Staff login**.
2. Log in with the demo credentials.
3. Click **New order**, enter customer information, choose a laundry type, enter weight, and save.
4. Open **Orders** and click **View details** for the new order.
5. Update the laundry status and save it.
6. Click **Customer tracking view** and check the order progress.
7. Optionally record a payment using **Record payment**.

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
