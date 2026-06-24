import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CountdownEvent } from '../types';
import { daysFromToday, formatDisplayDate } from '../utils/dateUtils';
import { getMilestoneInfo } from '../utils/milestoneUtils';
import { parseBg } from '../utils/backgroundUtils';

interface Props {
  event: CountdownEvent;
}

export const CARD_WIDTH = 320;
export const CARD_HEIGHT = 430;

export default function ShareCard({ event }: Props) {
  const diff = daysFromToday(event.targetDate);
  const absDiff = Math.abs(diff);
  const isPast = diff < 0;
  const isToday = diff === 0;
  const milestone = getMilestoneInfo(absDiff);
  const heroLabel = isToday ? null : isPast ? '已过去' : '还有';
  const bg = parseBg(event.coverImage);

  const cardContent = (
    <>
      {/* Decorative background circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      {bg.type === 'image' && <View style={styles.imageOverlay} />}

      <View style={styles.inner}>
        {milestone?.status === 'at' && (
          <View style={styles.milestoneBadge}>
            <Text style={styles.milestoneText}>🎉 第 {milestone.value} 天里程碑</Text>
          </View>
        )}

        {event.icon ? (
          <View style={styles.iconWrap}>
            <Text
              style={event.icon.length > 2 ? styles.iconKaomoji : styles.iconEmoji}
              numberOfLines={event.icon.length > 2 ? 2 : 1}
            >
              {event.icon}
            </Text>
          </View>
        ) : null}

        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>

        {heroLabel && <Text style={styles.heroLabel}>{heroLabel}</Text>}

        {isToday ? (
          <>
            <Text style={styles.todayEmoji}>🎉</Text>
            <Text style={styles.todayText}>就是今天！</Text>
          </>
        ) : (
          <View style={styles.countRow}>
            <Text style={styles.bigNumber}>{absDiff}</Text>
            <Text style={styles.bigUnit}>天</Text>
          </View>
        )}

        <Text style={styles.date}>{formatDisplayDate(event.targetDate)}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.brand}>倒数日</Text>
      </View>
    </>
  );

  if (bg.type === 'gradient') {
    return (
      <LinearGradient
        colors={bg.preset.colors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {cardContent}
      </LinearGradient>
    );
  }

  if (bg.type === 'image') {
    return (
      <ImageBackground
        source={{ uri: bg.uri }}
        style={styles.card}
        imageStyle={styles.imageStyle}
      >
        {cardContent}
      </ImageBackground>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: event.themeColor }]}>
      {cardContent}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 28,
    justifyContent: 'space-between',
  },
  imageStyle: {
    borderRadius: 24,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  circle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.10)',
    top: -70,
    right: -70,
  },
  circle2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)',
    bottom: -45,
    left: -55,
  },
  circle3: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: 55,
    left: 18,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  milestoneText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconEmoji: { fontSize: 32, lineHeight: 38 },
  iconKaomoji: { fontSize: 13, lineHeight: 18, textAlign: 'center', color: '#fff' },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.80)',
    marginBottom: 4,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  bigNumber: {
    fontSize: 84,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 90,
  },
  bigUnit: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8,
    marginLeft: 4,
  },
  todayEmoji: {
    fontSize: 60,
    lineHeight: 68,
    marginBottom: 8,
  },
  todayText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
  },
  date: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.68)',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  footerLine: {
    width: 36,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.28)',
    marginBottom: 10,
  },
  brand: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.50)',
    fontWeight: '600',
    letterSpacing: 1,
  },
});
