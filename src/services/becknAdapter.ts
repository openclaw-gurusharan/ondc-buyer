import axios, { AxiosInstance } from 'axios';

const BECKN_API_URL = import.meta.env.VITE_BECKN_API_URL || 'https://api.beckn.ondc.org';

export interface BecknContext {
  domain: string;
  location?: {
    country: { code: string };
    city: { code: string };
  };
  action: 'search' | 'select' | 'init' | 'confirm' | 'status' | 'track' | 'cancel' | 'update';
  version: string;
  bap_id: string;
  bap_uri: string;
  transaction_id: string;
  message_id: string;
  timestamp: string;
  ttl?: string;
}

export interface BecknItem {
  id: string;
  descriptor?: {
    name?: string;
    short_desc?: string;
    long_desc?: string;
    images?: string[];
  };
  price?: {
    currency: string;
    value: string;
    estimated_value?: string;
    computed_value?: string;
    offer_price?: { currency: string; value: string };
  };
  quantity?: {
    available?: { count?: string | number };
    selected?: { count?: string | number };
    unitized?: { measure?: { value: string; unit: string } };
  };
  category_id?: string;
  fulfillment_id?: string;
  tags?: Record<string, string>;
}

export interface BecknProvider {
  id: string;
  descriptor?: {
    name?: string;
    short_desc?: string;
    long_desc?: string;
    images?: string[];
  };
  locations?: Array<{
    id: string;
    descriptor?: { name?: string };
    address?: {
      street?: string;
      locality?: string;
      city?: string;
      state?: string;
      country?: string;
      area_code?: string;
    };
    circle?: { radius: { value: string; unit: string } };
    time?: {
      label?: string;
      timestamp?: string;
      schedule?: { holidays?: string[]; weekly_off?: string[] };
    };
  }>;
  items?: BecknItem[];
  tags?: Record<string, string>;
}

export interface BecknFulfillment {
  id?: string;
  type?: string;
  provider?: { id: string; descriptor?: { name?: string } };
  tracking?: boolean;
  contact?: {
    phone?: string;
    email?: string;
  };
  instructions?: {
    name?: string;
    short_desc?: string;
    long_desc?: string;
    additional_desc?: { url?: string; content_type?: string };
    images?: string[];
  };
  order?: {
    id?: string;
    state?: string;
    provider?: { id: string; descriptor?: { name?: string } };
    items?: BecknItem[];
    billing?: {
      name?: string;
      email?: string;
      phone?: string;
      address?: {
        door?: string;
        name?: string;
        building?: string;
        street?: string;
        locality?: string;
        city?: string;
        state?: string;
        country?: string;
        area_code?: string;
      };
      created_at?: string;
      updated_at?: string;
    };
    fulfillments?: Array<{
      id?: string;
      type?: string;
      state?: { descriptor?: { code?: string; name?: string } };
      tracking?: boolean;
      contact?: { phone?: string; email?: string };
      start?: {
        location?: { id?: string; descriptor?: { name?: string }; address?: any; gps?: string };
        time?: { range?: { start?: string; end?: string }; schedule?: { frequency?: string; holidays?: string[]; times?: string[] } };
        instructions?: any;
        contact?: { phone?: string; email?: string };
        person?: { name?: string };
      };
      end?: {
        location?: { id?: string; descriptor?: { name?: string }; address?: any; gps?: string };
        time?: { range?: { start?: string; end?: string } };
        instructions?: any;
        contact?: { phone?: string; email?: string };
        person?: { name?: string };
      };
    }>;
    quote?: {
      price?: { currency: string; value: string };
      breakup?: Array<{
        title?: string;
        price?: { currency: string; value: string };
        item?: { id?: string; quantity?: { selected?: { count?: string | number } } };
        tags?: Array<{ descriptor?: { code?: string }; list?: Array<{ descriptor?: { code?: string }; value?: string }> }>;
      }>;
      ttl?: string;
    };
    payments?: Array<{
      id?: string;
      type?: string;
      status?: string;
      params?: {
        amount?: string;
        currency?: string;
        bank_code?: string;
        bank_account_number?: string;
        virtual_payment_address?: string;
      };
      buyer_app_finder_fee_type?: string;
      buyer_app_finder_fee_amount?: string;
      seller_app_finder_fee_type?: string;
      seller_app_finder_fee_amount?: string;
    }>;
  };
}

export interface BecknOrder {
  id?: string;
  state?: string;
  provider?: BecknProvider;
  items?: BecknItem[];
  billing?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      door?: string;
      name?: string;
      building?: string;
      street?: string;
      locality?: string;
      city?: string;
      state?: string;
      country?: string;
      area_code?: string;
    };
    created_at?: string;
    updated_at?: string;
  };
  fulfillments?: BecknFulfillment[];
  quote?: {
    price?: { currency: string; value: string };
    breakup?: Array<{
      title?: string;
      price?: { currency: string; value: string };
    }>;
    ttl?: string;
  };
  payments?: Array<{
    id?: string;
    type?: string;
    status?: string;
    params?: { amount?: string; currency?: string };
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface BecknSearchRequest {
  context: Omit<BecknContext, 'action' | 'timestamp'> & { action: 'search' };
  message: {
    intent: {
      item?: {
        descriptor?: { name?: string };
        price?: { currency?: string; max_value?: string };
        quantity?: { count?: number; measure?: { value: number; unit: string } };
      };
      provider?: { id?: string; descriptor?: { name?: string } };
      category?: { id?: string; descriptor?: { name?: string } };
      fulfillment?: {
        type?: string;
        end?: {
          location?: { gps?: string; address?: { area_code?: string } };
        };
      };
      payment?: {
        type?: string;
        tl_method?: string;
        params?: { amount?: string; currency?: string };
      };
      tags?: Array<{ descriptor?: { code?: string }; list?: Array<{ descriptor?: { code?: string }; value?: string }> }>;
    };
  };
}

export interface BecknSearchResponse {
  context: BecknContext;
  message: {
    catalogs?: Array<{
      provider: BecknProvider[];
    }>;
  };
  error?: {
    code?: string;
    message?: string;
    details?: Array<{ code?: string; message?: string }>;
  };
}

export interface BecknSelectRequest {
  context: Omit<BecknContext, 'action' | 'timestamp'> & { action: 'select' };
  message: {
    order: {
      provider: { id: string };
      items: Array<{ id: string; quantity: number }>;
    };
  };
}

export interface BecknSelectResponse {
  context: BecknContext;
  message: {
    order: BecknOrder;
  };
  error?: {
    code?: string;
    message?: string;
  };
}

export interface BecknInitRequest {
  context: Omit<BecknContext, 'action' | 'timestamp'> & { action: 'init' };
  message: {
    order: {
      provider: { id: string; locations?: Array<{ id: string }> };
      items: Array<{
        id: string;
        quantity: number;
        fulfillment_ids?: string[];
      }>;
      billing: {
        name: string;
        email?: string;
        phone: string;
        address: {
          door?: string;
          name?: string;
          building?: string;
          street?: string;
          locality?: string;
          city?: string;
          state?: string;
          country?: string;
          area_code: string;
        };
      };
      fulfillments: Array<{
        id?: string;
        type: string;
        end: {
          location: {
            address: {
              door?: string;
              name?: string;
              building?: string;
              street?: string;
              locality?: string;
              city?: string;
              state?: string;
              country?: string;
              area_code: string;
            };
          };
          contact?: { phone: string; email?: string };
        };
      }>;
      payment?: {
        type: string;
        params?: { amount?: string; currency?: string };
      };
    };
  };
}

export interface BecknInitResponse {
  context: BecknContext;
  message: {
    order: BecknOrder;
  };
  error?: {
    code?: string;
    message?: string;
  };
}

export interface BecknConfirmRequest {
  context: Omit<BecknContext, 'action' | 'timestamp'> & { action: 'confirm' };
  message: {
    order: BecknOrder;
  };
}

export interface BecknConfirmResponse {
  context: BecknContext;
  message: {
    order: BecknOrder;
  };
  error?: {
    code?: string;
    message?: string;
  };
}

export interface BecknStatusRequest {
  context: Omit<BecknContext, 'action' | 'timestamp'> & { action: 'status' };
  message: {};
}

export interface BecknStatusResponse {
  context: BecknContext;
  message: {
    order: BecknOrder;
  };
  error?: {
    code?: string;
    message?: string;
  };
}

export interface BecknRequest<T = any> {
  context: BecknContext;
  message: T;
  error?: {
    code?: string;
    message?: string;
    details?: Array<{ code?: string; message?: string }>;
  };
}

export interface BecknResponse<T = any> {
  context: BecknContext;
  message: T;
  error?: {
    code?: string;
    message?: string;
    details?: Array<{ code?: string; message?: string }>;
  };
}

export interface OndcLifecycle {
  transactionId: string;
  messageId: string;
  bapId: string;
  bapUri: string;
  bppId?: string;
  bppUri?: string;
  action: 'search' | 'select' | 'init' | 'confirm' | 'status' | 'track' | 'cancel' | 'update';
  timestamp: string;
  domain: string;
  orderId?: string;
  status?: string;
}

class BecknAdapter {
  private client: AxiosInstance;
  private transactionId: string;
  private messageId: string;
  private bapId: string;
  private bapUri: string;
  private currentOrderId?: string;

  constructor() {
    this.client = axios.create({
      baseURL: BECKN_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.transactionId = this.generateId();
    this.messageId = this.generateId();
    this.bapId = import.meta.env.VITE_BAP_ID || 'buyer.ondc.example.com';
    this.bapUri = import.meta.env.VITE_BAP_URI || 'https://buyer.ondc.example.com';
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  private createContext(action: BecknContext['action']): BecknContext {
    this.messageId = this.generateId();
    return {
      domain: 'ONDC:FIS11',
      action,
      version: '1.1.0',
      bap_id: this.bapId,
      bap_uri: this.bapUri,
      transaction_id: this.transactionId,
      message_id: this.messageId,
      timestamp: new Date().toISOString(),
      ttl: 'PT30M',
    };
  }

  async search(params: {
    query?: string;
    categoryId?: string;
    providerId?: string;
    location?: { city: string; country: string };
  }): Promise<BecknSearchResponse> {
    const context = this.createContext('search');

    const request: BecknSearchRequest = {
      context: context as any,
      message: {
        intent: {
          item: params.query ? { descriptor: { name: params.query } } : {},
          provider: params.providerId ? { id: params.providerId } : {},
          category: params.categoryId ? { id: params.categoryId } : {},
          fulfillment: params.location
            ? {
                type: 'Delivery',
                end: {
                  location: {
                    address: { area_code: params.location.city },
                  },
                },
              }
            : {},
        },
      },
    };

    try {
      const response = await this.client.post<BecknSearchResponse>('/search', request);
      return response.data;
    } catch (error) {
      console.error('Beckn search error:', error);
      throw error;
    }
  }

  async select(params: {
    providerId: string;
    itemIds: Array<{ id: string; quantity: number }>;
  }): Promise<BecknSelectResponse> {
    const context = this.createContext('select');

    const request: BecknSelectRequest = {
      context: context as any,
      message: {
        order: {
          provider: { id: params.providerId },
          items: params.itemIds,
        },
      },
    };

    try {
      const response = await this.client.post<BecknSelectResponse>('/select', request);
      return response.data;
    } catch (error) {
      console.error('Beckn select error:', error);
      throw error;
    }
  }

  async init(params: {
    providerId: string;
    itemIds: Array<{ id: string; quantity: number }>;
    billing: {
      name: string;
      email?: string;
      phone: string;
      address: {
        area_code: string;
        city?: string;
        state?: string;
        country?: string;
        street?: string;
        locality?: string;
        building?: string;
        door?: string;
      };
    };
    fulfillment: {
      type: string;
      end: {
        location: {
          address: {
            area_code: string;
            city?: string;
            state?: string;
            country?: string;
            street?: string;
            locality?: string;
            building?: string;
            door?: string;
          };
        };
        contact?: { phone: string; email?: string };
      };
    };
  }): Promise<BecknInitResponse> {
    const context = this.createContext('init');

    const request: BecknInitRequest = {
      context: context as any,
      message: {
        order: {
          provider: { id: params.providerId, locations: [] },
          items: params.itemIds,
          billing: params.billing,
          fulfillments: [params. fulfillment],
        },
      },
    };

    try {
      const response = await this.client.post<BecknInitResponse>('/init', request);
      return response.data;
    } catch (error) {
      console.error('Beckn init error:', error);
      throw error;
    }
  }

  async confirm(order: BecknOrder): Promise<BecknConfirmResponse> {
    const context = this.createContext('confirm');

    const request: BecknConfirmRequest = {
      context: context as any,
      message: {
        order,
      },
    };

    try {
      const response = await this.client.post<BecknConfirmResponse>('/confirm', request);
      if (response.data.message?.order?.id) {
        this.currentOrderId = response.data.message.order.id;
      }
      return response.data;
    } catch (error) {
      console.error('Beckn confirm error:', error);
      throw error;
    }
  }

  async status(orderId?: string): Promise<BecknStatusResponse> {
    const context = this.createContext('status');
    context.transaction_id = orderId || this.transactionId;

    const request: BecknStatusRequest = {
      context: context as any,
      message: {},
    };

    try {
      const response = await this.client.post<BecknStatusResponse>('/status', request);
      return response.data;
    } catch (error) {
      console.error('Beckn status error:', error);
      throw error;
    }
  }

  getLifecycle(): OndcLifecycle {
    return {
      transactionId: this.transactionId,
      messageId: this.messageId,
      bapId: this.bapId,
      bapUri: this.bapUri,
      action: 'confirm',
      timestamp: new Date().toISOString(),
      domain: 'ONDC:FIS11',
      orderId: this.currentOrderId,
    };
  }

  resetTransaction(): void {
    this.transactionId = this.generateId();
    this.messageId = this.generateId();
    this.currentOrderId = undefined;
  }

  setBpp(bppId: string, bppUri: string): void {
    console.log(`Beckn adapter configured with BPP: ${bppId} at ${bppUri}`);
  }
}

export const becknAdapter = new BecknAdapter();

export default becknAdapter;
