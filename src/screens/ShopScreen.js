/**
 * Shop Screen
 * Auto customization and coin packs
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../config/colors';
import { useUser } from '../context/UserContext';
import LocalizationService from '../services/LocalizationService';
import { BODY_PAINTS } from '../data/shopItems';
import Button from '../components/ui/Button';

const ShopScreen = ({ onClose }) => {
  const { user, spendCoins, purchaseItem, equipItem, ownedItems, equippedItems } = useUser();

  const handlePurchase = async (item) => {
    if (user.coins >= item.price) {
      const success = await purchaseItem('bodyPaint', item.id, item.price);
      if (success) {
        alert(`Purchased ${item.name.en}!`);
        await equipItem('bodyPaint', item.id);
      }
    } else {
      alert('Not enough coins!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{LocalizationService.t('AUTO_SHOP')}</Text>
        <View style={styles.coinDisplay}>
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.coinText}>{user.coins || 0}</Text>
        </View>
      </View>

      <View style={styles.preview}>
        <View style={styles.autoPreview}>
          <Text style={styles.autoIcon}>🛺</Text>
        </View>
        <Text style={styles.previewText}>Your Auto</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.categoryTitle}>{LocalizationService.t('BODY_PAINT')}</Text>

        {BODY_PAINTS.map(item => {
          const isOwned = ownedItems.bodyPaint?.includes(item.id);
          const isEquipped = equippedItems.bodyPaint === item.id;

          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name.en}</Text>
                <Text style={styles.itemDescription}>{item.description.en}</Text>
              </View>

              <View style={styles.itemAction}>
                {isOwned ? (
                  isEquipped ? (
                    <View style={styles.equipped}>
                      <Text style={styles.equippedText}>
                        {LocalizationService.t('EQUIPPED')}
                      </Text>
                    </View>
                  ) : (
                    <Button
                      size="small"
                      onPress={() => equipItem('bodyPaint', item.id)}
                    >
                      Equip
                    </Button>
                  )
                ) : (
                  <Button
                    size="small"
                    variant="secondary"
                    onPress={() => handlePurchase(item)}
                  >
                    🪙 {item.price}
                  </Button>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.SURFACE,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 32,
    color: COLORS.PRIMARY,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  coinDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    fontSize: 20,
  },
  coinText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  preview: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: COLORS.SURFACE,
  },
  autoPreview: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 75,
  },
  autoIcon: {
    fontSize: 80,
  },
  previewText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  itemAction: {
    marginLeft: 12,
  },
  equipped: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  equippedText: {
    color: COLORS.TEXT_ON_PRIMARY,
    fontWeight: 'bold',
  },
});

export default ShopScreen;
