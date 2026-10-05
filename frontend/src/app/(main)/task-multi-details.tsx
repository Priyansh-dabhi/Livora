import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, typography, radius } from '@/theme';
import { useAppDispatch, useAppSelector, setMultiDescription } from '@/store';

export default function TaskMultiDetailsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    categories,
    selectedCategoryId,
    selectedHelpTypeIds,
    selectedActivityIds,
    multiDescriptions,
  } = useAppSelector((state) => state.tasks);

  const activeCategory =
    categories.find((c) => c.id === selectedCategoryId) || categories[0];

  // Build the list of selected activities with their parent info
  const selectedServices = useMemo(() => {
    const services: { id: string; name: string; subtitle: string }[] = [];

    activeCategory?.helpTypes?.forEach((ht) => {
      // If the help type itself is selected
      if (selectedHelpTypeIds.includes(ht.id)) {
        services.push({
          id: ht.id,
          name: ht.name,
          subtitle: `${activeCategory.name} • ${ht.name}`,
        });
      }

      // If specific activities are selected
      ht.activities.forEach((act) => {
        if (selectedActivityIds.includes(act.id)) {
          services.push({
            id: act.id,
            name: act.name,
            subtitle: `${activeCategory.name} • ${ht.name}`,
          });
        }
      });
    });

    return services;
  }, [activeCategory, selectedHelpTypeIds, selectedActivityIds]);

  const handleBack = useCallback(() => {
    router.replace('/(main)/tasks');
  }, [router]);

  const handleReviewRequest = () => {
    router.push('/(main)/task-multi-summary');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header area */}
          <View style={styles.headerArea}>
            <Text style={styles.stepText}>Your request • Step 1 of 2</Text>
            <Text style={styles.heading}>Anything we should know?</Text>
            <Text style={styles.subtitle}>
              Optional. A line or two helps your Lifestyle Manager start faster.
            </Text>
          </View>

          {/* List of text inputs for each selected service */}
          <View style={styles.servicesList}>
            {selectedServices.map((svc) => (
              <View key={svc.id} style={styles.serviceItem}>
                <Text style={styles.serviceTitle}>{svc.name}</Text>
                <Text style={styles.serviceSubtitle}>{svc.subtitle}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="What do you need here?"
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  value={multiDescriptions[svc.id] || ''}
                  onChangeText={(text) =>
                    dispatch(setMultiDescription({ id: svc.id, description: text }))
                  }
                  textAlignVertical="top"
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomBackButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Text style={styles.bottomBackButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reviewButton}
            onPress={handleReviewRequest}
            activeOpacity={0.8}
          >
            <Text style={styles.reviewButtonText}>Review request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  headerArea: {
    marginBottom: spacing.xl,
  },
  stepText: {
    ...typography.label,
    color: '#637381',
    marginBottom: spacing.xs,
  },
  heading: {
    ...typography.h2,
    fontSize: 28,
    color: '#0A2540',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: '#637381',
  },
  servicesList: {
    gap: spacing.xl,
  },
  serviceItem: {
    marginBottom: spacing.sm,
  },
  serviceTitle: {
    ...typography.bodyMedium,
    fontWeight: '700',
    fontSize: 16,
    color: '#0A2540',
    marginBottom: 4,
  },
  serviceSubtitle: {
    ...typography.body,
    fontSize: 13,
    color: '#637381',
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 100,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bottomBackButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
  },
  bottomBackButtonText: {
    ...typography.button,
    color: '#0A2540',
  },
  reviewButton: {
    flex: 1,
    marginLeft: spacing.md,
    backgroundColor: '#1E654C',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  reviewButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
