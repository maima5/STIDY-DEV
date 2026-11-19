import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppHeader from '@/components/dashboard/AppHeader';
import ExamListCard from '@/components/countdown/ExamListCard';
import ExamFormModal from '@/components/countdown/ExamFormModal';
import DeleteExamModal from '@/components/countdown/DeleteExamModal';
import CountdownCircle from '@/components/countdown/CountdownCircle';
import { useCountdown } from '@/hooks/use-countdown';
import { getExams } from '@/services/exam-service';
import { formatTimeLeft } from '@/utils/time';
import { downloadExamPdf } from '@/utils/pdf-export';
import { Colors, Radius } from '@/constants/auth-theme';
import { MOCK_USER } from '@/constants/mock-user';
import { Exam } from '@/types/countdown';

// ---------- Sub-komponen: Detail Hitung Mundur ----------

function CountdownDetail({ exam, onBack }: { exam: Exam; onBack: () => void }) {
  const deadline = new Date(exam.date);
  const parts = useCountdown(deadline);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <AppHeader initials={MOCK_USER.initials} />

      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <Pressable onPress={onBack}>
          <Text style={styles.breadLink}>Daftar Ujian</Text>
        </Pressable>
        <Text style={styles.breadSep}> › </Text>
        <Text style={styles.breadActive}>Detail Hitung Mundur</Text>
      </View>

      <View style={styles.detailCard}>
        {/* Tombol kembali */}
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Feather name="chevron-left" size={22} color={Colors.text} />
        </Pressable>

        {/* Header */}
        <Text style={styles.detailTitle}>Pengingat!</Text>
        <Text style={styles.detailSubject}>{exam.subject}</Text>

        {/* Lingkaran countdown SVG */}
        <CountdownCircle parts={parts} />

        {/* Kalimat motivasi */}
        <Text style={styles.motivation}>
          Mulai sekarang yuk? jangan di tunda
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ---------- Komponen Utama: Daftar Ujian & Countdown ----------

export default function CountdownScreen() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editExam, setEditExam] = useState<Exam | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Exam | undefined>(undefined);

  // Detail view
  const [detailExam, setDetailExam] = useState<Exam | undefined>(undefined);

  // Loading state tombol unduh
  const [downloading, setDownloading] = useState(false);

  const loadExams = useCallback(async () => {
    const data = await getExams();
    setExams(data);
  }, []);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  // Jika sedang di halaman detail, tampilkan detail countdown
  if (detailExam) {
    return <CountdownDetail exam={detailExam} onBack={() => setDetailExam(undefined)} />;
  }

  const nearest = exams[0];
  const filtered = exams.filter((e) =>
    e.subject.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = (data: Omit<Exam, 'id'>) => {
    const newExam: Exam = { ...data, id: String(Date.now()) };
    setExams((prev) =>
      [...prev, newExam].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    );
    setShowAddModal(false);
  };

  const handleEdit = (data: Omit<Exam, 'id'>) => {
    if (!editExam) return;
    setExams((prev) =>
      prev
        .map((e) => (e.id === editExam.id ? { ...e, ...data } : e))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    );
    setEditExam(undefined);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setExams((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(undefined);
    setExpandedId(null);
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadExamPdf(exams);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <AppHeader initials={MOCK_USER.initials} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <Pressable onPress={() => router.navigate('/home')}>
            <Text style={styles.breadLink}>Beranda</Text>
          </Pressable>
          <Text style={styles.breadSep}> › </Text>
          <Text style={styles.breadActive}>Daftar Ujian</Text>
        </View>

        {/* Judul */}
        <Text style={styles.eyebrow}>AGENDA AKADEMIK</Text>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Daftar Ujian</Text>

          {/* Tombol Unduh PDF */}
          <Pressable
            style={[styles.downloadBtn, downloading && styles.downloadBtnDisabled]}
            onPress={handleDownload}
            disabled={downloading}
          >
            <Feather name={downloading ? 'loader' : 'download'} size={16} color={Colors.deep} />
            <Text style={styles.downloadText}>{downloading ? 'Mengunduh...' : 'Unduh'}</Text>
          </Pressable>
        </View>
        <Text style={styles.pageSub}>Pantau semua jadwal ujianmu dalam satu tempat.</Text>

        {/* Banner ujian terdekat */}
        {nearest && (
          <Pressable onPress={() => setDetailExam(nearest)}>
            <LinearGradient
              colors={[Colors.deep, Colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nearBanner}
            >
              <View style={styles.nearIcon}>
                <Feather name="calendar" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nearEyebrow}>UJIAN TERDEKAT</Text>
                <Text style={styles.nearSubject}>{nearest.subject}</Text>
                {/* formatTimeLeft otomatis: hari/jam/menit/detik */}
                <Text style={styles.nearDays}>{formatTimeLeft(nearest.date)}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
            </LinearGradient>
          </Pressable>
        )}

        {/* Search */}
        <View style={styles.searchWrap}>
          <Feather name="search" size={18} color={Colors.placeholder} style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari mata pelajaran..."
            placeholderTextColor={Colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Header daftar */}
        <View style={styles.listHeader}>
          <Text style={styles.listLabel}>JADWAL UJIAN</Text>
          <Text style={styles.listCount}>{filtered.length} ujian</Text>
        </View>

        {/* Daftar ujian — badge dihitung oleh ExamListCard sendiri via formatTimeLeft */}
        {filtered.map((exam) => (
          <ExamListCard
            key={exam.id}
            exam={exam}
            expanded={expandedId === exam.id}
            onPress={() => setExpandedId(expandedId === exam.id ? null : exam.id)}
            onEdit={() => setEditExam(exam)}
            onDelete={() => setDeleteTarget(exam)}
            onCountdown={() => setDetailExam(exam)}
          />
        ))}
      </ScrollView>

      {/* FAB Tambah */}
      <Pressable style={styles.fab} onPress={() => setShowAddModal(true)}>
        <Feather name="plus" size={28} color="#fff" />
      </Pressable>

      {/* Modal Tambah */}
      <ExamFormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAdd}
      />

      {/* Modal Edit */}
      <ExamFormModal
        visible={!!editExam}
        exam={editExam}
        onClose={() => setEditExam(undefined)}
        onSave={handleEdit}
      />

      {/* Modal Hapus */}
      <DeleteExamModal
        visible={!!deleteTarget}
        subjectName={deleteTarget?.subject ?? ''}
        onClose={() => setDeleteTarget(undefined)}
        onConfirm={handleDelete}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },

  // Breadcrumb
  breadcrumb: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  breadLink: { fontSize: 12.5, color: Colors.primary, fontWeight: '600' },
  breadSep: { fontSize: 12.5, color: Colors.muted },
  breadActive: { fontSize: 12.5, color: Colors.muted, fontWeight: '600' },

  // Header
  eyebrow: { fontSize: 10.5, letterSpacing: 1.5, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageTitle: { fontSize: 28, fontWeight: '800', color: Colors.text },
  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: '#fff',
  },
  downloadBtnDisabled: { opacity: 0.5 },
  downloadText: { fontSize: 13, fontWeight: '600', color: Colors.deep },
  pageSub: { fontSize: 13, color: Colors.muted, marginTop: 6, marginBottom: 18 },

  // Banner ujian terdekat
  nearBanner: {
    flexDirection: 'row', alignItems: 'center', borderRadius: Radius.card,
    padding: 18, marginBottom: 16,
  },
  nearIcon: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  nearEyebrow: { fontSize: 9.5, fontWeight: '700', letterSpacing: 1, color: 'rgba(255,255,255,0.7)' },
  nearSubject: { fontSize: 17, fontWeight: '700', color: '#fff', marginTop: 2 },
  nearDays: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  // Search bar
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: Radius.input, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 16, marginBottom: 18,
  },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 14, color: Colors.text },

  // List header
  listHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 14,
  },
  listLabel: { fontSize: 10.5, fontWeight: '700', letterSpacing: 1.5, color: Colors.muted },
  listCount: { fontSize: 12.5, fontWeight: '600', color: Colors.primary },

  // FAB
  fab: {
    position: 'absolute', right: 24, bottom: 28,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 6,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8,
  },

  // ── Detail view ────────────────────────────────────────────────────────────
  detailCard: {
    margin: 20, flex: 1,
    backgroundColor: '#fff',
    borderRadius: Radius.card,
    padding: 24,
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute', top: 20, left: 20,
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  detailTitle: { fontSize: 24, fontWeight: '800', color: Colors.text, marginTop: 8 },
  detailSubject: { fontSize: 14, color: Colors.muted, marginTop: 4 },
  motivation: {
    fontSize: 15, color: Colors.muted, textAlign: 'center',
    marginTop: 8, lineHeight: 22, paddingHorizontal: 20,
  },
});
