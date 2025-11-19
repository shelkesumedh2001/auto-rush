/**
 * Character Selection Screen
 * Choose your auto-rickshaw with unique abilities
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useUser } from '../context/UserContext';
import { COLORS, SHADOWS } from '../config/colors';
import { CHARACTERS } from '../config/constants3D';
import Button from '../components/ui/Button';
import AutoRickshaw3D from '../game3D/components/AutoRickshaw3D';
import LocalizationService from '../services/LocalizationService';

const CharacterSelectScreen = ({ onClose }) => {
  const { user, selectCharacter, unlockCharacter } = useUser();
  const [selectedId, setSelectedId] = useState(user.selectedCharacter || 'standard');
  const [purchasing, setPurchasing] = useState(false);

  const characters = Object.values(CHARACTERS);
  const selectedCharacter = CHARACTERS[selectedId.toUpperCase()];

  const handleSelect = async () => {
    await selectCharacter(selectedId);
    onClose();
  };

  const handleUnlock = async (characterId, price) => {
    setPurchasing(true);
    const success = await unlockCharacter(characterId, price);
    if (success) {
      setSelectedId(characterId);
    }
    setPurchasing(false);
  };

  const isOwned = (characterId) => {
    return user.ownedCharacters.includes(characterId);
  };

  const renderCharacterCard = (character) => {
    const owned = isOwned(character.id);
    const selected = character.id === selectedId;

    return (
      <TouchableOpacity
        key={character.id}
        style={[
          styles.card,
          selected && styles.cardSelected,
          !owned && styles.cardLocked,
        ]}
        onPress={() => owned && setSelectedId(character.id)}
        disabled={!owned}
      >
        {/* 3D Preview */}
        <View style={styles.preview}>
          <Canvas>
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <AutoRickshaw3D
                position={[0, 0, 0]}
                color={character.color}
                targetLane={0}
              />
            </Suspense>
          </Canvas>
        </View>

        {/* Character info */}
        <View style={styles.cardInfo}>
          <Text style={styles.characterName}>
            {LocalizationService.getLanguage() === 'hi'
              ? character.name.hi
              : character.name.en}
          </Text>

          {character.ability && (
            <Text style={styles.abilityText}>
              {LocalizationService.getLanguage() === 'hi'
                ? character.description.hi
                : character.description.en}
            </Text>
          )}

          {/* Status badge */}
          {!owned && (
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>🪙 {character.price}</Text>
            </View>
          )}

          {selected && owned && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedText}>✓ SELECTED</Text>
            </View>
          )}

          {owned && !selected && (
            <View style={styles.ownedBadge}>
              <Text style={styles.ownedText}>OWNED</Text>
            </View>
          )}
        </View>

        {/* Unlock button */}
        {!owned && (
          <Button
            variant="success"
            size="small"
            onPress={() => handleUnlock(character.id, character.price)}
            loading={purchasing}
            disabled={user.coins < character.price}
            style={styles.unlockButton}
          >
            UNLOCK
          </Button>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Ride</Text>
        <Text style={styles.coinsDisplay}>🪙 {user.coins}</Text>
      </View>

      {/* Character grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {characters.map(renderCharacterCard)}
      </ScrollView>

      {/* Selected character details */}
      <View style={styles.detailsPanel}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>
            {LocalizationService.getLanguage() === 'hi'
              ? selectedCharacter.name.hi
              : selectedCharacter.name.en}
          </Text>
          {selectedCharacter.ability && (
            <Text style={styles.detailsAbility}>
              Special: {selectedCharacter.ability.replace(/_/g, ' ')}
            </Text>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          {isOwned(selectedId) ? (
            <>
              <Button
                variant="success"
                size="large"
                onPress={handleSelect}
                style={styles.actionButton}
              >
                SELECT & PLAY
              </Button>
              <Button
                variant="secondary"
                size="medium"
                onPress={onClose}
                style={styles.actionButton}
              >
                BACK
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="success"
                size="large"
                onPress={() => handleUnlock(selectedId, selectedCharacter.price)}
                loading={purchasing}
                disabled={user.coins < selectedCharacter.price}
                style={styles.actionButton}
              >
                UNLOCK ({selectedCharacter.price} COINS)
              </Button>
              <Button
                variant="secondary"
                size="medium"
                onPress={onClose}
                style={styles.actionButton}
              >
                BACK
              </Button>
            </>
          )}
        </View>
      </View>
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
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  coinsDisplay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.SUCCESS,
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.MEDIUM,
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: COLORS.SUCCESS,
  },
  cardLocked: {
    opacity: 0.7,
  },
  preview: {
    height: 150,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardInfo: {
    marginBottom: 12,
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  abilityText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  priceBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priceText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectedBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  selectedText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ownedBadge: {
    backgroundColor: COLORS.TEXT_SECONDARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ownedText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  unlockButton: {
    marginTop: 8,
  },
  detailsPanel: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...SHADOWS.LARGE,
  },
  detailsHeader: {
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  detailsAbility: {
    fontSize: 14,
    color: COLORS.SUCCESS,
    fontWeight: 'bold',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
});

export default CharacterSelectScreen;
