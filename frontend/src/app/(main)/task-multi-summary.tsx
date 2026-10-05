import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, typography, radius } from '@/theme';
import { useAppDispatch, useAppSelector, setSelectedTiming, setDescription, resetRequest } from '@/store';
import { useCreateRequestMutation } from '@/services/requestsApi';
import { TimingOptionId } from '@/types';

export default function TaskMultiSummaryScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [createRequest] = useCreateRequestMutation();

  const {
    categories,
    selectedCategoryId,
    selectedHelpTypeIds,
    selectedActivityIds,
    multiDescriptions,
    selectedTiming,
    description,
  } = useAppSelector((state) => state.tasks);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeCategory =
    categories.find((c) => c.id === selectedCategoryId) || categories[0];

  const selectedServices = useMemo(() => {
    const services: { id: string; name: string; subtitle: string }[] = [];
    activeCategory?.helpTypes?.forEach((ht) => {
      if (selectedHelpTypeIds.includes(ht.id)) {
        services.push({ id: ht.id, name: ht.name, subtitle: `${activeCategory.name} • ${ht.name}` });
      }
      ht.activities.forEach((act) => {
        if (selectedActivityIds.includes(act.id)) {
          services.push({ id: act.id, name: act.name, subtitle: `${activeCategory.name} • ${ht.name}` });
        }
      });
    });
    return services;
  }, [activeCategory, selectedHelpTypeIds, selectedActivityIds]);

  const handleBack = useCallback(() => {
    router.replace('/(main)/task-multi-details');
  }, [router]);

  const handleSubmitRequest = async () => {
    try {
      const activitiesList = selectedServices.map((s) => s.name);
      
      // Combine multiDescriptions into one notes string
      let combinedNotes = '';
      selectedServices.forEach((s) => {
        const desc = multiDescriptions[s.id];
        if (desc?.trim()) {
          combinedNotes += `[${s.name}]: ${desc.trim()}\n`;
        }
      });
      if (description.trim()) {
        combinedNotes += `\n[General]: ${description.trim()}`;
      }

      await createRequest({
        categoryName: activeCategory?.name || 'Concierge Service',
        categoryIcon: (activeCategory?.icon as string) || 'check-circle',
        activities: activitiesList,
        timing: selectedTiming,
        notes: combinedNotes.trim() || undefined,
      }).unwrap();
    } catch (e) {
      console.warn('Failed to save service request to API:', e);
    }
    setIsSubmitted(true);
  };

  const handleFinishToHome = () => {
    dispatch(resetRequest());
    router.replace('/(main)/home');
  };

  const handleFinishToRequests = () => {
    dispatch(resetRequest());
    router.replace('/(main)/requests');
  };

  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <Feather name="check" size={40} color={colors.white} />
            </View>
          </View>
          <Text style={styles.successTitle}>Request sent!</Text>
          <Text style={styles.successSubtitle}>
            Your Lifestyle Manager has received your request and will get back to you shortly.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleFinishToRequests}>
            <Text style={styles.primaryButtonText}>View request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleFinishToHome}>
            <Text style={styles.secondaryButtonText}>Back to home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const timingOptions: { id: TimingOptionId; label: string }[] = [
    { id: 'standard', label: 'Standard' },
    { id: 'same_day', label: 'Same day' },
    { id: 'express', label: 'Express' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.headerArea}>
            <Text style={styles.stepText}>Your request • Step 2 of 2</Text>
            <Text style={styles.heading}>Your request</Text>
          </View>

          {/* Read-only services list */}
          <View style={styles.servicesList}>
            {selectedServices.map((svc) => (
              <View key={svc.id} style={styles.serviceItem}>
                <Text style={styles.serviceTitle}>{svc.name}</Text>
                <Text style={styles.serviceSubtitle}>{svc.subtitle}</Text>
                {multiDescriptions[svc.id] ? (
                  <Text style={styles.readOnlyText}>{multiDescriptions[svc.id]}</Text>
                ) : null}
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.addRemoveButton}
            onPress={() => router.replace('/(main)/tasks')}
          >
            <Feather name="plus" size={16} color={colors.primary} />
            <Text style={styles.addRemoveText}>Add or remove services</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How soon?</Text>
            <View style={styles.timingChips}>
              {timingOptions.map((opt) => {
                const isSelected = selectedTiming === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.timingChip, isSelected && styles.timingChipSelected]}
                    onPress={() => dispatch(setSelectedTiming(opt.id))}
                  >
                    <Text style={[styles.timingChipText, isSelected && styles.timingChipTextSelected]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Anything else for your Lifestyle Manager?</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Optional"
              placeholderTextColor={colors.textTertiary}
              multiline
              value={description}
              onChangeText={(text) => dispatch(setDescription(text))}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomBackButton} onPress={handleBack} activeOpacity={0.8}>
            <Text style={styles.bottomBackButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reviewButton} onPress={handleSubmitRequest} activeOpacity={0.8}>
            <Text style={styles.reviewButtonText}>Submit request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  headerArea: { marginBottom: spacing.xl },
  stepText: { ...typography.label, color: '#637381', marginBottom: spacing.xs },
  heading: { ...typography.h2, fontSize: 28, color: '#0A2540' },
  servicesList: { gap: spacing.md, marginBottom: spacing.lg },
  serviceItem: { marginBottom: spacing.sm },
  serviceTitle: { ...typography.bodyMedium, fontWeight: '700', color: '#0A2540', marginBottom: 2 },
  serviceSubtitle: { ...typography.body, fontSize: 13, color: '#637381', marginBottom: 4 },
  readOnlyText: { ...typography.body, color: '#0A2540', marginTop: 4 },
  addRemoveButton: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  addRemoveText: { ...typography.label, color: colors.primary, marginLeft: 4 },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.bodyMedium, fontWeight: '700', fontSize: 16, color: '#0A2540', marginBottom: spacing.sm },
  timingChips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  timingChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  timingChipSelected: { borderColor: colors.primary, backgroundColor: colors.highlightMint },
  timingChipText: { ...typography.buttonSmall, color: '#637381' },
  timingChipTextSelected: { color: colors.primary, ...typography.buttonSmall },
  textInput: { ...typography.body, backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, color: colors.textPrimary, minHeight: 100 },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border },
  bottomBackButton: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.white },
  bottomBackButtonText: { ...typography.button, color: '#0A2540' },
  reviewButton: { flex: 1, marginLeft: spacing.md, backgroundColor: '#1E654C', paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  reviewButtonText: { ...typography.button, color: colors.white },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  successIconOuter: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.highlightMint, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  successIconInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  successTitle: { ...typography.h2, color: '#0A2540', marginBottom: spacing.sm, textAlign: 'center' },
  successSubtitle: { ...typography.body, color: '#637381', textAlign: 'center', marginBottom: spacing.xxl, lineHeight: 22 },
  primaryButton: { backgroundColor: colors.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.md, width: '100%', alignItems: 'center', marginBottom: spacing.md },
  primaryButtonText: { ...typography.button, color: colors.white },
  secondaryButton: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, width: '100%', alignItems: 'center' },
  secondaryButtonText: { ...typography.button, color: '#637381' },
});
