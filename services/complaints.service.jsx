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

{/* Apagar o mock acima qd implementar os dados reais */ }

export async function getComplaints() {
  // TODO: substituir por fetch(`${API_URL}/complaints`)
  return MOCK_COMPLAINTS;
}