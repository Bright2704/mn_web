export interface LotData {
    lot_id: string;
    note: string;
    lot_type: string;
    num_item: number;
    file_path?: string;
    image_path?: string;
  }
  
  export interface TrackingData {
    tracking_id: string;
    mnemonics: string;
    weight: number;
    wide: number;
    high: number;
    long: number;
    number: number;
    lot_id: string;
    in_cn: string;
    out_cn: string;
    in_th: string;
    user_id: string;
    type_item: string;
    check_product_price: number;
    transport: number;
    price_crate: number;
    new_wrap: number;
    other: number;
    image_item_paths: string[];
    lot_type: string;
    cal_price: number;
    type_cal: "weightPrice" | "volumePrice";
  }