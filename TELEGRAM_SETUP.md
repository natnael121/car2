# Telegram Integration Setup Guide

This guide will help you set up the Telegram integration for your car dealership application.

## Features

1. **Test Drive Notifications**: When a customer requests a test drive, you'll receive a notification with their contact details and preferred schedule.

2. **Trade-In Notifications**: When a customer submits a trade-in evaluation request, you'll receive a notification with their vehicle details and contact information.

3. **Vehicle Promotion**: You can promote vehicles to a Telegram channel or group with a single click, sharing the vehicle details and images with your audience.

## Configuration Steps

### 1. Get Your Telegram User ID

To receive notifications, you need your Telegram user ID:

1. Open Telegram and search for `@userinfobot`
2. Start a conversation with the bot
3. The bot will send you your user ID (a number like `123456789`)
4. Copy this user ID

### 2. Create a Telegram Channel or Group (for promotions)

1. Open Telegram and create a new channel or group
2. Add your bot as an administrator:
   - Go to channel/group settings
   - Click "Administrators"
   - Click "Add Administrator"
   - Search for your bot username: `@car_shop_MD_bot`
   - Give it permission to post messages

3. Get the channel/group ID:
   - For public channels: Use the channel username (e.g., `@your_channel`)
   - For private channels/groups:
     - Add `@userinfobot` to the channel/group
     - Forward a message from the channel/group to the bot
     - The bot will show you the channel ID (e.g., `-1001234567890`)

### 3. Configure Environment Variables

Update your `.env` file with the following values:

```env
VITE_TELEGRAM_BOT_TOKEN=8410370897:AAE1qG1lai5ZbHBpSr58RfAuqYTaG6Gaa1Y
VITE_TELEGRAM_BOT_USERNAME=car_shop_MD_bot
VITE_TELEGRAM_ADMIN_USER_ID=YOUR_TELEGRAM_USER_ID
VITE_TELEGRAM_CHANNEL_ID=YOUR_TELEGRAM_CHANNEL_OR_GROUP_ID
```

Replace:
- `YOUR_TELEGRAM_USER_ID` with your user ID from step 1
- `YOUR_TELEGRAM_CHANNEL_OR_GROUP_ID` with your channel/group ID from step 2

### 4. Test the Integration

1. **Test Drive Notifications**:
   - Submit a test drive request from the app
   - You should receive a message on Telegram with the customer's details

2. **Trade-In Notifications**:
   - Submit a trade-in evaluation request from the app
   - You should receive a message on Telegram with the vehicle and customer details

3. **Vehicle Promotion**:
   - Open any vehicle details page
   - Click the "Promote to Channel" button
   - The vehicle should be posted to your Telegram channel/group

## Notification Message Format

### Test Drive Notification
```
🚗 New Test Drive Request

Customer Information:
👤 Name: John Doe
📧 Email: john@example.com
📱 Phone: (555) 123-4567

Vehicle Details:
🚙 2020 Toyota Camry

Preferred Schedule:
📅 Date: 2025-10-15
🕐 Time: 10:00

Additional Notes:
Looking forward to testing the vehicle

Please contact the customer to confirm the test drive appointment.
```

### Trade-In Notification
```
🔄 New Trade-In Request

Customer Information:
👤 Name: John Doe
📧 Email: john@example.com
📱 Phone: (555) 123-4567

Trade-In Vehicle:
🚙 2018 Honda Accord
📊 Mileage: 45,000
✨ Condition: good

Applying Toward Purchase:
🎯 2020 Toyota Camry

Please contact the customer to schedule a vehicle evaluation.
```

### Vehicle Promotion
```
🚗 2020 Toyota Camry

💰 Price: $25,000
📊 Mileage: 30,000 miles
✨ Condition: certified-pre-owned
⚙️ Transmission: automatic
⛽ Fuel Type: hybrid
🎨 Color: Silver

This is a well-maintained vehicle with low mileage.

Contact us today for more details or to schedule a test drive!
```

## Troubleshooting

### Not receiving notifications?

1. Make sure your bot token is correct
2. Verify your user ID is correct
3. Start a conversation with your bot (`@car_shop_MD_bot`) first
4. Check the browser console for any errors

### Channel promotion not working?

1. Verify your bot is an administrator in the channel/group
2. Make sure the channel/group ID is correct (including the minus sign for private channels)
3. Ensure the bot has permission to post messages
4. Check if the channel is public or private and use the correct ID format

### Images not showing in promotions?

1. Ensure the vehicle has valid image URLs
2. Check that the images are publicly accessible
3. The Telegram API requires valid image URLs that are reachable from the internet

## Security Notes

- Never share your bot token publicly
- Keep your `.env` file secure and never commit it to version control
- The `.env` file is already included in `.gitignore` to prevent accidental commits
