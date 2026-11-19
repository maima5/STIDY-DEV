import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProfileColors, ProfileLayout } from '@/constants/profile-theme';
import { FaqItem } from '@/types/help';

interface HelpFaqAccordionProps {
  faqs: FaqItem[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}

export default function HelpFaqAccordion({
  faqs,
  expandedId,
  onToggle,
}: HelpFaqAccordionProps) {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pertanyaan Populer</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{faqs.length} topik</Text>
        </View>
      </View>

      {/* FAQ Cards */}
      {faqs.map((item) => {
        const isExpanded = expandedId === item.id;

        return (
          <View key={item.id} style={styles.faqCard}>
            <Pressable
              style={styles.questionRow}
              onPress={() => onToggle(item.id)}
              accessibilityRole="button"
              accessibilityLabel={item.question}
            >
              {/* Number Badge */}
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{item.number}</Text>
              </View>

              {/* Question Text */}
              <Text style={styles.questionText}>{item.question}</Text>

              {/* Chevron Indicator */}
              <Feather
                name={isExpanded ? 'chevron-up' : 'chevron-right'}
                size={18}
                color={isExpanded ? ProfileColors.primary : ProfileColors.chevron}
              />
            </Pressable>

            {/* Answer Content */}
            {isExpanded && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{item.answer}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ProfileColors.textPrimary,
    letterSpacing: -0.1,
  },
  countBadge: {
    backgroundColor: ProfileColors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: ProfileColors.primary,
  },
  faqCard: {
    backgroundColor: ProfileColors.cardBg,
    borderRadius: ProfileLayout.statCardRadius,
    padding: 16,
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 3px 12px rgba(15, 23, 42, 0.03)',
      },
    }),
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: ProfileColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: ProfileColors.primary,
  },
  questionText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: ProfileColors.textPrimary,
    lineHeight: 19,
    paddingRight: 6,
  },
  answerContainer: {
    marginTop: 12,
    paddingLeft: 42,
    paddingRight: 8,
  },
  answerText: {
    fontSize: 12,
    color: ProfileColors.textSecondary,
    lineHeight: 18,
  },
});

