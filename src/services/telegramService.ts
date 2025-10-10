const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

interface SendMessageParams {
  chatId: string | number;
  text: string;
  parseMode?: 'HTML' | 'Markdown';
}

export const sendTelegramMessage = async ({ chatId, text, parseMode = 'HTML' }: SendMessageParams): Promise<boolean> => {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      }),
    });

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};

export const sendTestDriveNotification = async (
  telegramUserId: string,
  data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
    preferredDate: string;
    preferredTime: string;
    notes?: string;
  }
): Promise<boolean> => {
  const message = `
🚗 <b>New Test Drive Request</b>

<b>Customer Information:</b>
👤 Name: ${data.customerName}
📧 Email: ${data.customerEmail}
📱 Phone: ${data.customerPhone}

<b>Vehicle Details:</b>
🚙 ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}

<b>Preferred Schedule:</b>
📅 Date: ${data.preferredDate}
🕐 Time: ${data.preferredTime}

${data.notes ? `<b>Additional Notes:</b>\n${data.notes}` : ''}

Please contact the customer to confirm the test drive appointment.
  `.trim();

  return sendTelegramMessage({ chatId: telegramUserId, text: message });
};

export const sendTradeInNotification = async (
  telegramUserId: string,
  data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
    vehicleMileage: number;
    vehicleCondition: string;
    targetVehicle?: {
      year: number;
      make: string;
      model: string;
    };
  }
): Promise<boolean> => {
  const targetVehicleText = data.targetVehicle
    ? `\n\n<b>Applying Toward Purchase:</b>\n🎯 ${data.targetVehicle.year} ${data.targetVehicle.make} ${data.targetVehicle.model}`
    : '';

  const message = `
🔄 <b>New Trade-In Request</b>

<b>Customer Information:</b>
👤 Name: ${data.customerName}
📧 Email: ${data.customerEmail}
📱 Phone: ${data.customerPhone}

<b>Trade-In Vehicle:</b>
🚙 ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}
📊 Mileage: ${data.vehicleMileage.toLocaleString()}
✨ Condition: ${data.vehicleCondition}${targetVehicleText}

Please contact the customer to schedule a vehicle evaluation.
  `.trim();

  return sendTelegramMessage({ chatId: telegramUserId, text: message });
};

export const promoteVehicleToChannel = async (
  chatId: string | number,
  vehicle: {
    year: number;
    make: string;
    model: string;
    price: number;
    mileage: number;
    mileageUnit: string;
    condition: string;
    transmission: string;
    fuelType: string;
    exteriorColor: string;
    imageUrls?: string[];
    description?: string;
  }
): Promise<boolean> => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const message = `
🚗 <b>${vehicle.year} ${vehicle.make} ${vehicle.model}</b>

💰 <b>Price:</b> ${formatPrice(vehicle.price)}
📊 <b>Mileage:</b> ${vehicle.mileage.toLocaleString()} ${vehicle.mileageUnit}
✨ <b>Condition:</b> ${vehicle.condition}
⚙️ <b>Transmission:</b> ${vehicle.transmission}
⛽ <b>Fuel Type:</b> ${vehicle.fuelType}
🎨 <b>Color:</b> ${vehicle.exteriorColor}

${vehicle.description ? `\n${vehicle.description}\n` : ''}
Contact us today for more details or to schedule a test drive!
  `.trim();

  if (vehicle.imageUrls && vehicle.imageUrls.length > 0) {
    try {
      const response = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          photo: vehicle.imageUrls[0],
          caption: message,
          parse_mode: 'HTML',
        }),
      });

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Error sending photo to Telegram:', error);
      return sendTelegramMessage({ chatId, text: message });
    }
  } else {
    return sendTelegramMessage({ chatId, text: message });
  }
};
