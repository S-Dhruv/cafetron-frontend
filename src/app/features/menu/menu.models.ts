export interface MenuItem {
  id: number;
  itemName: string;
  price: number;
  stock: number;
  foodType: string;
  isAvailable: boolean;
  vendorId: number;
  vendorName: string;
}

export interface MenuItemRequest {
  itemName: string;
  price: number;
  stock: number;
  foodType: string;
  vendorId: number;
}

export interface Vendor {
  id: number;
  name: string;
  isActive: boolean;
}