import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '@/constants/auth-theme';
import { TimeParts, pad2 } from '@/utils/time';

type Props = {
  parts: TimeParts;
};

const SIZE = 210;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;
/** Anggap maksimal countdown = 60 hari untuk skala visual */
const MAX_DAYS = 60;

export default function CountdownCircle({ parts }: Props) {
  // Progress arc: 0 hari → penuh (100%), MAX_DAYS+ → kosong
  const progressRatio = Math.min(parts.days / MAX_DAYS, 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progressRatio);

  // Jika hari = 0, tampilkan jam sebagai angka utama; label menyesuaikan
  const showHours = parts.days === 0;
  const mainNumber = showHours ? parts.hours : parts.days;
  const mainLabel = showHours ? 'JAM' : 'HARI';

  return (
    <View style={styles.wrapper}>
      {/* SVG ring */}
      <Svg width={SIZE} height={SIZE} style={styles.svg}>
        {/* Track abu-abu */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke="#E3E8EC"
          strokeWidth={STROKE}
          fill="none"
        />
        {/* Arc progress (teal) */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke={Colors.primary}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>

      {/* Teks di tengah ring */}
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.mainNumber}>{mainNumber}</Text>
        <Text style={styles.mainLabel}>{mainLabel}</Text>
        <Text style={styles.clock}>
          {pad2(parts.hours)}:{pad2(parts.minutes)}:{pad2(parts.seconds)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 24,
    width: SIZE,
    height: SIZE,
  },
  svg: {
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.primary,
    lineHeight: 60,
  },
  mainLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.muted,
    letterSpacing: 2.5,
    marginTop: 2,
  },
  clock: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 6,
  },
});
