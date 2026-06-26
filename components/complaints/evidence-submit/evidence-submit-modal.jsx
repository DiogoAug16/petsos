import { Modal, ScrollView, Text, TextInput, View } from 'react-native';

import {
  EVIDENCE_SUBMIT_MAX_PHOTOS,
  EVIDENCE_SUBMIT_MIN_DESCRIPTION,
} from '@/constants/complaints/complaint-evidence-submit.constants';
import { useEvidenceSubmit } from '@/hooks/complaints/useEvidenceSubmit';
import { evidenceSubmitStyles as styles } from '@/styles/complaints/evidence-submit.styles';

import { EvidencePhotoActions } from './evidence-photo-actions';
import { EvidencePhotoList } from './evidence-photo-list';
import { EvidenceSubmitFooter } from './evidence-submit-footer';
import { EvidenceSubmitHeader } from './evidence-submit-header';

export function EvidenceSubmitModal({
  visible,
  complaintId,
  onClose,
  onSubmitted,
}) {
  const evidenceSubmit = useEvidenceSubmit({
    complaintId,
    onClose,
    onSubmitted,
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <EvidenceSubmitHeader
          onClose={onClose}
          submitting={evidenceSubmit.submitting}
          styles={styles}
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>FOTOS DA EVIDÊNCIA</Text>
          <Text style={styles.hint}>
            {evidenceSubmit.photos.length}/{EVIDENCE_SUBMIT_MAX_PHOTOS} fotos
            (mínimo 1)
          </Text>

          <EvidencePhotoActions
            onPickFromGallery={evidenceSubmit.pickFromGallery}
            onTakePhoto={evidenceSubmit.takePhoto}
            styles={styles}
          />

          <EvidencePhotoList
            photos={evidenceSubmit.photos}
            onRemovePhoto={evidenceSubmit.removePhoto}
            styles={styles}
          />

          <Text style={[styles.label, styles.labelWithSpacing]}>DESCRIÇÃO</Text>
          <Text style={styles.hint}>
            {evidenceSubmit.description.trim().length}/
            {EVIDENCE_SUBMIT_MIN_DESCRIPTION} caracteres mínimos
          </Text>

          <TextInput
            style={styles.input}
            value={evidenceSubmit.description}
            onChangeText={evidenceSubmit.setDescription}
            placeholder="Descreva o que foi feito para resolver a denúncia..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />
        </ScrollView>

        <EvidenceSubmitFooter
          isValid={evidenceSubmit.isValid}
          onSubmit={evidenceSubmit.handleSubmit}
          submitting={evidenceSubmit.submitting}
          styles={styles}
        />
      </View>
    </Modal>
  );
}
