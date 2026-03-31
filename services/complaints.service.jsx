const API_URL = 'http://192.168.31.29:3000/api'; //Coloque o IP da sua máquina aqui


const MOCK_COMPLAINTS = [
  {
    id: '1',
    title: 'Cachorro abandonado e ferido',
    type: 'abandono',
    location: { latitude: -15.601411, longitude: -56.097892 },
    address: 'Rua das Flores, 142',
    time: 'há 2h',
    status: 'aberto',
    emoji: '🐕',
  },
];

export async function getComplaints() {
  return MOCK_COMPLAINTS;
}

export async function createComplaint({ title, description, imageUri }) {
  try {
    const formData = new FormData();

    // Dinâmicos
    formData.append('title', title);
    formData.append('description', description);

    //  Fixos
    formData.append('type', 'outro');
    formData.append('animal', 'cachorro');
    formData.append('status', 'aberto');

    formData.append(
      'location',
      JSON.stringify({
        latitude: -15.60,
        longitude: -56.09,
      })
    );

    //  Foto dinâmica
    if (imageUri) {
      const fileName = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(fileName);
      const fileType = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('photos', {
        uri: imageUri,
        name: fileName,
        type: fileType,
      });
    }

    const response = await fetch(`${API_URL}/complaints`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao criar denúncia');
    }

    return result;
  } catch (error) {
    console.log('Erro ao criar denúncia:', error);
    throw error;
  }
}