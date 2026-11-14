import { Alert, Platform } from 'react-native';

/** Dialog konfirmasi lintas platform (Alert di native, window.confirm di web). */
export function confirmAction(title: string, message: string, onConfirm: () => void, confirmLabel = 'Hapus') {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Batal', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}

/** Pesan info lintas platform. */
export function notify(title: string, message: string) {
  if (Platform.OS === 'web') window.alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
}
