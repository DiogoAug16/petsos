import { useMemo } from 'react';
import { Dimensions } from 'react-native';
import PawItem from './PawItem';

const { width } = Dimensions.get('window');

export default function PawBackground({ isDark }) {
  const pawConfigs = useMemo(() => {
    const { height } = Dimensions.get('window');
    const rotations = ['-25', '-15', '-10', '10', '15', '20', '25'];

    const PAW_SIZE = 40;
    const SPACING_X = 70;
    const SPACING_Y = 60;

    const cols = Math.ceil(width / SPACING_X) + 2;
    const rows = Math.ceil(height / SPACING_Y) + 2;

    const configs = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offset = (row % 2) * (SPACING_X / 2);
        const left = col * SPACING_X + offset;
        const top = row * SPACING_Y;

        if (left >= -PAW_SIZE && left <= width && top >= -PAW_SIZE && top <= height) {
          const rotateStart = rotations[Math.floor(Math.random() * rotations.length)];
          const rotateEnd = rotations[Math.floor(Math.random() * rotations.length)];

          configs.push({
            left,
            top,
            rotateStart,
            rotateEnd,
            floatRange: [-(Math.random() * 12 + 6), 0],
            duration: Math.random() * 800 + 2700,
            delay: Math.random() * 500,
          });
        }
      }
    }

    return configs;
  }, []);

  return (
    <>
      {pawConfigs.map((config, index) => (
        <PawItem key={index} config={config} index={index} isDark={isDark} />
      ))}
    </>
  );
}
