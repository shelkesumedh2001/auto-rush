/**
 * IAP Manager
 * Google Play Billing integration for in-app purchases
 */

import { IAP_PRODUCTS, getAllProductIds } from '../config/iap';
import AnalyticsService from '../services/AnalyticsService';

class IAPManager {
  constructor() {
    this.initialized = false;
    this.products = [];
    this.purchaseHistory = [];
  }

  /**
   * Initialize IAP system
   */
  async initialize() {
    try {
      // Note: expo-in-app-purchases requires production build
      // For development, we'll mock the system

      if (__DEV__) {
        console.log('IAP initialized in test mode');
        console.log('Products:', Object.keys(IAP_PRODUCTS));
        this.products = Object.values(IAP_PRODUCTS);
      }

      // In production, initialize like this:
      // import * as InAppPurchases from 'expo-in-app-purchases';
      //
      // await InAppPurchases.connectAsync();
      //
      // const productIds = getAllProductIds();
      // const { results } = await InAppPurchases.getProductsAsync(productIds);
      // this.products = results;
      //
      // const history = await InAppPurchases.getPurchaseHistoryAsync();
      // this.purchaseHistory = history;
      //
      // this.setupPurchaseListener();

      this.initialized = true;
      return { success: true, products: this.products };
    } catch (error) {
      console.error('IAP initialization error:', error);
      return { success: false, error };
    }
  }

  /**
   * Get product by ID
   */
  getProduct(productId) {
    const product = IAP_PRODUCTS[productId.toUpperCase().replace(/\s/g, '_')];
    if (!product) {
      // Try to find by id field
      return Object.values(IAP_PRODUCTS).find(p => p.id === productId);
    }
    return product;
  }

  /**
   * Purchase product
   */
  async purchaseProduct(productId) {
    try {
      const product = this.getProduct(productId);
      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      // Log attempt
      AnalyticsService.logPurchaseAttempt(productId, product.price);

      if (__DEV__) {
        console.log(`[IAP] Purchasing ${productId} (simulated)`);

        // Simulate purchase delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate successful purchase
        const purchase = {
          productId: product.id,
          transactionId: 'dev_' + Date.now(),
          purchaseTime: Date.now(),
          acknowledged: false,
        };

        AnalyticsService.logPurchaseComplete(productId, product.price, 'INR');

        return {
          success: true,
          purchase,
          product,
        };
      }

      // Production implementation:
      // import * as InAppPurchases from 'expo-in-app-purchases';
      //
      // await InAppPurchases.purchaseItemAsync(productId);
      //
      // The purchase result will come through the listener
      // Return pending status
      // return { success: 'pending' };

      return { success: false, error: 'Not implemented in development' };
    } catch (error) {
      console.error('Purchase error:', error);
      return { success: false, error };
    }
  }

  /**
   * Handle successful purchase (called by listener in production)
   */
  async handleSuccessfulPurchase(purchase, userContext) {
    try {
      const product = this.getProduct(purchase.productId);
      if (!product) return;

      if (product.type === 'consumable') {
        // Add coins or items
        if (product.amount) {
          const total = product.amount + (product.bonus || 0);
          await userContext.addCoins(total);
        }

        if (product.contents) {
          for (const [type, count] of Object.entries(product.contents)) {
            await userContext.addPowerup(type, count);
          }
        }

        // Consume the purchase (allows repurchase)
        // In production:
        // await InAppPurchases.finishTransactionAsync(purchase, true);

      } else if (product.type === 'non-consumable') {
        // Permanent unlock
        if (product.id === 'remove_ads_permanent') {
          await userContext.setPurchase('adsRemoved', true);
        } else if (product.id === 'vip_all_skins_unlock') {
          // Unlock all shop items
          // Implementation would go here
        } else if (product.id === 'premium_start_boost') {
          await userContext.setPurchase('premiumStart', true);
        }

        // Acknowledge purchase (does NOT consume)
        // In production:
        // await InAppPurchases.finishTransactionAsync(purchase, false);
      }

      // Log successful purchase
      AnalyticsService.logPurchaseComplete(
        purchase.productId,
        product.price,
        'INR'
      );

      return { success: true, product };
    } catch (error) {
      console.error('Error handling purchase:', error);
      return { success: false, error };
    }
  }

  /**
   * Restore purchases (for non-consumables)
   */
  async restorePurchases(userContext) {
    try {
      if (__DEV__) {
        console.log('[IAP] Restore purchases (simulated)');
        return { success: true, restored: 0 };
      }

      // Production:
      // import * as InAppPurchases from 'expo-in-app-purchases';
      //
      // const { results } = await InAppPurchases.getPurchaseHistoryAsync();
      // let restored = 0;
      //
      // for (const purchase of results) {
      //   const product = this.getProduct(purchase.productId);
      //   if (product && product.type === 'non-consumable') {
      //     await this.handleSuccessfulPurchase(purchase, userContext);
      //     restored++;
      //   }
      // }
      //
      // return { success: true, restored };

      return { success: false, error: 'Not implemented in development' };
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return { success: false, error };
    }
  }

  /**
   * Check if product is purchased (non-consumables only)
   */
  isPurchased(productId) {
    return this.purchaseHistory.some(p => p.productId === productId);
  }

  /**
   * Get all available products
   */
  getAvailableProducts() {
    return this.products;
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category) {
    // 'coins', 'powerups', 'permanent', 'subscription'
    return this.products.filter(p => {
      if (category === 'coins') {
        return p.id.startsWith('coins_');
      } else if (category === 'powerups') {
        return p.id.includes('powerup') || p.id.includes('boost');
      } else if (category === 'permanent') {
        return p.type === 'non-consumable';
      } else if (category === 'subscription') {
        return p.type === 'subscription';
      }
      return false;
    });
  }
}

// Export singleton instance
export default new IAPManager();
