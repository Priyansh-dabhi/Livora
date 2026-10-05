/**
 * Livora Requests Screen
 *
 * Tab screen for tracking active and historical service requests.
 * Features:
 * - Segmented filtering between Active and Completed requests
 * - Rich request cards with category icon, status pill, activities, timing badge, notes
 * - Direct WhatsApp concierge communication
 * - Interactive Progress Timeline modal
 * - "Book Again" shortcut for completed requests
 * - Empty state with direct CTA to browse catalog
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, typography, radius, shadows } from '@/theme';
import type { ServiceRequest, RequestStatus } from '@/types';
import { useAppDispatch, setSelectedCategory } from '@/store';
import { useGetUserRequestsQuery } from '@/services/requestsApi';

function formatRequestDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function RequestsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimelineRequest, setSelectedTimelineRequest] =
    useState<ServiceRequest | null>(null);

  const { data: response, isLoading, refetch } = useGetUserRequestsQuery();

  const requests: ServiceRequest[] = useMemo(() => {
    return response?.data || [];
  }, [response]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const activeRequests = useMemo(
    () =>
      requests.filter(
        (r) => r.status === 'in_progress' || r.status === 'pending',
      ),
    [requests],
  );

  const completedRequests = useMemo(
    () =>
      requests.filter(
        (r) => r.status === 'completed' || r.status === 'cancelled',
      ),
    [requests],
  );

  const currentList = activeTab === 'active' ? activeRequests : completedRequests;

  const handleOpenWhatsApp = async (requestId?: string) => {
    const phoneNumber = '919313975796';
    const message = requestId
      ? encodeURIComponent(
          `Hi Pilot LM, I am following up on my Livora request #${requestId}.`,
        )
      : encodeURIComponent(
          'Hi Pilot LM, I have a question regarding my Livora requests.',
        );
    const appLink = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    const webLink = `https://wa.me/${phoneNumber}?text=${message}`;

    try {
      const supported = await Linking.canOpenURL(appLink);
      if (supported) {
        await Linking.openURL(appLink);
      } else {
        await Linking.openURL(webLink);
      }
    } catch {
      await Linking.openURL(webLink);
    }
  };

  const handleBookAgain = (categoryName: string) => {
    // Map category name to ID
    let catId: string | null = null;
    if (categoryName.toLowerCase().includes('errand')) catId = 'cat-errands';
    else if (categoryName.toLowerCase().includes('home')) catId = 'cat-home';
    else if (categoryName.toLowerCase().includes('pet')) catId = 'cat-pet';
    else if (categoryName.toLowerCase().includes('senior')) catId = 'cat-senior';

    if (catId) {
      dispatch(setSelectedCategory(catId));
    }
    router.push('/(main)/tasks');
  };

  const renderStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'in_progress':
        return (
          <View style={[styles.statusBadge, styles.statusInProgress]}>
            <View style={styles.statusDotActive} />
            <Text style={styles.statusTextInProgress}>In Progress</Text>
          </View>
        );
      case 'pending':
        return (
          <View style={[styles.statusBadge, styles.statusPending]}>
            <Feather name="clock" size={11} color="#B45309" style={{ marginRight: 4 }} />
            <Text style={styles.statusTextPending}>Pending</Text>
          </View>
        );
      case 'completed':
        return (
          <View style={[styles.statusBadge, styles.statusCompleted]}>
            <Feather name="check" size={11} color="#15803D" style={{ marginRight: 4 }} />
            <Text style={styles.statusTextCompleted}>Completed</Text>
          </View>
        );
      case 'cancelled':
        return (
          <View style={[styles.statusBadge, styles.statusCancelled]}>
            <Text style={styles.statusTextCancelled}>Cancelled</Text>
          </View>
        );
    }
  };

  const renderTimingLabel = (request: ServiceRequest) => {
    if (request.timing === 'same_day') {
      return 'Same Day Delivery';
    }
    if (request.timing === 'express') {
      return 'Express (Under 2 hours)';
    }
    if (request.timing === 'scheduled') {
      return `Scheduled • ${request.scheduledDate || 'Upcoming'} at ${
        request.scheduledTime || 'Selected time'
      }`;
    }
    return 'Standard Fulfillment';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Requests</Text>
          <Text style={styles.headerSubtitle}>
            Track & manage your concierge services
          </Text>
        </View>

        {/* Concierge Status Pill */}
        <TouchableOpacity
          style={styles.conciergePill}
          activeOpacity={0.8}
          onPress={() => handleOpenWhatsApp()}
        >
          <View style={styles.conciergeDot} />
          <Text style={styles.conciergeText}>Pilot LM Online</Text>
        </TouchableOpacity>
      </View>

      {/* Segmented Filter Control */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeTab === 'active' && styles.segmentButtonActive,
          ]}
          onPress={() => setActiveTab('active')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === 'active' && styles.segmentTextActive,
            ]}
          >
            Active
          </Text>
          <View
            style={[
              styles.counterPill,
              activeTab === 'active' && styles.counterPillActive,
            ]}
          >
            <Text
              style={[
                styles.counterText,
                activeTab === 'active' && styles.counterTextActive,
              ]}
            >
              {activeRequests.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeTab === 'completed' && styles.segmentButtonActive,
          ]}
          onPress={() => setActiveTab('completed')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === 'completed' && styles.segmentTextActive,
            ]}
          >
            Completed
          </Text>
          <View
            style={[
              styles.counterPill,
              activeTab === 'completed' && styles.counterPillActive,
            ]}
          >
            <Text
              style={[
                styles.counterText,
                activeTab === 'completed' && styles.counterTextActive,
              ]}
            >
              {completedRequests.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {currentList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather
                name={activeTab === 'active' ? 'inbox' : 'check-circle'}
                size={36}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === 'active'
                ? 'No active requests right now'
                : 'No completed requests yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active'
                ? 'Whenever you need assistance with errands, maintenance, or appointments, let us take care of it.'
                : 'Your finished tasks, photos, and delivery receipts will be archived here for easy reference.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyCtaButton}
              activeOpacity={0.85}
              onPress={() => router.push('/(main)/tasks')}
            >
              <Feather
                name="plus"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.emptyCtaText}>Create a Request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          currentList.map((req) => (
            <View key={req.id} style={styles.requestCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.categoryLeft}>
                  <View style={styles.categoryIconWrap}>
                    <Feather
                      name={
                        (req.categoryIcon as keyof typeof Feather.glyphMap) ||
                        'clipboard'
                      }
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                  <View>
                    <Text style={styles.categoryTitle}>{req.categoryName}</Text>
                    <Text style={styles.requestIdText}>
                      #{req.id.slice(0, 8).toUpperCase()} • {formatRequestDate(req.createdAt)}
                    </Text>
                  </View>
                </View>
                {renderStatusBadge(req.status)}
              </View>

              {/* Activities Checklist */}
              <View style={styles.activitiesContainer}>
                {req.activities.map((act, index) => (
                  <View key={index} style={styles.activityItem}>
                    <Feather
                      name={req.status === 'completed' ? 'check-circle' : 'circle'}
                      size={13}
                      color={req.status === 'completed' ? '#15803D' : colors.primary}
                      style={styles.activityBullet}
                    />
                    <Text style={styles.activityText}>{act}</Text>
                  </View>
                ))}
              </View>

              {/* Timing & Notes Meta */}
              <View style={styles.metaRow}>
                <View style={styles.timingChip}>
                  <Feather
                    name="clock"
                    size={12}
                    color={colors.textSecondary}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.timingChipText}>
                    {renderTimingLabel(req)}
                  </Text>
                </View>
              </View>

              {req.notes ? (
                <View style={styles.notesBox}>
                  <Feather
                    name="message-square"
                    size={12}
                    color="#6B7280"
                    style={{ marginRight: 6, marginTop: 2 }}
                  />
                  <Text style={styles.notesText} numberOfLines={2}>
                    {req.notes}
                  </Text>
                </View>
              ) : null}

              {/* Footer Actions */}
              <View style={styles.cardFooter}>
                <View style={styles.lmAssignedBadge}>
                  <View style={styles.lmAvatarSmall}>
                    <Text style={styles.lmAvatarText}>LM</Text>
                  </View>
                  <Text style={styles.lmAssignedText}>
                    {req.lifestyleManagerName || 'Pilot LM'}
                  </Text>
                </View>

                <View style={styles.footerActionRow}>
                  {activeTab === 'active' ? (
                    <>
                      <TouchableOpacity
                        style={styles.timelineButton}
                        activeOpacity={0.7}
                        onPress={() => setSelectedTimelineRequest(req)}
                      >
                        <Feather
                          name="activity"
                          size={14}
                          color={colors.primary}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={styles.timelineButtonText}>Track</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.chatButton}
                        activeOpacity={0.8}
                        onPress={() => handleOpenWhatsApp(req.id)}
                      >
                        <Feather
                          name="message-circle"
                          size={14}
                          color="#FFFFFF"
                          style={{ marginRight: 4 }}
                        />
                        <Text style={styles.chatButtonText}>Chat</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={styles.bookAgainButton}
                      activeOpacity={0.8}
                      onPress={() => handleBookAgain(req.categoryName)}
                    >
                      <Feather
                        name="repeat"
                        size={14}
                        color={colors.primary}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.bookAgainText}>Book Again</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Timeline Modal */}
      {selectedTimelineRequest && (
        <Modal
          animationType="fade"
          transparent
          visible={!!selectedTimelineRequest}
          onRequestClose={() => setSelectedTimelineRequest(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Request Timeline</Text>
                  <Text style={styles.modalSubtitle}>
                    #{selectedTimelineRequest.id} •{' '}
                    {selectedTimelineRequest.categoryName}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedTimelineRequest(null)}
                  style={styles.modalCloseButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name="x" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Progress Steps */}
              <View style={styles.timelineFlow}>
                {/* Step 1 */}
                <View style={styles.timelineStep}>
                  <View style={[styles.timelineNode, styles.timelineNodeDone]}>
                    <Feather name="check" size={12} color="#FFFFFF" />
                  </View>
                  <View style={styles.timelineLineActive} />
                  <View style={styles.timelineStepContent}>
                    <Text style={styles.timelineStepTitle}>Request Received</Text>
                    <Text style={styles.timelineStepDesc}>
                      Logged into Livora system ({selectedTimelineRequest.createdAt})
                    </Text>
                  </View>
                </View>

                {/* Step 2 */}
                <View style={styles.timelineStep}>
                  <View style={[styles.timelineNode, styles.timelineNodeDone]}>
                    <Feather name="check" size={12} color="#FFFFFF" />
                  </View>
                  <View
                    style={
                      selectedTimelineRequest.status === 'in_progress' ||
                      selectedTimelineRequest.status === 'completed'
                        ? styles.timelineLineActive
                        : styles.timelineLineInactive
                    }
                  />
                  <View style={styles.timelineStepContent}>
                    <Text style={styles.timelineStepTitle}>
                      Pilot LM Assigned
                    </Text>
                    <Text style={styles.timelineStepDesc}>
                      Your Lifestyle Manager reviewed tasks and organized vendor.
                    </Text>
                  </View>
                </View>

                {/* Step 3 */}
                <View style={styles.timelineStep}>
                  <View
                    style={[
                      styles.timelineNode,
                      selectedTimelineRequest.status === 'in_progress'
                        ? styles.timelineNodeCurrent
                        : selectedTimelineRequest.status === 'completed'
                        ? styles.timelineNodeDone
                        : styles.timelineNodeUpcoming,
                    ]}
                  >
                    {selectedTimelineRequest.status === 'completed' ? (
                      <Feather name="check" size={12} color="#FFFFFF" />
                    ) : (
                      <View style={styles.nodeInnerDot} />
                    )}
                  </View>
                  <View
                    style={
                      selectedTimelineRequest.status === 'completed'
                        ? styles.timelineLineActive
                        : styles.timelineLineInactive
                    }
                  />
                  <View style={styles.timelineStepContent}>
                    <Text style={styles.timelineStepTitle}>In Progress</Text>
                    <Text style={styles.timelineStepDesc}>
                      {selectedTimelineRequest.status === 'in_progress'
                        ? 'Vendor is executing errand/task with concierge supervision.'
                        : 'Awaiting execution schedule.'}
                    </Text>
                  </View>
                </View>

                {/* Step 4 */}
                <View style={styles.timelineStep}>
                  <View
                    style={[
                      styles.timelineNode,
                      selectedTimelineRequest.status === 'completed'
                        ? styles.timelineNodeDone
                        : styles.timelineNodeUpcoming,
                    ]}
                  >
                    {selectedTimelineRequest.status === 'completed' ? (
                      <Feather name="check" size={12} color="#FFFFFF" />
                    ) : (
                      <View style={styles.nodeInnerDotGray} />
                    )}
                  </View>
                  <View style={styles.timelineStepContent}>
                    <Text style={styles.timelineStepTitle}>
                      Completed & Verified
                    </Text>
                    <Text style={styles.timelineStepDesc}>
                      Proof, photos, and item receipts shared via WhatsApp.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Modal Action CTA */}
              <TouchableOpacity
                style={styles.modalActionCta}
                activeOpacity={0.85}
                onPress={() => {
                  setSelectedTimelineRequest(null);
                  handleOpenWhatsApp(selectedTimelineRequest.id);
                }}
              >
                <Feather
                  name="message-circle"
                  size={16}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalActionCtaText}>
                  Message Pilot LM on WhatsApp
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  conciergePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlightMint,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  conciergeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  conciergeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 9,
    gap: 6,
  },
  segmentButtonActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.textPrimary,
  },
  counterPill: {
    backgroundColor: colors.border,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
  },
  counterPillActive: {
    backgroundColor: colors.highlightMint,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  counterTextActive: {
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  categoryIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  requestIdText: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusInProgress: {
    backgroundColor: colors.highlightMint,
  },
  statusDotActive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 5,
  },
  statusTextInProgress: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  statusPending: {
    backgroundColor: colors.warningLight,
  },
  statusTextPending: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusCompleted: {
    backgroundColor: colors.successLight,
  },
  statusTextCompleted: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  statusCancelled: {
    backgroundColor: colors.errorLight,
  },
  statusTextCancelled: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.error,
  },
  activitiesContainer: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 6,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityBullet: {
    marginRight: 7,
  },
  activityText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timingChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 12,
  },
  notesText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.surfaceElevated,
    paddingTop: 10,
  },
  lmAssignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lmAvatarSmall: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  lmAvatarText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.white,
  },
  lmAssignedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  footerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  timelineButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chatButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  bookAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  bookAgainText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280,
  },
  emptyCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    ...shadows.sm,
  },
  emptyCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    ...shadows.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalCloseButton: {
    padding: 4,
  },
  timelineFlow: {
    paddingLeft: 6,
    marginBottom: 20,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    marginBottom: 22,
  },
  timelineNode: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    zIndex: 2,
  },
  timelineNodeDone: {
    backgroundColor: colors.primary,
  },
  timelineNodeCurrent: {
    backgroundColor: colors.primary,
  },
  timelineNodeUpcoming: {
    backgroundColor: colors.border,
  },
  nodeInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  nodeInnerDotGray: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.disabledText,
  },
  timelineLineActive: {
    position: 'absolute',
    left: 10,
    top: 22,
    bottom: -22,
    width: 2,
    backgroundColor: colors.primary,
    zIndex: 1,
  },
  timelineLineInactive: {
    position: 'absolute',
    left: 10,
    top: 22,
    bottom: -22,
    width: 2,
    backgroundColor: colors.border,
    zIndex: 1,
  },
  timelineStepContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineStepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timelineStepDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  modalActionCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 48,
  },
  modalActionCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
