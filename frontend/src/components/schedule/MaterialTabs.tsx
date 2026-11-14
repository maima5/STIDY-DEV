import { ReactNode, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/auth-theme';
import { Eyebrow } from '@/components/schedule/ScheduleBits';
import { Attachment, Material } from '@/types/schedule';

/** Kartu putih dengan header ikon + eyebrow + judul, dipakai ketiga tab. */
function TabCard({ icon, eyebrow, title, children }: { icon: ReactNode; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View style={styles.cardIcon}>{icon}</View>
        <View style={{ flex: 1 }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}

// ── Ringkasan Materi ─────────────────────────────────────────────

export function SummaryTab({ material, onAskAI }: { material: Material; onAskAI: () => void }) {
  const { summary } = material;
  return (
    <>
      <TabCard
        icon={<Ionicons name="sparkles-outline" size={18} color={Colors.deep} />}
        eyebrow="KONSEP UTAMA" title="Hal yang perlu kamu pahami"
      >
        {summary ? (
          <>
            {summary.points.map((p, i) => (
              <Text key={i} style={styles.point}>
                {!!p.lead && <Text style={styles.pointLead}>{p.lead} </Text>}
                {p.text}
              </Text>
            ))}
            {!!summary.example && (
              <View style={styles.example}>
                <Text style={styles.exampleLabel}>{summary.example.label}</Text>
                <Text style={styles.formula}>{summary.example.formula}</Text>
                {!!summary.example.caption && <Text style={styles.exampleCaption}>{summary.example.caption}</Text>}
              </View>
            )}
          </>
        ) : (
          <Text style={styles.empty}>
            Belum ada ringkasan untuk materi ini. Gunakan AI untuk membuat rangkuman singkat dan poin penting.
          </Text>
        )}
      </TabCard>

      <Pressable style={({ pressed }) => [styles.ai, pressed && { opacity: 0.9 }]} onPress={onAskAI}>
        <View style={styles.aiIcon}><Ionicons name="sparkles-outline" size={18} color="#fff" /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.aiTitle}>Ringkas materi ini dengan AI</Text>
          <Text style={styles.aiSub}>Dapatkan rangkuman singkat dan poin penting</Text>
        </View>
        <Feather name="chevron-right" size={18} color={Colors.deep} />
      </Pressable>
    </>
  );
}

// ── Catatan Pribadi ──────────────────────────────────────────────

export function NotesTab({ material, onSave }: { material: Material; onSave: (note: string) => void }) {
  const [note, setNote] = useState(material.note);
  const dirty = note !== material.note;

  return (
    <TabCard
      icon={<Feather name="save" size={18} color={Colors.deep} />}
      eyebrow="CATATAN PRIBADI" title="Tulis pemahamanmu sendiri"
    >
      <TextInput
        multiline value={note} onChangeText={setNote} textAlignVertical="top"
        placeholder="Tulis catatanmu di sini..." placeholderTextColor={Colors.placeholder}
        style={styles.textarea}
      />
      <View style={styles.noteFoot}>
        <Text style={styles.counter}>{note.length} karakter{!dirty && note.length > 0 ? ' · tersimpan' : ''}</Text>
        <Pressable
          style={({ pressed }) => [styles.saveBtn, (!dirty || pressed) && { opacity: dirty ? 0.88 : 0.5 }]}
          disabled={!dirty} onPress={() => onSave(note)}
        >
          <Feather name="save" size={15} color="#fff" />
          <Text style={styles.saveText}>Simpan Catatan</Text>
        </Pressable>
      </View>
    </TabCard>
  );
}

// ── Lampiran / File ──────────────────────────────────────────────

type AttachmentsProps = { attachments: Attachment[]; onAdd: () => void; onRemove: (id: string) => void };

export function AttachmentsTab({ attachments, onAdd, onRemove }: AttachmentsProps) {
  return (
    <TabCard
      icon={<Feather name="paperclip" size={18} color={Colors.deep} />}
      eyebrow="LAMPIRAN" title="File pendukung materi"
    >
      {attachments.length === 0 && <Text style={[styles.empty, { marginBottom: 12 }]}>Belum ada file terlampir.</Text>}
      {attachments.map((file) => (
        <View key={file.id} style={styles.file}>
          <View style={styles.fileIcon}><Feather name="file-text" size={17} color={Colors.deep} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
            <Text style={styles.fileDesc}>{file.description}</Text>
          </View>
          <Pressable onPress={() => onRemove(file.id)} hitSlop={10}>
            <Feather name="x" size={16} color={Colors.muted} />
          </Pressable>
        </View>
      ))}
      <Pressable style={({ pressed }) => [styles.upload, pressed && { opacity: 0.85 }]} onPress={onAdd}>
        <Feather name="upload" size={16} color={Colors.deep} />
        <Text style={styles.uploadText}>Tambahkan File</Text>
      </Pressable>
    </TabCard>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: Colors.border },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardIcon: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 14, fontWeight: '800', color: Colors.text, marginTop: 5 },
  empty: { fontSize: 12, lineHeight: 19, color: Colors.muted },

  point: { fontSize: 12, lineHeight: 19, color: Colors.muted, marginBottom: 12, paddingHorizontal: 4 },
  pointLead: { fontWeight: '800', color: Colors.text },
  example: {
    marginTop: 6, padding: 14, borderRadius: 14, backgroundColor: Colors.primarySoft,
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
  },
  exampleLabel: { fontSize: 8.5, letterSpacing: 1.2, fontWeight: '800', color: Colors.muted },
  formula: {
    fontSize: 17, color: Colors.text, marginTop: 10,
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
  },
  exampleCaption: { fontSize: 9.5, color: Colors.muted, marginTop: 8 },
  ai: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginTop: 14, borderRadius: 20,
    backgroundColor: Colors.mintWash, borderWidth: 1, borderColor: Colors.mintBorder,
  },
  aiIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.deep, alignItems: 'center', justifyContent: 'center' },
  aiTitle: { fontSize: 13, fontWeight: '800', color: Colors.text },
  aiSub: { fontSize: 10, color: Colors.muted, marginTop: 4 },

  textarea: {
    height: 240, padding: 14, fontSize: 12.5, lineHeight: 19, color: Colors.text,
    backgroundColor: Colors.inputBg, borderRadius: 16, borderWidth: 1, borderColor: Colors.border,
  },
  noteFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  counter: { fontSize: 10, color: Colors.muted, flexShrink: 1 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, height: 38, paddingHorizontal: 14,
    borderRadius: 12, backgroundColor: Colors.deep,
  },
  saveText: { fontSize: 11.5, fontWeight: '700', color: '#fff' },

  file: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, marginBottom: 10,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.inputBg,
  },
  fileIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  fileName: { fontSize: 12, fontWeight: '700', color: Colors.text },
  fileDesc: { fontSize: 9.5, color: Colors.muted, marginTop: 3 },
  upload: {
    height: 48, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.mintWash, borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.primary,
  },
  uploadText: { fontSize: 12.5, fontWeight: '700', color: Colors.deep },
});
