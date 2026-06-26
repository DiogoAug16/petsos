import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { styles } from "@/styles/complaints/evidence-validation.styles";

const RESULT_CONFIG = {
  resolved: {
    icon: "checkmark-circle",
    iconColor: "#10B981",
    title: "Resolvido pela Comunidade",
    description:
      "Esta denúncia foi marcada como resolvida através da votação comunitária.",
    boxStyle: styles.resolvedSuccessContainer,
    boxIcon: "checkmark",
    boxIconColor: "#10B981",
    boxText: "Denúncia concluída!",
    boxTextStyle: styles.resolvedSuccessText,
  },
  closed: {
    icon: "close-circle",
    iconColor: "#78716C",
    title: "Fechado pela Comunidade",
    description: "Esta denúncia foi fechada através da votação comunitária.",
    boxStyle: styles.closedContainer,
    boxIcon: "lock-closed",
    boxIconColor: "#78716C",
    boxText: "Denúncia fechada",
    boxTextStyle: styles.closedText,
  },
  rejected: {
    icon: "close-circle",
    iconColor: "#E24B4A",
    title: "Rejeitado pela Comunidade",
    description: "Esta denúncia foi rejeitada através da votação comunitária.",
    boxStyle: styles.rejectedContainer,
    boxIcon: "close",
    boxIconColor: "#E24B4A",
    boxText: "Denúncia rejeitada",
    boxTextStyle: styles.rejectedText,
  },
};

export const ValidationResultCard = ({ type, expiresAt }) => {
  const config = RESULT_CONFIG[type];
  if (!config) return null;

  const expiresDate = expiresAt ? new Date(expiresAt) : null;
  const hoursRemaining = expiresDate
    ? Math.max(0, Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60)))
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name={config.icon} size={18} color={config.iconColor} />
        <Text style={styles.headerText}>{config.title}</Text>
      </View>
      <Text style={styles.description}>{config.description}</Text>
      <View style={config.boxStyle}>
        <Ionicons name={config.boxIcon} size={32} color={config.boxIconColor} />
        <Text style={config.boxTextStyle}>{config.boxText}</Text>
      </View>
      {type === "rejected" && hoursRemaining !== null && hoursRemaining > 0 && (
        <Text style={styles.rejectionExpiryText}>
          Esta votação será removida em {hoursRemaining}h.
        </Text>
      )}
      {type === "rejected" && hoursRemaining === 0 && (
        <Text style={styles.rejectionExpiryText}>
          Esta votação será removida em breve.
        </Text>
      )}
    </View>
  );
};
