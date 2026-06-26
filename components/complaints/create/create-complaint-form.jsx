import { ScrollView } from 'react-native';

import ComplaintBasicInfo from '@/components/complaints/create/ComplaintBasicInfo';
import ComplaintLocation from '@/components/complaints/create/ComplaintLocation';
import ComplaintTypeAnimal from '@/components/complaints/create/ComplaintTypeAnimal';
import PhotoSection from '@/components/complaints/create/PhotoSection';

export function CreateComplaintForm({
  form,
  location,
  manualLocation,
  onChangeManualLocation,
  onUpdateField,
  styles,
}) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ComplaintBasicInfo
        title={form.title}
        description={form.description}
        onChangeTitle={(value) => onUpdateField('title', value)}
        onChangeDescription={(value) => onUpdateField('description', value)}
      />

      <ComplaintTypeAnimal
        type={form.type}
        animal={form.animal}
        animalOther={form.animalOther}
        onChangeType={(value) => onUpdateField('type', value)}
        onChangeAnimal={(value) => onUpdateField('animal', value)}
        onChangeAnimalOther={(value) => onUpdateField('animalOther', value)}
      />

      <ComplaintLocation
        locationMode={form.locationMode}
        location={location}
        manualLocation={manualLocation}
        onChangeLocationMode={(value) => onUpdateField('locationMode', value)}
        onChangeManualLocation={onChangeManualLocation}
      />

      <PhotoSection
        photos={form.photos}
        setPhotos={(value) => {
          if (typeof value === 'function') {
            onUpdateField('photos', value(form.photos));
            return;
          }

          onUpdateField('photos', value);
        }}
        maxPhotos={5}
      />
    </ScrollView>
  );
}
