import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Customer, CustomerSource, CustomerVehiclePurchase } from '../types';

export const findCustomerByEmail = async (email: string): Promise<Customer | null> => {
  try {
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Customer;
  } catch (error) {
    console.error('Error finding customer by email:', error);
    throw error;
  }
};

export const findCustomerByPhone = async (phone: string): Promise<Customer | null> => {
  try {
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('phone', '==', phone));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Customer;
  } catch (error) {
    console.error('Error finding customer by phone:', error);
    throw error;
  }
};

export const createCustomer = async (customerData: Omit<Customer, 'id'>): Promise<string> => {
  try {
    const customersRef = collection(db, 'customers');
    const newCustomerRef = doc(customersRef);

    await setDoc(newCustomerRef, {
      ...customerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return newCustomerRef.id;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const updateCustomer = async (customerId: string, updates: Partial<Customer>): Promise<void> => {
  try {
    const customerRef = doc(db, 'customers', customerId);
    await updateDoc(customerRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const addPurchaseToCustomer = async (
  customerId: string,
  purchase: CustomerVehiclePurchase
): Promise<void> => {
  try {
    const customerRef = doc(db, 'customers', customerId);
    await updateDoc(customerRef, {
      vehiclesPurchased: arrayUnion(purchase),
      totalPurchases: increment(1),
      totalSpent: increment(purchase.salePrice),
      source: arrayUnion('purchase' as CustomerSource),
      status: 'active',
      lastContactDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding purchase to customer:', error);
    throw error;
  }
};

export const linkTestDriveToCustomer = async (
  customerId: string,
  testDriveId: string
): Promise<void> => {
  try {
    const customerRef = doc(db, 'customers', customerId);
    await updateDoc(customerRef, {
      testDrives: arrayUnion(testDriveId),
      source: arrayUnion('test-drive' as CustomerSource),
      lastContactDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error linking test drive to customer:', error);
    throw error;
  }
};

export const linkTradeInToCustomer = async (
  customerId: string,
  tradeInId: string
): Promise<void> => {
  try {
    const customerRef = doc(db, 'customers', customerId);
    await updateDoc(customerRef, {
      tradeIns: arrayUnion(tradeInId),
      source: arrayUnion('trade-in' as CustomerSource),
      lastContactDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error linking trade-in to customer:', error);
    throw error;
  }
};

export const getOrCreateCustomer = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  additionalData?: Partial<Customer>
): Promise<string> => {
  try {
    const existingCustomer = await findCustomerByEmail(email);

    if (existingCustomer) {
      return existingCustomer.id;
    }

    const newCustomerData: Omit<Customer, 'id'> = {
      firstName,
      lastName,
      email,
      phone,
      address: additionalData?.address || '',
      city: additionalData?.city || '',
      state: additionalData?.state || '',
      zipCode: additionalData?.zipCode || '',
      source: additionalData?.source || ['walk-in'],
      status: additionalData?.status || 'lead',
      telegramUserId: additionalData?.telegramUserId,
      totalPurchases: 0,
      totalSpent: 0,
      vehiclesPurchased: [],
      testDrives: [],
      tradeIns: [],
      financingApplications: [],
      serviceAppointments: [],
      notes: additionalData?.notes,
      preferredContact: additionalData?.preferredContact,
      tags: additionalData?.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await createCustomer(newCustomerData);
  } catch (error) {
    console.error('Error getting or creating customer:', error);
    throw error;
  }
};
