import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Platform, Alert } from 'react-native';
import { CountdownEvent } from '../types';

interface BackupData {
  version: number;
  exportedAt: string;
  events: CountdownEvent[];
}

export async function exportEvents(events: CountdownEvent[]): Promise<void> {
  if (Platform.OS === 'web') {
    Alert.alert('提示', '导出功能仅支持移动端');
    return;
  }
  try {
    const data: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      events,
    };
    const fileName = `countdown_backup_${new Date().toISOString().slice(0, 10)}.json`;
    const file = new File(Paths.cache, fileName);
    file.write(JSON.stringify(data, null, 2));

    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert('提示', '当前设备不支持分享');
      return;
    }
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: '导出倒数日备份',
    });
  } catch {
    Alert.alert('导出失败', '请稍后重试');
  }
}

export async function importEvents(): Promise<CountdownEvent[] | null> {
  if (Platform.OS === 'web') {
    Alert.alert('提示', '导入功能仅支持移动端');
    return null;
  }
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/plain', '*/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.[0]) return null;

    const pickedFile = new File(result.assets[0].uri);
    const content = await pickedFile.text();
    const parsed: BackupData = JSON.parse(content);

    if (!Array.isArray(parsed.events)) {
      Alert.alert('格式错误', '所选文件不是有效的备份文件');
      return null;
    }
    return parsed.events;
  } catch (e: any) {
    if (e?.code === 'DOCUMENT_PICKER_CANCELED') return null;
    Alert.alert('导入失败', '文件读取失败，请检查文件格式');
    return null;
  }
}
