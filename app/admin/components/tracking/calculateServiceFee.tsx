interface ServiceFeeParams {
  pricing: string;
  lot_type: string;
  user_rate: string;
  weight: number;
  wide: number;
  high: number;
  long: number;
  number: number;
}

interface ServiceFeeResult {
  serviceFee: number;
  cal_price: number;
  type_cal: 'weightPrice' | 'volumePrice';
}

export const calculateServiceFee = ({
  pricing,
  lot_type,
  user_rate,
  weight,
  wide,
  high,
  long,
  number
}: ServiceFeeParams): ServiceFeeResult => {
  const volume = (wide * high * long) / 1000000;
  let cal_price = 0;
  let type_cal: 'weightPrice' | 'volumePrice';

  const weightPrice = lot_type === "รถ" 
    ? user_rate === "A" ? weight * 15 : user_rate === "B" ? weight * 20 : weight * 35
    : user_rate === "A" ? weight * 10 : user_rate === "B" ? weight * 15 : weight * 35;

  const volumePrice = lot_type === "รถ"
    ? user_rate === "A" ? volume * 5900 : user_rate === "B" ? volume * 6000 : volume * 8500
    : user_rate === "A" ? volume * 3800 : user_rate === "B" ? volume * 5500 : volume * 8500;

  if (pricing === "อัตโนมัติ") {
    if (lot_type === "รถ") {
      if (user_rate === "A") {
        cal_price = Math.max(weight * 15, volume * 5900);
      } else if (user_rate === "B") {
        cal_price = Math.max(weight * 20, volume * 6000);
      } else if (user_rate === "C") {
        cal_price = Math.max(weight * 35, volume * 8500);
      }
    } else if (lot_type === "เรือ") {
      if (user_rate === "A") {
        cal_price = Math.max(weight * 10, volume * 3800);
      } else if (user_rate === "B") {
        cal_price = Math.max(weight * 15, volume * 5500);
      } else if (user_rate === "C") {
        cal_price = Math.max(weight * 35, volume * 8500);
      }
    }
  } else if (pricing === "น้ำหนัก") {
    cal_price = weightPrice;
  } else if (pricing === "ปริมาตร") {
    cal_price = volumePrice;
  }

  type_cal = weightPrice > volumePrice ? 'weightPrice' : 'volumePrice';

  return {
    serviceFee: cal_price * number,
    cal_price,
    type_cal
  };
};